import { NextRequest, NextResponse } from "next/server"

const PAYPAL_API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com"

async function getPayPalAccessToken(): Promise<string> {
  // Check for PayPal credentials - prioritize production environment variables
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  console.log("[PAYPAL] Checking credentials - Client ID:", clientId ? "Present" : "Missing")
  console.log("[PAYPAL] Checking credentials - Client Secret:", clientSecret ? "Present" : "Missing")

  if (!clientId || !clientSecret) {
    console.error("[PAYPAL] PayPal credentials not configured properly")
    throw new Error("PayPal credentials not configured. Please check PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.")
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

   // Calculate totals safely
const itemTotal = items.reduce((sum: number, item: any) => {
  const price = Number(item?.price ?? 0)
  const qty = Number(item?.quantity ?? 0)
  return sum + price * qty
}, 0)

const shippingCost = 0
const tax = 0
const total = itemTotal + shippingCost + tax

if (!Number.isFinite(total) || total <= 0) {
  return NextResponse.json({ error: "Invalid total amount" }, { status: 400 })
}

// Prepare PayPal order items
const paypalItems = items.map((item: any) => ({
  name: item?.product?.name?.en || item?.product?.name || "3D Printed Product",
  description:
    item?.product?.description?.en?.substring(0, 127) ||
    item?.product?.description?.substring?.(0, 127) ||
    "3D Printed Product",
  unit_amount: {
    currency_code: "EUR",
    value: Number(item?.price ?? 0).toFixed(2),
  },
  quantity: String(item?.quantity ?? 1),
  category: "PHYSICAL_GOODS",
}))

// Create PayPal order
const orderPayload = {
  intent: "CAPTURE",
  purchase_units: [
    {
      description: "NewPrint3D Order",
      amount: {
        currency_code: "EUR",
        value: total.toFixed(2),
        breakdown: {
          item_total: {
            currency_code: "EUR",
            value: itemTotal.toFixed(2),
          },
        shipping: {
  currency_code: "EUR",
  value: shippingCost.toFixed(2),
},

        },
          tax_total: {
            currency_code: "EUR",
            value: tax.toFixed(2),
          },
        },
      },
      items: paypalItems,
    
    },
  ],
  application_context: {
    brand_name: "NewPrint3D",
    locale: "en_US",
    landing_page: "BILLING",
    user_action: "PAY_NOW",
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
  },
}

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
