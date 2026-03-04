"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createLead } from "@/app/actions/growth";
import Link from "next/link";

export function TaxThermometer() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [sector, setSector] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ impact: string; message: string; nextSteps: string } | null>(null);

    const handleSimulate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const impactLevel = sector === "servicos" ? "ALTO" : "MODERADO";
        const messageText = sector === "servicos"
            ? "Sua carga tributária pode subir até 12% sem um planejamento de créditos imediato."
            : "Você terá novas oportunidades de crédito de insumos que podem compensar a alíquota nominal.";

        try {
            await createLead({
                email,
                sector,
                results: { impact: impactLevel, message: messageText }
            });

            setResult({
                impact: impactLevel,
                message: messageText,
                nextSteps: "Recomendamos a migração para o Plano Pro para um mapeamento detalhado."
            });
            setStep(3);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 relative overflow-hidden bg-slate-900 text-white">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b82f6,transparent)]" />
            </div>

            <div className="container mx-auto px-4 max-w-4xl relative z-10">
                <div className="text-center mb-12">
                    <Badge className="text-primary border-primary mb-4">SIMULAÇÃO RÁPIDA</Badge>
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Termômetro da Reforma</h2>
                    <p className="text-slate-400 text-lg">Descubra em 30 segundos o nível de risco da sua empresa no novo sistema.</p>
                </div>

                <Card className="bg-slate-800 border-2 border-slate-700 shadow-brutal-white overflow-hidden rounded-none">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <Label className="text-slate-300">Qual o setor principal da sua empresa?</Label>
                                        <Select onValueChange={setSector}>
                                            <SelectTrigger className="bg-slate-900/50 border-white/10 h-12 text-white">
                                                <SelectValue placeholder="Selecione o setor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="servicos">Serviços e Tecnologia</SelectItem>
                                                <SelectItem value="comercio">Comércio e Varejo</SelectItem>
                                                <SelectItem value="industria">Indústria e Produção</SelectItem>
                                                <SelectItem value="agro">Agronegócio</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button
                                        className="w-full h-12 rounded-none border-2 border-primary font-bold bg-primary hover:bg-primary/90 shadow-brutal hover:translate-y-0.5 hover:shadow-brutal-sm transition-all"
                                        disabled={!sector}
                                        onClick={() => setStep(2)}
                                    >
                                        Continuar análise <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <Label className="text-slate-300">Onde enviamos o relatório técnico?</Label>
                                        <Input
                                            type="email"
                                            placeholder="seu@email.com.br"
                                            className="bg-slate-900/50 border-white/10 h-12 text-white"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        className="w-full h-12 rounded-none border-2 border-primary font-bold bg-primary hover:bg-primary/90 shadow-brutal hover:translate-y-0.5 hover:shadow-brutal-sm transition-all"
                                        disabled={!email.includes("@") || loading}
                                        onClick={handleSimulate}
                                    >
                                        {loading ? "Analisando..." : "Gerar meu Parecer"}
                                    </Button>
                                </motion.div>
                            )}

                            {step === 3 && result && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6 py-6"
                                >
                                    <div className={`mx-auto h-20 w-20 rounded-none border-2 flex items-center justify-center mb-4 ${result.impact === "ALTO" ? "bg-red-500/20 text-red-500 border-red-500" : "bg-emerald-500/20 text-emerald-500 border-emerald-500"}`}>
                                        {result.impact === "ALTO" ? <AlertCircle size={40} /> : <CheckCircle2 size={40} />}
                                    </div>
                                    <CardTitle className="text-2xl font-bold">Risco {result.impact}</CardTitle>
                                    <p className="text-slate-300 leading-relaxed italic border-l-4 border-primary pl-4 py-2 bg-primary/5 rounded-r-lg">
                                        &quot;{result.message}&quot;
                                    </p>
                                    <div className="pt-4 space-y-4">
                                        <p className="text-sm text-primary font-bold">{result.nextSteps}</p>
                                        <Button className="w-full rounded-none border-2" asChild>
                                            <Link href="/sign-in">Acessar Consultoria Completa</Link>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-none text-[10px] font-black tracking-widest uppercase border-2 shadow-brutal-sm ${className}`}>
            {children}
        </span>
    );
}


