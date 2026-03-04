"use client";

import { Button } from "@/components/ui/button";
import { createBillingPortalSession } from "@/lib/subscription";
import { useState } from "react";
import { CreditCard } from "lucide-react";

export function ManageSubscriptionButton() {
    const [loading, setLoading] = useState(false);

    const onManage = async () => {
        try {
            setLoading(true);
            const { url } = await createBillingPortalSession();
            if (url) window.location.assign(url);
        } catch (error) {
            console.error("STRIPE_PORTAL_ERROR", error);
            alert("Não foi possível acessar o portal de faturamento. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={onManage}
            disabled={loading}
            variant="outline"
            className="w-full sm:w-auto rounded-none border-2 font-bold shadow-brutal-sm hover:-translate-y-0.5 transition-all"
        >
            <CreditCard className="mr-2 h-4 w-4" />
            {loading ? "Redirecionando..." : "Gerenciar Assinatura"}
        </Button>
    );
}
