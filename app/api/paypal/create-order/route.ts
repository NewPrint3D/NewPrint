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

function mapSiteLocaleToPayPalLocale(siteLocale?: string) {
  const l = (siteLocale || "").toLowerCase()
  if (l === "es") return "es-ES"
  if (l === "pt") return "pt-PT"
  if (l === "en") return "en-US"
  return "es-ES"
}

function getPayPalBaseUrl() {
  // ✅ Controle por ENV (recomendado no Render):
  // PAYPAL_ENV = "sandbox" | "live"
  // ou PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com"
  const explicit = process.env.PAYPAL_BASE_URL
  if (explicit) return explicit

  const env = (process.env.PAYPAL_ENV || "").toLowerCase()
  if (env === "sandbox") return "https://api-m.sandbox.paypal.com"
  if (env === "live") return "https://api-m.paypal.com"

  // ✅ fallback seguro: se não configurou, assume SANDBOX para não “travar” em produção com credencial errada
  return "https://api-m.sandbox.paypal.com"
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const res = await fetch(url, { ...init, signal: controller.signal })
    return res
  } finally {
    clearTimeout(t)
  }
}

async function getPayPalAccessToken() {
  // ✅ Use credenciais SERVER-SIDE (não public)
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Missing PayPal credentials: PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET")
  }

  const base = getPayPalBaseUrl()
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetchWithTimeout(
    `${base}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    },
    15000,
  )

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = data?.error_description || data?.error || data?.message || "Failed to get PayPal token"
    throw new Error(msg)
  }

  if (!data?.access_token) {
    throw new Error("PayPal token missing in response")
  }

  return { accessToken: data.access_token as string, base }
}

function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!siteUrl) return ""
  return siteUrl.replace(/\/+$/, "")
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any))

    const items: CartItem[] = Array.isArray(body?.items) ? body.items : []
    const customerData: CustomerData = body?.customerData || body?.shippingInfo || {}
    const siteLocale: string | undefined = body?.locale

    if (!items.length) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    const siteUrl = getSiteUrl()
    if (!siteUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SITE_URL in environment (Render)" },
        { status: 500 },
      )
    }

    // total dos itens
    const itemTotal = items.reduce((sum, it) => {
      const price = safeNumber(it.price)
      const qty = safeNumber(it.quantity)
      return sum + price * qty
    }, 0)

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
          : it.product?.name) || "3D Printed Product"

      const descRaw =
        (typeof it.product?.description === "object"
          ? it.product?.description?.es || it.product?.description?.en || it.product?.description?.pt
          : it.product?.description) || "3D Printed Product"

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
        locale: mapSiteLocaleToPayPalLocale(siteLocale),
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${siteUrl}/order-success`,
        cancel_url: `${siteUrl}/checkout`,
      },
    }

    const createRes = await fetchWithTimeout(
      `${base}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
        cache: "no-store",
      },
      20000,
    )

    const createData = await createRes.json().catch(() => ({}))

    if (!createRes.ok) {
      return NextResponse.json(
        {
          error: createData?.message || "Failed to create PayPal order",
          details: createData,
          paypal_base: base,
        },
        { status: 400 },
      )
    }

    const approveLink = Array.isArray(createData?.links)
      ? createData.links.find((l: any) => l.rel === "approve")?.href
      : null

    if (!approveLink) {
      return NextResponse.json(
        {
          error: "PayPal approval URL is missing (approve link not found).",
          details: createData,
          paypal_base: base,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        id: createData.id,
        approveUrl: approveLink,
      },
      { status: 200 },
    )
  } catch (err: any) {
    const msg =
      err?.name === "AbortError"
        ? "PayPal request timed out (Render → PayPal). Check PAYPAL_ENV/credentials."
        : err?.message || "Server error"

    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
