import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  const authResult = await requireAuth(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  // Buscar dados atualizados do usuário
  const users = await sql!`
    SELECT id, email, first_name, last_name, role
    FROM users
    WHERE id = ${authResult.user.userId}
  `

  if (users.length === 0) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
  }

  const user = users[0]

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    },
  })
}
