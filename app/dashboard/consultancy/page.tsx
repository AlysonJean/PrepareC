import { getConsultancyLogs } from "./actions";
import ConsultancyClient from "./consultancy-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Consultoria Técnica | PrepareC",
    description: "Assistente técnico especializado na Reforma Tributária Brasileira.",
    openGraph: {
        title: "Consultoria Técnica | PrepareC",
    },
};

export default async function ConsultancyPage() {
    const rawHistory = await getConsultancyLogs();
    
    const history = rawHistory.map(log => ({
        id: log.id,
        question: log.question,
        answer: log.answer,
    }));

    return <ConsultancyClient initialHistory={history} />;
}
