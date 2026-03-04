"use server";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export async function getDashboardStats() {
    const user = await getSelf();
    
    if (!user || !user.organizationId) {
        return {
            clientsCount: 0,
            consultancyCount: 0,
            plan: "ESSENTIAL",
            orgName: "Minha Organização"
        };
    }

    try {
        const [clientsCount, consultancyCount] = await Promise.all([
            db.client.count({
                where: { organizationId: user.organizationId }
            }),
            db.consultancyLog.count({
                where: { organizationId: user.organizationId }
            })
        ]);

        return {
            clientsCount,
            consultancyCount,
            plan: user.organization?.plan || "ESSENTIAL",
            orgName: user.organization?.name || "Minha Organização"
        };
    } catch (error) {
        console.warn("⚠️ getDashboardStats: Database unreachable or query failed.", error);
        return {
            clientsCount: 0,
            consultancyCount: 0,
            plan: "ESSENTIAL",
            orgName: user?.organization?.name || "Minha Organização"
        };
    }
}

export async function getBillingData() {
    const user = await getSelf();
    if (!user) return null;

    try {
        const subscription = await db.subscription.findUnique({
            where: { userId: user.id },
        });

        return {
            nextBillingDate: subscription?.stripeCurrentPeriodEnd?.toISOString() || null,
            status: subscription?.status || null,
            planType: subscription?.planType || null,
        };
    } catch {
        return null;
    }
}

export async function getUnreadNotificationsCount() {
    const user = await getSelf();
    if (!user) return 0;

    try {
        return await db.notification.count({
            where: { userId: user.id, read: false },
        });
    } catch {
        return 0;
    }
}

export async function getNotifications() {
    const user = await getSelf();
    if (!user) return [];

    try {
        return await db.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 20,
        });
    } catch {
        return [];
    }
}

export async function markNotificationRead(id: string) {
    const user = await getSelf();
    if (!user) return;

    await db.notification.update({
        where: { id, userId: user.id },
        data: { read: true },
    });
}

export async function markAllNotificationsRead() {
    const user = await getSelf();
    if (!user) return;

    await db.notification.updateMany({
        where: { userId: user.id, read: false },
        data: { read: true },
    });
}

