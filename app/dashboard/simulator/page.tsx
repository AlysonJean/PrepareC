import { getDashboardStats } from "../actions";
import { getPlanLimits } from "@/lib/plan-limits";
import { SimulatorForm } from "@/components/simulator/simulator-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Simulador RTC | PrepareC",
    description: "Simule o impacto da Reforma Tributária (IBS/CBS) no seu negócio.",
};

export default async function SimulatorPage() {
    const stats = await getDashboardStats();
    const limits = getPlanLimits(stats.plan);

    // O relatório detalhado é exclusivo do plano PRO ou superior
    const isPro = limits.features.customReports;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Simulador RTC (IBS/CBS)</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Descubra o impacto financeiro da transição para o novo modelo de IVA Dual.
                </p>
            </div>

            <SimulatorForm isPro={isPro} />
        </div>
    );
}
