import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    await resend.emails.send({
      from: "NewPrint3D <no-reply@newprint3d.com>",
      to: ["contacto@newprint3d.com"],
      replyTo: email,
      subject: `[Contato Site] ${subject}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${message}</p>
      `,
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return new Response("Erro ao enviar email", { status: 500 });
  }
}
