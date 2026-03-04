import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const getSelf = async () => {
    const isMock = process.env.MOCK_DATABASE === "true";
    const user = await currentUser();

    // Bypass auth for development if no Clerk user or MOCK_DATABASE is true
    if (isMock || !user || !user.id) {
        if (!isMock && process.env.NODE_ENV === "production") {
            return null;
        }

        const mockRole = (process.env.MOCK_USER_ROLE as any) || "ADMIN";
        const mockUserId = user?.id || "dev-user-id";
        const mockOrgId = "dev-org-id";

        if (isMock) {
            return {
                id: mockUserId,
                email: user?.emailAddresses[0]?.emailAddress || "test@PrepareC.com.br",
                role: mockRole,
                organizationId: mockOrgId,
                organization: {
                    id: mockOrgId,
                    name: "Escritório de Teste (Demo)",
                    plan: "ESSENTIAL",
                    subscriptionStatus: "ACTIVE"
                }
            } as any;
        }

        try {
            // Use transaction for consistency during dev setup
            return await db.$transaction(async (tx) => {
                const devOrg = await tx.organization.upsert({
                    where: { id: mockOrgId },
                    update: {},
                    create: {
                        id: mockOrgId,
                        name: "Escritório de Teste",
                        plan: "ESSENTIAL",
                        subscriptionStatus: "ACTIVE"
                    }
                });

                return await tx.user.upsert({
                    where: { id: mockUserId },
                    update: {},
                    create: {
                        id: mockUserId,
                        email: "test@PrepareC.com.br",
                        role: "ADMIN",
                        organizationId: devOrg.id
                    },
                    include: { organization: true }
                });
            });
        } catch (error) {
            console.warn("⚠️ Database connection failed. Running in static mock mode.");
            return {
                id: mockUserId,
                email: "test@PrepareC.com.br",
                role: "ADMIN",
                organizationId: mockOrgId,
                organization: {
                    id: mockOrgId,
                    name: "Escritório de Teste (Offline)",
                    plan: "ESSENTIAL",
                    subscriptionStatus: "ACTIVE"
                }
            } as any;
        }
    }

    try {
        const dbUser = await db.user.findUnique({
            where: { id: user.id },
            include: { organization: true },
        });

        if (!dbUser) {
            // First time login - Atomic creation of User and Organization
            const email = user.emailAddresses[0]?.emailAddress || "no-email@example.com";
            const name = user.firstName
                ? `${user.firstName} Escritório`
                : "Meu Escritório";

            return await db.$transaction(async (tx) => {
                const newOrg = await tx.organization.create({
                    data: {
                        name: name,
                        plan: "ESSENTIAL",
                        users: {
                            create: {
                                id: user.id,
                                email: email,
                                role: "ADMIN",
                            }
                        }
                    }
                });

                return await tx.user.findUnique({
                    where: { id: user.id },
                    include: { organization: true },
                });
            });
        }

        return dbUser;
    } catch (error) {
        console.error("❌ Prisma fetch error:", error);
        // Fallback for UI testing if DB is down
        return {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || "user@example.com",
            role: "USER",
            organization: {
                id: "fallback-org",
                name: "Modo de Demonstração",
                plan: "PRO",
                subscriptionStatus: "ACTIVE"
            }
        } as any;
    }
};

export const getOrganization = async () => {
    const isMock = process.env.MOCK_DATABASE === "true";
    const user = await getSelf();
    if (!user) return null;

    if (!user.organizationId) return null;

    if (isMock) {
        return user.organization || {
            id: user.organizationId,
            name: "Escritório de Teste (Demo)",
            plan: "ESSENTIAL",
            subscriptionStatus: "ACTIVE",
            users: [],
            clients: []
        };
    }

    try {
        const org = await db.organization.findUnique({
            where: { id: user.organizationId },
            include: {
                users: true,
                clients: true
            }
        });

        return org;
    } catch (error) {
        console.error("❌ getOrganization error:", error);
        return user.organization || null;
    }
}
