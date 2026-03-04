import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name?: string) {
    try {
        await resend.emails.send({
            from: "PrepareC <welcome@PrepareC.com.br>",
            to: email,
            subject: "Bem-vindo ao Futuro da Contabilidade!",
            html: `
        <h1>Olá, ${name || "parceiro"}!</h1>
        <p>Obrigado por se juntar à lista de espera do <strong>PrepareC</strong>.</p>
        <p>Estamos trabalhando duro para garantir que sua empresa domine a Reforma Tributária.</p>
        <br />
        <p>Fique atento, em breve você receberá seu convite para o Beta!</p>
      `,
        });
    } catch (error) {
        console.error("EMAIL_ERROR", error);
    }
}
