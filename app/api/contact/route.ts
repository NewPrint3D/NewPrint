export async function POST() {
  return Response.json(
    { ok: true, test: "api-alive" },
    { status: 200 }
  );
}
