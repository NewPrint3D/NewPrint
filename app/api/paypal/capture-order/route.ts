import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"

const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
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
        userId = decoded.userId
      }
    } catch (error) {
      // User not logged in - that's ok for guest checkout
      console.log("[PAYPAL] Guest checkout")
    }

    // Calculate totals
    const itemTotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const shipping = 9.99
    const tax = itemTotal * 0.1
    const total = itemTotal + shipping + tax

    // Save order to database
    try {
      const orderResult = await query(
        `INSERT INTO orders (
          user_id,
          total,
          status,
          payment_status,
          payment_method,
          paypal_order_id,
          shipping_address,
          shipping_city,
          shipping_state,
          shipping_zip,
          shipping_country,
          customer_email,
          customer_phone
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id`,
        [
          userId,
          total.toFixed(2),
          "pending",
          "paid",
          "paypal",
          orderID,
          customerData.address,
          customerData.city,
          customerData.state,
          customerData.zipCode,
          customerData.country,
          customerData.email,
          customerData.phone,
        ],
      )

      const orderId = orderResult.rows[0].id

      // Insert order items
      for (const item of items) {
        await query(
          `INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price,
            selected_color,
            selected_size
          ) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            orderId,
            item.product.id,
            item.quantity,
            item.price.toFixed(2),
            item.selectedColor || null,
            item.selectedSize || null,
          ],
        )

        // Update product stock
        await query(
          `UPDATE products
           SET stock = GREATEST(0, stock - $1)
           WHERE id = $2`,
          [item.quantity, item.product.id],
        )
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
      // Payment was captured but database save failed
      // You may want to implement a retry mechanism or manual intervention here
      return NextResponse.json(
        {
          error: "Payment successful but failed to save order",
          orderID: captureData.id,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[PAYPAL CAPTURE ORDER] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
