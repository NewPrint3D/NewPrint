import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    const { items, shippingInfo, locale } = await req.json()

    // Stripe Checkout language (follow site language)
    const stripeLocale = locale === "pt" ? "pt-PT" : locale === "es" ? "es" : "en"

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

    // Add shipping only if not free
    if (shippingAmount > 0) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Shipping" },
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
