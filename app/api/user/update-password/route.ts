import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, validatePassword, hashPassword, verifyPassword } from "@/lib/auth"

export async function PUT(request: Request) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { currentPassword, newPassword } = await request.json()

    // Validate new password
    const validation = validatePassword(newPassword)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.message }, { status: 400 })
    }

    // Get user from database
    const users = await sql!`
      SELECT id, email, password_hash FROM users WHERE id = ${authResult.user.userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Verify current password
    const isValidPassword = await verifyPassword(currentPassword, user.password_hash as string)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword)

    // Update password in database
    await sql!`
      UPDATE users
      SET password_hash = ${hashedPassword}, updated_at = NOW()
      WHERE id = ${authResult.user.userId}
    `

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 })
  }
}
