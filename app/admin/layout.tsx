import { AdminSidebar } from "@/components/admin-sidebar";
import { getSelf } from "@/lib/auth-service";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getSelf();

    // Proteção: Apenas ADMIN do sistema pode acessar
    if (!user || user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="h-full relative font-sans">
            <div className="hidden h-full md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 z-[80] bg-background">
                <AdminSidebar />
            </div>
            <main className="md:pl-60">
                <div className="w-full py-8 px-4 md:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
