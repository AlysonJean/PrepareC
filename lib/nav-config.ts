import {
    LayoutDashboard,
    Users,
    Building2,
    Settings,
    Scale,
    CreditCard,
    Calculator,
    ScrollText,
    BookOpen,
} from "lucide-react";

export interface SidebarSection {
    label: string;
    items: SidebarItem[];
}

export interface SidebarItem {
    title: string;
    href: string;
    icon: typeof LayoutDashboard;
}

export const sidebarSections: SidebarSection[] = [
    {
        label: "Análise",
        items: [
            {
                title: "Visão Geral",
                href: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "Consultoria Digital",
                href: "/dashboard/consultancy",
                icon: Scale,
            },
            {
                title: "Simulador da Reforma",
                href: "/dashboard/simulator",
                icon: Calculator,
            },
        ],
    },
    {
        label: "Gestão",
        items: [
            {
                title: "Clientes",
                href: "/dashboard/clients",
                icon: Users,
            },
            {
                title: "Minha Organização",
                href: "/dashboard/organization",
                icon: Building2,
            },
            {
                title: "Histórico de Consultas",
                href: "/dashboard/logs",
                icon: ScrollText,
            },
        ],
    },
    {
        label: "Conta",
        items: [
            {
                title: "Planos e Assinatura",
                href: "/dashboard/billing",
                icon: CreditCard,
            },
            {
                title: "Status Legislativo",
                href: "/dashboard/legislation",
                icon: BookOpen,
            },
            {
                title: "Configurações",
                href: "/dashboard/settings",
                icon: Settings,
            },
        ],
    },
];

// Flat list for backward compatibility
export const sidebarItems = sidebarSections.flatMap((s) => s.items);
