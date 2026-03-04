"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ClientActions } from "./client-actions";
import { Search, Users } from "lucide-react";

interface Client {
    id: string;
    name: string;
    document: string;
    createdAt: Date;
    updatedAt: Date;
}

function getClientStatus(updatedAt: Date): { label: string; className: string } {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate <= 30) return { label: "Ativo", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30" };
    if (daysSinceUpdate <= 90) return { label: "Inativo", className: "bg-amber-500/10 text-amber-700 border-amber-500/30" };
    return { label: "Dormindo", className: "bg-muted text-muted-foreground border-border" };
}

export function ClientsTable({ clients }: { clients: Client[] }) {
    const [search, setSearch] = useState("");

    const filtered = clients.filter((c) => {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.document.includes(q);
    });

    return (
        <>
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar por nome ou CNPJ..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-9 rounded-none border-2"
                />
            </div>

            <div className="rounded-none border-2 border-border shadow-brutal-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-40 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="h-12 w-12 rounded-none border-2 border-border bg-secondary flex items-center justify-center">
                                            <Users className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {search ? "Nenhum resultado" : "Nenhum cliente cadastrado"}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {search ? `Nenhum cliente corresponde a "${search}".` : "Adicione seu primeiro cliente para começar o monitoramento."}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((client) => {
                                const status = getClientStatus(client.updatedAt);
                                return (
                                    <TableRow key={client.id}>
                                        <TableCell className="font-medium">{client.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{client.document}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-none ${status.className}`}>
                                                {status.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <ClientActions clientId={client.id} clientName={client.name} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
            
            {filtered.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    Mostrando {filtered.length} de {clients.length} cliente(s).
                </p>
            )}
        </>
    );
}
