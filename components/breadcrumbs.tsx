"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const pathNames: Record<string, string> = {
    "/dashboard": "Visão Geral",
    "/dashboard/consultancy": "Consultoria Digital",
    "/dashboard/simulator": "Simulador da Reforma",
    "/dashboard/clients": "Clientes",
    "/dashboard/organization": "Minha Organização",
    "/dashboard/logs": "Histórico de Consultas",
    "/dashboard/billing": "Planos e Assinatura",
    "/dashboard/legislation": "Status Legislativo",
    "/dashboard/settings": "Configurações",
    "/dashboard/help": "Ajuda",
};

export function Breadcrumbs() {
    const pathname = usePathname();
    const currentPage = pathNames[pathname];

    if (!currentPage || pathname === "/dashboard") return null;

    return (
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Painel
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{currentPage}</span>
        </nav>
    );
}
