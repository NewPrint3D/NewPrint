import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, validateEmail, verifyPassword } from "@/lib/auth"

export async function PUT(request: Request) {
  try {
    // Verify authentication
    const authResult = await requireAuth(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { newEmail, password } = await request.json()

    // Validate email format
    if (!validateEmail(newEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Get user from database
    const users = await sql!`
      SELECT id, email, password_hash FROM users WHERE id = ${authResult.user.userId}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash as string)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Password is incorrect" }, { status: 400 })
    }

    // Check if email already exists
    const existingUsers = await sql!`
      SELECT id FROM users WHERE email = ${newEmail} AND id != ${authResult.user.userId}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // Update email in database
    await sql!`
      UPDATE users
      SET email = ${newEmail}, updated_at = NOW()
      WHERE id = ${authResult.user.userId}
    `

    return NextResponse.json({
      message: "Email updated successfully",
      newEmail,
    })
  } catch (error) {
    console.error("Error updating email:", error)
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 })
  }
}
