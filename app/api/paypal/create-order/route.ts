import { NextRequest, NextResponse } from "next/server"

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
    const { items, shipping, tax, total, customerData } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    if (typeof total !== "number" || total <= 0) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 })
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken()

    // Calculate item total
    const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Prepare PayPal order items
    const paypalItems = items.map((item: any) => ({
      name: item.product.name.en || item.product.name,
      description: item.product.description?.en?.substring(0, 127) || "3D Printed Product",
      unit_amount: {
        currency_code: "USD",
        value: item.price.toFixed(2),
      },
      quantity: item.quantity.toString(),
      category: "PHYSICAL_GOODS",
    }))

    // Create PayPal order
    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          description: "NewPrint3D Order",
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: itemTotal.toFixed(2),
              },
              shipping: {
                currency_code: "USD",
                value: shipping.toFixed(2),
              },
              tax_total: {
                currency_code: "USD",
                value: tax.toFixed(2),
              },
            },
          },
          items: paypalItems,
          shipping: {
            name: {
              full_name: `${customerData.firstName} ${customerData.lastName}`,
            },
            address: {
              address_line_1: customerData.address,
              admin_area_2: customerData.city,
              admin_area_1: customerData.state,
              postal_code: customerData.zipCode,
              country_code: customerData.country === "United States" ? "US" : "BR",
            },
          },
        },
      ],
      application_context: {
        brand_name: "NewPrint3D",
        locale: "en_US",
        landing_page: "BILLING",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      },
    }

    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderPayload),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[PAYPAL] Failed to create order:", error)
      return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 })
    }

    const order = await response.json()

    console.log("[PAYPAL] Order created successfully:", order.id)

    return NextResponse.json({ orderID: order.id })
  } catch (error) {
    console.error("[PAYPAL CREATE ORDER] Error:", error)
    return NextResponse.json(
      { error: "Payment system temporarily unavailable. Please try again later." },
      { status: 500 },
    )
  }
}
