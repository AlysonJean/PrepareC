"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, TrendingDown, TrendingUp, Download, Lock } from "lucide-react";
import { calculateTaxImpact, SimulationParams, SimulationResult } from "@/lib/simulator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PaywallOverlay } from "@/components/shared/paywall-overlay";
import { createConsultancyLog } from "@/app/dashboard/logs/actions";

interface SimulatorProps {
    isPro: boolean;
}

export function SimulatorForm({ isPro }: SimulatorProps) {
    const [params, setParams] = useState<SimulationParams>({
        faturamentoMensal: 100000,
        regimeAtual: "LUCRO_PRESUMIDO",
        setor: "SERVICOS",
        custoInsumosPerc: 15,
        folhaPagamentoPerc: 40,
        saldoCredorObtido: 0,
        percentualVendasB2B: 0,
    });

    const [result, setResult] = useState<SimulationResult | null>(null);

    const formatCurrency = (value: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const formatPercent = (value: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 }).format(value / 100);

    const handleCalculate = async () => {
        const res = calculateTaxImpact(params);
        setResult(res);

        // Registra o log da consulta em background
        const question = `[Simulação] Faturamento: ${formatCurrency(params.faturamentoMensal)} | Regime: ${params.regimeAtual} | Setor: ${params.setor}`;
        const answer = `Impacto de ${formatPercent(res.impactoPercentual)} (${res.isAumento ? 'Aumento' : 'Redução'}). Carga Futura Projetada: ${formatCurrency(res.cargaFuturaCalc)}.`;

        try {
            await createConsultancyLog({ 
                question, 
                answer, 
                contextData: { ...params, rawResult: res } as Record<string, unknown>
            });
        } catch (error) {
            console.error("Erro ao salvar log do simulador", error);
        }
    };

    const chartData = result ? result.timeline.map((t) => ({
        name: t.year.toString(),
        "Transição (Reforma)": t.cargaProjetada,
        "Carga Antiga": t.cargaAtual
    })) : [];

    return (
        <div className="grid gap-6 lg:grid-cols-12">
            {/* Input Form */}
            <Card className="lg:col-span-5 shadow-brutal-white rounded-none border-2 border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Calculator className="h-5 w-5 text-primary" />
                        Parâmetros da Empresa
                    </CardTitle>
                    <CardDescription>
                        Insira os dados da empresa para calcularmos a projeção de 8 anos de transição do IBS e CBS.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Faturamento Mensal (Média em R$)</Label>
                        <Input 
                            type="number" 
                            value={params.faturamentoMensal}
                            onChange={(e) => setParams({...params, faturamentoMensal: Number(e.target.value)})}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Saldo Credor (ICMS/IPI) acumulado</Label>
                        <Input 
                            type="number" 
                            value={params.saldoCredorObtido || ""}
                            placeholder="Ex: 50000"
                            onChange={(e) => setParams({...params, saldoCredorObtido: Number(e.target.value)})}
                        />
                        <p className="text-[10px] text-muted-foreground">Valor total não utilizado que poderá ser amortizado na Reforma (240 meses).</p>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Regime Tributário Atual</Label>
                        <Select 
                            value={params.regimeAtual} 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onValueChange={(val: any) => setParams({...params, regimeAtual: val})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o regime" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SIMPLES">Simples Nacional</SelectItem>
                                <SelectItem value="LUCRO_PRESUMIDO">Lucro Presumido</SelectItem>
                                <SelectItem value="LUCRO_REAL">Lucro Real</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Setor Principal</Label>
                        <Select 
                            value={params.setor} 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            onValueChange={(val: any) => setParams({...params, setor: val})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o setor" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SERVICOS">Serviços</SelectItem>
                                <SelectItem value="COMERCIO">Comércio</SelectItem>
                                <SelectItem value="INDUSTRIA">Indústria</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {params.regimeAtual === "SIMPLES" && (
                        <div className="space-y-2 p-3 bg-secondary/20 rounded-none border-2 border-primary/20">
                            <Label className="text-primary font-medium">Porcentagem de Vendas B2B (%)</Label>
                            <Input 
                                type="number" 
                                value={params.percentualVendasB2B || ""}
                                placeholder="Ex: 80"
                                onChange={(e) => setParams({...params, percentualVendasB2B: Number(e.target.value)})}
                            />
                            <p className="text-[10px] text-muted-foreground">Vendas para outras empresas. Necessário para calcular o &quot;Custo de Oportunidade&quot; de créditos se não optar pelo Regime Híbrido.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs">Custo de Insumos (%)</Label>
                            <Input 
                                type="number" 
                                value={params.custoInsumosPerc}
                                onChange={(e) => setParams({...params, custoInsumosPerc: Number(e.target.value)})}
                            />
                            <p className="text-[10px] text-muted-foreground">Insumos que geram crédito IVA.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Folha de Pagto (%)</Label>
                            <Input 
                                type="number" 
                                value={params.folhaPagamentoPerc}
                                onChange={(e) => setParams({...params, folhaPagamentoPerc: Number(e.target.value)})}
                            />
                            <p className="text-[10px] text-muted-foreground">Não dá direito a crédito.</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCalculate} className="w-full gap-2">
                        Simular Impacto <ArrowRight className="h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>

            {/* Results Area */}
            <Card className="lg:col-span-7 shadow-brutal-sm rounded-none border-2 border-border bg-secondary/10 relative overflow-hidden">
                {!result ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                        <div className="h-16 w-16 rounded-none border-2 border-primary bg-primary/10 flex items-center justify-center mb-4">
                            <Calculator className="h-8 w-8 text-primary opacity-50" />
                        </div>
                        <h3 className="text-lg font-semibold">Aguardando Parâmetros</h3>
                        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                            Preencha os dados da empresa e clique em &quot;Simular Impacto&quot; para ver a projeção visual da carga tributária.
                        </p>
                    </div>
                ) : (
                    <>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Projeção de Transição (2026-2033)</CardTitle>
                            <CardDescription>Evolução da carga tributária durante os 8 anos de implementação da Reforma (Trava de ICMS/ISS vs IBS/CBS).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-2 border-border/50 rounded-none p-4 bg-background">
                                    <p className="text-xs text-muted-foreground mb-1">Carga Atual Projetada</p>
                                    <p className="text-2xl font-bold">{formatCurrency(result.cargaAtualCalc)}</p>
                                    <p className="text-xs font-semibold text-muted-foreground mt-1">Alíquota Efetiva: {formatPercent(result.cargaAtualPerc)}</p>
                                </div>
                                <div className={`border-2 rounded-none p-4 bg-background shadow-brutal-sm ${result.isAumento ? 'border-destructive' : 'border-emerald-500'}`}>
                                    <p className="text-xs text-muted-foreground mb-1">Carga Futura (IBS/CBS)</p>
                                    <p className="text-2xl font-bold">{formatCurrency(result.cargaFuturaCalc)}</p>
                                    <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${result.isAumento ? 'text-destructive' : 'text-emerald-500'}`}>
                                        {result.isAumento ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                        {formatPercent(result.impactoPercentual)} {result.isAumento ? 'de aumento' : 'de redução'}
                                    </p>
                                </div>
                            </div>

                            <div className="h-[250px] w-full mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <YAxis tickFormatter={(value) => `R$ ${value / 1000}k`} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            formatter={(value: number | undefined) => value ? formatCurrency(value) : ''}
                                            cursor={{ fill: 'transparent' }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        <Line type="monotone" dataKey="Transição (Reforma)" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="Carga Antiga" stroke="#888888" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Inteligência Estratégica (Diferenciais) */}
                            <div className="mt-6 space-y-3 border-t pt-4">
                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary" /> Diagnóstico Estratégico para o Cliente
                                </h4>
                                
                                <div className="grid gap-3">
                                    {result.sugestaoAumentoPreco > 0 && (
                                        <div className="p-3 text-sm rounded-none border-2 border-amber-500 shadow-brutal-sm bg-amber-500/10">
                                            <strong className="text-amber-600 block mb-1">Dica de Precificação (Markup)</strong>
                                            Para manter a mesma margem absoluta diante deste aumento tributário, o preço médio de venda do cliente precisaria ter um repasse (aumento) de cerca de <strong>{formatPercent(result.sugestaoAumentoPreco * 100)}</strong>.
                                        </div>
                                    )}

                                    {result.splitPaymentImpact > 0 && (
                                        <div className="p-3 text-sm rounded-none border-2 border-blue-500 shadow-brutal-sm bg-blue-500/10">
                                            <strong className="text-blue-600 block mb-1">Atenção ao Caixa (Split Payment)</strong>
                                            Pelo novo modelo, <strong>{formatCurrency(result.splitPaymentImpact)}</strong> mensais serão retidos na fonte direto pelos bancos (PIX/Cartão). O cliente deixará de receber este valor na conta bancária (Baixa de capital de giro circulante).
                                        </div>
                                    )}

                                    {params.regimeAtual === "SIMPLES" && result.custoOportunidadeCreditoB2B > 0 && (
                                        <div className="p-3 text-sm rounded-none border-2 border-emerald-500 shadow-brutal-sm bg-emerald-500/10">
                                            <strong className="text-emerald-600 block mb-1">Simples Híbrido: Custo de Oportunidade B2B</strong>
                                            Se a empresa não recolher o IBS/CBS &quot;por fora&quot; do DAS, os seus clientes PJ deixarão de aproveitar cerca de <strong>{formatCurrency(result.custoOportunidadeCreditoB2B)}</strong> mensais em créditos, o que reduzirá a competitividade comercial desta empresa frente a fornecedores que optarem pelo Regime Normal ou Híbrido.
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <PaywallOverlay
                                isLocked={!isPro}
                                featureName="Relatório Completo (PDF)"
                                requiredPlan="PRO"
                            >
                                <Button 
                                    variant="outline" 
                                    className="w-full gap-2 border-primary/20 hover:border-primary/50 text-primary bg-primary/5"
                                    onClick={() => window.print()}
                                >
                                    {isPro ? <Download className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                    Gerar Parecer Técnico Completo
                                </Button>
                            </PaywallOverlay>
                        </CardContent>
                    </>
                )}
            </Card>
        </div>
    );
}
