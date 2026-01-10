import { NextResponse } from "next/server"
import { Resend } from "resend"

export const runtime = "nodejs"

function requireEnv(name: string) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

export async function POST(req: Request) {
  try {
    const RESEND_API_KEY = requireEnv("RESEND_API_KEY")
    const CONTACT_FROM = requireEnv("CONTACT_FROM")
    const CONTACT_TO = requireEnv("CONTACT_TO")

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
        { status: 400 }
      )
    }

    const subject = `Novo pedido via site - ${name}`

    const html = `
      <h2>Novo pedido via site (Solicite seu Projeto)</h2>
      <p><b>Nome:</b> ${escapeHtml(name)}</p>
      <p><b>E-mail:</b> ${escapeHtml(email)}</p>
      <p><b>Telefone:</b> ${escapeHtml(phone || "-")}</p>
      <p><b>Mensagem:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p>Origem: newprint3d.com</p>
    `.trim()

    // Anexo (com limite de segurança pra não estourar tamanho)
    // Se o arquivo for grande (STL/OBJ), enviamos sem anexo e avisamos no e-mail.
    const attachments: Array<{ filename: string; content: Buffer }> = []
    let attachmentNote = ""

    if (file instanceof File) {
      const MAX_BYTES = 7 * 1024 * 1024 // ~7MB
      if (file.size > MAX_BYTES) {
        attachmentNote = `<p><b>Arquivo não anexado:</b> ${escapeHtml(file.name)} (${(file.size / 1024 / 1024).toFixed(
          2
        )} MB) — tamanho acima do limite.</p>`
      } else {
        const ab = await file.arrayBuffer()
        attachments.push({
          filename: file.name || "arquivo",
          content: Buffer.from(ab),
        })
      }
    }

    const finalHtml = attachmentNote ? `${html}<br/>${attachmentNote}` : html

    await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      subject,
      html: finalHtml,
      attachments: attachments.length ? attachments : undefined,
    })

    return NextResponse.json(
      { success: true, message: "Contato recebido e e-mail enviado com sucesso." },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Erro em /api/contact:", error)
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor." },
      { status: 500 }
    )
  }
}
