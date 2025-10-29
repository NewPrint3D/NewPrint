"use client"

import { useEffect, useRef, useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface PayPalButtonProps {
  orderData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

declare global {
  interface Window {
    paypal?: any
  }
}

export function PayPalButton({ orderData }: PayPalButtonProps) {
  const { t, locale } = useLanguage()
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const paypalRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const shipping = 9.99
  const tax = totalPrice * 0.1
  const orderTotal = totalPrice + shipping + tax

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    if (!clientId || clientId.trim() === "") {
      setError(t.demo?.paypalNotConfigured || "PayPal not configured")
      setIsLoading(false)
      return
    }

    // Check if PayPal script is already loaded
    if (window.paypal) {
      renderPayPalButton()
      return
    }

    // Load PayPal script
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&locale=${locale}_${locale.toUpperCase()}`
    script.async = true
    script.onload = () => {
      renderPayPalButton()
    }
    script.onerror = () => {
      setError(t.demo?.paypalLoadError || "Failed to load PayPal")
      setIsLoading(false)
    }

    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const renderPayPalButton = () => {
    if (!window.paypal || !paypalRef.current) {
      return
    }

    // Clear any existing buttons
    paypalRef.current.innerHTML = ""

    window.paypal
      .Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        },
        createOrder: async () => {
          try {
            const response = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items,
                shipping,
                tax,
                total: orderTotal,
                customerData: orderData,
              }),
            })

            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.error || "Failed to create order")
            }

            return data.orderID
          } catch (error) {
            console.error("Error creating PayPal order:", error)
            toast({
              title: t.errors?.paymentFailed || "Payment Failed",
              description: error instanceof Error ? error.message : "Unknown error",
              variant: "destructive",
            })
            throw error
          }
        },
        onApprove: async (data: any) => {
          try {
            const response = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                orderID: data.orderID,
                customerData: orderData,
                items,
              }),
            })

            const result = await response.json()

            if (!response.ok) {
              throw new Error(result.error || "Failed to capture payment")
            }

            // Clear cart
            clearCart()

            // Show success message
            toast({
              title: t.checkout?.success || "Order placed successfully!",
              description: t.checkout?.successMessage || "Your order has been confirmed.",
            })

            // Redirect to order success page
            router.push(`/order-success?session_id=paypal_${result.orderId}`)
          } catch (error) {
            console.error("Error capturing PayPal payment:", error)
            toast({
              title: t.errors?.paymentFailed || "Payment Failed",
              description: error instanceof Error ? error.message : "Unknown error",
              variant: "destructive",
            })
          }
        },
        onError: (err: any) => {
          console.error("PayPal error:", err)
          toast({
            title: t.errors?.paymentFailed || "Payment Failed",
            description: t.errors?.tryAgain || "Please try again",
            variant: "destructive",
          })
        },
        onCancel: () => {
          toast({
            title: t.checkout?.cancelled || "Payment Cancelled",
            description: t.checkout?.cancelledMessage || "You cancelled the payment",
          })
        },
      })
      .render(paypalRef.current)
      .then(() => {
        setIsLoading(false)
      })
      .catch((err: any) => {
        console.error("Error rendering PayPal button:", err)
        setError(t.demo?.paypalRenderError || "Failed to render PayPal button")
        setIsLoading(false)
      })
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-800 dark:text-red-200">
          <strong>PayPal Error:</strong> {error}
        </p>
        <p className="text-xs text-red-700 dark:text-red-300 mt-2">
          Please check your PayPal configuration or try again later.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  return <div ref={paypalRef} />
}
