"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
    LayoutDashboard, 
    Building2, 
    Users, 
    Settings, 
    LifeBuoy,
    Scale,
    CreditCard
} from "lucide-react";

const routes = [
    {
        label: 'Dashboard Global',
        icon: LayoutDashboard,
        href: '/admin',
        color: "text-foreground",
    },
    {
        label: 'Organizações',
        icon: Building2,
        href: '/admin/organizations',
        color: "text-foreground",
    },
    {
        label: 'Usuários',
        icon: Users,
        href: '/admin/users',
        color: "text-foreground",
    },
    {
        label: 'Assinaturas',
        icon: CreditCard,
        href: '/admin/subscriptions',
        color: "text-foreground",
    },
    {
        label: 'Suporte Técnico',
        icon: LifeBuoy,
        href: '/admin/support',
        color: "text-foreground",
    },
    {
        label: 'Base Legal (RAG)',
        icon: Scale,
        href: '/admin/rag',
        color: "text-foreground",
    },
    {
        label: 'Configurações',
        icon: Settings,
        href: '/admin/settings',
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-background border-r">
            <div className="px-6 py-2">
                <Link href="/admin" className="flex items-center">
                    <h1 className="text-xl font-bold tracking-tight text-primary">
                        PrepareC <span className="text-[10px] bg-primary/10 border-2 border-primary px-2 py-0.5 rounded-none ml-2 shadow-brutal-sm">ADMIN</span>
                    </h1>
                </Link>
            </div>
            <div className="flex-1 px-3">
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-secondary rounded-none border-l-4 border-transparent transition",
                                pathname === route.href ? "bg-secondary text-foreground border-primary" : "text-muted-foreground hover:border-border",
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
