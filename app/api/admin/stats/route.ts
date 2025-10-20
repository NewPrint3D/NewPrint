import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: Request) {
  // Modo demonstração: retornar estatísticas simuladas
  if (isDemoMode) {
    console.log("[DEMO MODE] GET /api/admin/stats - retornando estatísticas simuladas")
    return NextResponse.json({
      totalProducts: 8,
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      recentOrders: [],
      demoMode: true,
      message: "Estatísticas em modo demonstração"
    })
  }

  const authResult = await requireAdmin(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    // Buscar total de produtos
    const productsResult = await sql!`
      SELECT COUNT(*) as count FROM products WHERE active = true
    `
    const totalProducts = Number(productsResult[0]?.count || 0)

    // Buscar total de pedidos
    const ordersResult = await sql!`
      SELECT COUNT(*) as count FROM orders
    `
    const totalOrders = Number(ordersResult[0]?.count || 0)

    // Buscar receita total
    const revenueResult = await sql!`
      SELECT COALESCE(SUM(total), 0) as revenue
      FROM orders
      WHERE payment_status = 'paid'
    `
    const totalRevenue = Number(revenueResult[0]?.revenue || 0)

    // Buscar pedidos pendentes
    const pendingResult = await sql`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status = 'pending'
    `
    const pendingOrders = Number(pendingResult[0]?.count || 0)

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
