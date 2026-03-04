import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailPlus, Clock, Users } from "lucide-react";
import { getGrowthMetrics } from "../actions";

export default async function AdminSupportPage() {
    const { waitlist, leads } = await getGrowthMetrics();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Growth & Leads</h1>
                <p className="text-sm text-muted-foreground">Funil de aquisição — Waitlist e leads do simulador tributário.</p>
            </div>

            {/* Summary */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-2 rounded-none shadow-brutal-sm">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-none border-2 border-primary bg-primary/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Waitlist</div>
                            <div className="text-3xl font-black">{waitlist.length}</div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 rounded-none shadow-brutal-sm">
                    <CardContent className="pt-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-none border-2 border-primary bg-primary/10 flex items-center justify-center">
                            <MailPlus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Leads (Simulador)</div>
                            <div className="text-3xl font-black">{leads.length}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Waitlist Table */}
            <Card className="border-2 rounded-none shadow-brutal">
                <CardHeader className="border-b-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Lista de Espera ({waitlist.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {waitlist.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">Nenhum cadastro na waitlist.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 bg-secondary/30">
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Email</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Origem</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {waitlist.map((entry) => (
                                        <tr key={entry.id} className="border-b hover:bg-secondary/10 transition-colors">
                                            <td className="p-4 text-sm font-mono">{entry.email}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{entry.source || "direto"}</td>
                                            <td className="p-4">
                                                <WaitlistBadge status={entry.status} />
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString("pt-BR")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Leads Table */}
            <Card className="border-2 rounded-none shadow-brutal">
                <CardHeader className="border-b-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <MailPlus className="h-4 w-4 text-primary" />
                        Leads do Simulador ({leads.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {leads.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">Nenhum lead capturado.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 bg-secondary/30">
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Email</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Setor</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="border-b hover:bg-secondary/10 transition-colors">
                                            <td className="p-4 text-sm font-mono">{lead.email}</td>
                                            <td className="p-4 text-sm">{lead.sector || "—"}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{new Date(lead.createdAt).toLocaleDateString("pt-BR")}</td>
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

function WaitlistBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        PENDING: "bg-yellow-500/10 text-yellow-600 border-yellow-500",
        INVITED: "bg-blue-500/10 text-blue-600 border-blue-500",
        JOINED: "bg-emerald-500/10 text-emerald-600 border-emerald-500",
    };
    return (
        <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 border-2 rounded-none ${colors[status] || "bg-secondary text-muted-foreground border-border"}`}>
            {status}
        </span>
    );
}
