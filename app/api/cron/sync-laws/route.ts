import { NextResponse } from "next/server";
import { syncLegislation } from "@/lib/legislation/sync";

/**
 * Endpoint de CRON para atualização automática da base legal
 * Pode ser chamado via Vercel Cron, GitHub Actions ou manualmente
 */
export async function GET(req: Request) {
    // 1. Verificação de Segurança (Ex: Vercel Cron Secret)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const result = await syncLegislation();
        return NextResponse.json({
            message: "Sync completed successfully",
            ...result
        });
    } catch (error: any) {
        return NextResponse.json({
            error: "Sync failed",
            message: error.message
        }, { status: 500 });
    }
}
