"use client";

import { useEffect, useRef, useState } from "react";
import { Scale, FileText, Landmark, DollarSign, TrendingDown, AlertTriangle, CheckCircle2 } from "lucide-react";

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    side: "top" | "bottom";
    highlight?: boolean;
    icon: React.ElementType;
}

const events: TimelineEvent[] = [
    {
        year: "2023",
        title: "Aprovação da PEC 45",
        description: "Emenda Constitucional 132/2023 aprovada, institucional reforma tributária sobre consumo.",
        side: "top",
        icon: Landmark,
    },
    {
        year: "2024/25",
        title: "Leis Complementares",
        description: "Instituição do IBS, CBS e Comitê Gestor. Apresentação das leis regulamentadoras.",
        side: "bottom",
        icon: FileText,
    },
    {
        year: "2026",
        title: "Cobrança Teste",
        description: "IBS a 0,1% e CBS a 0,9% em regime de teste. Apresentação do Imposto Seletivo (IS).",
        side: "top",
        highlight: true,
        icon: AlertTriangle,
    },
    {
        year: "2027",
        title: "CBS Substitui PIS/Cofins",
        description: "Cobrança do IS. IPI zerado (exceto Zona Franca). IBS estadual e municipal a 0,05%.",
        side: "bottom",
        icon: DollarSign,
    },
    {
        year: "2028",
        title: "Substituição do PIS/Cofins",
        description: "CBS passa a ser o tributo federal sobre consumo, substituindo integralmente PIS e Cofins.",
        side: "top",
        icon: Scale,
    },
    {
        year: "2029–30",
        title: "Transição: 90%→80% ICMS/ISS",
        description: "Cobrança gradual do IBS com redução proporcional de ICMS e ISS. Alíquotas do IBS fixadas pelo Senado.",
        side: "bottom",
        icon: TrendingDown,
    },
    {
        year: "2031–32",
        title: "Transição: 70%→60% ICMS/ISS",
        description: "Continuidade da redução. ICMS e ISS passam a representar 60% da alíquota original em 2032.",
        side: "top",
        icon: TrendingDown,
    },
    {
        year: "2033",
        title: "Extinção ICMS/ISS",
        description: "ICMS e ISS extintos. Cobrança integral do IBS. Novo sistema tributário plenamente vigente.",
        side: "bottom",
        icon: CheckCircle2,
    },
];

// Stagger delay classes — Tailwind JIT picks these up as literal strings
const STAGGER_DESKTOP = [
    "delay-[0ms]",
    "delay-[80ms]",
    "delay-[160ms]",
    "delay-[240ms]",
    "delay-[320ms]",
    "delay-[400ms]",
    "delay-[480ms]",
    "delay-[560ms]",
];
const STAGGER_DESKTOP_LABEL = [
    "delay-[150ms]",
    "delay-[230ms]",
    "delay-[310ms]",
    "delay-[390ms]",
    "delay-[470ms]",
    "delay-[550ms]",
    "delay-[630ms]",
    "delay-[710ms]",
];
const STAGGER_DESKTOP_CARD = [
    "delay-[300ms]",
    "delay-[380ms]",
    "delay-[460ms]",
    "delay-[540ms]",
    "delay-[620ms]",
    "delay-[700ms]",
    "delay-[780ms]",
    "delay-[860ms]",
];
const STAGGER_MOBILE_DOT = [
    "delay-[0ms]",
    "delay-[60ms]",
    "delay-[120ms]",
    "delay-[180ms]",
    "delay-[240ms]",
    "delay-[300ms]",
    "delay-[360ms]",
    "delay-[420ms]",
];
const STAGGER_MOBILE_CONTENT = [
    "delay-[150ms]",
    "delay-[210ms]",
    "delay-[270ms]",
    "delay-[330ms]",
    "delay-[390ms]",
    "delay-[450ms]",
    "delay-[510ms]",
    "delay-[570ms]",
];

function TimelineItem({ event, index }: { event: TimelineEvent; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const Icon = event.icon;

    return (
        <div
            ref={ref}
            className={`relative flex flex-col items-center ${STAGGER_DESKTOP[index]}`}
        >
            {/* Connector dot */}
            <div
                className={`
                    relative z-10 h-10 w-10 rounded-none border-2 flex items-center justify-center
                    transition-all duration-700 ease-out
                    ${visible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                    ${event.highlight
                        ? "border-primary bg-primary text-primary-foreground shadow-brutal-sm"
                        : "border-border bg-card text-foreground"
                    }
                `}
            >
                <Icon className="h-4 w-4" />
            </div>

            {/* Year label */}
            <div
                className={`
                    mt-2 text-xs font-bold uppercase tracking-wider
                    transition-all duration-500 ease-out ${STAGGER_DESKTOP_LABEL[index]}
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
                    ${event.highlight ? "text-primary" : "text-foreground"}
                `}
            >
                {event.year}
            </div>

            {/* Content card */}
            <div
                className={`
                    mt-2 w-full max-w-[180px] p-3 rounded-none border-2 bg-card text-left
                    transition-all duration-700 ease-out ${STAGGER_DESKTOP_CARD[index]}
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
                    ${event.highlight
                        ? "border-primary shadow-brutal-sm"
                        : "border-border shadow-brutal-sm"
                    }
                `}
            >
                <p className="text-[11px] font-semibold mb-1 leading-snug">{event.title}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{event.description}</p>
            </div>
        </div>
    );
}

function TimelineProgress() {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const handleScroll = () => {
            const rect = el.getBoundingClientRect();
            const viewportH = window.innerHeight;
            const start = viewportH * 0.8;
            const end = viewportH * 0.2;

            if (rect.top > start) {
                setWidth(0);
            } else if (rect.bottom < end) {
                setWidth(100);
            } else {
                const total = rect.height + (start - end);
                const scrolled = start - rect.top;
                setWidth(Math.min(100, Math.max(0, (scrolled / total) * 100)));
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div ref={ref} className="absolute top-5 left-0 right-0 h-0.5 bg-border/40">
            <div
                className="h-full bg-primary transition-[width] duration-100 ease-linear"
                // width % is truly dynamic (scroll position) — no static class possible
                // eslint-disable-next-line react/forbid-dom-props
                style={{ width: `${width}%` }}
            />
        </div>
    );
}

export function ReformTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [headerVisible, setHeaderVisible] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setHeaderVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 md:py-24 border-t-2 border-border bg-secondary/10 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                {/* Header */}
                <div
                    className={`max-w-2xl mb-16 transition-all duration-700 ease-out ${
                        headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                    }`}
                >
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Cronograma Oficial</p>
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                        Linha do Tempo da Reforma
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Acompanhe passo a passo a implementação da reforma tributária brasileira — de 2023 até a extinção completa do ICMS e ISS em 2033.
                    </p>
                </div>

                {/* Desktop timeline (horizontal) */}
                <div className="hidden lg:block">
                    <div className="relative">
                        <TimelineProgress />
                        <div className="grid grid-cols-8 gap-3">
                            {events.map((event, i) => (
                                <TimelineItem key={event.year} event={event} index={i} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile timeline (vertical) */}
                <div className="lg:hidden space-y-0">
                    {events.map((event, i) => (
                        <MobileTimelineItem key={event.year} event={event} index={i} isLast={i === events.length - 1} />
                    ))}
                </div>

                {/* Source */}
                <p
                    className={`text-[10px] text-muted-foreground mt-10 transition-all duration-500 delay-[800ms] ${
                        headerVisible ? "opacity-60" : "opacity-0"
                    }`}
                >
                    Fonte: EC 132/2023, LC 214/2025 · Mannrich e Vasconcelos Advogados
                </p>
            </div>
        </section>
    );
}

function MobileTimelineItem({ event, index, isLast }: { event: TimelineEvent; index: number; isLast: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const Icon = event.icon;

    return (
        <div ref={ref} className="relative flex gap-4">
            {/* Vertical line + dot */}
            <div className="flex flex-col items-center">
                <div
                    className={`
                        h-9 w-9 rounded-none border-2 flex items-center justify-center shrink-0
                        transition-all duration-500 ease-out ${STAGGER_MOBILE_DOT[index]}
                        ${visible ? "scale-100 opacity-100" : "scale-0 opacity-0"}
                        ${event.highlight ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}
                    `}
                >
                    <Icon className="h-4 w-4" />
                </div>
                {!isLast && (
                    <div className={`w-0.5 flex-1 min-h-[40px] transition-all duration-700 ${visible ? "bg-border" : "bg-transparent"}`} />
                )}
            </div>

            {/* Content */}
            <div
                className={`
                    pb-6 transition-all duration-500 ease-out ${STAGGER_MOBILE_CONTENT[index]}
                    ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
                `}
            >
                <span className={`text-xs font-bold ${event.highlight ? "text-primary" : "text-foreground"}`}>
                    {event.year}
                </span>
                <p className="text-sm font-semibold mt-0.5">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{event.description}</p>
            </div>
        </div>
    );
}
