import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sql, isDemoMode } from "@/lib/db"

export async function GET(request: Request) {
  const authResult = await requireAdmin(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    // Demo mode: return mock orders
    if (isDemoMode) {
      console.log("[DEMO MODE] GET /api/admin/orders - returning mock orders")
      const mockOrders = [
        {
          id: 1,
          order_number: "DEMO-001",
          total: 89.99,
          status: "processing",
          payment_status: "paid",
          created_at: new Date().toISOString(),
          customer_email: "demo@example.com",
          shipping_first_name: "John",
          shipping_last_name: "Doe",
        },
        {
          id: 2,
          order_number: "DEMO-002",
          total: 149.99,
          status: "shipped",
          payment_status: "paid",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          customer_email: "customer@example.com",
          shipping_first_name: "Jane",
          shipping_last_name: "Smith",
        },
      ]

      return NextResponse.json({ orders: mockOrders })
    }

    // Production: fetch from database
    const orders = await sql!`
      SELECT
        id,
        order_number,
        total,
        status,
        payment_status,
        created_at,
        shipping_first_name,
        shipping_last_name,
        customer_email
      FROM orders
      ORDER BY created_at DESC
    `

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}