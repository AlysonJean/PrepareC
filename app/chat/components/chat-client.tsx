"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Send, User as UserIcon, Bot } from "lucide-react";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";

export default function ChatClient() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    messages: [
      {
        id: "welcome",
        role: "assistant",
        parts: [{
          type: "text",
          text: "Olá! Sou o seu Consultor Tributário especializado na Reforma (EC 132/2023). Como posso ajudar com o IBS e CBS hoje?"
        }],
      },
    ],
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <Card className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full overflow-hidden shadow-xl border-slate-200 dark:border-slate-800">
        <header className="p-4 border-b bg-white dark:bg-slate-900 flex items-center gap-3">
          <Avatar className="h-10 w-10 border bg-primary/10">
            <AvatarFallback><Bot className="h-6 w-6 text-primary" /></AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg flex items-center gap-2">
              Consultor Tributário
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">10k+ usuários</span>
            </h1>
            <p className="text-xs text-muted-foreground">Especialista em IBS/CBS - EC 132/2023</p>
          </div>
        </header>

        <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="space-y-4">
            {messages.map((m: UIMessage, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {m.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1 border bg-white dark:bg-slate-900">
                    <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-2xl px-4 py-2 max-w-[85%] text-sm leading-relaxed shadow-sm ${m.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-white dark:bg-slate-800 border rounded-tl-none markdown-body"
                    }`}
                >
                  <div className="max-w-prose">
                    {m.parts.map((p, j) =>
                      p.type === "text" ? <p key={j} className="mb-1 last:mb-0">{p.text}</p> : null
                    )}
                  </div>
                </div>

                {m.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1 border bg-slate-200 dark:bg-slate-800">
                    <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-pulse">
                <Avatar className="h-8 w-8 mt-1 border bg-white dark:bg-slate-900">
                  <AvatarFallback><Bot className="h-4 w-4 text-primary" /></AvatarFallback>
                </Avatar>
                <div className="bg-white dark:bg-slate-800 border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-white dark:bg-slate-900 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2 relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida sobre a Reforma Tributária..."
              className="pr-12 py-6 rounded-xl shadow-inner bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-primary"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-1.5 top-1.5 h-9 w-9 rounded-lg shadow-sm"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Análise baseada em fontes oficiais. Para decisões críticas, consulte nosso suporte especializado.
          </p>
        </div>
      </Card>
    </div>
  );
}
