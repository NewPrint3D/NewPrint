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

export async function POST(req: Request) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY || ""
    const CONTACT_FROM = process.env.CONTACT_FROM || ""
    const CONTACT_TO = process.env.CONTACT_TO || ""

    // ✅ Em vez de “500 genérico”, devolve erro claro (ajuda você a configurar rápido no Render)
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, message: "Configuração ausente: RESEND_API_KEY (Render Environment)." },
        { status: 500 },
      )
    }
    if (!CONTACT_FROM) {
      return NextResponse.json(
        { success: false, message: "Configuração ausente: CONTACT_FROM (Render Environment)." },
        { status: 500 },
      )
    }
    if (!CONTACT_TO) {
      return NextResponse.json(
        { success: false, message: "Configuração ausente: CONTACT_TO (Render Environment)." },
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
      <h2>Novo contato via site (Contact)</h2>
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
      replyTo: email, // ✅ responder vai direto pro cliente
      subject,
      html: finalHtml,
      attachments: attachments.length ? attachments : undefined,
    })

    // ✅ Se a Resend retornar erro, mostramos o motivo no response (para você corrigir rápido)
    if ((sendRes as any)?.error) {
      return NextResponse.json(
        {
          success: false,
          message: "Falha ao enviar e-mail (Resend).",
          details: (sendRes as any).error,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso." }, { status: 200 })
  } catch (error) {
    console.error("❌ Erro em /api/contact:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno no servidor.",
      },
      { status: 500 },
    )
  }
}
