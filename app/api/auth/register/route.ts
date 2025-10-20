import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { hashPassword, generateToken, validatePassword, validateEmail } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validar campos obrigatórios
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Validar formato do email com validação RFC-compliant
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Validar força da senha (mínimo 12 caracteres + complexidade)
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.message }, { status: 400 })
    }

    // Modo demonstração
    if (isDemoMode) {
      console.log("[DEMO MODE] POST /api/auth/register - registro não disponível em modo demo")
      return NextResponse.json({
        error: "Modo demonstração: Registro não disponível. Configure DATABASE_URL para habilitar autenticação.",
        demoMode: true
      }, { status: 503 })
    }

    // Verificar se email já existe
    const existingUsers = await sql!`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
    }

    // Hash da senha
    const passwordHash = await hashPassword(password)

    // Criar usuário
    const newUsers = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, phone, role)
      VALUES (${email}, ${passwordHash}, ${firstName}, ${lastName}, ${phone || null}, 'customer')
      RETURNING id, email, first_name, last_name, role
    `

    const newUser = newUsers[0]

    // Gerar token JWT
    const token = await generateToken(newUser.id, newUser.email, newUser.role)

    // Retornar usuário e token
    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Erro no registro:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
