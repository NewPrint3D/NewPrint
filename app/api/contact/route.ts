import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return Response.json(
        { ok: false, error: "Missing required fields (name, email, message)." },
        { status: 400 }
      );
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 465);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    // pode estar "true"/"false" no Render
    const secure =
      String(process.env.SMTP_SECURE || "true").toLowerCase() === "true";

    if (!host || !user || !pass) {
      return Response.json(
        { ok: false, error: "SMTP env vars missing (SMTP_HOST/USER/PASSWORD)." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    const to = process.env.CONTACT_TO || "contacto@newprint3d.com";

    await transporter.sendMail({
      from: `"NewPrint3D Site" <${user}>`,
      to,
      replyTo: email,
      subject: subject ? `[Site] ${subject}` : "[Site] Novo contato",
      text: `Nome: ${name}\nEmail: ${email}\n\nMensagem:\n${message}\n`,
    });

    return Response.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}
