import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "nodejs"

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

// ✅ nunca retorna segredos
function safeDetails(err: any) {
  const msg = err?.message || String(err || "")
  return {
    name: err?.name,
    message: msg,
    statusCode: err?.statusCode,
    code: err?.code,
  }
}

export async function POST(req: Request) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
    const CONTACT_FROM = process.env.CONTACT_FROM || ""
    const CONTACT_TO = process.env.CONTACT_TO || ""

    if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing env vars",
          details: {
            has_RESEND_API_KEY: !!RESEND_API_KEY,
            has_CONTACT_FROM: !!CONTACT_FROM,
            has_CONTACT_TO: !!CONTACT_TO,
          },
        },
        { status: 500 },
      )
    }

    const resend = new Resend(RESEND_API_KEY)

    const formData = await req.formData()

    const name = String(formData.get("name") || "").trim()
    const email = String(formData.get("email") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const message = String(formData.get("message") || "").trim()
    const file = formData.get("file")

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Campos obrigatórios faltando (name/email/message)." },
        { status: 400 },
      )
    }

    if (!isEmail(email)) {
      return NextResponse.json({ success: false, message: "E-mail inválido." }, { status: 400 })
    }

    const subject = `Novo contato via site - ${name}`

    const baseHtml = `
      <h2>Novo contato via site</h2>
      <p><b>Nome:</b> ${escapeHtml(name)}</p>
      <p><b>E-mail:</b> ${escapeHtml(email)}</p>
      <p><b>Telefone:</b> ${escapeHtml(phone || "-")}</p>
      <p><b>Mensagem:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p>Origem: newprint3d.com</p>
    `.trim()

    const attachments: Array<{ filename: string; content: Buffer }> = []
    let attachmentNote = ""

    if (file instanceof File) {
      const MAX_BYTES = 7 * 1024 * 1024 // ~7MB
      if (file.size > MAX_BYTES) {
        attachmentNote = `<p><b>Arquivo não anexado:</b> ${escapeHtml(file.name)} (${(file.size / 1024 / 1024).toFixed(
          2,
        )} MB) — tamanho acima do limite.</p>`
      } else {
        const ab = await file.arrayBuffer()
        attachments.push({
          filename: file.name || "arquivo",
          content: Buffer.from(ab),
        })
      }
    }

    const finalHtml = attachmentNote ? `${baseHtml}<br/>${attachmentNote}` : baseHtml

    const sendRes = await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      replyTo: email,
      subject,
      html: finalHtml,
      attachments: attachments.length ? attachments : undefined,
    })

    // ✅ se a Resend recusar, ela vem aqui
    if ((sendRes as any)?.error) {
      return NextResponse.json(
        { success: false, message: "Resend error", details: (sendRes as any).error },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso." }, { status: 200 })
  } catch (error: any) {
    console.error("❌ Erro em /api/contact:", error)
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor.", details: safeDetails(error) },
      { status: 500 },
    )
  }
}
