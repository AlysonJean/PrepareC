"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarItems } from "@/lib/nav-config";
import { useState } from "react";

export function MobileNav() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col w-64 p-0">
                <div className="flex h-14 items-center px-5 border-b">
                    <Link href="/" className="text-sm font-semibold" onClick={() => setOpen(false)}>
                        PrepareC
                    </Link>
                </div>
                <nav className="flex flex-col gap-0.5 p-2 mt-2 flex-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
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
                </nav>
                <div className="p-2 border-t">
                    <Link
                        href="/dashboard/help"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-none px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:border-border border-l-4 border-transparent transition-colors"
                    >
                        <HelpCircle className="h-4 w-4" />
                        Ajuda
                    </Link>
                </div>
            </SheetContent>
        </Sheet>
    );
}
