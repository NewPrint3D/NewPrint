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

  // ✅ chave única do item (produto + variações)
  cartKey?: string
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: any, color?: string, size?: string, material?: string, image?: string) => void
  updateQuantity: (productId: any, quantity: number, color?: string, size?: string, material?: string, image?: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const norm = (v?: string) =>
  (v ?? "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")

const normColor = (v?: string) => norm(v).replace("#", "")

const getProductId = (product: any) => {
  const id = product?.id ?? product?.product_id ?? product?.slug ?? product?.handle ?? product?.sku ?? ""
  return String(id || "").trim()
}

const makeKey = (productId: any, color?: string, size?: string, material?: string, image?: string) => {
  return [
    String(productId || "").trim(),
    normColor(color),
    norm(size),
    norm(material),
    // ✅ imagem entra como parte da chave para evitar colisão em variações “sem cor”
    norm(image),
  ].join("|")
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem("np3d:cart")
      if (!raw) return

      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return

      // ✅ migração: garante cartKey em itens antigos
      const hydrated: CartItem[] = parsed.map((p: CartItem) => {
        const pid = getProductId(p?.product)
        const k = p.cartKey || makeKey(pid, p.selectedColor, p.selectedSize, p.selectedMaterial, p.selectedImage)
        return { ...p, cartKey: k }
      })

      setItems(hydrated)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("np3d:cart", JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = (item: CartItem) => {
    const pid = getProductId(item?.product)
    const key = makeKey(pid, item.selectedColor, item.selectedSize, item.selectedMaterial, item.selectedImage)

    setItems((prev) => {
      const idx = prev.findIndex((p) => (p.cartKey || "") === key)

      if (idx >= 0) {
        const copy = [...prev]
        copy[idx] = { ...copy[idx], quantity: (copy[idx].quantity || 0) + (item.quantity || 1) }
        return copy
      }

      return [...prev, { ...item, quantity: item.quantity || 1, cartKey: key }]
    })
  }

  const removeItem = (productId: any, color?: string, size?: string, material?: string, image?: string) => {
    const key = makeKey(productId, color, size, material, image)
    setItems((prev) => prev.filter((p) => (p.cartKey || "") !== key))
  }

  const updateQuantity = (productId: any, quantity: number, color?: string, size?: string, material?: string, image?: string) => {
    const key = makeKey(productId, color, size, material, image)
    setItems((prev) =>
      prev
        .map((p) => {
          if ((p.cartKey || "") !== key) return p
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
