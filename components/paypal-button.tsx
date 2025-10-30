"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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

type ComponentState = 'loading' | 'ready' | 'error'

export function PayPalButton({ orderData }: PayPalButtonProps) {
  const { t, locale } = useLanguage()
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const paypalRef = useRef<HTMLDivElement>(null)
  const [componentState, setComponentState] = useState<ComponentState>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isHydrated, setIsHydrated] = useState(false)

  const shipping = 9.99
  const tax = totalPrice * 0.1
  const orderTotal = totalPrice + shipping + tax

  // Stable references to prevent effect re-runs
  const renderPayPalButtonRef = useRef<() => void>(() => {})
  const scriptLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Hydration guard - ensures component only runs on client
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Memoized error setter
  const setError = useCallback((message: string) => {
    console.error("[PAYPAL] Error:", message)
    setErrorMessage(message)
    setComponentState('error')
  }, [])

  // Memoized success setter
  const setReady = useCallback(() => {
    setComponentState('ready')
  }, [])

  // Robust container checking with proper timing
  const waitForContainer = useCallback((callback: () => void, attempts = 0): void => {
    if (!paypalRef.current) {
      if (attempts < 50) { // Max 50 attempts (5 seconds at 100ms intervals)
        containerCheckTimeoutRef.current = setTimeout(() => {
          waitForContainer(callback, attempts + 1)
        }, 100)
      } else {
        setError("PayPal button container failed to initialize. Please refresh the page.")
      }
      return
    }

    // Clear any pending timeout
    if (containerCheckTimeoutRef.current) {
      clearTimeout(containerCheckTimeoutRef.current)
      containerCheckTimeoutRef.current = null
    }

    callback()
  }, [setError])

  // PayPal button rendering logic - defined later to avoid conflicts
  const renderPayPalButtonInternal = useCallback(() => {
    if (!window.paypal) {
      setError("PayPal SDK not loaded. Please refresh the page.")
      return
    }

    waitForContainer(() => {
      if (!paypalRef.current) return

      console.log("[PAYPAL] Rendering button to container")

      // Clear any existing content
      paypalRef.current.innerHTML = ""

      const buttons = window.paypal.Buttons({
        style: {
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "paypal",
        },
        createOrder: async () => {
          try {
            console.log("[PAYPAL] Creating order with data:", {
              itemsCount: items.length,
              total: orderTotal,
              shipping,
              tax
            })

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
            console.log("[PAYPAL] Create order response:", { status: response.status, data })

            if (!response.ok) {
              throw new Error(data.error || "Failed to create order")
            }

            console.log("[PAYPAL] Order created successfully:", data.orderID)
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
            console.log("[PAYPAL] Payment approved, capturing order:", data.orderID)

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
            console.log("[PAYPAL] Capture response:", { status: response.status, result })

            if (!response.ok) {
              console.error("[PAYPAL] Capture failed:", result)
              throw new Error(result.error || "Failed to capture payment")
            }

            console.log("[PAYPAL] Payment captured successfully:", result)

            clearCart()

            toast({
              title: t.checkout?.success || "Order placed successfully!",
              description: t.checkout?.successMessage || "Your order has been confirmed.",
            })

            router.push(`/order-success?session_id=${data.orderID}`)
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
          console.log("[PAYPAL] Payment cancelled by user")
          toast({
            title: t.checkout?.cancelled || "Payment Cancelled",
            description: t.checkout?.cancelledMessage || "You cancelled the payment",
          })
        },
      })

      console.log("[PAYPAL] Calling buttons.render()...")
      buttons.render(paypalRef.current)
        .then(() => {
          console.log("[PAYPAL] Button rendered successfully")
          setReady()
        })
        .catch((err: any) => {
          console.error("Error rendering PayPal button:", err)
          setError("Failed to render PayPal button. Please try again.")
        })
    })
  }, [items, orderTotal, shipping, tax, orderData, clearCart, router, toast, t, waitForContainer, setError, setReady])

  // Store render function in ref to prevent stale closures
  renderPayPalButtonRef.current = renderPayPalButtonInternal

  // SDK loading effect - runs only once after hydration
  useEffect(() => {
    if (!isHydrated) return

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

    if (!clientId || clientId.trim() === "") {
      setError("PayPal client ID not configured. Please check your environment variables.")
      return
    }

    console.log("[PAYPAL] Initializing with client ID:", clientId.substring(0, 10) + "...")

    // Check if SDK is already loaded
    if (window.paypal) {
      console.log("[PAYPAL] SDK already available, rendering button")
      renderPayPalButtonRef.current?.()
      return
    }

    // Create and load PayPal SDK script
    const script = document.createElement("script")
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture&locale=en_US&components=buttons&enable-funding=paypal&disable-funding=card`
    script.async = true

    script.onload = () => {
      console.log("[PAYPAL] SDK loaded successfully, version:", window.paypal?.version)
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        renderPayPalButtonRef.current?.()
      })
    }

    script.onerror = (e) => {
      console.error("[PAYPAL] Failed to load SDK:", e)
      setError("Failed to load PayPal payment system. Please check your internet connection and try again.")
    }

    // Add script to head
    document.head.appendChild(script)
    console.log("[PAYPAL] Script added to head, waiting for load...")

    // Set loading timeout
    scriptLoadTimeoutRef.current = setTimeout(() => {
      if (componentState === 'loading') {
        console.error("[PAYPAL] SDK loading timeout after 15 seconds")
        setError("PayPal payment system is taking too long to load. Please refresh the page.")
      }
    }, 15000)

    // Cleanup function
    return () => {
      if (scriptLoadTimeoutRef.current) {
        clearTimeout(scriptLoadTimeoutRef.current)
      }
      if (containerCheckTimeoutRef.current) {
        clearTimeout(containerCheckTimeoutRef.current)
      }
      // Note: We don't remove the script to avoid conflicts with other instances
      // PayPal SDK is designed to be loaded once per page
    }
  }, [isHydrated, setError]) // Only depend on hydration status


  // Render based on component state
  if (!isHydrated || componentState === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (componentState === 'error') {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-800 dark:text-red-200">
          <strong>PayPal Error:</strong> {errorMessage}
        </p>
        <p className="text-xs text-red-700 dark:text-red-300 mt-2">
          Please check your PayPal configuration or try again later.
        </p>
      </div>
    )
  }

  return <div ref={paypalRef} />
}
