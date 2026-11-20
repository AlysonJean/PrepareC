import Link from "next/link";
import { SeloScript } from "@/components/selo-script";

export function Footer() {
    return (
        <footer className="border-t-2 border-border bg-background">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <span className="text-sm font-bold tracking-tight">PrepareC</span>
                        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                            Inteligência tributária para contadores que precisam navegar a Reforma com segurança.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Produto</h4>
                        <ul className="space-y-2">
                            <li><Link href="/#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</Link></li>
                            <li><Link href="/#planos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Planos</Link></li>
                            <li><Link href="/sign-in" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Entrar</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Legal</h4>
                        <ul className="space-y-2">
                            <li><Link href="/lgpd" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</Link></li>
                            <li><Link href="/termos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Termos de Uso</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Suporte</h4>
                        <ul className="space-y-2">
                            <li><a href="mailto:suporte@PrepareC.com.br" className="text-xs text-muted-foreground hover:text-foreground transition-colors">suporte@PrepareC.com.br</a></li>
                            <li><span className="text-xs text-muted-foreground">Seg–Sex, 9h–18h</span></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
                    <span>&copy; {new Date().getFullYear()} PrepareC. Todos os direitos reservados.</span>
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                        <span className="flex items-center gap-1">
                            <Link href="/lgpd" className="hover:text-foreground transition-colors">LGPD</Link>
                            <span>·</span>
                            <Link href="/termos" className="hover:text-foreground transition-colors">Termos</Link>
                        </span>
                        <x-selo site="preparec.com.br" className="text-[11px]">
                            <a href="https://wa.me/5531975808477" target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>Desenvolvido por X Soluções Digitais</a>
                        </x-selo>
                        <SeloScript />
                    </div>
                </div>
            </div>
        </footer>
    );
}
