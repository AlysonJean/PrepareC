"use server";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

export async function updateOrganization(formData: FormData) {
    const user = await getSelf();

    if (!user || !user.organizationId) {
        return { error: "Unauthorized" };
    }

    const name = formData.get("name") as string;
    const document = formData.get("document") as string;

    if (!name) {
        return { error: "Name is required" };
    }

    try {
        await db.organization.update({
            where: {
                id: user.organizationId
            },
            data: {
                name,
                document
            }
        });

        revalidatePath("/dashboard/organization");
        return { success: true };
    } catch (error) {
        console.error("Update Organization Error:", error);
        return { error: "Failed to update organization" };
    }
}
