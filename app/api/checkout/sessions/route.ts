import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  console.log("🔥 CHECKOUT API FOI CHAMADA")

  try {
    const { items, userId, shippingInfo } = await request.json()

    // =============================
    // Validações iniciais
    // =============================
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    if (!stripe) {
      console.error("[STRIPE] Stripe not configured")
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    // =============================
    // Validação de preços (CRÍTICO)
    // =============================
    items.forEach((item: any) => {
      const price = Number(item.price)

      if (!price || price <= 0) {
        throw new Error(
          `Preço inválido para o produto: ${item.product?.name || "sem nome"}`
        )
      }

      if (!item.quantity || item.quantity <= 0) {
        throw new Error(
          `Quantidade inválida para o produto: ${item.product?.name || "sem nome"}`
        )
      }
    })

    // =============================
    // Cálculos
    // =============================
    const itemTotal = items.reduce(
      (sum: number, item: any) =>
        sum + Number(item.price) * item.quantity,
      0
    )

    const shipping = 5.99
    const tax = itemTotal * 0.1
    const total = itemTotal + shipping + tax

    // =============================
    // Criação da sessão Stripe
    // =============================
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

  line_items: [
  // PRODUTOS
  ...items.map((item: any) => {
    const rawImage = item?.product?.image

    const images =
      typeof rawImage === "string" &&
      rawImage.startsWith("http") &&
      rawImage.length < 2000
        ? [rawImage]
        : undefined

    return {
      price_data: {
        currency: "eur",
        product_data: {
          name:
            typeof item.product?.name === "string"
              ? item.product.name
              : item.product?.name?.en || "Produto",

          description:
            typeof item.product?.description === "string"
              ? item.product.description
              : item.product?.description?.en || "",

          ...(images ? { images } : {}),

          metadata: {
            product_id: String(item.product?.id || ""),
            color: item.selectedColor || "",
            size: item.selectedSize || "",
            material: item.selectedMaterial || "",
          },
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity,
    }
  }),

  // 🚚 ENVIO
  {
    price_data: {
      currency: "eur",
      product_data: {
        name: "Envio",
      },
      unit_amount: Math.round(shipping * 100),
    },
    quantity: 1,
  },

  // 🧾 IMPOSTOS
  {
    price_data: {
      currency: "eur",
      product_data: {
        name: "Impostos",
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
  } catch (error: any) {
    console.error("[STRIPE] Error creating checkout session:", error)

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Payment system temporarily unavailable.",
      },
      { status: 500 }
    )
  }
}
