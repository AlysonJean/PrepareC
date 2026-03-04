"use client";

import { TaxCalculator } from "@/components/consultancy/tax-calculator";
import { ChatInterface } from "@/components/consultancy/chat-interface";
import { UIMessage } from "ai";

interface ConsultancyClientProps {
    initialHistory: {
        id: string;
        question: string;
        answer: string;
    }[];
}

export default function ConsultancyClient({ initialHistory }: ConsultancyClientProps) {
    const initialMessages: UIMessage[] = initialHistory.flatMap((log): UIMessage[] => [
        { id: `${log.id}-q`, role: "user", parts: [{ type: "text", text: log.question }] },
        { id: `${log.id}-a`, role: "assistant", parts: [{ type: "text", text: log.answer }] }
    ]);

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold">Consultoria</h1>
                    <p className="text-xs text-muted-foreground">Especialista em Reforma Tributária (EC 132/2023)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-0">
                {/* Chat */}
                <div className="lg:col-span-2">
                    <ChatInterface initialMessages={initialMessages} />
                </div>

                {/* Calculator */}
                <div className="hidden lg:block h-full overflow-y-auto">
                    <TaxCalculator />
                </div>
            </div>
        </div>
    );
}
