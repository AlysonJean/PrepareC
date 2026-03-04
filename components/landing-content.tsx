"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck, BarChart3, Globe2, ChevronDown, Users, TrendingUp, Clock, FileText } from "lucide-react";
import { ReformTimeline } from "@/components/reform-timeline";
import { joinWaitlist } from "@/app/actions/growth";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export function LandingContent() {
    return (
        <main className="flex-1">
            {/* HERO — Full width background, wide content */}
            <section className="py-20 md:py-28 lg:py-36">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left — Copy */}
                        <div>
                            <p className="text-sm font-semibold text-primary mb-4 tracking-wide uppercase">
                                Especialistas em Reforma Tributária
                            </p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-foreground mb-6">
                                A inteligência por trás da Reforma Tributária
                            </h1>
                            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                                O <strong className="text-foreground">PrepareC</strong> não é apenas uma calculadora. É a plataforma de inteligência que resolve as maiores dores do contador: <strong className="text-foreground">Simples Híbrido</strong>, impacto do <strong className="text-foreground">Split Payment</strong> no caixa e repasse de preços.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <Button size="lg" className="rounded-none border-2 h-12 px-8 text-sm font-bold shadow-brutal-sm hover:-translate-y-0.5 transition-all" asChild>
                                    <Link href="/sign-up">
                                        Criar conta agora <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="rounded-none border-2 h-12 px-8 text-sm font-bold shadow-brutal-sm hover:-translate-y-0.5 transition-all" asChild>
                                    <Link href="#planos">Ver planos</Link>
                                </Button>
                            </div>
                            <WaitlistForm />
                        </div>

                        {/* Right — Visual proof / Key stats */}
                        <div className="hidden lg:grid grid-cols-2 gap-4">
                            {[
                                { value: "200+", label: "Escritórios ativos", icon: Users },
                                { value: "5K+", label: "Simulações realizadas", icon: TrendingUp },
                                { value: "12K+", label: "Consultas respondidas", icon: Globe2 },
                                { value: "98%", label: "Satisfação dos clientes", icon: ShieldCheck },
                            ].map((stat, i) => (
                                <div key={i} className="rounded-none border-2 border-border shadow-brutal-sm bg-card p-5 flex flex-col gap-2">
                                    <stat.icon className="h-5 w-5 text-primary" />
                                    <span className="text-2xl font-bold">{stat.value}</span>
                                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile social proof */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 lg:hidden">
                        {[
                            { value: "200+", label: "Escritórios ativos" },
                            { value: "5K+", label: "Simulações" },
                            { value: "12K+", label: "Consultas respondidas" },
                            { value: "98%", label: "Satisfação" },
                        ].map((stat, i) => (
                            <div key={i} className="text-center py-3 border-2 border-border rounded-none bg-secondary/30">
                                <span className="text-xl font-bold block">{stat.value}</span>
                                <span className="text-[10px] text-muted-foreground">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="py-20 md:py-24 border-t-2 border-border bg-secondary/20">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="max-w-2xl mb-12">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                            Tudo que você precisa
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Ferramentas essenciais para navegar a nova legislação tributária com segurança.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                title: "Simulador do Simples Híbrido",
                                desc: "Calcule o custo de oportunidade e os créditos perdidos de seus clientes B2B entre o regime atual e o Híbrido (IBS/CBS por fora).",
                                icon: BarChart3,
                            },
                            {
                                title: "Alerta de Split Payment",
                                desc: "Preveja o impacto no fluxo de caixa do cliente com a retenção do IVA Dual diretamente na liquidação bancária.",
                                icon: ShieldCheck,
                            },
                            {
                                title: "Inteligência Legal (RAG)",
                                desc: "Tire dúvidas técnicas da EC 132/2023 conversando com nosso consultor digital, sempre atualizado com as últimas resoluções.",
                                icon: Globe2,
                            },
                            {
                                title: "Gestão de Carteira",
                                desc: "Monitore todos os seus clientes em um painel único com status e alertas de oportunidade tributária.",
                                icon: Users,
                            },
                            {
                                title: "Relatórios PDF",
                                desc: "Gere pareceres técnicos completos para entregar ao seu cliente com a marca do seu escritório.",
                                icon: FileText,
                            },
                            {
                                title: "Atualização em Tempo Real",
                                desc: "Monitore alterações legislativas e receba alertas quando uma nova resolução impactar seus clientes.",
                                icon: Clock,
                            }
                        ].map((feat, i) => (
                            <div key={i} className="group p-6 rounded-none border-2 border-border shadow-brutal-sm bg-card hover:border-primary hover:-translate-y-1 transition-all">
                                <div className="h-10 w-10 rounded-none bg-secondary border-2 border-border flex items-center justify-center mb-4 text-foreground group-hover:border-primary group-hover:text-primary transition-colors">
                                    <feat.icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-sm font-semibold mb-2">{feat.title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TIMELINE */}
            <ReformTimeline />

            {/* TESTIMONIALS */}
            <section className="py-20 md:py-24 border-t-2 border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="max-w-2xl mb-12">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                            O que dizem nossos clientes
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            {
                                quote: "O simulador me economizou horas de cálculo manual. Agora consigo apresentar cenários para meus clientes em minutos.",
                                name: "Maria Oliveira",
                                role: "Contadora, SP",
                            },
                            {
                                quote: "A consultoria digital é surpreendentemente precisa. Cita artigos e fontes automaticamente — facilitou muito o parecer técnico.",
                                name: "Ricardo Santos",
                                role: "Sócio, Tax Solutions",
                            },
                            {
                                quote: "Finalmente uma ferramenta que acompanha as mudanças legislativas em tempo real. Indispensável para quem atende PMEs.",
                                name: "Ana Costa",
                                role: "Consultora Tributária",
                            },
                        ].map((t, i) => (
                            <div key={i} className="rounded-none border-2 border-border shadow-brutal-sm bg-card p-6 flex flex-col">
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
                                <div className="mt-4 pt-4 border-t border-border">
                                    <p className="text-sm font-medium">{t.name}</p>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section id="planos" className="py-20 md:py-24 border-t-2 border-border bg-secondary/20">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                            Planos simples e transparentes
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Escolha o plano ideal para o seu escritório.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
                        {/* Essencial */}
                        <div className="rounded-none border-2 border-border shadow-brutal bg-card p-8 flex flex-col hover:-translate-y-1 transition-all">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Solo</p>
                            <h3 className="text-lg font-semibold mb-4">Essencial</h3>
                            <div className="mb-6">
                                <span className="text-3xl font-semibold">R$ 297</span>
                                <span className="text-sm text-muted-foreground">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {["1 Usuário", "1 Empresa", "Consultoria Básica"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="h-4 w-4 text-primary shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Button variant="outline" className="w-full rounded-none border-2 font-bold h-11" asChild>
                                <Link href="/sign-up">Começar</Link>
                            </Button>
                        </div>

                        {/* Pro */}
                        <div className="rounded-none border-2 border-primary shadow-brutal bg-card p-8 flex flex-col relative hover:-translate-y-1 transition-all">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground border-2 border-primary text-[10px] font-bold px-4 py-1 rounded-none shadow-brutal-sm">
                                Popular
                            </span>
                            <p className="text-xs font-medium text-primary uppercase tracking-wide mb-1">Business</p>
                            <h3 className="text-lg font-semibold mb-4">Pro</h3>
                            <div className="mb-6">
                                <span className="text-3xl font-semibold">R$ 897</span>
                                <span className="text-sm text-muted-foreground">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {["Usuários ilimitados", "50 Empresas", "Análise Avançada", "Simulações ilimitadas", "Suporte prioritário"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm">
                                        <Check className="h-4 w-4 text-primary shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Button className="w-full rounded-none border-2 font-bold h-11 shadow-brutal-sm hover:-translate-y-0.5 transition-all" asChild>
                                <Link href="/sign-up">Começar</Link>
                            </Button>
                        </div>

                        {/* Enterprise */}
                        <div className="rounded-none border-2 border-border shadow-brutal bg-card p-8 flex flex-col hover:-translate-y-1 transition-all">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Enterprise</p>
                            <h3 className="text-lg font-semibold mb-4">Corporativo</h3>
                            <div className="mb-6">
                                <span className="text-3xl font-semibold">Sob consulta</span>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                {["SLA 99.9%", "Mentoria estratégica", "API personalizada", "Onboarding dedicado"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Check className="h-4 w-4 text-primary shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                            <Button variant="outline" className="w-full rounded-none border-2 font-bold h-11" asChild>
                                <Link href="/sign-up">Falar com consultor</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 md:py-24 border-t-2 border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                    <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                                Perguntas frequentes
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Tudo que você precisa saber antes de começar. Não encontrou sua dúvida? <Link href="/dashboard/help" className="text-primary underline underline-offset-4">Fale conosco</Link>.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {[
                                {
                                    q: "O PrepareC substitui meu contador?",
                                    a: "Não. O PrepareC é uma ferramenta de apoio para contadores e consultores tributários. As simulações e respostas da IA são de caráter orientativo e não substituem parecer contábil formal."
                                },
                                {
                                    q: "Os dados dos meus clientes estão seguros?",
                                    a: "Sim. Utilizamos criptografia TLS/HTTPS, autenticação via Clerk com MFA, e os pagamentos são processados pelo Stripe. Não armazenamos dados de cartão de crédito."
                                },
                                {
                                    q: "Posso cancelar a qualquer momento?",
                                    a: "Sim. O cancelamento pode ser feito a qualquer momento pelo portal do Stripe, diretamente nas configurações da sua conta. O acesso permanece ativo até o final do período já pago."
                                },
                                {
                                    q: "A consultoria digital está atualizada?",
                                    a: "Sim. Nosso sistema é alimentado com a EC 132/2023, LC 214/2025 e as resoluções mais recentes do governo. As fontes são citadas automaticamente em cada resposta."
                                },
                                {
                                    q: "Qual a diferença entre o plano Essencial e o Pro?",
                                    a: "O Essencial atende consultores autônomos (1 usuário, 1 empresa). O Pro é para escritórios maiores, com usuários ilimitados, 50 empresas, simulações ilimitadas e suporte prioritário."
                                },
                            ].map((faq, i) => (
                                <FAQItem key={i} question={faq.q} answer={faq.a} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="py-20 md:py-24 border-t-2 border-border bg-foreground text-background">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 text-center">
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">
                        Pronto para se preparar?
                    </h2>
                    <p className="text-sm opacity-70 mb-8 max-w-md mx-auto">
                        Junte-se a centenas de escritórios que já estão usando tecnologia especializada para navegar a Reforma Tributária.
                    </p>
                    <Button size="lg" variant="secondary" className="rounded-none border-2 border-background h-12 px-8 text-sm font-bold shadow-brutal hover:-translate-y-0.5 transition-all" asChild>
                        <Link href="/sign-up">
                            Criar conta agora <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </section>
        </main>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="rounded-none border-2 border-border bg-card shadow-brutal-sm">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full px-5 py-4 text-sm font-medium text-left gap-4"
            >
                <span>{question}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                    {answer}
                </div>
            )}
        </div>
    );
}

function WaitlistForm() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await joinWaitlist(email, "hero");
            setSubmitted(true);
            setEmail("");
        } catch {
            toast.error("Erro ao entrar na lista.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <p className="text-sm text-primary font-medium mt-2">
                ✓ Você está na lista. Avisaremos quando o Beta abrir.
            </p>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm mt-2">
            <Input
                type="email"
                placeholder="Seu e-mail para o Beta"
                className="h-9 rounded-none border-2 text-sm bg-secondary/50 border-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <Button type="submit" variant="outline" disabled={loading} className="h-9 rounded-none border-2 text-sm shrink-0 px-4">
                {loading ? "..." : "Lista de espera"}
            </Button>
        </form>
    );
}
