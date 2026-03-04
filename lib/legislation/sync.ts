import { db } from "../db";
import { getRelevantLawChunks } from "../rag-service"; // Apenas para referência se necessário
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

/**
 * Interface para representar uma atualização legislativa
 */
interface LawUpdate {
    title: string;
    content: string;
    source: string;
    publicationDate: Date;
    type: "EMENDA_CONSTITUCIONAL" | "LEI_COMPLEMENTAR" | "LEI_ORDINARIA" | "DECRETO";
}

/**
 * Serviço central de sincronização de legislação
 */
export async function syncLegislation() {
    console.log("🔄 Iniciando Ciclo de Sincronização...");

    try {
        // 1. Buscar atualizações (Simulando chamada para API do Senado/DOU)
        // Em produção, aqui você faria fetch('https://legis.senado.leg.br/dadosabertos/recente...')
        const updates = await fetchGovernmentUpdates();

        for (const update of updates) {
            // 2. Verificar se já indexamos este documento
            const exists = await db.legalDocument.findFirst({
                where: { source: update.source }
            });

            if (exists) {
                console.log(`ℹ️ Documento já existe: ${update.title}`);
                continue;
            }

            // 3. Criar Documento
            const doc = await db.legalDocument.create({
                data: {
                    title: update.title,
                    content: update.content,
                    source: update.source,
                    publicationDate: update.publicationDate,
                    type: update.type,
                }
            });

            // 4. Fragmentar e Gerar Embeddings (Chunks)
            // Aqui usamos um "Simple Splitter" - em produção use algo como LangChain Splitter
            const chunks = splitText(update.content, 1000);

            for (let i = 0; i < chunks.length; i++) {
                const { embedding } = await embed({
                    model: openai.embedding("text-embedding-3-small"),
                    value: chunks[i],
                });

                await db.$executeRawUnsafe(
                    `INSERT INTO document_chunks (id, "documentId", content, "chunkIndex", embedding) 
           VALUES (gen_random_uuid(), $1, $2, $3, $4::vector)`,
                    doc.id,
                    chunks[i],
                    i,
                    `[${embedding.join(",")}]`
                );
            }

            console.log(`✅ Novo documento indexado: ${update.title}`);
        }

        return { success: true, processed: updates.length };
    } catch (error) {
        console.error("❌ Erro na sincronização:", error);
        throw error;
    }
}

/**
 * Mock de busca de dados governamentais (Substituir por API real do LexML/Senado)
 */
async function fetchGovernmentUpdates(): Promise<LawUpdate[]> {
    // Simulando descoberta de uma nova Lei Complementar
    return [
        {
            title: "Lei Complementar nº 200/2026 - Regulamentação IBS",
            content: "Art. 1º Esta Lei Complementar regulamenta o Imposto sobre Bens e Serviços (IBS)...",
            source: "https://planalto.gov.br/exemplo-lc-200",
            publicationDate: new Date(),
            type: "LEI_COMPLEMENTAR"
        }
    ];
}

function splitText(text: string, size: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += size) {
        chunks.push(text.substring(i, i + size));
    }
    return chunks;
}
