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
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });

        return logs;
    } catch (error) {
        console.error("❌ getConsultancyLogs error:", error);
        return [];
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createConsultancyLog({ question, answer, contextData }: { question: string, answer: string, contextData?: any }) {
    const user = await getSelf();
    if (!user || !user.organizationId) {
        return { error: "Não autorizado" };
    }

    try {
        await db.consultancyLog.create({
            data: {
                question,
                answer,
                userId: user.id,
                organizationId: user.organizationId,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                contextData: (contextData as any) || {}
            }
        });
        return { success: true };
    } catch (error) {
        console.error("❌ createConsultancyLog error:", error);
        return { error: "Falha ao salvar log de consultoria." };
    }
}
