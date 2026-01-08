import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      )
    }

    const { items, shippingInfo } = await req.json()

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.product.name?.pt || item.product.name?.en || "Produto",
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))
const subtotal = items.reduce(
  (sum: number, item: any) => sum + item.price * item.quantity,
  0
)

const shippingAmount = subtotal >= 50 ? 0 : 5.99

// Só adiciona a linha de frete se for maior que 0 (ou seja, se NÃO for grátis)
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
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: shippingInfo?.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("[CHECKOUT CREATE ERROR]", error)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
