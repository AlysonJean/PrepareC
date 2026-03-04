import { db } from "./db";
import { openai } from "@ai-sdk/openai";
import { embed, embedMany } from "ai";
import { randomUUID } from "crypto";

/**
 * Realiza a busca semântica por trechos da legislação
 */
export async function getRelevantLawChunks(query: string, limit = 5) {
    const isMock = process.env.MOCK_DATABASE === "true";

    if (isMock) {
        return [
            {
                id: "mock-chunk-1",
                content: "Art. 1º O Imposto sobre Bens e Serviços (IBS) e a Contribuição sobre Bens e Serviços (CBS) substituem o ICMS, ISS, IPI, PIS e Cofins. A alíquota de referência será definida pelo Senado Federal. Escritórios de contabilidade no Simples Nacional podem manter seu regime ou aderir ao novo IBS/CBS com direito a crédito.",
                documentId: "mock-doc-1",
                documentTitle: "EC 132/2023 (Simulado)",
                publicationDate: new Date(),
                similarity: 0.99
            }
        ];
    }

    try {
        // 1. Gerar o embedding para a pergunta do usuário
        const { embedding } = await embed({
            model: openai.embedding("text-embedding-3-small"),
            value: query,
        });

        // 2. Buscar no banco via SQL RAW (Prisma ainda não suporta busca vetorial nativa em campos Unsupported)
        // Nota: Estamos usando a distância de cosseno (<=>) ou produto interno (<#>)
        const chunks = await db.$queryRaw`
      SELECT 
        c.id, 
        c.content, 
        c."documentId",
        d.title as "documentTitle",
        d."publicationDate",
        1 - (c.embedding <=> ${embedding}::vector) as similarity
      FROM document_chunks c
      JOIN legal_documents d ON c."documentId" = d.id
      WHERE c.embedding IS NOT NULL
      ORDER BY c.embedding <=> ${embedding}::vector
      LIMIT ${limit};
    ` as Array<{
        id: string;
        content: string;
        documentId: string;
        documentTitle: string;
        publicationDate: Date | null;
        similarity: number;
    }>;

        return chunks.filter(chunk => chunk.similarity > 0.5); // Filtro básico de relevância
    } catch (error) {
        console.error("[RAG_SEARCH_ERROR]", error);
        return [];
    }
}

/**
 * Fragmenta um texto longo em partes menores (chunks) com leve sobreposição
 */
function chunkText(text: string, chunkSize = 1000, overlap = 200): string[] {
    const chunks: string[] = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += chunkSize - overlap;
    }
    return chunks;
}

/**
 * Lê um texto jurídico, divide em recortes (chunks), 
 * extrai embeddings de todos eles e salva no banco usando pgvector.
 */
export async function seedLawDocument({
    title,
    type,
    source,
    content,
    publicationDate,
}: {
    title: string;
    type: "LEI_COMPLEMENTAR" | "EMENDA_CONSTITUCIONAL" | "LEI_ORDINARIA" | "MEDIDA_PROVISORIA" | "DECRETO" | "INSTRUCAO_NORMATIVA" | "SOLUCAO_CONSULTA" | "NOTA_TECNICA";
    source: string;
    content: string;
    publicationDate?: Date;
}) {
    // 1. Cria o documento mestre
    const documentId = randomUUID();
    await db.legalDocument.create({
        data: {
            id: documentId,
            title,
            type,
            source,
            content,
            publicationDate,
        }
    });

    // 2. Quebrar em pedaços (chunks)
    const chunks = chunkText(content);
    if (chunks.length === 0) return documentId;

    // 3. Pegar embeddings usando embedMany
    const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: chunks,
    });

    // 4. Salvar os Chunks no banco
    for (let i = 0; i < chunks.length; i++) {
        const chunkId = randomUUID();
        const chunkContent = chunks[i];
        const embedding = embeddings[i];

        // Formatando o vetor para o pgvector: [0.1, 0.2, ...] => '[0.1, 0.2, ...]'
        const vectorString = `[${embedding.join(",")}]`;

        await db.$executeRaw`
            INSERT INTO "document_chunks" (id, "documentId", content, "chunkIndex", embedding)
            VALUES (${chunkId}, ${documentId}, ${chunkContent}, ${i}, ${vectorString}::vector)
        `;
    }

    return documentId;
}
