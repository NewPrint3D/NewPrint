export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { ok: true, test: "api-alive-node" },
    { status: 200 }
  );
}
