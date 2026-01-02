import { NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken(): Promise<string> {
  // Usar NEXT_PUBLIC em server-side também funciona, mas prefira sem prefixo
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured")
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  if (!response.ok) {
    const error = await response.text()
    console.error("[PAYPAL] Failed to get access token:", error)
    throw new Error("Failed to authenticate with PayPal")
  }

  const data = await response.json()
  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderID, customerData, items } = body

    if (!orderID) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Capture the PayPal order
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[PAYPAL] Failed to capture order:", error)
      return NextResponse.json({ error: "Failed to capture PayPal payment" }, { status: 500 })
    }

    const captureData = await response.json()

    console.log("[PAYPAL] Payment captured successfully:", captureData.id)

    // Get user ID from token if available
    let userId: number | null = null
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get("auth_token")?.value
      if (token) {
        const decoded = await verifyToken(token)
        if (decoded) {
          userId = decoded.userId
        }
      }
    } catch (error) {
      console.log("[PAYPAL] Guest checkout or token error:", error)
    }

    // Calculate totals
    const itemTotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shipping = 9.99
    const tax = itemTotal * 0.1
    const total = itemTotal + shipping + tax

    // CRITICAL: Validate total matches PayPal order - REJECT if mismatch
    const expectedTotal = parseFloat(captureData.purchase_units[0].amount.value)
    if (Math.abs(total - expectedTotal) > 0.01) {
      console.error(`[PAYPAL] SECURITY: Total mismatch detected - Calculated: ${total}, PayPal: ${expectedTotal}`)
      return NextResponse.json(
        {
          error: "Payment amount mismatch. Transaction rejected for security reasons.",
          orderID: captureData.id,
          calculated: total,
          received: expectedTotal
        },
        { status: 400 }
      )
    }

    // Save order to database
    try {
      // CRITICAL: Validate database connection before operations
      if (!sql) {
        console.error("[PAYPAL] Database not configured")
        return NextResponse.json(
          {
            error: "Database error. Please contact support.",
            orderID: captureData.id,
            databaseError: true
          },
          { status: 500 }
        )
      }

      const orderResult = await sql`
        INSERT INTO orders (
          user_id, order_number,
          subtotal, shipping, tax, total,
          status, payment_status, payment_method,
          paypal_order_id,
          shipping_address, shipping_city, shipping_state,
          shipping_zip_code, shipping_country, shipping_email, shipping_phone,
          shipping_first_name, shipping_last_name
        )
        VALUES (
          ${userId}, ${`PP-${orderID.slice(-10)}`},
          ${itemTotal.toFixed(2)}, ${shipping.toFixed(2)}, ${tax.toFixed(2)}, ${total.toFixed(2)},
          'processing', 'paid', 'paypal',
          ${orderID},
          ${customerData.address}, ${customerData.city},
          ${customerData.state}, ${customerData.zipCode}, ${customerData.country},
          ${customerData.email}, ${customerData.phone},
          ${customerData.firstName}, ${customerData.lastName}
        )
        RETURNING id
      `

      const orderId = orderResult[0].id

      // Insert order items
      for (const item of items) {
        await sql`
          INSERT INTO order_items (
            order_id, product_id, product_name, quantity, unit_price,
            selected_color, selected_size, selected_material, subtotal
          )
          VALUES (
            ${orderId}, ${item.product.id}, ${item.product.name.en || item.product.name},
            ${item.quantity}, ${item.price.toFixed(2)},
            ${item.selectedColor || null}, ${item.selectedSize || null},
            ${item.selectedMaterial || null}, ${(item.price * item.quantity).toFixed(2)}
          )
        `

        // Update product stock - with availability check
        const stockUpdate = await sql`
          UPDATE products
          SET stock_quantity = stock_quantity - ${item.quantity}
          WHERE id = ${item.product.id}
          AND stock_quantity >= ${item.quantity}
          RETURNING stock_quantity
        `

        if (stockUpdate.length === 0) {
          console.warn(`[PAYPAL] Insufficient stock for product ${item.product.id} - order processed but stock at 0`)
          // Payment already captured - we accept the order but log the issue
        }
      }

      console.log(`[PAYPAL] Order saved to database: ${orderId}`)

      return NextResponse.json({
        success: true,
        orderID: captureData.id,
        orderId: orderId,
        status: captureData.status,
      })
    } catch (dbError) {
      console.error("[PAYPAL] Database error:", dbError)
      // Payment was successful, but database save failed
      // This is a critical error - we should alert admin
      return NextResponse.json(
        {
          error: "Payment successful but failed to save order. Please contact support.",
          orderID: captureData.id,
          databaseError: true,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[PAYPAL CAPTURE ORDER] Error:", error)
    return NextResponse.json(
      { error: "Payment processing failed. Please contact support if your payment was charged." },
      { status: 500 },
    )
  }
}
