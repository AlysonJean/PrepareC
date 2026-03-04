"use server";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

// ========================================
// ADMIN DASHBOARD — KPIs GLOBAIS
// ========================================

export async function getAdminDashboardStats() {
    const user = await getSelf();
    if (!user || user.role !== "ADMIN") {
        return { totalOrgs: 0, totalUsers: 0, activeSubscriptions: 0, canceledThisMonth: 0, totalLeads: 0, totalWaitlist: 0 };
    }

    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalOrgs, totalUsers, activeSubscriptions, canceledThisMonth, totalLeads, totalWaitlist] = await Promise.all([
            db.organization.count(),
            db.user.count(),
            db.subscription.count({ where: { status: "ACTIVE" } }),
            db.subscription.count({ where: { status: "CANCELED", updatedAt: { gte: startOfMonth } } }),
            db.lead.count(),
            db.waitlist.count(),
        ]);

        return { totalOrgs, totalUsers, activeSubscriptions, canceledThisMonth, totalLeads, totalWaitlist };
    } catch (error) {
        console.error("❌ getAdminDashboardStats error:", error);
        return { totalOrgs: 0, totalUsers: 0, activeSubscriptions: 0, canceledThisMonth: 0, totalLeads: 0, totalWaitlist: 0 };
    }
}

// ========================================
// ORGANIZAÇÕES
// ========================================

export async function getAllOrganizations() {
    const user = await getSelf();
    if (!user || user.role !== "ADMIN") return [];

    try {
        return await db.organization.findMany({
            include: {
                _count: { select: { users: true, clients: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("❌ getAllOrganizations error:", error);
        return [];
    }
}

// ========================================
// USUÁRIOS
// ========================================

export async function getAllUsers() {
    const user = await getSelf();
    if (!user || user.role !== "ADMIN") return [];

    try {
        return await db.user.findMany({
            include: {
                organization: { select: { name: true, plan: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error("❌ getAllUsers error:", error);
        return [];
    }
}

// ========================================
// ASSINATURAS
// ========================================

export async function getAllSubscriptions() {
    const user = await getSelf();
    if (!user || user.role !== "ADMIN") return [];

    try {
        return await db.subscription.findMany({
            include: {
                user: { select: { email: true, firstName: true, lastName: true } },
            },
            orderBy: { updatedAt: "desc" },
        });
    } catch (error) {
        console.error("❌ getAllSubscriptions error:", error);
        return [];
    }
}

// ========================================
// GROWTH — WAITLIST + LEADS
// ========================================

export async function getGrowthMetrics() {
    const user = await getSelf();
    if (!user || user.role !== "ADMIN") return { waitlist: [], leads: [] };

    try {
        const [waitlist, leads] = await Promise.all([
            db.waitlist.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
            db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
        ]);

        return { waitlist, leads };
    } catch (error) {
        console.error("❌ getGrowthMetrics error:", error);
        return { waitlist: [], leads: [] };
    }
}

// ========================================
// ÚLTIMAS ORGANIZAÇÕES (Dashboard Feed)
// ========================================

export async function getRecentOrganizations() {
    const user = await getSelf();
    if (!user || user.role !== "ADMIN") return [];

    try {
        return await db.organization.findMany({
            include: { _count: { select: { users: true } } },
            orderBy: { createdAt: "desc" },
            take: 5,
        });
    } catch (error) {
        console.error("❌ getRecentOrganizations error:", error);
        return [];
    }
}

// ========================================
// MUTAÇÃO: ALTERAR ROLE DO USUÁRIO
// ========================================

export async function updateUserRole(userId: string, newRole: "ADMIN" | "USER") {
    const user = await getSelf();
    if (!user || user.role !== "ADMIN") {
        return { error: "Não autorizado" };
    }

    try {
        await db.user.update({
            where: { id: userId },
            data: { role: newRole },
        });
        return { success: true };
    } catch (error) {
        console.error("❌ updateUserRole error:", error);
        return { error: "Falha ao atualizar permissão." };
    }
}
