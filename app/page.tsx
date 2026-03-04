import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LandingContent } from "@/components/landing-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PrepareC | A sua plataforma estratégica para a Reforma Tributária",
  description: "Tome decisões baseadas em dados. Calcule o custo de oportunidade do Simples Nacional e o impacto do Split Payment no fluxo de caixa dos seus clientes.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <LandingContent />
      <Footer />
    </div>
  );
}
