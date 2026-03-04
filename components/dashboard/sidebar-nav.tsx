"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, MessageSquareText, Settings } from "lucide-react";

export function SidebarNav() {
    const pathname = usePathname();

    const items = [
        {
            title: "Visão Geral",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Consultoria",
            href: "/dashboard/consultancy",
            icon: MessageSquareText,
        },
        {
            title: "Configurações",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ];

    return (
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {items.map((item) => (
                <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                        "justify-start",
                        pathname === item.href ? "bg-secondary text-secondary-foreground" : ""
                    )}
                    asChild
                >
                    <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </Link>
                </Button>
            ))}
        </nav>
    );
}
