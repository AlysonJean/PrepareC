import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { NotificationBell } from "@/components/notification-bell";
import { CommandPalette } from "@/components/command-palette";
import { ThemeToggle } from "@/components/theme-toggle";
import { getSelf } from "@/lib/auth-service";
import { getNotifications, getUnreadNotificationsCount } from "./actions";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        template: "%s — PrepareC",
        default: "Dashboard — PrepareC",
    },
    description: "Gerencie sua conformidade tributária.",
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getSelf();
    const subscriptionStatus = user?.organization?.subscriptionStatus || "INACTIVE";

    // Hard Paywall: Redireciona usuários inativos diretamente no servidor.
    const isBeta = process.env.NEXT_PUBLIC_BETA_MODE === "true";
    if (!isBeta && subscriptionStatus !== "ACTIVE" && subscriptionStatus !== "TRIALING") {
        redirect("/onboarding/plans");
    }

    // Fetch notifications server-side
    const [notifications, unreadCount] = await Promise.all([
        getNotifications(),
        getUnreadNotificationsCount(),
    ]);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
                <header className="flex h-14 items-center justify-between border-b-2 border-border px-4 md:px-8 bg-background sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <MobileNav />
                        <span className="text-sm font-bold md:hidden">PrepareC</span>
                        <div className="hidden md:block">
                            <Breadcrumbs />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-auto">
                        <CommandPalette />
                        <ThemeToggle />
                        <NotificationBell
                            notifications={notifications.map(n => ({
                                ...n,
                                createdAt: n.createdAt,
                            }))}
                            unreadCount={unreadCount}
                        />
                        <UserButton 
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "rounded-none border-2 border-primary shadow-brutal-sm h-8 w-8 hover:-translate-y-0.5 transition-all",
                                    userButtonPopoverCard: "rounded-none border-2 border-border shadow-brutal",
                                    userButtonPopoverActionButton: "rounded-none hover:bg-secondary transition-colors",
                                }
                            }}
                        />
                    </div>
                </header>
                <main className="flex flex-1 flex-col p-4 md:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
