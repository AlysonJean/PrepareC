import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { LayoutDashboard } from "lucide-react";

export function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
            <div className="flex h-14 items-center justify-between w-full px-4 md:px-8">
                <Link href="/" className="text-base font-semibold tracking-tight text-foreground">
                    PrepareC
                </Link>

                <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
                    <Link href="/#features" className="hover:text-foreground transition-colors">
                        Funcionalidades
                    </Link>
                    <Link href="/#planos" className="hover:text-foreground transition-colors">
                        Planos
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <SignedOut>
                        <Button variant="ghost" size="sm" className="hidden md:flex text-sm text-muted-foreground hover:text-foreground" asChild>
                            <Link href="/sign-in">Entrar</Link>
                        </Button>
                        <Button size="sm" className="text-sm rounded-none border-2 h-8 px-4" asChild>
                            <Link href="/sign-up">Começar Agora</Link>
                        </Button>
                    </SignedOut>

                    <SignedIn>
                        <Button size="sm" className="text-sm rounded-none border-2 border-primary bg-primary text-primary-foreground hover:bg-primary/90 shadow-brutal hover:-translate-y-0.5 hover:shadow-brutal-sm transition-all h-8 px-4 gap-2" asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="h-4 w-4" />
                                <span className="hidden sm:inline">Ir para o Painel</span>
                                <span className="sm:hidden">Painel</span>
                            </Link>
                        </Button>
                        <div className="hidden sm:block">
                            <UserButton 
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "rounded-none border-2 border-primary shadow-brutal-sm h-8 w-8 hover:-translate-y-0.5 transition-all",
                                        userButtonPopoverCard: "rounded-none border-2 border-border shadow-brutal",
                                        userButtonPopoverActionButton: "rounded-none hover:bg-secondary transition-colors",
                                    }
                                }}
                            />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
