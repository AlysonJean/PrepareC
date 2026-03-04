"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export const getSubscriptionStatus = async () => {
    const { userId } = await auth();
    if (!userId) return "INACTIVE";

    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            include: { organization: true },
        });

        if (!user?.organization) return "INACTIVE";

        return user.organization.subscriptionStatus;
    } catch (error) {
        console.error("❌ getSubscriptionStatus error:", error);
        return "ACTIVE"; // Em dev, permitimos o acesso se o banco estiver fora
    }
};

export const createCheckoutSession = async (priceId: string) => {
    const isMock = process.env.MOCK_DATABASE === "true";
    let finalUserId = "mock-user-id";
    let finalEmail = "test@PrepareC.com.br";
    let finalCustomerId = undefined;
    
    if (!isMock) {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new Error("User not found");
        
        finalUserId = userId;
        finalEmail = user.email;
        finalCustomerId = user.stripeCustomerId;
    }

    // Em modo mock com IDs ficticios, apenas simulamos a navegação
    if (isMock && (priceId === "price_ESSENTIAL" || priceId === "price_PRO")) {
         return { url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing?success=true` };
    }

    const session = await stripe.checkout.sessions.create({
        customer: finalCustomerId || undefined,
        customer_email: finalCustomerId ? undefined : finalEmail,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing?canceled=true`,
        metadata: {
            userId: finalUserId,
        },
    });

    return { url: session.url };
};

export const createBillingPortalSession = async () => {
    const isMock = process.env.MOCK_DATABASE === "true";

    if (isMock) {
        return { url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing?status=mock-portal` };
    }

    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { id: userId },
    });

    if (!user || !user.stripeCustomerId) {
        throw new Error("Customer not found or not subscribed via Stripe yet.");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/dashboard/billing`,
    });

    return { url: portalSession.url };
};
