"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function joinWaitlist(email: string, source?: string) {
    if (!email || !email.includes("@")) {
        throw new Error("E-mail inválido");
    }

    try {
        await db.waitlist.upsert({
            where: { email },
            update: { source },
            create: { email, source },
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("WAITLIST_ERROR", error);
        throw new Error("Erro ao salvar na lista de espera");
    }
}

export async function createLead(data: { email: string; sector: string; results: any }) {
    try {
        await db.lead.create({
            data: {
                email: data.email,
                sector: data.sector,
                impactResults: data.results,
            },
        });
        return { success: true };
    } catch (error) {
        console.error("LEAD_ERROR", error);
        return { success: false };
    }
}
