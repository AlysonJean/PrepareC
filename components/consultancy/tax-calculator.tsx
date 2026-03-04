"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator } from "lucide-react";

export function TaxCalculator() {
    const [baseValue, setBaseValue] = useState("");
    const [legacyCarga, setLegacyCarga] = useState("9.25"); // Padrão Lucro Real
    const [ibsRate, setIbsRate] = useState("17.7");
    const [cbsRate, setCbsRate] = useState("8.8");

    const results = useMemo(() => {
        const base = parseFloat(baseValue);
        const legacy = parseFloat(legacyCarga) / 100;
        const ibs = parseFloat(ibsRate) / 100;
        const cbs = parseFloat(cbsRate) / 100;

        if (isNaN(base)) return null;

        const legacyVal = base * legacy;
        const ibsVal = base * ibs;
        const cbsVal = base * cbs;
        const totalNew = ibsVal + cbsVal;
        const diff = totalNew - legacyVal;

        return {
            legacy: legacyVal,
            ibs: ibsVal,
            cbs: cbsVal,
            totalNew: base + totalNew,
            taxNew: totalNew,
            diff: diff,
            diffPct: (diff / legacyVal) * 100
        };
    }, [baseValue, legacyCarga, ibsRate, cbsRate]);

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <Card className="h-full border-2 border-border bg-background shadow-brutal overflow-hidden rounded-none">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <div className="rounded-none p-2 bg-primary/10 text-primary border-2 border-primary">
                            <Calculator className="h-5 w-5" />
                        </div>
                        Simulador de Impacto
                    </CardTitle>
                </div>
                <CardDescription className="text-sm font-medium">
                    Comparemos o sistema Atual vs IVA Dual
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="base" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Valor da Operação (R$)</Label>
                    <Input
                        id="base"
                        type="number"
                        placeholder="0,00"
                        value={baseValue}
                        onChange={(e) => setBaseValue(e.target.value)}
                        className="h-10 rounded-none border-2 bg-background font-semibold hover:border-primary focus-visible:ring-0"
                    />
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                        <Label htmlFor="legacy" className="text-[10px] font-bold uppercase text-muted-foreground">Carga Atual Est. (%)</Label>
                        <Input id="legacy" type="number" value={legacyCarga} onChange={(e) => setLegacyCarga(e.target.value)} className="h-8 text-xs rounded-none border-2 hover:border-primary focus-visible:ring-0" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pb-2 border-b border-border/40">
                    <div className="space-y-1">
                        <Label htmlFor="ibs" className="text-[10px] font-bold uppercase text-muted-foreground">IBS (%)</Label>
                        <Input id="ibs" type="number" value={ibsRate} onChange={(e) => setIbsRate(e.target.value)} className="h-8 text-xs rounded-none border-2 border-primary/30 hover:border-primary focus-visible:ring-0" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="cbs" className="text-[10px] font-bold uppercase text-muted-foreground">CBS (%)</Label>
                        <Input id="cbs" type="number" value={cbsRate} onChange={(e) => setCbsRate(e.target.value)} className="h-8 text-xs rounded-none border-2 border-primary/30 hover:border-primary focus-visible:ring-0" />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {results ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Carga Sistema Atual:</span>
                                    <span className="font-bold">{formatCurrency(results.legacy)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Carga Novo IVA Dual:</span>
                                    <span className="font-bold text-primary">{formatCurrency(results.taxNew)}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-none border-2 ${results.diff > 0 ? 'bg-red-500/10 border-red-500' : 'bg-emerald-500/10 border-emerald-500'}`}>
                                <p className="text-[10px] font-bold uppercase mb-1">Variação de Carga Fiscal</p>
                                <div className="flex items-baseline gap-2">
                                    <p className={`text-2xl font-black ${results.diff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                        {results.diff > 0 ? '+' : ''}{formatCurrency(results.diff)}
                                    </p>
                                    <p className="text-[10px] font-bold opacity-70">
                                        ({results.diff > 0 ? '+' : ''}{results.diffPct.toFixed(1)}%)
                                    </p>
                                </div>
                                <p className="text-[10px] mt-2 leading-tight opacity-60">
                                    {results.diff > 0
                                        ? "Atenção: Aumento de carga detectado. Revise créditos de não-cumulatividade."
                                        : "Otimização: Redução de carga prevista conforme regras de alíquota padrão."}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="pt-8 text-center opacity-40">
                            <Calculator className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                            <p className="text-[10px] font-medium">Insira o valor para simulação</p>
                        </div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}
