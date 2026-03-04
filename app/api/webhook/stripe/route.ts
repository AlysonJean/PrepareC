import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

type StripeSub = {
    id: string;
    customer: string | Stripe.Customer | Stripe.DeletedCustomer;
    current_period_end: number;
    items: { data: { price: { id: string } }[] };
};

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: unknown) {
        const err = error as Error;
        console.error("🔴 Webhook Security Error:", err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    try {
        const session = event.data.object as Stripe.Checkout.Session;

        // 1. PRIMEIRA ASSINATURA CONCLUÍDA
        if (event.type === "checkout.session.completed") {
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
            );

            if (!session?.metadata?.userId) {
                return new NextResponse("User id is required", { status: 400 });
            }

            // Identificar Plano Dinâmico (Mapeando o ID do Produto Stripe -> Banco de Dados)
            const stripeSub = subscription as unknown as StripeSub;
            const priceId = stripeSub.items.data[0].price.id;
            // Fallback para variáveis de ambiente ou Hardcoded mocks
            let planType: "FREE" | "ESSENTIAL" | "PRO" | "ELITE" | "ENTERPRISE" = "PRO"; 
            if (priceId === "price_ESSENTIAL" || priceId === process.env.STRIPE_PRICE_ESSENTIAL) planType = "ESSENTIAL";
            if (priceId === "price_PRO" || priceId === process.env.STRIPE_PRICE_PRO) planType = "PRO";

            // Salvar CustomerID na entidade original para o Billing Portal funcionar
            await db.user.update({
                where: { id: session.metadata.userId },
                data: {
                    stripeCustomerId: stripeSub.customer as string,
                },
            });

            // Atualizar Sistema Global de Subs
            await db.subscription.upsert({
                where: { userId: session.metadata.userId },
                create: {
                    userId: session.metadata.userId,
                    stripeSubscriptionId: subscription.id,
                    stripePriceId: priceId,
                    stripeCurrentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                    status: "ACTIVE",
                    planType: planType,
                },
                update: {
                    stripeSubscriptionId: subscription.id,
                    stripePriceId: priceId,
                    stripeCurrentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
                    status: "ACTIVE",
                    planType: planType,
                },
            });

            // Dar poder à Organização
            const user = await db.user.findUnique({ where: { id: session.metadata.userId } });
            if (user?.organizationId) {
                await db.organization.update({
                    where: { id: user.organizationId },
                    data: {
                        subscriptionStatus: "ACTIVE",
                        plan: planType,
                    },
                });
            }
        }

        // 2. RENOVAÇÃO BEM SUCEDIDA (Todo mês)
        if (event.type === "invoice.payment_succeeded") {
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
            );

            const stripeSubInvoice = subscription as unknown as StripeSub;

            await db.subscription.update({
                where: { stripeSubscriptionId: subscription.id },
                data: {
                    stripeCurrentPeriodEnd: new Date(stripeSubInvoice.current_period_end * 1000),
                    stripePriceId: stripeSubInvoice.items.data[0].price.id,
                    status: "ACTIVE",
                },
            });
            
            const sub = await db.subscription.findUnique({ where: { stripeSubscriptionId: subscription.id }, include: { user: true }});
            if (sub?.user?.organizationId) {
                await db.organization.update({
                    where: { id: sub.user.organizationId },
                    data: { subscriptionStatus: "ACTIVE" }
                });
            }
        }

        // 3. CANCELAMENTO OU INADIMPLÊNCIA
        if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
            const subscriptionObj = event.data.object as unknown as StripeSub;
            const subscriptionParams = event.data.object as Stripe.Subscription;
            
            const isCanceledOrFailed = subscriptionParams.status === "canceled" || subscriptionParams.status === "unpaid";
            const newStatusRaw = subscriptionParams.status === "canceled" ? "CANCELED" : subscriptionParams.status.toUpperCase();
            const newStatus = newStatusRaw as "ACTIVE" | "CANCELED" | "PAST_DUE" | "UNPAID" | "TRIALING";

            await db.subscription.update({
                where: { stripeSubscriptionId: subscriptionObj.id },
                data: {
                    stripeCurrentPeriodEnd: new Date(subscriptionObj.current_period_end * 1000),
                    status: newStatus,
                },
            });

            // Se caiu, revoga o acesso imediatamente da Organização (Hard Paywall Fechado)
            if (isCanceledOrFailed) {
                const sub = await db.subscription.findUnique({ where: { stripeSubscriptionId: subscriptionObj.id }, include: { user: true }});
                if (sub?.user?.organizationId) {
                    await db.organization.update({
                        where: { id: sub.user.organizationId },
                        data: { subscriptionStatus: newStatus }
                    });
                }
            }
        }

    } catch (error: unknown) {
        const err = error as Error;
        // Fallback Enterprise: Banco falhou? Devolva 500 para não perder o evento!
        // A Stripe garante 'Automated Retries' (Tentará novamente de forma exponencial) caso não receba status 200.
        console.error("🔴 Erro Crítico no Banco de DB/Stripe Sync (Retentando...):", err);
        return new NextResponse(`Erro de Transação: ${err.message}`, { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
