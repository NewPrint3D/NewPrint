import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import type Stripe from "stripe"

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    const body = await req.json()
    const items = body?.items ?? []
    const shippingInfo = body?.shippingInfo
    const localeRaw = body?.locale

    // ✅ garante locale vindo do frontend
    const locale = (localeRaw === "pt" || localeRaw === "es" || localeRaw === "en") ? localeRaw : "en"

    // ✅ idioma do Stripe Checkout (tipo correto do Stripe)
    const stripeLocale: Stripe.Checkout.SessionCreateParams.Locale =
      locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en"

    // ✅ nome do frete traduzido
    const shippingLabel =
      locale === "pt" ? "Envio" : locale === "es" ? "Envío" : "Shipping"

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product?.name?.[locale] || item.product?.name?.en || "Product",
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: Number(item.quantity),
    }))

    const subtotal = items.reduce(
      (sum: number, item: any) => sum + Number(item.price) * Number(item.quantity),
      0
    )

    const shippingAmount = subtotal >= 50 ? 0 : 5.99

    if (shippingAmount > 0) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: shippingLabel },
          unit_amount: Math.round(shippingAmount * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      locale: stripeLocale,
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: shippingInfo?.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[CHECKOUT CREATE ERROR]", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
