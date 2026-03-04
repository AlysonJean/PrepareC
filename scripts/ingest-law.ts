import { db } from "../lib/db";
import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

/**
 * Script de Ingestão de Legislação (EC 132/2023 - Exemplo)
 */
async function ingestLaw() {
    console.log("🚀 Iniciando ingestão da lei...");

    const lawTitle = "Emenda Constitucional 132 (Reforma Tributária)";
    const lawContent = `
    Art. 1º A Constituição Federal passa a vigorar com as seguintes alterações:
    Art. 149-B. Os tributos previstos nos arts. 156-A e 195, V, observarão as mesmas regras em relação a:
    I - fatos geradores, bases de cálculo, hipóteses de não incidência e sujeitos passivos;
    II - regimes de alíquotas específicas ou ad valorem;
    ... (Trecho da Reforma) ...
  `;

    try {
        // 1. Criar o documento principal
        const document = await db.legalDocument.create({
            data: {
                title: lawTitle,
                type: "EMENDA_CONSTITUCIONAL",
                source: "https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm",
                content: lawContent,
            },
        });

        // 2. Criar Chunks (Aqui você usaria um text splitter real, vamos simular um)
        const chunks = [
            "Art. 149-B. Os tributos previstos nos arts. 156-A (IBS) e 195, V (CBS), observarão as mesmas regras em relação a fatos geradores e bases de cálculo.",
            "A CBS e o IBS compõem o chamado IVA Dual brasileiro, unificando a tributação sobre consumo.",
        ];

        for (let i = 0; i < chunks.length; i++) {
            console.log(`📡 Gerando embedding para chunk ${i + 1}...`);

            const { embedding } = await embed({
                model: openai.embedding("text-embedding-3-small"),
                value: chunks[i],
            });

            // Salva no banco usando Raw SQL para o campo de vetor
            await db.$executeRawUnsafe(
                `INSERT INTO document_chunks (id, "documentId", content, "chunkIndex", embedding) 
         VALUES (gen_random_uuid(), $1, $2, $3, $4::vector)`,
                document.id,
                chunks[i],
                i,
                `[${embedding.join(",")}]`
            );
        }

        console.log("✅ Ingestão concluída com sucesso!");
    } catch (error) {
        console.error("❌ Erro na ingestão:", error);
    } finally {
        await db.$disconnect();
    }
}

ingestLaw();
