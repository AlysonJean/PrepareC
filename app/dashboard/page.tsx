import { PremiumCard } from "@/components/shared/premium-card";
import { getDashboardStats } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Activity, ShieldCheck, ArrowRight, Zap, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getPlanLimits } from "@/lib/plan-limits";
import { PaywallOverlay, FeatureBadge } from "@/components/shared/paywall-overlay";

export default async function DashboardPage() {
    const stats = await getDashboardStats();
    const limits = getPlanLimits(stats.plan);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Visão Geral</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Bem-vindo(a) de volta à <span className="text-foreground font-medium">{stats.orgName}</span>.
                </p>
            </div>

            {/* Onboarding Welcome State para Novos Usuários */}
            {stats.clientsCount === 0 && stats.consultancyCount === 0 && (
                <Card className="border-primary/50 bg-primary/5 overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl text-primary flex items-center gap-2">
                            🎉 Conta criada com sucesso!
                        </CardTitle>
                        <CardDescription className="text-sm">
                            O <strong>PrepareC</strong> está pronto para ajudar seu escritório de contabilidade a navegar na Reforma Tributária. Para extrair valor imediato do sistema, recomendamos duas ações:
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <Link href="/dashboard/clients" className="group rounded-none p-4 bg-background border-2 border-border hover:border-primary hover:-translate-y-1 hover:shadow-brutal transition-all">
                            <div className="h-10 w-10 bg-primary/10 rounded-none flex items-center justify-center mb-3">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">1. Cadastrar Empresa</h3>
                            <p className="text-xs text-muted-foreground">Registre seu primeiro cliente para iniciar o monitoramento fiscal e o Histórico de Consultas dele.</p>
                        </Link>
                        
                        <Link href="/dashboard/simulator" className="group rounded-none p-4 bg-background border-2 border-border hover:border-primary hover:-translate-y-1 hover:shadow-brutal transition-all">
                            <div className="h-10 w-10 bg-primary/10 rounded-none flex items-center justify-center mb-3">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">2. Testar o Simulador</h3>
                            <p className="text-xs text-muted-foreground">Faça uma simulação rápida do impacto de 8 anos do IBS/CBS na carga tributária.</p>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <PremiumCard
                    title="Clientes"
                    value={stats.clientsCount}
                    description="Monitorados"
                    icon={<Users className="h-4 w-4" />}
                />
                <PremiumCard
                    title="Consultas"
                    value={stats.consultancyCount}
                    description="Pareceres gerados"
                    icon={<FileText className="h-4 w-4" />}
                />
                <PremiumCard
                    title="Plano"
                    value={stats.plan}
                    description="Assinatura ativa"
                    icon={<Activity className="h-4 w-4" />}
                />
                <PremiumCard
                    title="Este Mês"
                    value={stats.consultancyCount > 0 ? `${stats.consultancyCount}` : "0"}
                    description="Consultas realizadas"
                    icon={<ShieldCheck className="h-4 w-4" />}
                    iconClassName="text-primary"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card className="rounded-none shadow-brutal-sm">
                    <CardHeader>
                        <CardTitle className="text-base flex items-center">
                            Ações Rápidas
                        </CardTitle>
                        <CardDescription className="text-xs">Atalhos para as funções mais usadas.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2">
                        <Link
                            href="/dashboard/clients"
                            className="flex items-center gap-3 rounded-none border-2 border-dashed border-muted-foreground/50 p-4 text-sm text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <Users className="h-4 w-4 text-primary" />
                            <span>Adicionar Cliente</span>
                            <ArrowRight className="h-3 w-3 ml-auto" />
                        </Link>
                        <Link
                            href="/dashboard/consultancy"
                            className="flex items-center gap-3 rounded-none border-2 border-dashed border-muted-foreground/50 p-4 text-sm text-muted-foreground hover:text-foreground hover:border-primary hover:bg-primary/5 transition-all"
                        >
                            <FileText className="h-4 w-4 text-primary" />
                            <span>Nova Consulta</span>
                            <ArrowRight className="h-3 w-3 ml-auto" />
                        </Link>
                    </CardContent>
                </Card>

                <PaywallOverlay
                    isLocked={!limits.features.customReports}
                    featureName="Relatórios customizados"
                    requiredPlan="PRO"
                >
                    <Card className="rounded-none shadow-brutal-sm h-full">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center">
                                Análise Avançada
                                {!limits.features.customReports && <FeatureBadge plan="PRO" />}
                            </CardTitle>
                            <CardDescription className="text-xs">Relatórios detalhados com impacto financeiro.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 rounded-none bg-background border-2 border-border">
                                    <Zap className="h-4 w-4 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Relatório de Impacto IBS/CBS</p>
                                        <p className="text-[10px] text-muted-foreground">Projeção 2026-2033</p>
                                    </div>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-none bg-background border-2 border-border opacity-50">
                                    <Activity className="h-4 w-4" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Comparativo Setorial</p>
                                        <p className="text-[10px] text-muted-foreground">Benchmark de mercado</p>
                                    </div>
                                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </PaywallOverlay>
            </div>
        </div>
    );
}
