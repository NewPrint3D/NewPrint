import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    const resendApiKey = process.env.RESEND_API_KEY

    // ✅ Em build/produção, se não tiver a key, NÃO pode quebrar o deploy
    // Retornamos 200 para não derrubar o build e avisamos no payload.
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "RESEND_API_KEY not configured",
        }),
        { status: 200 },
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

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Erro ao enviar mensagem" }),
      { status: 200 },
    )
  }
}
