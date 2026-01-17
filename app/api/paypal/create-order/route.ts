import { NextResponse } from "next/server"

type CartItem = {
  product?: {
    name?: { en?: string; es?: string; pt?: string } | string
    description?: { en?: string; es?: string; pt?: string } | string
  }
  price: number | string
  quantity: number | string
  selectedColor?: string
  selectedSize?: string
  selectedMaterial?: string
}

type CustomerData = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
}

function to2(n: number) {
  return n.toFixed(2)
}

function safeNumber(v: unknown) {
  const n = typeof v === "string" ? Number(v) : (v as number)
  return Number.isFinite(n) ? n : 0
}

async function getPayPalAccessToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials (CLIENT_ID / CLIENT_SECRET)")
  }

  // Se você estiver usando sandbox, troque para:
  // https://api-m.sandbox.paypal.com
  const base = "https://api-m.paypal.com"

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = data?.error_description || data?.error || "Failed to get PayPal token"
    throw new Error(msg)
  }

  return { accessToken: data.access_token as string, base }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))

    const items: CartItem[] = Array.isArray(body?.items) ? body.items : []
    const customerData: CustomerData = body?.customerData || body?.shippingInfo || {}

    if (!items.length) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // ✅ FOCO PRINCIPAL: sempre abrir em espanhol no PayPal
    const PAYPAL_LOCALE = "es-ES"

    // total dos itens
    const itemTotal = items.reduce((sum, it) => {
      const price = safeNumber(it.price)
      const qty = safeNumber(it.quantity)
      return sum + price * qty
    }, 0)

    // Ajuste se você tiver frete/imposto de verdade no seu projeto
    const shippingCost = 0
    const tax = 0

    const total = itemTotal + shippingCost + tax

    if (!Number.isFinite(total) || total <= 0) {
      return NextResponse.json({ error: "Invalid total amount" }, { status: 400 })
    }

    const paypalItems = items.map((it) => {
      const name =
        (typeof it.product?.name === "object"
          ? it.product?.name?.es || it.product?.name?.en || it.product?.name?.pt
          : it.product?.name) || "Producto impreso en 3D"

      const descRaw =
        (typeof it.product?.description === "object"
          ? it.product?.description?.es || it.product?.description?.en || it.product?.description?.pt
          : it.product?.description) || "Producto impreso en 3D"

      const price = safeNumber(it.price)
      const qty = Math.max(1, Math.floor(safeNumber(it.quantity)))

      return {
        name: String(name).slice(0, 127),
        description: String(descRaw).slice(0, 127),
        unit_amount: {
          currency_code: "EUR",
          value: to2(price),
        },
        quantity: String(qty),
        category: "PHYSICAL_GOODS",
      }
    })

    const { accessToken, base } = await getPayPalAccessToken()

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: to2(total),
            breakdown: {
              item_total: {
                currency_code: "EUR",
                value: to2(itemTotal),
              },
            },
          },
          items: paypalItems,
        },
      ],
      application_context: {
        brand_name: "NewPrint3D",
        locale: PAYPAL_LOCALE, // ✅ espanhol sempre
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      },
    }

    const createRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Accept-Language": PAYPAL_LOCALE, // ✅ força idioma no PayPal
      },
      body: JSON.stringify(orderPayload),
      cache: "no-store",
    })

    const createData = await createRes.json().catch(() => ({}))

    if (!createRes.ok) {
      return NextResponse.json(
        { error: createData?.message || "Failed to create PayPal order", details: createData },
        { status: 400 }
      )
    }

    const approveLink = Array.isArray(createData?.links)
      ? createData.links.find((l: any) => l.rel === "approve")?.href
      : null

    console.log("==== PAYPAL CREATE ORDER RESULT ====")
    console.log("createData:", JSON.stringify(createData, null, 2))
    console.log("approveLink:", approveLink)

    return NextResponse.json(
      {
        id: createData.id,
        approveUrl: approveLink,
        raw: createData,
      },
      { status: 200 }
    )
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 })
  }
}
