"use client";

import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
    Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogHeader, 
    DialogTitle,
    DialogTrigger 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface PaywallOverlayProps {
    children: React.ReactNode;
    isLocked: boolean;
    featureName: string;
    requiredPlan: string;
}

export function PaywallOverlay({ 
    children, 
    isLocked, 
    featureName, 
    requiredPlan 
}: PaywallOverlayProps) {
    // Beta mode: desbloqueia tudo para testes com contadores
    const isBeta = process.env.NEXT_PUBLIC_BETA_MODE === "true";
    if (!isLocked || isBeta) return <>{children}</>;

    return (
        <div className="relative group cursor-not-allowed">
            <div className="blur-[2px] pointer-events-none opacity-50 grayscale">
                {children}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/20 backdrop-blur-[2px] rounded-none transition-all group-hover:bg-background/40">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 shadow-brutal bg-background border-2 border-primary hover:border-primary transition-all rounded-none">
                            <Lock className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs font-medium">Liberar {featureName}</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] border-2 border-border shadow-brutal rounded-none">
                        <DialogHeader className="items-center text-center space-y-4">
                            <div className="h-12 w-12 rounded-none border-2 border-primary bg-primary/10 flex items-center justify-center mb-2">
                                <Lock className="h-6 w-6 text-primary" />
                            </div>
                            <DialogTitle className="text-xl font-bold">Recurso Exclusivo</DialogTitle>
                            <DialogDescription className="text-sm leading-relaxed">
                                A funcionalidade de <strong className="text-foreground">{featureName}</strong> está disponível apenas para assinantes do plano <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{requiredPlan}</Badge> ou superior.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3 py-4">
                            <Button className="w-full rounded-none" size="lg" asChild>
                                <a href="/dashboard/billing">Ver Planos e Preços</a>
                            </Button>
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground" asChild>
                                <a href="/dashboard/help">Falar com suporte técnico</a>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

// Estilização alternativa: Badge de "PRO" ao lado do título
export function FeatureBadge({ plan }: { plan: string }) {
    return (
        <Badge variant="outline" className="ml-2 text-[10px] h-4 px-1.5 font-bold border-primary/30 text-primary bg-primary/5 uppercase tracking-wider">
            {plan}
        </Badge>
    );
}
