"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { sidebarSections } from "@/lib/nav-config";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden border-r-2 bg-background md:block h-screen sticky top-0 overflow-y-auto">
            <div className="flex h-14 items-center px-5 border-b-2">
                <Link href="/" className="text-sm font-semibold text-foreground">
                    PrepareC
                </Link>
            </div>
            <nav className="flex flex-col gap-1 p-2 mt-2">
                {sidebarSections.map((section) => (
                    <div key={section.label} className="mb-2">
                        <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            {section.label}
                        </p>
                        {section.items.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-none px-3 py-2 text-sm transition-colors border-l-4 border-transparent",
                                    pathname === item.href
                                        ? "bg-secondary text-foreground font-bold border-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:border-border"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </div>
                ))}
            </nav>
            <div className="mt-auto p-2 border-t-2 absolute bottom-0 left-0 right-0 bg-background">
                <Link
                    href="/dashboard/help"
                    className={cn(
                        "flex items-center gap-3 rounded-none px-3 py-2 text-sm transition-colors border-l-4 border-transparent",
                        pathname === "/dashboard/help"
                            ? "bg-secondary text-foreground font-bold border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:border-border"
                    )}
                >
                    <HelpCircle className="h-4 w-4" />
                    Ajuda
                </Link>
            </div>
        </div>
    );
}
