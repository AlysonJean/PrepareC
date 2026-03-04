"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { processLegalText } from "./actions";

export default function RagAdminPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const formData = new FormData(e.currentTarget);
        const result = await processLegalText(formData);

        if (result.error) {
            setMessage({ type: "error", text: result.error });
        } else if (result.success) {
            setMessage({ type: "success", text: "Documento vetorizado com sucesso e injetado na base de conhecimento!" });
            (e.target as HTMLFormElement).reset();
        }
        
        setLoading(false);
    }

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Base de Conhecimento RAG</h2>
                    <p className="text-muted-foreground mt-1">
                        Injete textos legais (como a EC 132/2023) para fundamentar as respostas da consultoria digital.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Adicionar Nova Legislação</CardTitle>
                    <CardDescription>O sistema usará OpenAI Text Embeddings 3 para processar esse texto.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Título ou Ementa</Label>
                                <Input id="title" name="title" placeholder="Ex: Artigo 1 da EC 132/2023" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Tipo de Documento</Label>
                                <Select name="type" defaultValue="EMENDA_CONSTITUCIONAL">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EMENDA_CONSTITUCIONAL">Emenda Constitucional</SelectItem>
                                        <SelectItem value="LEI_COMPLEMENTAR">Lei Complementar</SelectItem>
                                        <SelectItem value="MEDIDA_PROVISORIA">Medida Provisória</SelectItem>
                                        <SelectItem value="INSTRUCAO_NORMATIVA">Instrução Normativa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="source">URL da Fonte Oficial (Opcional)</Label>
                            <Input id="source" name="source" placeholder="Ex: planalto.gov.br/..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Texto Legal na Íntegra</Label>
                            <Textarea 
                                id="content" 
                                name="content" 
                                placeholder="Cole aqui o texto da lei. O sistema dividirá automaticamente em recortes para processamento." 
                                className="min-h-[250px]" 
                                required 
                            />
                        </div>

                        {message && (
                            <div className={`p-3 text-sm rounded-md ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {message.text}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? "Vetorizando (Processamento Pesado)..." : "Vetorizar e Salvar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
