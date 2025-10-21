import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  // Validações de segurança
  if (!signature) {
    console.error("[STRIPE WEBHOOK] Assinatura ausente")
    return NextResponse.json({ error: "Assinatura ausente" }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[STRIPE WEBHOOK] STRIPE_WEBHOOK_SECRET não configurado")
    return NextResponse.json({ error: "Webhook não configurado" }, { status: 500 })
  }

  if (!stripe) {
    console.error("[STRIPE WEBHOOK] Stripe não inicializado")
    return NextResponse.json({ error: "Stripe não configurado" }, { status: 500 })
  }

  try {
    // Verificar assinatura do webhook
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    // Processar evento
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Buscar pedido para validar o valor
        const orders = await sql!`
          SELECT id, total, payment_status
          FROM orders
          WHERE stripe_payment_intent_id = ${paymentIntent.id}
        `

        if (orders.length === 0) {
          console.error(`[STRIPE WEBHOOK] Pedido não encontrado: ${paymentIntent.id}`)
          return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 })
        }

        const order = orders[0]

        // Validar valor do pagamento (convertendo para centavos)
        const expectedAmount = Math.round(parseFloat(order.total) * 100)
        if (paymentIntent.amount !== expectedAmount) {
          console.error(`[STRIPE WEBHOOK] Valor incompatível - Esperado: ${expectedAmount}, Recebido: ${paymentIntent.amount}`)
          return NextResponse.json({ error: "Valor do pagamento incompatível" }, { status: 400 })
        }

        // Verificar se já foi processado (idempotência)
        if (order.payment_status === "paid") {
          console.log(`[STRIPE WEBHOOK] Pagamento já processado: ${paymentIntent.id}`)
          return NextResponse.json({ received: true, message: "Já processado" })
        }

        // Atualizar status do pagamento no banco
        try {
          await sql!`
            UPDATE orders
            SET payment_status = 'paid', status = 'processing', updated_at = CURRENT_TIMESTAMP
            WHERE stripe_payment_intent_id = ${paymentIntent.id}
          `
          console.log(`[STRIPE WEBHOOK] Pagamento confirmado: ${paymentIntent.id}`)
        } catch (dbError) {
          console.error(`[STRIPE WEBHOOK] Erro ao atualizar banco:`, dbError)
          // Retornar erro 500 para que Stripe tente novamente
          return NextResponse.json({ error: "Erro de banco de dados" }, { status: 500 })
        }
        break

      case "payment_intent.payment_failed":
        const failedPayment = event.data.object

        try {
          await sql!`
            UPDATE orders
            SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
            WHERE stripe_payment_intent_id = ${failedPayment.id}
          `
          console.log(`[STRIPE WEBHOOK] Pagamento falhou: ${failedPayment.id}`)
        } catch (dbError) {
          console.error(`[STRIPE WEBHOOK] Erro ao atualizar banco:`, dbError)
          return NextResponse.json({ error: "Erro de banco de dados" }, { status: 500 })
        }
        break

      case "charge.dispute.created":
        const dispute = event.data.object
        console.log(`[STRIPE WEBHOOK] Disputa criada: ${dispute.id}`)
        // TODO: Notificar admin sobre disputa
        break

      case "charge.refunded":
        const refund = event.data.object
        console.log(`[STRIPE WEBHOOK] Reembolso processado: ${refund.id}`)
        // TODO: Atualizar status do pedido para refunded
        break

      default:
        console.log(`[STRIPE WEBHOOK] Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    if (error instanceof Error && error.message.includes("signature")) {
      console.error("[STRIPE WEBHOOK] Assinatura inválida:", error.message)
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 })
    }

    console.error("[STRIPE WEBHOOK] Erro ao processar webhook:", error)
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 400 })
  }
}
