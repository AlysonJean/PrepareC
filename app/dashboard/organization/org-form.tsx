"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateOrganization } from "./actions";

interface OrgFormProps {
    initialData: {
        name: string;
        document: string | null;
        plan: string;
        subscriptionStatus: string;
    };
}

export function OrgForm({ initialData }: OrgFormProps) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
            const result = await updateOrganization(formData);
            if (result.error) {
                setMessage("Erro ao atualizar.");
            } else {
                setMessage("Dados atualizados com sucesso!");
            }
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <div className="grid gap-6 rounded-lg border p-4 bg-card">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Dados Gerais</h2>
                    <span className="text-sm font-medium px-2 py-1 rounded bg-muted text-muted-foreground">{initialData.plan}</span>
                </div>

                <Separator />
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="org-name">Nome da Organização</Label>
                        <Input
                            id="org-name"
                            name="name"
                            placeholder="Nome da sua empresa"
                            defaultValue={initialData.name}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="org-doc">CNPJ</Label>
                        <Input
                            id="org-doc"
                            name="document"
                            placeholder="00.000.000/0000-00"
                            defaultValue={initialData.document || ""}
                        />
                    </div>
                </div>
                {message && (
                    <div className={`text-sm text-center ${message.includes("Erro") ? "text-red-500" : "text-green-500"}`}>
                        {message}
                    </div>
                )}
                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </div>
        </form>
    );
}
