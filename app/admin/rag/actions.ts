"use server";

import { seedLawDocument } from "@/lib/rag-service";
import { revalidatePath } from "next/cache";
import { getSelf } from "@/lib/auth-service";

export async function processLegalText(formData: FormData) {
    try {
        const user = await getSelf();
        if (user?.role !== "ADMIN") {
            return { error: "Não autorizado." };
        }

        const title = formData.get("title") as string;
        const type = formData.get("type") as "LEI_COMPLEMENTAR" | "EMENDA_CONSTITUCIONAL" | "LEI_ORDINARIA" | "MEDIDA_PROVISORIA" | "DECRETO" | "INSTRUCAO_NORMATIVA" | "SOLUCAO_CONSULTA" | "NOTA_TECNICA";
        const source = formData.get("source") as string;
        const content = formData.get("content") as string;

        if (!title || !type || !content) {
            return { error: "Preencha os campos obrigatórios." };
        }

        const documentId = await seedLawDocument({
            title,
            type,
            source: source || "",
            content,
            publicationDate: new Date(),
        });

        revalidatePath("/admin/rag");
        return { success: true, documentId };
    } catch (error) {
        const err = error as Error;
        console.error("Erro ao processar documento", err);
        return { error: "Erro interno ao vetorizar o documento: " + err.message };
    }
}
