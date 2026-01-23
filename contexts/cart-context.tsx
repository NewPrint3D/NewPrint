"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type CartItem = {
  product: any
  quantity: number
  selectedColor?: string
  selectedColorName?: string
  selectedSize?: string
  selectedMaterial?: string
  selectedImage?: string
  price: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: any, color?: string, size?: string, material?: string) => void
  updateQuantity: (
    productId: any,
    color: string | undefined,
    size: string | undefined,
    material: string | undefined,
    quantity: number
  ) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const normalize = (v?: string) => (v || "").toString().trim().toLowerCase().replace("#", "")

const makeKey = (productId: any, color?: string, size?: string, material?: string) => {
  return [String(productId), normalize(color), (size || "").trim(), (material || "").trim()].join("|")
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("np3d:cart")
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("np3d:cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (item: CartItem) => {
    const productId = String(item?.product?.id ?? item?.product?.product_id ?? item?.product?.slug ?? "")
    const key = makeKey(productId, item.selectedColor, item.selectedSize, item.selectedMaterial)

    setItems((prev) => {
      const idx = prev.findIndex((p) => {
        const pid = String(p?.product?.id ?? p?.product?.product_id ?? p?.product?.slug ?? "")
        return makeKey(pid, p.selectedColor, p.selectedSize, p.selectedMaterial) === key
      })

      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: (copy[idx].quantity || 1) + (item.quantity || 1) }
        return copy
      }

      return [...prev, { ...item, quantity: item.quantity || 1 }]
    })
  }

  const removeItem = (productId: any, color?: string, size?: string, material?: string) => {
    const key = makeKey(productId, color, size, material)
    setItems((prev) =>
      prev.filter((p) => {
        const pid = String(p?.product?.id ?? p?.product?.product_id ?? p?.product?.slug ?? "")
        return makeKey(pid, p.selectedColor, p.selectedSize, p.selectedMaterial) !== key
      }),
    )
  }

  const updateQuantity = (productId: any, color?: string, size?: string, material?: string, quantity: number) => {
    const key = makeKey(productId, color, size, material)
    setItems((prev) =>
      prev
        .map((p) => {
          const pid = String(p?.product?.id ?? p?.product?.product_id ?? p?.product?.slug ?? "")
          const k = makeKey(pid, p.selectedColor, p.selectedSize, p.selectedMaterial)
          if (k !== key) return p
          return { ...p, quantity }
        })
        .filter((p) => (p.quantity || 0) > 0),
    )
  }

  const clearCart = () => setItems([])

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + (i.quantity || 0), 0), [items])
  const totalPrice = useMemo(() => items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 0), 0), [items])

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
