import { Button } from "@/components/ui/button";
import { SubscribeButton } from "@/components/subscribe-button";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { Check, CreditCard, Calendar, BarChart3, Users } from "lucide-react";
import { getOrganization } from "@/lib/auth-service";
import { getDashboardStats, getBillingData } from "../actions";
import { getPlanLimits } from "@/lib/plan-limits";

export default async function PlansPage() {
    const org = await getOrganization();
    const stats = await getDashboardStats();
    const limits = getPlanLimits(stats.plan);

    const currentPlan = org?.plan || "FREE";
    const isSubscribed = org?.subscriptionStatus === "ACTIVE" || org?.subscriptionStatus === "TRIALING";

    // Dados reais de billing do Stripe
    const billingData = await getBillingData();
    const nextBillingDate = billingData?.nextBillingDate ? new Date(billingData.nextBillingDate) : null;
    const createdAt = org?.createdAt ? new Date(org.createdAt) : new Date();
    
    // Cálculos de Limites reais do Banco de Dados
    const usedClients = stats.clientsCount;
    const maxClients = limits.maxClients;
    const clientsPercent = Math.min(100, Math.round((usedClients / maxClients) * 100));

    const plans = [
        {
            name: "Essencial",
            price: "R$ 297/mês",
            description: "Para consultores autônomos.",
            features: ["1 Usuário", "1 Empresa", "Consultoria Básica"],
            highlight: false,
        },
        {
            name: "Pro",
            price: "R$ 897/mês",
            description: "Para escritórios em expansão.",
            features: ["Usuários ilimitados", "50 Empresas", "Análise Avançada", "Simulações ilimitadas", "Suporte prioritário"],
            highlight: true,
        },
        {
            name: "Corporativo",
            price: "Sob Consulta",
            description: "Grandes consultorias e departamentos jurídicos.",
            features: ["SLA 99.9%", "Mentoria estratégica", "API personalizada", "Onboarding dedicado"],
            highlight: false,
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl font-semibold">Planos da Organização</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Gerencie sua assinatura, limites de uso e cobranças.
                    </p>
                </div>
                {/* O botão ManageSubscriptionButton foi movido para dentro do Card de Resumo se estiver inscrito */}
            </div>

            {isSubscribed && (
                <div className="rounded-none border-2 border-border bg-card p-6 shadow-brutal flex flex-col gap-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b-2 border-border pb-6">
                        <div>
                            <h2 className="text-lg font-bold">Resumo da Assinatura</h2>
                            <p className="text-sm text-muted-foreground">O plano <strong className="text-foreground">{currentPlan === "ESSENTIAL" ? "Essencial" : currentPlan === "PRO" ? "Pro" : "Corporativo"}</strong> está ativo.</p>
                        </div>
                        <ManageSubscriptionButton />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Uso do Plano */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Uso de Recursos</h3>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2"><Users className="h-4 w-4" /> Empresas Monitoradas</span>
                                    <span className="font-medium">{usedClients} / {maxClients === 9999 ? 'Ilimitado' : maxClients}</span>
                                </div>
                                {maxClients !== 9999 && (
                                    <div className="h-2 w-full bg-secondary border-2 border-border rounded-none overflow-hidden">
                                        <div className={`h-full transition-all ${clientsPercent >= 90 ? 'bg-destructive' : 'bg-emerald-500'}`} style={{ width: `${clientsPercent}%` }} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Informações de Faturamento */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Faturamento</h3>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-none border-2 border-border p-3 bg-secondary/20">
                                    <p className="text-xs text-muted-foreground mb-1">{nextBillingDate ? 'Próxima Cobrança' : 'Membro desde'}</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {(nextBillingDate || createdAt).toLocaleDateString('pt-BR')}</p>
                                </div>
                                <div className="rounded-none border-2 border-border p-3 bg-secondary/20 flex flex-col justify-between">
                                    <p className="text-xs text-muted-foreground mb-1">Pagamento</p>
                                    <p className="text-sm font-bold flex items-center gap-2"><CreditCard className="h-3.5 w-3.5" /> Via Stripe</p>
                                </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Para gerenciar método de pagamento, faturas e cancelamento, use o botão &quot;Gerenciar Assinatura&quot; acima.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans.map((plan) => {
                    // Mapeia o Enum do Prisma para o nome do Box
                    const isCurrent = 
                        (plan.name === "Essencial" && currentPlan === "ESSENTIAL") || 
                        (plan.name === "Pro" && currentPlan === "PRO") || 
                        (plan.name === "Corporativo" && currentPlan === "ENTERPRISE");

                    return (
                        <div
                            key={plan.name}
                            className={`rounded-none border-2 bg-card p-6 shadow-brutal-sm flex flex-col relative ${plan.highlight ? "border-primary" : "border-border"} ${isCurrent ? "bg-secondary/20" : ""}`}
                        >
                            {isCurrent && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest border-2 border-background px-3 py-1 rounded-none">
                                    Seu Plano Atual
                                </span>
                            )}
                            <h3 className="font-medium text-sm mb-1">{plan.name}</h3>
                            <div className="text-2xl font-semibold mb-1">{plan.price}</div>
                            <p className="text-xs text-muted-foreground mb-6">{plan.description}</p>
                            <ul className="space-y-2 text-sm mb-8 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2 text-muted-foreground">
                                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div>
                                {plan.price === "Sob Consulta" ? (
                                    <Button className="w-full rounded-none" variant="outline">
                                        Falar com Consultor
                                    </Button>
                                ) : (
                                    isSubscribed ? (
                                        <Button className="w-full rounded-none" variant="secondary" disabled>
                                            Incluso na Assinatura
                                        </Button>
                                    ) : (
                                        <SubscribeButton
                                            priceId={plan.name === "Essencial" ? "price_ESSENTIAL" : "price_PRO"}
                                            variant={plan.highlight ? "default" : "outline"}
                                        >
                                            Assinar
                                        </SubscribeButton>
                                    )
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
