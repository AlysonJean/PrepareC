"use server";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export async function getConsultancyLogs() {
    const user = await getSelf();

    if (!user || !user.organizationId) {
        return [];
    }

    try {
        const logs = await db.consultancyLog.findMany({
            where: {
                organizationId: user.organizationId
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return logs;
    } catch (error) {
        console.error("❌ getConsultancyLogs error:", error);
        return [];
    }
}

export async function sendConsultancyMessage(question: string) {
    const user = await getSelf();

    if (!user || !user.organizationId) {
        return { error: "Unauthorized" };
    }

    if (!question) {
        return { error: "Question is required" };
    }

    // OBSOLETO: O AI Chat agora comunica-se nativamente e salva o db.consultancyLog
    // Mantendo a ação por retro-compatibilidade até futura limpeza na view
    const finalAnswer = "[SISTEMA] Redirecinamento. Utilize a interface interativa atada a /api/chat.";

    try {
        await db.consultancyLog.create({
            data: {
                question: question,
                answer: finalAnswer,
                userId: user.id,
                organizationId: user.organizationId,
                contextData: { source: "Simulated-RAG-v1" }
            }
        });

        // revalidatePath("/dashboard/consultancy"); // No need if we return the new message
        return { success: true, answer: finalAnswer };
    } catch (error) {
        console.error("Consultancy Log Error:", error);
        return { error: "Failed to process request" };
    }
}
