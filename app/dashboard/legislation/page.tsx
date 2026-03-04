import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const legislationStatus = [
    {
        title: "Emenda Constitucional 132/2023",
        status: "PROMULGADA",
        date: "20/12/2023",
        progress: 100,
        description: "Institui a Reforma do Consumo (IBS, CBS e IS).",
    },
    {
        title: "Lei Complementar 214/2025",
        status: "PROMULGADA",
        date: "16/01/2025",
        progress: 100,
        description: "Regulamenta o IBS e CBS, normas gerais, alíquotas e regimes diferenciados.",
    },
    {
        title: "Regulamentação do Imposto Seletivo",
        status: "EM TRAMITAÇÃO",
        date: "Prev. 2025/2026",
        progress: 35,
        description: "Incidência sobre produtos prejudiciais à saúde/ambiente.",
    },
    {
        title: "Reforma sobre Renda e Folha",
        status: "AGUARDANDO",
        date: "2026+",
        progress: 5,
        description: "Segunda fase da reforma tributária nacional.",
    }
];

export default function LegislationPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-xl font-semibold">Legislação</h1>
                <p className="text-sm text-muted-foreground mt-1">Progresso da regulamentação da Reforma Tributária.</p>
            </div>

            <div className="space-y-3 max-w-2xl">
                {legislationStatus.map((item, idx) => (
                    <div key={idx} className="rounded-none border-2 border-border shadow-brutal-sm p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-medium">{item.title}</h3>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <Badge variant={item.status === "PROMULGADA" ? "default" : "secondary"} className="text-[10px]">
                                    {item.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {item.date}
                                </span>
                                <span>{item.progress}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary border-2 border-border rounded-none overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-none transition-all"
                                    style={{ width: `${item.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
