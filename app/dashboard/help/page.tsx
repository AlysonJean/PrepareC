"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function HelpPage() {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitted(true);
        const form = e.currentTarget;
        form.reset();
        setTimeout(() => setSubmitted(false), 4000);
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-xl font-semibold">Ajuda</h1>
                <p className="text-sm text-muted-foreground mt-1">Tire suas dúvidas ou entre em contato.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-3xl">
                <div className="space-y-6">
                    <div className="rounded-none border-2 border-border shadow-brutal-sm bg-background p-5">
                        <h2 className="text-sm font-medium mb-4">Perguntas Frequentes</h2>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-sm">Como adiciono um cliente?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Vá até &quot;Clientes&quot; e clique em &quot;Adicionar Cliente&quot;. Preencha Nome e CNPJ.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-sm">Como funciona o simulador?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Insira o valor base e as alíquotas estimadas do IBS e CBS para simular a carga no novo regime.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-sm">Posso mudar meu plano?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Sim, acesse &quot;Planos e Assinatura&quot; para visualizar e alterar.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-sm">Como cancelo minha assinatura?</AccordionTrigger>
                                <AccordionContent className="text-sm text-muted-foreground">
                                    Vá em &quot;Configurações&quot; e use o botão &quot;Gerenciar Assinatura&quot; para acessar o portal do Stripe.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div className="rounded-none border-2 border-border shadow-brutal-sm bg-background p-5">
                        <h2 className="text-sm font-medium mb-3">Contato</h2>
                        <div className="space-y-3">
                            <div className="text-sm">
                                <p className="text-muted-foreground">E-mail</p>
                                <p>suporte@PrepareC.com.br</p>
                            </div>
                            <div className="text-sm">
                                <p className="text-muted-foreground">Horário</p>
                                <p>Seg a Sex, 9h às 18h</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-none border-2 border-border shadow-brutal-sm bg-background p-5 h-fit">
                    <h2 className="text-sm font-medium mb-4">Abrir chamado</h2>

                    {submitted && (
                        <div className="flex items-center gap-2 rounded-none border-2 border-emerald-500 bg-emerald-500/10 p-3 mb-4 text-sm text-emerald-700">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            Mensagem enviada! Responderemos em até 24h.
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-1.5">
                            <Label htmlFor="subject" className="text-sm">Assunto</Label>
                            <Input id="subject" placeholder="Ex: Dúvida sobre CBS" className="rounded-none focus-visible:border-primary" required />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="message" className="text-sm">Mensagem</Label>
                            <Textarea id="message" placeholder="Descreva sua dúvida..." className="rounded-none border-2 border-input shadow-brutal-sm focus-visible:ring-0 focus-visible:border-primary min-h-[120px]" required />
                        </div>
                        <Button type="submit" className="w-full rounded-none" disabled={submitted}>
                            {submitted ? "Enviado ✓" : "Enviar"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
