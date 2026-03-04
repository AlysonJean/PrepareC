import { UserButton } from "@clerk/nextjs";
import { getOrganization } from "@/lib/auth-service";
import { SubscribeButton } from "@/components/subscribe-button";
import { Check, ShieldAlert } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OnboardingPlansPage() {
    const org = await getOrganization();
    
    if (org?.subscriptionStatus === "ACTIVE" || org?.subscriptionStatus === "TRIALING") {
        redirect("/dashboard");
    }

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
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col py-8 px-4 md:px-8 relative">
            <header className="flex justify-between items-center max-w-6xl mx-auto w-full mb-16 px-4">
                <span className="text-xl font-bold tracking-tight text-foreground">PrepareC</span>
                <UserButton afterSignOutUrl="/" />
            </header>

            <main className="flex-1 flex flex-col items-center max-w-5xl mx-auto w-full">
                <div className="text-center mb-10 max-w-2xl">
                    <div className="inline-flex items-center justify-center p-3 bg-amber-500/10 text-amber-600 rounded-none border-2 border-amber-500/30 mb-4">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
                        Complete sua Assinatura
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Para acessar a plataforma estratégica e as ferramentas de Inteligência da Reforma Tributária, escolha o plano que melhor atende o seu escritório.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-none border-2 bg-card p-8 flex flex-col relative shadow-brutal ${plan.highlight ? "border-primary" : "border-border"}`}
                        >
                            {plan.highlight && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1.5 rounded-none border-2 border-primary uppercase tracking-wider shadow-brutal-sm">
                                    Mais Popular
                                </span>
                            )}
                            <h3 className="font-semibold text-xl mb-2">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-2">{plan.price}</div>
                            <p className="text-sm text-muted-foreground mb-8">{plan.description}</p>
                            
                            <ul className="space-y-4 text-sm mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                                        <Check className="h-5 w-5 text-primary shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            
                            <SubscribeButton
                                priceId={plan.name === "Essencial" ? "price_ESSENTIAL" : "price_PRO"}
                                variant={plan.highlight ? "default" : "outline"}
                            >
                                Assinar e Acessar
                            </SubscribeButton>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-muted-foreground font-medium mb-4">
                        Precisa de um plano Corporativo maior?
                    </p>
                    <Button variant="outline" className="rounded-none border-2" asChild>
                        <Link href="/">Falar com um Consultor</Link>
                    </Button>
                </div>
            </main>
        </div>
    );
}
