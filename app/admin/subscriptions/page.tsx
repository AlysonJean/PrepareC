import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ExternalLink } from "lucide-react";
import { getAllSubscriptions } from "../actions";

export default async function AdminSubscriptionsPage() {
    const subscriptions = await getAllSubscriptions();

    const activeCount = subscriptions.filter(s => s.status === "ACTIVE").length;
    const canceledCount = subscriptions.filter(s => s.status === "CANCELED").length;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Assinaturas</h1>
                <p className="text-sm text-muted-foreground">{subscriptions.length} assinatura(s) registradas. {activeCount} ativas, {canceledCount} canceladas.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-2 rounded-none shadow-brutal-sm">
                    <CardContent className="pt-6">
                        <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Ativas</div>
                        <div className="text-3xl font-black text-emerald-600">{activeCount}</div>
                    </CardContent>
                </Card>
                <Card className="border-2 rounded-none shadow-brutal-sm">
                    <CardContent className="pt-6">
                        <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Canceladas</div>
                        <div className="text-3xl font-black text-red-600">{canceledCount}</div>
                    </CardContent>
                </Card>
                <Card className="border-2 rounded-none shadow-brutal-sm">
                    <CardContent className="pt-6">
                        <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Total</div>
                        <div className="text-3xl font-black">{subscriptions.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Subscriptions Table */}
            <Card className="border-2 rounded-none shadow-brutal">
                <CardHeader className="border-b-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        Todas as Assinaturas
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {subscriptions.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">Nenhuma assinatura encontrada.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 bg-secondary/30">
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Usuário</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Plano</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Próxima Cobrança</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Stripe ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subscriptions.map((sub) => (
                                        <tr key={sub.id} className="border-b hover:bg-secondary/10 transition-colors">
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-bold text-sm">{sub.user.firstName || ""} {sub.user.lastName || ""}</p>
                                                    <p className="text-[10px] text-muted-foreground font-mono">{sub.user.email}</p>
                                                </div>
                                            </td>
                                            <td className="p-4"><PlanBadge plan={sub.planType} /></td>
                                            <td className="p-4"><StatusBadge status={sub.status} /></td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(sub.stripeCurrentPeriodEnd).toLocaleDateString("pt-BR")}
                                            </td>
                                            <td className="p-4">
                                                <a
                                                    href={`https://dashboard.stripe.com/subscriptions/${sub.stripeSubscriptionId}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[10px] text-primary hover:underline font-mono inline-flex items-center gap-1"
                                                >
                                                    {sub.stripeSubscriptionId.slice(0, 20)}…
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function PlanBadge({ plan }: { plan: string }) {
    const colors: Record<string, string> = {
        FREE: "bg-secondary text-muted-foreground border-border",
        ESSENTIAL: "bg-blue-500/10 text-blue-600 border-blue-500",
        PRO: "bg-emerald-500/10 text-emerald-600 border-emerald-500",
        ELITE: "bg-amber-500/10 text-amber-600 border-amber-500",
        ENTERPRISE: "bg-primary/10 text-primary border-primary",
    };
    return (
        <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 border-2 rounded-none ${colors[plan] || "bg-secondary text-muted-foreground border-border"}`}>
            {plan}
        </span>
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
