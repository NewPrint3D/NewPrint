import { NextResponse } from "next/server"
import { stripe, isStripeDemoMode } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const { items, userId, shippingInfo } = await request.json()

    // Validar dados
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 })
    }

    // Modo demonstração
    if (isStripeDemoMode || !stripe) {
      console.log("[DEMO MODE] Checkout Session simulada criada")
      return NextResponse.json({
        sessionId: `cs_demo_${Date.now()}`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id=demo_${Date.now()}`,
        demoMode: true,
        message: "Checkout em modo demonstração"
      })
    }

    // Criar Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.product.name.pt || item.product.name.en,
            description: item.product.description?.pt || item.product.description?.en || '',
            images: item.product.image ? [`${process.env.NEXT_PUBLIC_SITE_URL}${item.product.image}`] : [],
            metadata: {
              product_id: item.product.id,
              color: item.selectedColor || '',
              size: item.selectedSize || '',
              material: item.selectedMaterial || '',
            }
          },
          unit_amount: Math.round(item.price * 100), // Converter para centavos
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

      // Informações de envio
      shipping_address_collection: {
        allowed_countries: ['BR', 'US'],
      },

      // Dados de envio pré-preenchidos
      ...(shippingInfo && {
        shipping_options: [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: {
                amount: 999, // R$ 9.99 em centavos
                currency: 'brl',
              },
              display_name: 'Envio Padrão',
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
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
