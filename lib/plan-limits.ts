import { PlanType } from "@prisma/client";

export interface PlanLimits {
    maxUsers: number;
    maxClients: number;
    supportLevel: "EMAIL" | "PRIORITY" | "MENTORING";
    features: {
        simulationAdvanced: boolean;
        customReports: boolean;
        apiAccess: boolean;
    };
}

export const PLAN_CONFIG: Record<PlanType, PlanLimits> = {
    FREE: {
        maxUsers: 1,
        maxClients: 1,
        supportLevel: "EMAIL",
        features: {
            simulationAdvanced: false,
            customReports: false,
            apiAccess: false,
        }
    },
    ESSENTIAL: {
        maxUsers: 1,
        maxClients: 1,
        supportLevel: "EMAIL",
        features: {
            simulationAdvanced: true,
            customReports: false,
            apiAccess: false,
        }
    },
    PRO: {
        maxUsers: 9999, // Usuários ilimitados na UI
        maxClients: 50,
        supportLevel: "PRIORITY",
        features: {
            simulationAdvanced: true,
            customReports: true,
            apiAccess: false,
        }
    },
    ELITE: {
        maxUsers: 999,
        maxClients: 999,
        supportLevel: "MENTORING",
        features: {
            simulationAdvanced: true,
            customReports: true,
            apiAccess: true,
        }
    },
    ENTERPRISE: {
        maxUsers: 9999,
        maxClients: 9999,
        supportLevel: "MENTORING",
        features: {
            simulationAdvanced: true,
            customReports: true,
            apiAccess: true,
        }
    }
};

export function getPlanLimits(plan: PlanType): PlanLimits {
    return PLAN_CONFIG[plan] || PLAN_CONFIG.FREE;
}
