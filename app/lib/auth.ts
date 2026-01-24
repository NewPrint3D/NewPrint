import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"

// SEGURANÇA: JWT_SECRET é obrigatório em produção
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET não configurado. Configure esta variável de ambiente antes de fazer deploy.")
}

// Modo demonstração: usar chave padrão APENAS em development
const JWT_SECRET_STRING = process.env.JWT_SECRET || (
  process.env.NODE_ENV === "development"
    ? "demo-secret-key-not-for-production-use-only"
    : ""
)

if (!JWT_SECRET_STRING) {
  throw new Error("JWT_SECRET não configurado")
}

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING)

// Flag para verificar se está em modo demonstração
export const isAuthDemoMode = !process.env.JWT_SECRET && process.env.NODE_ENV === "development"

// Gerar token JWT
export async function generateToken(userId: number, email: string, role: string) {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token válido por 7 dias
    .sign(JWT_SECRET)

  return token
}

// Verificar token JWT
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: number; email: string; role: string }
  } catch (error) {
    return null
  }
}

// Hash de senha
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Verificar senha
export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

// Middleware para verificar autenticação
export async function requireAuth(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Não autorizado", status: 401 }
  }

  const token = authHeader.substring(7)
  const payload = await verifyToken(token)

  if (!payload) {
    return { error: "Token inválido", status: 401 }
  }

  return { user: payload }
}

// Middleware para verificar se é admin
export async function requireAdmin(request: Request) {
  const authResult = await requireAuth(request)

  if ("error" in authResult) {
    return authResult
  }

  if (authResult.user.role !== "admin") {
    return { error: "Acesso negado. Apenas administradores.", status: 403 }
  }

  return { user: authResult.user }
}

// Validar força da senha
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 12) {
    return { valid: false, message: "Senha deve ter no mínimo 12 caracteres" }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos uma letra maiúscula" }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos uma letra minúscula" }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos um número" }
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, message: "Senha deve conter pelo menos um caractere especial" }
  }

  return { valid: true }
}

// Validar email com regex mais rigoroso
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email) && email.length <= 254
}
