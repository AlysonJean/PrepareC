import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade — PrepareC",
    description: "Como coletamos, usamos e protegemos seus dados.",
};

export default function LGPDPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 py-16">
                <article className="container max-w-3xl mx-auto px-4 prose prose-sm prose-neutral dark:prose-invert">
                    <h1 className="text-2xl font-semibold tracking-tight">Política de Privacidade</h1>
                    <p className="text-muted-foreground text-sm">Última atualização: Março de 2026</p>

                    <h2>1. Dados Coletados</h2>
                    <p>Coletamos os seguintes dados pessoais quando você utiliza o <strong>PrepareC</strong>:</p>
                    <ul>
                        <li><strong>Dados de cadastro:</strong> Nome, e-mail, senha (gerenciada pelo Clerk).</li>
                        <li><strong>Dados da organização:</strong> Nome do escritório, CNPJ, plano contratado.</li>
                        <li><strong>Dados de uso:</strong> Consultas realizadas, simulações executadas, logs de atividade.</li>
                        <li><strong>Dados de pagamento:</strong> Processados exclusivamente pelo <strong>Stripe</strong>. Não armazenamos dados de cartão.</li>
                    </ul>

                    <h2>2. Finalidade do Tratamento</h2>
                    <ul>
                        <li>Prestação do serviço contratado (consultoria tributária digital).</li>
                        <li>Gerenciamento de assinatura e cobrança.</li>
                        <li>Melhoria do produto e experiência do usuário.</li>
                        <li>Comunicação sobre atualizações legislativas relevantes.</li>
                    </ul>

                    <h2>3. Base Legal (Art. 7º, LGPD)</h2>
                    <p>O tratamento é realizado com base no <strong>consentimento</strong> do titular (cadastro voluntário), na <strong>execução de contrato</strong> (prestação do serviço) e no <strong>legítimo interesse</strong> do controlador (melhoria do produto).</p>

                    <h2>4. Compartilhamento</h2>
                    <p>Seus dados podem ser compartilhados com:</p>
                    <ul>
                        <li><strong>Clerk</strong> — Autenticação e gerenciamento de identidade.</li>
                        <li><strong>Stripe</strong> — Processamento de pagamentos.</li>
                        <li><strong>Google</strong> — Processamento de consultas digitais (dados anonimizados).</li>
                    </ul>
                    <p>Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing.</p>

                    <h2>5. Seus Direitos</h2>
                    <p>Conforme a Lei nº 13.709/2018 (LGPD), você tem direito a:</p>
                    <ul>
                        <li>Acessar seus dados pessoais.</li>
                        <li>Corrigir dados incompletos ou desatualizados.</li>
                        <li>Solicitar a exclusão de seus dados.</li>
                        <li>Revogar o consentimento a qualquer momento.</li>
                        <li>Solicitar a portabilidade dos dados.</li>
                    </ul>

                    <h2>6. Segurança</h2>
                    <p>Utilizamos criptografia em trânsito (TLS/HTTPS), autenticação multifator e infraestrutura em nuvem com padrões SOC 2 para proteção dos seus dados.</p>

                    <h2>7. Contato do Encarregado (DPO)</h2>
                    <p>Para exercer seus direitos ou tirar dúvidas sobre privacidade:</p>
                    <p><strong>E-mail:</strong> privacidade@PrepareC.com.br</p>
                </article>
            </main>
            <Footer />
        </div>
    );
}
