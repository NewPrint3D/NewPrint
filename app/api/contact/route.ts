import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    const resendApiKey = process.env.RESEND_API_KEY

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500 }
      )
    }

    const resend = new Resend(resendApiKey)

    await resend.emails.send({
      from: "NewPrint <onboarding@resend.dev>",
      to: ["contato@newprint3d.com"],
      subject: `Contato - ${name}`,
      replyTo: email,
      text: message,
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erro ao enviar mensagem" }),
      { status: 500 }
    )
  }
}
