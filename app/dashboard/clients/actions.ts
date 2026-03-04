"use server";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

export async function getClients() {
    const user = await getSelf();

    if (!user || !user.organizationId) {
        return [];
    }

    try {
        const clients = await db.client.findMany({
            where: {
                organizationId: user.organizationId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return clients;
    } catch (error) {
        console.error("❌ getClients error:", error);
        return [];
    }
}

export async function createClient(formData: FormData) {
    const user = await getSelf();

    if (!user || !user.organizationId) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const document = formData.get("document") as string;

    if (!name || !document) {
        return { error: "Name and Document are required" };
    }

    try {
        await db.client.create({
            data: {
                name,
                document,
                organizationId: user.organizationId
            }
        });

        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error) {
        console.error("Create Client Error:", error);
        return { error: "Failed to create client" };
    }
}

export async function deleteClient(clientId: string) {
    const user = await getSelf();

    if (!user || !user.organizationId) {
        return { error: "Unauthorized" };
    }

    try {
        // Ensure the client belongs to the user's organization
        const client = await db.client.findFirst({
            where: {
                id: clientId,
                organizationId: user.organizationId
            }
        });

        if (!client) {
            return { error: "Client not found or unauthorized" };
        }

        await db.client.delete({
            where: {
                id: clientId
            }
        });

        revalidatePath("/dashboard/clients");
        return { success: true };
    } catch (error) {
        console.error("Delete Client Error:", error);
        return { error: "Failed to delete client" };
    }
}
