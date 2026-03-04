import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PrepareC | Consultoria Estratégica & Reforma Tributária 2026",
  description: "A primeira plataforma de inteligência que resolve as reais dores do contador na Reforma Tributária. Simulador do Simples Nacional Híbrido, Alerta de Split Payment e Cálculo de Repasse de Preços para a EC 132/2023.",
  keywords: ["Reforma Tributária", "Simples Nacional Híbrido", "IBS", "CBS", "Split Payment", "Calculadora Reforma", "Carga Tributária 2026", "Consultoria Tributária", "PrepareC"],
  openGraph: {
    title: "PrepareC | A sua plataforma estratégica para a Reforma Tributária",
    description: "Tome decisões baseadas em dados. Calcule o custo de oportunidade do Simples Nacional e o impacto do Split Payment no fluxo de caixa dos seus clientes.",
    url: "https://PrepareC.com.br",
    siteName: "PrepareC",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={ptBR}
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-sm',
          footerActionLink: 'text-primary hover:text-primary/90'
        }
      }}
    >
      <html lang="pt-BR" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${geistMono.variable} antialiased font-sans`}
        >
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
