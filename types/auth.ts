import { User, Organization, UserRole, PlanType, SubscriptionStatus } from "@prisma/client";

export type UserWithOrganization = User & {
    organization: (Organization & {
        users: User[];
    }) | null;
};

export interface AuthContext {
    userId: string;
    orgId: string | null;
    role: UserRole;
    plan: PlanType;
}
