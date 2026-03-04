import { ClientDialog } from "./client-dialog";
import { ClientsTable } from "./clients-table";
import { getClients } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Clientes | PrepareC Dashboard",
    description: "Gerencie sua carteira de clientes e monitoramento tributário.",
    openGraph: {
        title: "Clientes | PrepareC",
    }
};

export default async function ClientsPage() {
    const clients = await getClients();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
                    <p className="text-sm text-muted-foreground mt-1">{clients.length} empresa(s) monitorada(s).</p>
                </div>
                <ClientDialog />
            </div>
            <ClientsTable clients={clients.map(c => ({
                id: c.id,
                name: c.name,
                document: c.document,
                createdAt: c.createdAt,
                updatedAt: c.updatedAt,
            }))} />
        </div>
    );
}
