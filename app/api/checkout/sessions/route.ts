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

    // Calculate totals
    const itemTotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
    const shipping = 9.99
    const tax = itemTotal * 0.1
    const total = itemTotal + shipping + tax

    // Criar Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        // Product line items
        ...items.map((item: any) => ({
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
        // Shipping line item
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Standard Shipping',
              description: '5-10 business days delivery',
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
        // Tax line item
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sales Tax',
              description: '10% tax',
            },
            unit_amount: Math.round(tax * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,

      // Payment method configuration - minimal setup to avoid verification
      payment_method_types: ['card'],

      // CRITICAL FIX: Complete elimination of all verification triggers
      phone_number_collection: {
        enabled: false,
      },
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: [], // Completely disable shipping collection
      },
      customer_creation: 'if_required',
      invoice_creation: {
        enabled: false,
      },
      tax_id_collection: {
        enabled: false,
      },
      submit_type: 'pay', // Explicit payment intent
      payment_intent_data: {
        setup_future_usage: undefined, // No future usage
        metadata: {
          integration_check: 'value',
        },
      },

      // FINAL VERIFICATION ELIMINATION - These are the critical settings
      consent_collection: {
        terms_of_service: 'none', // No terms collection
      },
      custom_text: {
        shipping_address: undefined,
        submit: undefined,
      },
      custom_fields: [], // No custom fields
      customer_update: undefined, // No customer updates
      discounts: [], // No discounts
      expires_at: undefined, // No expiration
      locale: 'auto', // Auto locale
      payment_method_collection: 'always', // But minimal collection
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      setup_intent_data: undefined, // No setup intent
      subscription_data: undefined, // No subscriptions
      ui_mode: undefined, // Default UI mode

      // Informações do cliente
      customer_email: shippingInfo?.email,

      // Metadata para rastreamento - CRITICAL: Include totals for webhook
      metadata: {
        user_id: userId || 'guest',
        subtotal: itemTotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      },

      // Disable shipping address collection to avoid additional verification
      // shipping_address_collection: {
      //   allowed_countries: ['BR', 'US'],
      // },

      // Disable shipping options to avoid additional verification steps
      // ...(shippingInfo && {
      //   shipping_options: [
      //     {
      //       shipping_rate_data: {
      //         type: 'fixed_amount',
      //         fixed_amount: {
      //           amount: 999, // $9.99 in cents
      //           currency: 'usd',
      //         },
      //         display_name: 'Standard Shipping',
      //         delivery_estimate: {
      //           minimum: {
      //             unit: 'business_day',
      //             value: 5,
      //           },
      //           maximum: {
      //             unit: 'business_day',
      //             value: 10,
      //           },
      //         },
      //       },
      //     },
      //   ],
      // }),

      // Disable all optional features that could trigger verification
      allow_promotion_codes: false,

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
