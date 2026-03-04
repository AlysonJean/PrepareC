"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, Eye } from "lucide-react";
import { deleteClient } from "./actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function ClientActions({ clientId, clientName }: { clientId: string; clientName: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (confirm(`Tem certeza que deseja excluir "${clientName}"? Esta ação não pode ser desfeita.`)) {
            startTransition(async () => {
                await deleteClient(clientId);
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-none">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-none border-2 shadow-brutal-sm">
                <DropdownMenuLabel className="text-xs">Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    onClick={() => router.push(`/dashboard/consultancy`)}
                    className="rounded-none cursor-pointer text-xs gap-2"
                >
                    <Eye className="h-3.5 w-3.5" />
                    Nova consulta
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="rounded-none text-destructive focus:text-destructive cursor-pointer text-xs gap-2"
                    disabled={isPending}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    {isPending ? "Excluindo..." : "Excluir"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
