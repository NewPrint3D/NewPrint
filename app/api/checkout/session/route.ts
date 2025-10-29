import { NextResponse } from "next/server"
import { stripe, isStripeDemoMode } from "@/lib/stripe"
import { sql, isDemoMode } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Validate Stripe configuration for production
    if (!stripe) {
      console.error("[STRIPE] Stripe not configured for session retrieval")
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    // Recuperar sessão do Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    // Buscar pedido no banco de dados
    if (session.payment_intent) {
      const orders = await sql!`
        SELECT order_number, id, total, status, payment_status
        FROM orders
        WHERE stripe_payment_intent_id = ${session.payment_intent}
        LIMIT 1
      `

      if (orders.length > 0) {
        return NextResponse.json({
          orderNumber: orders[0].order_number,
          orderId: orders[0].id,
          total: orders[0].total,
          status: orders[0].status,
          paymentStatus: orders[0].payment_status
        })
      }
    }

    // Se não encontrou no banco, retornar baseado na sessão
    return NextResponse.json({
      orderNumber: `CS-${sessionId.slice(-10)}`,
      total: (session.amount_total || 0) / 100,
      status: 'processing',
      paymentStatus: session.payment_status
    })
  } catch (error) {
    console.error('[CHECKOUT SESSION] Error:', error)
    return NextResponse.json(
      { error: 'Unable to verify payment status. Please contact support if your payment was processed.' },
      { status: 500 }
    )
  }
}
