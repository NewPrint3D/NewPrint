import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

type IncomingItem = {
  productId?: string
  name?: string
  quantity: number
  unitPrice: number
  selectedColor?: string | null
  selectedSize?: string | null
  selectedMaterial?: string | null
  selectedImage?: string | null
  product?: any
  price?: number
}

type IncomingBody = {
  paymentMethod?: "card" | "paypal"
  locale?: string
  customer?: {
    firstName?: string
    lastName?: string
    email?: string
    address?: string
    city?: string
    zipCode?: string
  }
  shippingInfo?: {
    email?: string
  }
  items?: IncomingItem[]
  totals?: {
    subtotal?: number
    shipping?: number
    total?: number
    currency?: string
  }
}

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (envUrl) return envUrl.replace(/\/$/, "")
  return "https://www.newprint3d.com"
}

function safeLocale(raw: any) {
  return raw === "pt" || raw === "es" || raw === "en" ? raw : "en"
}

function toStripeLocale(locale: "pt" | "es" | "en"): Stripe.Checkout.SessionCreateParams.Locale {
  return locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en"
}

function safeName(item: any, locale: string) {
  return (
    item?.name ||
    item?.product?.name?.[locale] ||
    item?.product?.name?.es ||
    item?.product?.name?.en ||
    "Producto"
  )
}

function toCents(n: any) {
  return Math.round((Number(n) || 0) * 100)
}

function getUnitPrice(item: any) {
  return Number(item?.unitPrice ?? item?.price) || 0
}

function getQty(item: any) {
  return Math.max(1, Number(item?.quantity) || 1)
}

function round2(n: number) {
  return Math.round((Number(n) || 0) * 100) / 100
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET
  const env = (process.env.PAYPAL_ENV || "sandbox").toLowerCase() // sandbox | live

  if (!clientId || !clientSecret) throw new Error("Missing PayPal credentials")

  const apiBase = env === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })

  const data = await res.json().catch(() => ({} as any))
  if (!res.ok || !data?.access_token) {
    console.error("[PAYPAL AUTH ERROR]", res.status, data)
    throw new Error("PayPal auth failed")
  }

  return { accessToken: data.access_token as string, apiBase }
}

async function createPayPalOrder(body: IncomingBody) {
  const baseUrl = getBaseUrl()
  const currency = (body.totals?.currency || "EUR").toUpperCase()

  const items = Array.isArray(body.items) ? body.items : []
  if (!items.length) throw new Error("Cart is empty")

  // ✅ IMPORTANTÍSSIMO: PayPal é chato com centavos.
  // Vamos calcular subtotal/total no SERVIDOR para bater 100% com os itens.
  const subtotalCalc = round2(
    items.reduce((sum, i) => sum + getUnitPrice(i) * getQty(i), 0)
  )

  const shippingIncoming = body.totals?.shipping
  const shippingCalc = Number.isFinite(Number(shippingIncoming))
    ? round2(Number(shippingIncoming))
    : subtotalCalc >= 50
      ? 0
      : 5.99

  const totalCalc = round2(subtotalCalc + shippingCalc)

  const fmt = (n: number) => (Number(n) || 0).toFixed(2)

  const paypalItems = items.map((i) => {
    const qty = getQty(i)
    const unit = round2(getUnitPrice(i))
    const name = String(safeName(i, safeLocale(body.locale))).slice(0, 127)

    return {
      name,
      quantity: String(qty),
      unit_amount: { currency_code: currency, value: fmt(unit) },
    }
  })

  const { accessToken, apiBase } = await getPayPalAccessToken()

  const res = await fetch(`${apiBase}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: fmt(totalCalc),
            breakdown: {
              item_total: { currency_code: currency, value: fmt(subtotalCalc) },
              shipping: { currency_code: currency, value: fmt(shippingCalc) },
            },
          },
          items: paypalItems,
        },
      ],
      application_context: {
        brand_name: "NewPrint3D",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${baseUrl}/checkout/success?provider=paypal`,
        cancel_url: `${baseUrl}/checkout?canceled=1`,
      },
    }),
    cache: "no-store",
  })

  const data = await res.json().catch(() => ({} as any))
  if (!res.ok) {
    console.error("[PAYPAL ORDER ERROR]", res.status, data)
    throw new Error("PayPal order failed")
  }

  const approve = (data?.links || []).find((l: any) => l?.rel === "approve")?.href
  if (!approve) {
    console.error("[PAYPAL APPROVE MISSING]", data)
    throw new Error("PayPal approval url missing")
  }

  return approve as string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as IncomingBody

    const items = Array.isArray(body.items) ? body.items : []
    if (!items.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 })

    const locale = safeLocale(body.locale)
    const stripeLocale = toStripeLocale(locale)

    const baseUrl = getBaseUrl()
    const paymentMethod = body.paymentMethod || "card"

    const customerEmail = body.customer?.email || body.shippingInfo?.email || undefined

    // PAYPAL
    if (paymentMethod === "paypal") {
      const url = await createPayPalOrder(body)
      return NextResponse.json({ url }, { status: 200 })
    }

    // STRIPE (CARTAO)
    if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })

    const currency = (body.totals?.currency || "EUR").toLowerCase()

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: any) => {
      const qty = getQty(item)
      const unit = getUnitPrice(item)

      return {
        price_data: {
          currency,
          product_data: {
            name: String(safeName(item, locale)).slice(0, 120),
          },
          unit_amount: toCents(unit),
        },
        quantity: qty,
      }
    })

    const subtotal = Number(body.totals?.subtotal) || items.reduce((sum, it: any) => sum + getUnitPrice(it) * getQty(it), 0)
    const shippingAmount = Number(body.totals?.shipping)
    const shippingValue = Number.isFinite(shippingAmount) ? shippingAmount : subtotal >= 50 ? 0 : 5.99

    const shippingLabel = locale === "pt" ? "Envio" : locale === "es" ? "Envío" : "Shipping"

    if (shippingValue > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: shippingLabel },
          unit_amount: toCents(shippingValue),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: stripeLocale,
      line_items,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?canceled=1`,
      customer_email: customerEmail,
      metadata: {
        locale,
        customerName: `${body.customer?.firstName || ""} ${body.customer?.lastName || ""}`.trim(),
        customerCity: body.customer?.city || "",
        customerZip: body.customer?.zipCode || "",
      },
    })

    if (!session.url) throw new Error("Stripe session missing url")
    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error: any) {
    console.error("[CHECKOUT CREATE ERROR]", error?.message || error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
