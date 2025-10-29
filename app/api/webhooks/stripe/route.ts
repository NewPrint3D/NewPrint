import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { sql, isDemoMode } from "@/lib/db"

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
      // ========================================
      // CHECKOUT SESSIONS
      // ========================================
      case "checkout.session.completed":
        await fulfillCheckout(event.data.object.id)
        break

      case "checkout.session.async_payment_succeeded":
        await fulfillCheckout(event.data.object.id)
        break

      case "checkout.session.async_payment_failed":
        await handleFailedCheckout(event.data.object.id)
        break

      case "checkout.session.expired":
        console.log(`[STRIPE WEBHOOK] Checkout session expirada: ${event.data.object.id}`)
        break

      // ========================================
      // PAYMENT INTENTS
      // ========================================
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object

        // Find order to validate amount
        const orders = await sql!`
          SELECT id, total, payment_status
          FROM orders
          WHERE stripe_payment_intent_id = ${paymentIntent.id}
        `

        if (orders.length === 0) {
          console.error(`[STRIPE WEBHOOK] Order not found: ${paymentIntent.id}`)
          return NextResponse.json({ error: "Order not found" }, { status: 404 })
        }

        const order = orders[0]

        // Validate payment amount (converting to cents)
        const expectedAmount = Math.round(parseFloat(order.total) * 100)
        if (paymentIntent.amount !== expectedAmount) {
          console.error(`[STRIPE WEBHOOK] Amount mismatch - Expected: ${expectedAmount}, Received: ${paymentIntent.amount}`)
          return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 })
        }

        // Check if already processed (idempotency)
        if (order.payment_status === "paid") {
          console.log(`[STRIPE WEBHOOK] Payment already processed: ${paymentIntent.id}`)
          return NextResponse.json({ received: true, message: "Already processed" })
        }

        // Update payment status in database
        try {
          await sql!`
            UPDATE orders
            SET payment_status = 'paid', status = 'processing', updated_at = CURRENT_TIMESTAMP
            WHERE stripe_payment_intent_id = ${paymentIntent.id}
          `
          console.log(`[STRIPE WEBHOOK] Payment confirmed: ${paymentIntent.id}`)
        } catch (dbError) {
          console.error(`[STRIPE WEBHOOK] Database update error:`, dbError)
          // Return 500 error so Stripe retries
          return NextResponse.json({ error: "Database error" }, { status: 500 })
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
          console.log(`[STRIPE WEBHOOK] Payment failed: ${failedPayment.id}`)
        } catch (dbError) {
          console.error(`[STRIPE WEBHOOK] Database update error:`, dbError)
          return NextResponse.json({ error: "Database error" }, { status: 500 })
        }
        break

      // ========================================
      // DISPUTAS E REEMBOLSOS
      // ========================================
      case "charge.dispute.created":
        const dispute = event.data.object
        console.log(`[STRIPE WEBHOOK] Dispute created: ${dispute.id}`)
        await sql!`
          UPDATE orders
          SET status = 'disputed', updated_at = CURRENT_TIMESTAMP
          WHERE stripe_payment_intent_id = ${dispute.payment_intent}
        `
        break

      case "charge.dispute.funds_reinstated":
        const reinstated = event.data.object
        console.log(`[STRIPE WEBHOOK] Funds reinstated: ${reinstated.id}`)
        await sql!`
          UPDATE orders
          SET status = 'processing', updated_at = CURRENT_TIMESTAMP
          WHERE stripe_payment_intent_id = ${reinstated.payment_intent}
        `
        break

      case "charge.refunded":
        const refund = event.data.object
        console.log(`[STRIPE WEBHOOK] Refund processed: ${refund.id}`)
        await sql!`
          UPDATE orders
          SET payment_status = 'refunded', status = 'cancelled', updated_at = CURRENT_TIMESTAMP
          WHERE stripe_payment_intent_id = ${refund.payment_intent}
        `
        break

      case "refund.created":
        console.log(`[STRIPE WEBHOOK] Reembolso criado: ${event.data.object.id}`)
        break

      case "refund.updated":
        console.log(`[STRIPE WEBHOOK] Reembolso atualizado: ${event.data.object.id}`)
        break

      case "refund.failed":
        console.log(`[STRIPE WEBHOOK] Reembolso falhou: ${event.data.object.id}`)
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

// ========================================
// FUNÇÕES DE EXECUÇÃO
// ========================================

/**
 * Executa um pedido após checkout bem-sucedido
 * Idempotente - pode ser chamada múltiplas vezes com segurança
 */
async function fulfillCheckout(sessionId: string) {
  console.log('[STRIPE] Fulfilling checkout session:', sessionId)

  if (!stripe) {
    console.error('[STRIPE] Stripe not configured - cannot fulfill checkout')
    return
  }

  try {
    // Recuperar a sessão com line_items expandidos
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    })

    // Verificar se o pagamento foi concluído
    if (session.payment_status !== 'paid') {
      console.log(`[STRIPE] Payment not completed yet: ${session.payment_status}`)
      return
    }

    // Buscar pedido existente ou criar novo
    const existingOrders = await sql!`
      SELECT id, payment_status
      FROM orders
      WHERE stripe_payment_intent_id = ${session.payment_intent}
      LIMIT 1
    `

    if (existingOrders.length > 0) {
      const order = existingOrders[0]

      // Verificar se já foi executado (idempotência)
      if (order.payment_status === 'paid') {
        console.log(`[STRIPE] Order already fulfilled: ${order.id}`)
        return
      }

      // Atualizar pedido existente
      await sql!`
        UPDATE orders
        SET payment_status = 'paid', status = 'processing', updated_at = CURRENT_TIMESTAMP
        WHERE id = ${order.id}
      `

      console.log(`[STRIPE] Order ${order.id} fulfilled successfully`)
    } else {
      // Create new order from Checkout session
      const lineItems = session.line_items?.data || []
      const shipping = session.shipping_cost?.amount_total || 0
      const subtotal = session.amount_subtotal || 0
      const total = session.amount_total || 0
      const tax = total - subtotal - shipping

      // Extract shipping information
      const sessionData = session as any
      const shippingName = sessionData.shipping?.name || sessionData.customer_details?.name || ''
      const nameParts = shippingName.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const newOrder = await sql!`
        INSERT INTO orders (
          user_id,
          order_number,
          subtotal,
          shipping,
          tax,
          total,
          status,
          payment_status,
          payment_method,
          stripe_payment_intent_id,
          shipping_first_name,
          shipping_last_name,
          shipping_email,
          shipping_phone,
          shipping_address,
          shipping_city,
          shipping_state,
          shipping_zip_code,
          shipping_country
        ) VALUES (
          ${session.metadata?.user_id || null},
          ${`CS-${sessionId.slice(-10)}`},
          ${subtotal / 100},
          ${shipping / 100},
          ${tax / 100},
          ${total / 100},
          'processing',
          'paid',
          'stripe',
          ${session.payment_intent},
          ${firstName},
          ${lastName},
          ${sessionData.customer_email || sessionData.customer_details?.email || ''},
          ${sessionData.shipping?.phone || sessionData.customer_details?.phone || ''},
          ${sessionData.shipping?.address?.line1 || ''},
          ${sessionData.shipping?.address?.city || ''},
          ${sessionData.shipping?.address?.state || ''},
          ${sessionData.shipping?.address?.postal_code || ''},
          ${sessionData.shipping?.address?.country || ''}
        )
        RETURNING id
      `

      const orderId = newOrder[0].id

      // Create order items
      for (const item of lineItems) {
        const priceData = item.price as any
        const productData = priceData?.product as any

        await sql!`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            quantity,
            unit_price,
            selected_color,
            selected_size,
            selected_material,
            subtotal
          ) VALUES (
            ${orderId},
            ${productData?.metadata?.product_id || null},
            ${item.description || ''},
            ${item.quantity || 1},
            ${(priceData?.unit_amount || 0) / 100},
            ${productData?.metadata?.color || null},
            ${productData?.metadata?.size || null},
            ${productData?.metadata?.material || null},
            ${(item.amount_total || 0) / 100}
          )
        `

        // Update product stock
        if (productData?.metadata?.product_id) {
          await sql!`
            UPDATE products
            SET stock_quantity = GREATEST(0, stock_quantity - ${item.quantity || 1})
            WHERE id = ${productData.metadata.product_id}
          `
        }
      }

      console.log(`[STRIPE] New order ${orderId} created and fulfilled`)
    }
  } catch (error) {
    console.error('[STRIPE] Error fulfilling checkout:', error)
    // Não lançar erro - deixar Stripe tentar novamente
  }
}

/**
 * Trata checkouts com pagamento falhado
 */
async function handleFailedCheckout(sessionId: string) {
  console.log('[STRIPE] Handling failed checkout:', sessionId)

  if (!stripe) {
    console.error('[STRIPE] Stripe not configured - cannot handle failed checkout')
    return
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_intent) {
      await sql!`
        UPDATE orders
        SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP
        WHERE stripe_payment_intent_id = ${session.payment_intent}
      `
    }

    console.log('[STRIPE] Failed checkout handled')
  } catch (error) {
    console.error('[STRIPE] Error handling failed checkout:', error)
  }
}
