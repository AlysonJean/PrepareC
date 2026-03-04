"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { processLegalText } from "./actions";
import { Scale, Upload, CheckCircle2, AlertCircle } from "lucide-react";

const DOC_TYPES = [
    { value: "LEI_COMPLEMENTAR", label: "Lei Complementar" },
    { value: "EMENDA_CONSTITUCIONAL", label: "Emenda Constitucional" },
    { value: "LEI_ORDINARIA", label: "Lei Ordinária" },
    { value: "MEDIDA_PROVISORIA", label: "Medida Provisória" },
    { value: "DECRETO", label: "Decreto" },
    { value: "INSTRUCAO_NORMATIVA", label: "Instrução Normativa" },
    { value: "SOLUCAO_CONSULTA", label: "Solução de Consulta" },
    { value: "NOTA_TECNICA", label: "Nota Técnica" },
] as const;

export default function AdminRAGPage() {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success?: boolean; error?: string; documentId?: string } | null>(null);
    const [docType, setDocType] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.set("type", docType);

        startTransition(async () => {
            const res = await processLegalText(formData);
            setResult(res);
        });
    };

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl flex items-center gap-2">
                    <Scale className="h-5 w-5 text-primary" />
                    Base Legal (RAG)
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Cadastre documentos legais para alimentar o sistema de consultoria digital. Os textos são automaticamente divididos em chunks e vetorizados.
                </p>
            </div>

            {/* Feedback */}
            {result && (
                <div className={`rounded-none border-2 p-4 text-sm flex items-start gap-3 ${
                    result.success 
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" 
                        : "border-destructive bg-destructive/10 text-destructive"
                }`}>
                    {result.success ? <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" /> : <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />}
                    <div>
                        {result.success ? (
                            <>
                                <p className="font-medium">Documento vetorizado com sucesso!</p>
                                <p className="text-xs mt-1 opacity-70">ID: {result.documentId}</p>
                            </>
                        ) : (
                            <p>{result.error}</p>
                        )}
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="rounded-none border-2 border-border shadow-brutal-sm bg-card p-6 space-y-5 max-w-2xl">
                <div className="space-y-2">
                    <Label htmlFor="title">Título do documento *</Label>
                    <Input 
                        id="title"
                        name="title" 
                        placeholder="Ex: LC 214/2025 — Regulamentação IBS e CBS"
                        className="rounded-none border-2"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tipo *</Label>
                        <Select value={docType} onValueChange={setDocType} required>
                            <SelectTrigger className="rounded-none border-2">
                                <SelectValue placeholder="Selecionar tipo" />
                            </SelectTrigger>
                            <SelectContent className="rounded-none border-2">
                                {DOC_TYPES.map(dt => (
                                    <SelectItem key={dt.value} value={dt.value}>{dt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="source">Fonte / URL</Label>
                        <Input 
                            id="source"
                            name="source" 
                            placeholder="Ex: planalto.gov.br/..."
                            className="rounded-none border-2"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Conteúdo do documento * </Label>
                    <Textarea 
                        id="content"
                        name="content" 
                        placeholder="Cole aqui o texto integral da lei, artigos ou resolução..."
                        className="rounded-none border-2 min-h-[200px] text-xs leading-relaxed"
                        required
                    />
                    <p className="text-[10px] text-muted-foreground">
                        O texto será dividido em chunks de ~1000 caracteres e vetorizado automaticamente via OpenAI embeddings.
                    </p>
                </div>

                <Button 
                    type="submit" 
                    disabled={isPending || !docType}
                    className="rounded-none border-2 gap-2 shadow-brutal-sm"
                >
                    <Upload className="h-4 w-4" />
                    {isPending ? "Processando e vetorizando..." : "Cadastrar e Vetorizar"}
                </Button>
            </form>
        </div>
    );
}
