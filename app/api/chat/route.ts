import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { z } from "zod";
import { getRelevantLawChunks } from "@/lib/rag-service";

// Rate Limiter em memória para proteção básica contra Spam/Abuso de IA
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 10; // Max 10 mensagens por minuto por usuário

// Configuração do Consultor Tributário
const SYSTEM_PROMPT = `
Você é um Consultor Tributário Sênior especializado na Reforma Tributária Brasileira (EC 132/2023).
Sua missão é ajudar contadores a entender as mudanças do IBS e CBS.

Regras de Ouro:
1. Seja técnico, direto e profissional.
2. Cite a base legal sempre que possível (ex: "Conforme Art. X da EC 132...").
3. Se não souber a resposta ou se a lei ainda não estiver regulamentada, diga claramente: "Ainda aguardando regulamentação via Lei Complementar".
4. NÃO invente alíquotas ou regras que não existem.

Formato de Resposta:
- Use Markdown para destacar pontos importantes.
- Se houver cálculo, mostre o passo a passo.
- OBRIGATÓRIO: Sempre adicione ao final da sua resposta uma seção com o título "### 📚 Fontes Oficiais" listando as fontes que você utilizou baseadas no CONTEXTO LEGAL, incluindo o título do documento e data de publicação.
`;

const RequestSchema = z.object({
  messages: z.array(z.any()),
  conversationId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 0. Rate Limiting Protection (Anti-Abuse)
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (userLimit) {
      if (now - userLimit.lastReset > RATE_LIMIT_WINDOW_MS) {
        // Reseta a janela se passou de 1 minuto
        rateLimitMap.set(userId, { count: 1, lastReset: now });
      } else {
        // Dentro da janela, verificar limite
        if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
          console.warn(`⏳ Rate Limit atingido para o usuário: ${userId}`);
          return new NextResponse("Muitas requisições. Por favor, aguarde 1 minuto para enviar novas mensagens.", { status: 429 });
        }
        rateLimitMap.set(userId, { count: userLimit.count + 1, lastReset: userLimit.lastReset });
      }
    } else {
      // Primeiro acesso
      rateLimitMap.set(userId, { count: 1, lastReset: now });
    }

    const userDb = await db.user.findUnique({
      where: { id: userId },
      select: { organizationId: true }
    });

    const body = await req.json();
    const { messages, conversationId } = RequestSchema.parse(body);
    const lastMessage = messages[messages.length - 1];

    // Extraímos o texto da última mensagem para persistência e busca (suporta partes da v6 e fallback content)
    const lastMessageText = (lastMessage.parts || [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((p: any) => p.type === "text")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((p: any) => p.text)
      .join("") || lastMessage.content || "";

    // 1. Busca de contexto Jurídico (RAG)
    const relevantChunks = await getRelevantLawChunks(lastMessageText);
    const contextText = relevantChunks.length > 0
      ? relevantChunks.map(c => `[FONTE: ${c.documentTitle} | PUBLICADO EM: ${c.publicationDate ? new Date(c.publicationDate).toLocaleDateString('pt-BR') : 'Data não informada'}]\nCONTEÚDO: ${c.content}`).join("\n\n")
      : "Nenhuma base legal específica encontrada no banco de dados para esta consulta.";

    const safetyDisclaimer = `
IMPORTANTE: 
1. Você deve priorizar o conteúdo das fontes acima.
2. Se a data de publicação de uma fonte for antiga (anterior à Reforma de 2023), alerte o usuário que o entendimento pode ter mudado.
3. Se houver contradição entre as fontes, destaque a mais recente.
4. Sempre mencione que o Direito Tributário brasileiro é volátil e recomende a verificação diária no Diário Oficial.
`;

    // 2. Iniciamos o stream com o AI SDK usando Markdown Injection para as fontes
    // NOTA: Utilizando gemini-2.5-flash-lite para mitigar o erro HTTP 429 (Resource Exhausted / Quota Exceeded) do Free Tier.
    const result = await streamText({
      model: google("gemini-2.5-flash-lite"),
      system: `${SYSTEM_PROMPT}\n\n${safetyDisclaimer}\n\nCONTEXTO LEGAL PARA ESTA CONSULTA:\n${contextText}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: await convertToModelMessages(messages as any),
      temperature: 0.1,
      onFinish: async ({ text }) => {
        // Persistência robusta ao final do stream
        try {
          let activeConversationId = conversationId;

          if (!activeConversationId) {
            const newConversation = await db.conversation.create({
              data: {
                userId,
                title: lastMessageText.substring(0, 30) + (lastMessageText.length > 30 ? "..." : ""),
              },
            });
            activeConversationId = newConversation.id;
          }

          // Prepara as operações transacionais
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const transactions: any[] = [
            db.chatMessage.create({
              data: {
                conversationId: activeConversationId,
                userId,
                role: "USER",
                content: lastMessageText,
              },
            }),
            db.chatMessage.create({
              data: {
                conversationId: activeConversationId,
                userId,
                role: "ASSISTANT",
                content: text,
                sources: relevantChunks.map(c => ({
                  title: c.documentTitle,
                  content: c.content,
                  date: c.publicationDate
                }))
              },
            }),
          ];

          if (userDb?.organizationId) {
            transactions.push(
              db.consultancyLog.create({
                data: {
                  question: lastMessageText,
                  answer: text,
                  userId,
                  organizationId: userDb.organizationId,
                  contextData: { source: "chat" }
                }
              })
            );
          }

          // Salva todas de uma vez em uma transação
          await db.$transaction(transactions);
        } catch (dbError) {
          console.error("[DB_PERSISTENCE_ERROR]", dbError);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[CHAT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
