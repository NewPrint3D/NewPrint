export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const name = String(body?.name || "").trim();
  const email = String(body?.email || "").trim();
  const subject = String(body?.subject || "").trim();
  const message = String(body?.message || "").trim();

  if (!name || !email || !message) {
    return Response.json(
      { ok: false, error: "Missing required fields: name, email, message" },
      { status: 400 }
    );
  }

  // Por enquanto: só confirma que recebeu (no próximo passo a gente manda o e-mail)
  return Response.json(
    { ok: true, received: { name, email, subject, message } },
    { status: 200 }
  );
}
