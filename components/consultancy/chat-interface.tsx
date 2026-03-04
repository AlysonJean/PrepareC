"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, Bot, User } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { UIMessage } from "ai";
import React from "react";

interface ChatInterfaceProps {
    initialMessages?: UIMessage[];
}

export function ChatInterface({ initialMessages = [] }: ChatInterfaceProps) {
    // @ts-expect-error - suppress ai-sdk generic mismatch
    const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
        api: "/api/chat",
        initialMessages: [
            ...initialMessages,
            {
                id: "initial-system-msg",
                role: "assistant",
                parts: [{ type: "text", text: "Olá! Sou o consultor digital do PrepareC, especialista na Reforma Tributária (EC 132/2023). Como posso ajudar o seu escritório hoje?" }]
            }
        ]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll sempre que houver novas mensagens
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <Card className="flex flex-col h-[600px] border-none shadow-md">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    Consultoria Digital
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    <div className="flex flex-col gap-4">
                        {messages.map((msg, index) => {
                            // Extrai o texto da mensagem via content ou fallback para array de partes
                            const textContent = (msg as { content?: string }).content || 
                                (msg as { parts?: { type: string; text: string }[] }).parts?.filter(p => p.type === 'text').map(p => p.text).join('\n') || '';

                            return (
                                <div
                                    key={msg.id || index}
                                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""
                                        }`}
                                >
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-border ${msg.role === "user"
                                            ? "bg-background"
                                            : "bg-primary text-primary-foreground border-primary"
                                            }`}
                                    >
                                        {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                    </div>
                                    <div
                                        className={`rounded-none px-4 py-3 max-w-[85%] text-sm border-2 shadow-brutal-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground border-primary whitespace-pre-wrap"
                                            : "bg-background border-border text-foreground"
                                            }`}
                                    >
                                        {msg.role === "user" ? (
                                            <>{textContent}</>
                                        ) : (
                                            <div className="space-y-4 text-sm">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ node, ...props }) => { void node; return <p className="leading-relaxed text-sm" {...props} /> },
                                                        strong: ({ node, ...props }) => { void node; return <strong className="font-semibold text-primary" {...props} /> },
                                                        h3: ({ node, ...props }) => { void node; return <h3 className="text-base font-semibold mt-4 mb-2 text-primary" {...props} /> },
                                                        ul: ({ node, ...props }) => { void node; return <ul className="list-disc pl-5 space-y-1 mb-2" {...props} /> },
                                                        li: ({ node, ...props }) => { 
                                                            void node; 
                                                            return React.createElement("li", { className: "marker:text-primary", ...props });
                                                        },
                                                        a: ({ node, ...props }) => { void node; return <a className="text-primary hover:underline" {...props} /> }
                                                    }}
                                                >
                                                    {textContent}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-primary bg-primary text-primary-foreground">
                                    <Bot className="h-4 w-4 animate-pulse" />
                                </div>
                                <div className="rounded-none px-4 py-3 border-2 border-border bg-background shadow-brutal-sm text-sm flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 rounded-none bg-primary animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 rounded-none bg-primary animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 rounded-none bg-primary animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        {error && (
                            <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border-2 border-destructive bg-destructive text-destructive-foreground">
                                    <Bot className="h-4 w-4" />
                                </div>
                                <div className="rounded-none px-4 py-3 bg-destructive/10 border-2 border-destructive shadow-brutal-sm text-destructive text-sm">
                                    <strong>Erro na IA:</strong> {error.message || "Ocorreu um erro no servidor."}
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
            </CardContent>

            <CardFooter className="p-4 border-t bg-background">
                <form 
                    className="flex w-full items-center gap-2" 
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                    }}
                >
                    <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary">
                        <Paperclip className="h-4 w-4" />
                        <span className="sr-only">Anexar arquivo</span>
                    </Button>
                    <Input
                        placeholder="Digite sua dúvida tributária..."
                        value={input || ""}
                        onChange={handleInputChange || (() => {})}
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={!(input || "").trim() || isLoading} size="icon" className="shrink-0">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Enviar</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
