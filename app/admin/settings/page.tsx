import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Shield, Database, Webhook, Package } from "lucide-react";

export default function AdminSettingsPage() {
    const envVars = [
        { key: "DATABASE_URL", status: !!process.env.DATABASE_URL, masked: true },
        { key: "STRIPE_WEBHOOK_SECRET", status: !!process.env.STRIPE_WEBHOOK_SECRET, masked: true },
        { key: "STRIPE_PRICE_ESSENTIAL", status: !!process.env.STRIPE_PRICE_ESSENTIAL, masked: false },
        { key: "STRIPE_PRICE_PRO", status: !!process.env.STRIPE_PRICE_PRO, masked: false },
        { key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", status: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, masked: true },
        { key: "MOCK_DATABASE", status: !!process.env.MOCK_DATABASE, masked: false },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black tracking-tight">Configurações</h1>
                <p className="text-sm text-muted-foreground">Estado do sistema e variáveis de ambiente.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* System Info */}
                <Card className="border-2 rounded-none shadow-brutal">
                    <CardHeader className="border-b-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <Package className="h-4 w-4 text-primary" />
                            Sistema
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 divide-y-2">
                        <InfoRow label="Aplicação" value="PrepareC" />
                        <InfoRow label="Framework" value="Next.js 16" />
                        <InfoRow label="Runtime" value={`Node.js ${process.version || "—"}`} />
                        <InfoRow label="Ambiente" value={process.env.NODE_ENV || "development"} />
                        <InfoRow label="React Compiler" value="Ativado" />
                        <InfoRow label="ORM" value="Prisma Client 5.x" />
                    </CardContent>
                </Card>

                {/* Security */}
                <Card className="border-2 rounded-none shadow-brutal">
                    <CardHeader className="border-b-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            Segurança
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 divide-y-2">
                        <InfoRow label="Auth Provider" value="Clerk" />
                        <InfoRow label="Billing Provider" value="Stripe" />
                        <InfoRow label="Webhook Signature" value="Ativo (HMAC-SHA256)" />
                        <InfoRow label="Rate Limiting (Chat)" value="10 req/min por usuário" />
                        <InfoRow label="SQL Injection" value="Protegido (Prisma ORM)" />
                        <InfoRow label="RBAC (Roles)" value="Admin / User" />
                    </CardContent>
                </Card>

                {/* Environment Variables */}
                <Card className="border-2 rounded-none shadow-brutal lg:col-span-2">
                    <CardHeader className="border-b-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            Variáveis de Ambiente
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 bg-secondary/30">
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Variável</th>
                                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-wider text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {envVars.map((env) => (
                                        <tr key={env.key} className="border-b hover:bg-secondary/10 transition-colors">
                                            <td className="p-4 text-sm font-mono">{env.key}</td>
                                            <td className="p-4">
                                                {env.status ? (
                                                    <span className="text-[10px] font-black tracking-wider px-2 py-0.5 border-2 rounded-none bg-emerald-500/10 text-emerald-600 border-emerald-500">
                                                        CONFIGURADA
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black tracking-wider px-2 py-0.5 border-2 rounded-none bg-red-500/10 text-red-600 border-red-500">
                                                        AUSENTE
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Integrations */}
                <Card className="border-2 rounded-none shadow-brutal lg:col-span-2">
                    <CardHeader className="border-b-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <Webhook className="h-4 w-4 text-primary" />
                            Integrações
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 divide-y-2">
                        <InfoRow label="Stripe Webhooks" value="/api/webhook/stripe → Verificação Criptográfica Ativa" />
                        <InfoRow label="IA (Chat)" value="Google Gemini 2.5 Flash Lite via AI SDK" />
                        <InfoRow label="RAG (Base Legal)" value="pgvector + OpenAI Embeddings (1536 dim)" />
                        <InfoRow label="Email" value="Resend SDK" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between p-4">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-bold font-mono">{value}</span>
        </div>
    );
}
