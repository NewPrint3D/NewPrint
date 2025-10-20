import Stripe from "stripe"

// Modo demonstração: Se chaves do Stripe não estiverem configuradas, o sistema funcionará em modo simulado
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Flag para verificar se está em modo demonstração
export const isStripeDemoMode = !STRIPE_SECRET_KEY

// Criar cliente Stripe apenas se as chaves estiverem configuradas
export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-12-18.acacia",
      typescript: true,
    })
  : null

// Função para criar Payment Intent
export async function createPaymentIntent(amount: number, currency = "usd") {
  // Modo demonstração: retornar Payment Intent simulado
  if (isStripeDemoMode || !stripe) {
    console.log("[DEMO MODE] Payment Intent simulado criado")
    return {
      id: `pi_demo_${Date.now()}`,
      client_secret: `pi_demo_${Date.now()}_secret_demo`,
      amount: Math.round(amount * 100),
      currency,
      status: "succeeded",
    } as any
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return paymentIntent
  } catch (error) {
    console.error("Erro ao criar Payment Intent:", error)
    throw error
  }
}

// Função para confirmar pagamento
export async function confirmPayment(paymentIntentId: string) {
  // Modo demonstração
  if (isStripeDemoMode || !stripe) {
    console.log("[DEMO MODE] Pagamento confirmado (simulado)")
    return {
      id: paymentIntentId,
      status: "succeeded",
      amount: 0,
      currency: "usd",
    } as any
  }

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error("Erro ao confirmar pagamento:", error)
    throw error
  }
}

// Função para criar reembolso
export async function createRefund(paymentIntentId: string, amount?: number) {
  // Modo demonstração
  if (isStripeDemoMode || !stripe) {
    console.log("[DEMO MODE] Reembolso criado (simulado)")
    return {
      id: `re_demo_${Date.now()}`,
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : 0,
      status: "succeeded",
    } as any
  }

  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
    })

    return refund
  } catch (error) {
    console.error("Erro ao criar reembolso:", error)
    throw error
  }
}
