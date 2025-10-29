import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const { items, userId, shippingInfo } = await request.json()

    // Validar dados
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    // Validate Stripe configuration for production
    if (!stripe) {
      console.error("[STRIPE] Stripe not configured - check STRIPE_SECRET_KEY")
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    // Criar Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name.en || item.product.name,
            description: item.product.description?.en || item.product.description || '',
            images: item.product.image ? [`${process.env.NEXT_PUBLIC_SITE_URL}${item.product.image}`] : [],
            metadata: {
              product_id: item.product.id,
              color: item.selectedColor || '',
              size: item.selectedSize || '',
              material: item.selectedMaterial || '',
            }
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,

      // Formas de pagamento
      payment_method_types: ['card'],

      // Informações do cliente
      customer_email: shippingInfo?.email,

      // Metadata para rastreamento
      metadata: {
        user_id: userId || 'guest',
      },

      // Shipping information
      shipping_address_collection: {
        allowed_countries: ['BR', 'US'],
      },

      // Pre-filled shipping data
      ...(shippingInfo && {
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 999, // $9.99 in cents
                currency: 'usd',
              },
              display_name: 'Standard Shipping',
              delivery_estimate: {
                minimum: {
                  unit: 'business_day',
                  value: 5,
                },
                maximum: {
                  unit: 'business_day',
                  value: 10,
                },
              },
            },
          },
        ],
      }),

      // Permite cupons de desconto
      allow_promotion_codes: true,

      // Coleta informações de cobrança
      billing_address_collection: 'required',

      // Configurações fiscais
      automatic_tax: {
        enabled: false, // Ative se tiver Stripe Tax configurado
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error) {
    console.error('[STRIPE] Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Payment system temporarily unavailable. Please try again later.' },
      { status: 500 }
    )
  }
}
