"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    LayoutDashboard,
    Scale,
    Calculator,
    Users,
    Building2,
    ScrollText,
    CreditCard,
    BookOpen,
    Settings,
    HelpCircle,
    Search,
} from "lucide-react";

const commands = [
    { label: "Visão Geral", href: "/dashboard", icon: LayoutDashboard, keywords: "home painel dashboard" },
    { label: "Consultoria Digital", href: "/dashboard/consultancy", icon: Scale, keywords: "chat ia consultoria" },
    { label: "Simulador da Reforma", href: "/dashboard/simulator", icon: Calculator, keywords: "simulador ibs cbs reforma" },
    { label: "Clientes", href: "/dashboard/clients", icon: Users, keywords: "clientes empresas cnpj" },
    { label: "Minha Organização", href: "/dashboard/organization", icon: Building2, keywords: "organização escritório" },
    { label: "Histórico de Consultas", href: "/dashboard/logs", icon: ScrollText, keywords: "logs histórico consultas" },
    { label: "Planos e Assinatura", href: "/dashboard/billing", icon: CreditCard, keywords: "planos billing assinatura pagamento" },
    { label: "Status Legislativo", href: "/dashboard/legislation", icon: BookOpen, keywords: "legislação reforma lei" },
    { label: "Configurações", href: "/dashboard/settings", icon: Settings, keywords: "configurações conta perfil" },
    { label: "Ajuda", href: "/dashboard/help", icon: HelpCircle, keywords: "ajuda suporte contato" },
];

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const filtered = commands.filter((c) => {
        const q = query.toLowerCase();
        return c.label.toLowerCase().includes(q) || c.keywords.includes(q);
    });

    const navigate = useCallback((href: string) => {
        setOpen(false);
        setQuery("");
        router.push(href);
    }, [router]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="hidden md:flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-none border-2 border-border px-3 py-1.5 bg-secondary/30 hover:bg-secondary/60"
            >
                <Search className="h-3 w-3" />
                <span>Buscar...</span>
                <kbd className="ml-2 text-[10px] bg-background border border-border px-1.5 py-0.5 rounded-none font-mono">⌘K</kbd>
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="rounded-none border-2 border-border shadow-brutal p-0 gap-0 max-w-md [&>button]:hidden">
                    <div className="border-b-2 border-border p-3">
                        <Input
                            placeholder="Buscar páginas..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="rounded-none border-0 shadow-none focus-visible:ring-0 text-sm h-8"
                            autoFocus
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">Nenhum resultado.</p>
                        ) : (
                            filtered.map((cmd) => (
                                <button
                                    key={cmd.href}
                                    onClick={() => navigate(cmd.href)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-left rounded-none hover:bg-secondary transition-colors"
                                >
                                    <cmd.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                                    {cmd.label}
                                </button>
                            ))
                        )}
                    </div>
                    <div className="border-t-2 border-border px-3 py-2 flex items-center gap-4 text-[10px] text-muted-foreground">
                        <span><kbd className="font-mono bg-secondary px-1">↑↓</kbd> navegar</span>
                        <span><kbd className="font-mono bg-secondary px-1">↵</kbd> abrir</span>
                        <span><kbd className="font-mono bg-secondary px-1">esc</kbd> fechar</span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
