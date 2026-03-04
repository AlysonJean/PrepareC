import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ManageSubscriptionButton } from "@/components/manage-subscription-button";
import { UserButton } from "@clerk/nextjs";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-xl font-semibold">Configurações</h1>
                <p className="text-sm text-muted-foreground mt-1">Gerencie sua conta e preferências.</p>
            </div>
            <Separator />

            <div className="space-y-6 max-w-lg">
                <div className="rounded-none border-2 border-border shadow-brutal-sm bg-background p-5">
                    <h2 className="text-sm font-medium mb-4">Perfil</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm">Conta Clerk</p>
                            <p className="text-xs text-muted-foreground">Gerencie senha e autenticação.</p>
                        </div>
                        <UserButton />
                    </div>
                </div>

                <div className="rounded-none border-2 border-border shadow-brutal-sm bg-background p-5">
                    <h2 className="text-sm font-medium mb-4">Notificações</h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="security-emails" className="flex flex-col gap-0.5">
                                <span className="text-sm">Alertas de Segurança</span>
                                <span className="text-xs text-muted-foreground font-normal">Login suspeito e alterações de conta.</span>
                            </Label>
                            <Switch id="security-emails" defaultChecked disabled />
                        </div>
                    </div>
                </div>

                <div className="rounded-none border-2 border-border shadow-brutal-sm bg-background p-5">
                    <h2 className="text-sm font-medium mb-4">Assinatura</h2>
                    <p className="text-xs text-muted-foreground mb-4">Gerencie seu plano, método de pagamento e faturas no Stripe.</p>
                    <ManageSubscriptionButton />
                </div>

                <div className="rounded-none border-2 border-destructive shadow-brutal-sm bg-destructive/5 p-5">
                    <h2 className="text-sm font-medium text-destructive mb-2">Zona de Perigo</h2>
                    <p className="text-xs text-muted-foreground mb-4">Para cancelar sua assinatura, use o botão acima para acessar o portal do Stripe.</p>
                </div>
            </div>
        </div>
    );
}
