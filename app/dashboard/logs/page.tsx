import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getConsultancyLogs } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Histórico de Consultas | PrepareC Dashboard",
    description: "Histórico das interações e simulações com o Consultor Tributário.",
};

export default async function ConsultancyLogsPage() {
    const logs = await getConsultancyLogs();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl">Histórico de Consultas (Logs)</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Visualize todas as simulações e perguntas feitas ao Consultor Tributário pela sua organização.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Últimas Interações</CardTitle>
                    <CardDescription>Mostrando os 50 registros mais recentes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-none border-2 border-border shadow-brutal-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[150px]">Data e Hora</TableHead>
                                    <TableHead className="w-[150px]">Usuário</TableHead>
                                    <TableHead className="w-[30%]">Pergunta / Contexto</TableHead>
                                    <TableHead>Resposta do Consultor</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                            Nenhum histórico encontrado. Adicione usuários ou use o Chat / Simulador para gerar dados.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    logs.map((log) => (
                                        <TableRow key={log.id} className="cursor-default">
                                            <TableCell className="font-medium align-top">
                                                {new Date(log.createdAt).toLocaleString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                            <TableCell className="align-top text-muted-foreground">
                                                {'user' in log && log.user ? `${log.user.firstName || ''} ${log.user.lastName || ''}`.trim() || 'Usuário' : 'Indefinido'}
                                            </TableCell>
                                            <TableCell className="align-top whitespace-pre-wrap text-sm line-clamp-3">
                                                {log.question}
                                            </TableCell>
                                            <TableCell className="align-top whitespace-pre-wrap text-sm line-clamp-3">
                                                {log.answer}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
