import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar campos
    if (!email || !password) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    // Modo demonstração: login simulado (não funcional, apenas retorna mensagem)
    if (isDemoMode) {
      console.log("[DEMO MODE] POST /api/auth/login - autenticação não disponível em modo demo")
      return NextResponse.json({
        error: "Modo demonstração: Login não disponível. Configure DATABASE_URL para habilitar autenticação.",
        demoMode: true
      }, { status: 503 })
    }

    // Buscar usuário no banco
    const users = await sql!`
      SELECT * FROM users WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    const user = users[0]

    // Verificar senha
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 })
    }

    // Gerar token JWT
    const token = await generateToken(user.id, user.email, user.role)

    // Retornar usuário e token
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
