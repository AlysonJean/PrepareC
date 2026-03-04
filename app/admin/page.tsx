import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, CreditCard, TrendingDown, MailPlus, Clock } from "lucide-react";
import { getAdminDashboardStats, getRecentOrganizations } from "./actions";
import Link from "next/link";

export default async function AdminPage() {
    const stats = await getAdminDashboardStats();
    const recentOrgs = await getRecentOrganizations();

    const kpis = [
        {
            title: "Organizações",
            value: stats.totalOrgs,
            description: "Total cadastradas",
            icon: Building2,
            href: "/admin/organizations",
        },
        {
            title: "Usuários",
            value: stats.totalUsers,
            description: "Total na plataforma",
            icon: Users,
            href: "/admin/users",
        },
        {
            title: "Assinaturas Ativas",
            value: stats.activeSubscriptions,
            description: "Planos pagantes",
            icon: CreditCard,
            href: "/admin/subscriptions",
        },
        {
            title: "Churn (Mês)",
            value: stats.canceledThisMonth,
            description: "Cancelamentos este mês",
            icon: TrendingDown,
            href: "/admin/subscriptions",
        },
        {
            title: "Leads",
            value: stats.totalLeads,
            description: "Termômetro tributário",
            icon: MailPlus,
            href: "/admin/support",
        },
        {
            title: "Waitlist",
            value: stats.totalWaitlist,
            description: "Lista de espera",
            icon: Clock,
            href: "/admin/support",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Dashboard Global</h1>
                <p className="text-sm text-muted-foreground">Visão geral da operação PrepareC — dados em tempo real.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {kpis.map((kpi) => (
                    <Link key={kpi.title} href={kpi.href}>
                        <Card className="border-2 rounded-none shadow-brutal-sm hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {kpi.title}
                                </CardTitle>
                                <kpi.icon className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{kpi.value}</div>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    {kpi.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Organizations */}
                <Card className="border-2 rounded-none shadow-brutal">
                    <CardHeader className="border-b-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold uppercase tracking-wider">Últimas Organizações</CardTitle>
                            <Link href="/admin/organizations" className="text-xs text-primary hover:underline font-bold">Ver todas →</Link>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recentOrgs.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground text-sm">Nenhuma organização cadastrada.</div>
                        ) : (
                            <div className="divide-y-2">
                                {recentOrgs.map((org) => (
                                    <div key={org.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors">
                                        <div className="h-10 w-10 rounded-none border-2 border-primary bg-primary/10 flex items-center justify-center">
                                            <Building2 className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold truncate">{org.name}</p>
                                            <p className="text-[10px] text-muted-foreground">
                                                {org.plan} • {org._count.users} membro(s)
                                            </p>
                                        </div>
                                        <StatusBadge status={org.subscriptionStatus} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-2 rounded-none shadow-brutal">
                    <CardHeader className="border-b-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">Atalhos Rápidos</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        {[
                            { label: "Gerenciar Organizações", href: "/admin/organizations", icon: Building2 },
                            { label: "Gerenciar Usuários", href: "/admin/users", icon: Users },
                            { label: "Assinaturas e Faturamento", href: "/admin/subscriptions", icon: CreditCard },
                            { label: "Growth & Leads", href: "/admin/support", icon: MailPlus },
                        ].map((action) => (
                            <Link key={action.href} href={action.href}>
                                <div className="flex items-center gap-3 p-3 border-2 rounded-none hover:bg-secondary/30 hover:border-primary transition-all cursor-pointer group">
                                    <action.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-sm font-medium group-hover:text-primary transition-colors">{action.label}</span>
                                    <span className="ml-auto text-muted-foreground text-xs">→</span>
                                </div>
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500",
        TRIALING: "bg-blue-500/10 text-blue-600 border-blue-500",
        CANCELED: "bg-red-500/10 text-red-600 border-red-500",
        PAST_DUE: "bg-yellow-500/10 text-yellow-600 border-yellow-500",
        UNPAID: "bg-red-500/10 text-red-600 border-red-500",
    };

    return (
        <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 border-2 rounded-none ${colors[status] || "bg-secondary text-muted-foreground border-border"}`}>
            {status}
        </span>
    );
}
