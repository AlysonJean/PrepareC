import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos de Uso — PrepareC",
    description: "Termos e condições de uso da plataforma PrepareC.",
};

export default function TermosPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-16">
                <article className="container max-w-3xl mx-auto px-4 prose prose-sm prose-neutral dark:prose-invert">
                    <h1 className="text-2xl font-semibold tracking-tight">Termos de Uso</h1>
                    <p className="text-muted-foreground text-sm">Última atualização: Março de 2026</p>

                    <h2>1. Aceitação dos Termos</h2>
                    <p>Ao criar uma conta e utilizar o <strong>PrepareC</strong>, você declara que leu, compreendeu e concorda com estes Termos de Uso. Caso não concorde, não utilize a plataforma.</p>

                    <h2>2. Descrição do Serviço</h2>
                    <p>O PrepareC é uma plataforma SaaS de inteligência tributária que oferece:</p>
                    <ul>
                        <li>Simulador de impacto da Reforma Tributária (IBS/CBS).</li>
                        <li>Consultoria digital via IA especializada.</li>
                        <li>Monitoramento de legislação tributária.</li>
                        <li>Gestão de clientes e consultas.</li>
                    </ul>

                    <h2>3. Cadastro e Conta</h2>
                    <ul>
                        <li>Você é responsável pela veracidade das informações fornecidas.</li>
                        <li>A conta é pessoal e intransferível.</li>
                        <li>Você é responsável por manter a segurança de suas credenciais.</li>
                    </ul>

                    <h2>4. Planos e Pagamento</h2>
                    <ul>
                        <li>A assinatura é recorrente e cobrada mensalmente via Stripe.</li>
                        <li>Cancelamentos podem ser feitos a qualquer momento pelo portal Stripe.</li>
                        <li>Não há reembolso proporcional do período já pago após cancelamento.</li>
                        <li>O acesso à plataforma é suspenso imediatamente após a expiração da assinatura.</li>
                    </ul>

                    <h2>5. Uso Aceitável</h2>
                    <p>Você concorda em não:</p>
                    <ul>
                        <li>Utilizar a plataforma para fins ilegais.</li>
                        <li>Tentar acessar dados de outras organizações.</li>
                        <li>Automatizar o acesso à API sem autorização (exceto planos com API).</li>
                        <li>Revender ou redistribuir o conteúdo gerado pela IA.</li>
                    </ul>

                    <h2>6. Limitação de Responsabilidade</h2>
                    <p>O PrepareC oferece <strong>informações de caráter orientativo</strong>. As simulações e consultas digitais <strong>não substituem parecer jurídico ou contábil formal</strong>. A responsabilidade por decisões empresariais tomadas com base no sistema é exclusiva do usuário.</p>

                    <h2>7. Propriedade Intelectual</h2>
                    <p>Todo o conteúdo, código, design e marca do PrepareC são propriedade exclusiva da empresa. Os dados inseridos pelo cliente permanecem sob propriedade do cliente.</p>

                    <h2>8. Rescisão</h2>
                    <p>Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos, com notificação prévia de 7 dias quando possível.</p>

                    <h2>9. Foro</h2>
                    <p>Fica eleito o foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes destes Termos.</p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
