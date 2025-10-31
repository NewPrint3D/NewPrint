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

    // CRITICAL FIX: Minimal Stripe Checkout configuration to prevent SMS/phone verification
    // Key strategy: Omit all optional parameters that could trigger verification
    const session = await stripe.checkout.sessions.create({
      // Required parameters only
      mode: 'payment',

      // Line items - products + shipping + tax
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
            unit_amount: Math.round(item.price * 100),
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

      // Success/cancel URLs
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,

      // CRITICAL: Only accept cards (no wallets that might require verification)
      payment_method_types: ['card'],

      // CRITICAL: Never create a Customer object (prevents verification triggers)
      customer_creation: undefined,

      // CRITICAL: Do NOT collect phone numbers (completely omit the parameter)
      // phone_number_collection: undefined, // Omitted - not even set to false

      // CRITICAL: Minimal billing address collection
      billing_address_collection: undefined, // Omitted to prevent any address-based verification

      // CRITICAL: Do NOT collect shipping address (completely omit the parameter)
      // shipping_address_collection: undefined, // Omitted

      // Optional customer email for receipt (safe - doesn't trigger verification)
      customer_email: shippingInfo?.email,

      // Metadata for webhook processing
      metadata: {
        user_id: userId || 'guest',
        subtotal: itemTotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        // Store shipping info in metadata instead of using shipping_address_collection
        shipping_first_name: shippingInfo?.firstName || '',
        shipping_last_name: shippingInfo?.lastName || '',
        shipping_email: shippingInfo?.email || '',
        shipping_phone: shippingInfo?.phone || '',
        shipping_address: shippingInfo?.address || '',
        shipping_city: shippingInfo?.city || '',
        shipping_state: shippingInfo?.state || '',
        shipping_zip_code: shippingInfo?.zipCode || '',
        shipping_country: shippingInfo?.country || '',
      },

      // CRITICAL: Disable all verification-triggering features
      allow_promotion_codes: false,

      // Payment intent configuration - minimal to prevent verification
      payment_intent_data: {
        // CRITICAL: Disable setup for future usage (prevents Customer creation)
        setup_future_usage: undefined,

        // Capture method - immediate capture
        capture_method: 'automatic',

        // Basic metadata
        metadata: {
          order_type: 'ecommerce_purchase',
        },
      },

      // CRITICAL: Disable 3D Secure unless absolutely required by card issuer
      payment_method_options: {
        card: {
          // Only request 3DS when REQUIRED by card issuer (not for Radar rules)
          request_three_d_secure: 'if_required',
        },
      },

      // Disable automatic tax calculation
      automatic_tax: {
        enabled: false,
      },

      // Submit type
      submit_type: 'pay',

      // Locale
      locale: 'auto',
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
