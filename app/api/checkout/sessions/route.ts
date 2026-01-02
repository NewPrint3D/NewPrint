import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  console.log("🔥 CHECKOUT API FOI CHAMADA")

  try {
    const { items, userId, shippingInfo } = await request.json()

    // Validar dados
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    // Validate Stripe configuration
    if (!stripe) {
      console.error("[STRIPE] Stripe not configured")
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    // Calculate totals
    const itemTotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const shipping = 9.99
    const tax = itemTotal * 0.1
    const total = itemTotal + shipping + tax

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        ...items.map((item: any) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name:
                typeof item.product.name === "string"
                  ? item.product.name
                  : item.product.name?.en || "Produto",

              description:
                typeof item.product.description === "string"
                  ? item.product.description
                  : item.product.description?.en || "",

              images: item.product.image
                ? [`${process.env.NEXT_PUBLIC_SITE_URL}${item.product.image}`]
                : [],

              metadata: {
                product_id: String(item.product.id || ""),
                color: item.selectedColor || "",
                size: item.selectedSize || "",
                material: item.selectedMaterial || "",
              },
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),

        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Standard Shipping",
              description: "5-10 business days delivery",
            },
            unit_amount: 999,
          },
          quantity: 1,
        },

        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sales Tax",
              description: "10% tax",
            },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,

      payment_method_types: ["card"],
      customer_email: shippingInfo?.email,

      metadata: {
        user_id: userId || "guest",
        subtotal: itemTotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },

      allow_promotion_codes: false,

      payment_intent_data: {
        capture_method: "automatic",
      },

      automatic_tax: {
        enabled: false,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error("[STRIPE] Error creating checkout session:", error)
    return NextResponse.json(
      { error: "Payment system temporarily unavailable." },
      { status: 500 }
    )
  }
}