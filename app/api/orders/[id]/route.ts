import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { requireAuth, requireAdmin } from "@/lib/auth"

// GET - Buscar pedido por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAuth(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const orders = await sql`
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_name', oi.product_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'selected_color', oi.selected_color,
            'selected_size', oi.selected_size,
            'selected_material', oi.selected_material,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ${params.id}
      GROUP BY o.id
    `

    if (orders.length === 0) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    const order = orders[0]

    if (authResult.user.role !== "admin" && order.user_id !== authResult.user.userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Erro ao buscar pedido:", error)
    return NextResponse.json({ error: "Erro ao buscar pedido" }, { status: 500 })
  }
}

// PUT - Atualizar status do pedido (apenas admin)
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authResult = await requireAdmin(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    const { status } = await request.json()

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 })
    }

    const updatedOrders = await sql`
      UPDATE orders
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    `

    if (updatedOrders.length === 0) {
      return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ order: updatedOrders[0] })
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error)
    return NextResponse.json({ error: "Erro ao atualizar pedido" }, { status: 500 })
  }
}
