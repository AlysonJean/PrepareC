"use client";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/subscription";
import { useState } from "react";

interface SubscribeButtonProps {
    priceId: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
    children: React.ReactNode;
}

export function SubscribeButton({ priceId, variant = "default", children }: SubscribeButtonProps) {
    const [loading, setLoading] = useState(false);

    const onSubscribe = async () => {
        try {
            setLoading(true);
            const { url } = await createCheckoutSession(priceId);
            if (url) {
                if (url.includes("success=true")) {
                    alert("⚠️ AMBIENTE DE SIMULAÇÃO (MOCK)\n\nEm produção, este botão redireciona o cliente para o Checkout Seguro da Stripe com opções de Pix e Cartão.\n\n(Ação simulada e interceptada pois MOCK_DATABASE=true)");
                } else {
                    window.location.assign(url);
                }
            }
        } catch (error) {
            console.error("STRIIPE_CLIENT_ERROR", error);
            alert("Algo deu errado ao processar a assinatura.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={onSubscribe}
            disabled={loading}
            variant={variant}
            className="w-full rounded-none border-2 font-bold shadow-brutal-sm hover:-translate-y-0.5 transition-all"
        >
            {loading ? "Processando..." : children}
        </Button>
    );
}
