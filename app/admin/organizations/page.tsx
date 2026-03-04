import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { getAllOrganizations } from "../actions";

export default async function AdminOrganizationsPage() {
    const organizations = await getAllOrganizations();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Organizações</h1>
                <p className="text-sm text-muted-foreground">{organizations.length} organização(ões) cadastradas na plataforma.</p>
            </div>

            <Card className="border-2 rounded-none shadow-brutal">
                <CardHeader className="border-b-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-primary" />
                        Todas as Organizações
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {organizations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">Nenhuma organização encontrada.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 bg-secondary/30">
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Nome</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">CNPJ</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Plano</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="text-center p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Membros</th>
                                        <th className="text-center p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Clientes</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Criado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {organizations.map((org) => (
                                        <tr key={org.id} className="border-b hover:bg-secondary/10 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-none border-2 border-primary bg-primary/10 flex items-center justify-center shrink-0">
                                                        <Building2 className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="font-bold text-sm">{org.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground font-mono">{org.document || "—"}</td>
                                            <td className="p-4"><PlanBadge plan={org.plan} /></td>
                                            <td className="p-4"><StatusBadge status={org.subscriptionStatus} /></td>
                                            <td className="p-4 text-center font-bold text-sm">{org._count.users}</td>
                                            <td className="p-4 text-center font-bold text-sm">{org._count.clients}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{new Date(org.createdAt).toLocaleDateString("pt-BR")}</td>
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
