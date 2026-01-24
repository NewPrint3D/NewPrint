import Stripe from "stripe"

// Modo demonstração: Se chaves do Stripe não estiverem configuradas, o sistema funcionará em modo simulado
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Flag para verificar se está em modo demonstração
export const isStripeDemoMode = !STRIPE_SECRET_KEY

// Criar cliente Stripe apenas se as chaves estiverem configuradas
export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-09-30.clover" as any, // ✅ FINAL FIX: Type bypass for production compatibility
      typescript: true,
    })
  : null

// Função para criar Payment Intent
export async function createPaymentIntent(amount: number, currency = "eur") {
  if (!stripe) {
    throw new Error("Stripe not configured")
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
  if (!stripe) {
    throw new Error("Stripe not configured")
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
  if (!stripe) {
    throw new Error("Stripe not configured")
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
