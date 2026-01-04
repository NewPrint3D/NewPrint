import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { requireAuth } from "@/lib/auth"
import { createPaymentIntent } from "@/lib/stripe"

// GET - Listar pedidos (admin vê todos, usuário vê apenas seus)
export async function GET(request: Request) {
  // Modo demonstração: retornar pedidos vazios ou do localStorage
  if (isDemoMode) {
    console.log("[DEMO MODE] GET /api/orders - retornando dados simulados")
    return NextResponse.json({
      orders: [],
      demoMode: true,
      message: "Em modo demonstração. Os pedidos são salvos no navegador (localStorage)."
    })
  }

  const authResult = await requireAuth(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    let orders

    if (authResult.user.role === "admin") {
      // Admin vê todos os pedidos
      orders = await sql!`
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
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `
    } else {
      // Usuário vê apenas seus pedidos
      orders = await sql!`
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
        WHERE o.user_id = ${authResult.user.userId}
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `
    }

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error)
    return NextResponse.json({ error: "Erro ao buscar pedidos" }, { status: 500 })
  }
}

// POST - Criar novo pedido
export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { items, shippingInfo, userId } = data

    // Validar dados
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    if (!shippingInfo) {
      return NextResponse.json({ error: "Informações de envio obrigatórias" }, { status: 400 })
    }

    // Calcular totais
    const subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shipping = 5.99
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    // Gerar número do pedido
    const orderNumber = `NP3D-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Criar Payment Intent no Stripe
    const paymentIntent = await createPaymentIntent(total)

    // Modo demonstração: retornar pedido simulado sem salvar no banco
    if (isDemoMode) {
      console.log("[DEMO MODE] POST /api/orders - criando pedido simulado")
      const demoOrder = {
        id: Date.now(),
        order_number: orderNumber,
        status: "pending",
        subtotal,
        shipping,
        tax,
        total,
        created_at: new Date().toISOString(),
        payment_status: "pending",
        stripe_payment_intent_id: paymentIntent.id,
      }

      return NextResponse.json({
        order: demoOrder,
        clientSecret: paymentIntent.client_secret,
        demoMode: true,
        message: "Pedido criado em modo demonstração. Salve no localStorage do navegador."
      })
    }

    // Criar pedido no banco
    const newOrders = await sql!`
      INSERT INTO orders (
        user_id, order_number, status, subtotal, shipping, tax, total,
        shipping_first_name, shipping_last_name, shipping_email, shipping_phone,
        shipping_address, shipping_city, shipping_state, shipping_zip_code, shipping_country,
        payment_method, payment_status, stripe_payment_intent_id
      )
      VALUES (
        ${userId || null}, ${orderNumber}, 'pending', ${subtotal}, ${shipping}, ${tax}, ${total},
        ${shippingInfo.firstName}, ${shippingInfo.lastName}, ${shippingInfo.email}, ${shippingInfo.phone},
        ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.zipCode}, ${shippingInfo.country},
        'stripe', 'pending', ${paymentIntent.id}
      )
      RETURNING *
    `

    const order = newOrders[0]

    // Criar itens do pedido
    for (const item of items) {
      await sql!`
        INSERT INTO order_items (
          order_id, product_id, product_name, quantity, unit_price,
          selected_color, selected_size, selected_material, subtotal
        )
        VALUES (
          ${order.id}, ${item.product.id}, ${item.product.name.en}, ${item.quantity}, ${item.price},
          ${item.selectedColor}, ${item.selectedSize}, ${item.selectedMaterial}, ${item.price * item.quantity}
        )
      `
    }

    return NextResponse.json({
      order,
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Erro ao criar pedido:", error)
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 })
  }
}
