"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface BillingGateProps {
    subscriptionStatus: string;
    children: React.ReactNode;
}

export function BillingGate({ subscriptionStatus, children }: BillingGateProps) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (subscriptionStatus !== "ACTIVE" && pathname !== "/dashboard/billing") {
            router.push("/dashboard/billing");
        }
    }, [subscriptionStatus, pathname, router]);

    // If locked out, usually we might want to hide content, but since the layout wraps the sidebar
    // we still want the layout to render so they can see the Sidebar (to click Billing).
    // If we completely block rendering, the sidebar disappears.
    // The previous instruction said "o ÚNICO acesso permitido é a Página de Planos".
    // This implies sidebar navigation to Billing is allowed.

    // If we are on a blocked page, we could return null or a loader to prevent flash of content,
    // but simply letting the redirect happen is often acceptable for MVP.
    // To be stricter:
    if (subscriptionStatus !== "ACTIVE" && pathname !== "/dashboard/billing") {
        return null; // Don't render the protected page content while redirecting
    }

    return <>{children}</>;
}
