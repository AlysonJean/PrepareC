import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { getAllUsers } from "../actions";

export default async function AdminUsersPage() {
    const users = await getAllUsers();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Usuários</h1>
                <p className="text-sm text-muted-foreground">{users.length} usuário(s) na plataforma.</p>
            </div>

            <Card className="border-2 rounded-none shadow-brutal">
                <CardHeader className="border-b-2">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Todos os Usuários
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground">Nenhum usuário encontrado.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 bg-secondary/30">
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Nome</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Email</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Role</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Organização</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Plano</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Criado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u) => (
                                        <tr key={u.id} className="border-b hover:bg-secondary/10 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {u.imageUrl ? (
                                                        <img src={u.imageUrl} alt="" className="h-8 w-8 rounded-none border-2 border-border object-cover" />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-none border-2 border-border bg-secondary flex items-center justify-center text-xs font-black text-muted-foreground">
                                                            {(u.firstName?.[0] || u.email[0]).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-sm">
                                                        {u.firstName || ""} {u.lastName || ""}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground font-mono">{u.email}</td>
                                            <td className="p-4"><RoleBadge role={u.role} /></td>
                                            <td className="p-4 text-sm">{u.organization?.name || <span className="text-muted-foreground">—</span>}</td>
                                            <td className="p-4">
                                                {u.organization?.plan ? <PlanBadge plan={u.organization.plan} /> : <span className="text-muted-foreground text-xs">—</span>}
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
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

function RoleBadge({ role }: { role: string }) {
    const isAdmin = role === "ADMIN";
    return (
        <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 border-2 rounded-none ${isAdmin ? "bg-primary/10 text-primary border-primary" : "bg-secondary text-muted-foreground border-border"}`}>
            {role}
        </span>
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
