"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Product } from "@/lib/products"

export interface CartItem {
  product: Product
  quantity: number
  selectedColor: string
  selectedSize: string
  selectedMaterial: string
  price: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color: string, size: string, material: string) => void
  updateQuantity: (productId: string, color: string, size: string, material: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (i) =>
          i.product.id === item.product.id &&
          i.selectedColor === item.selectedColor &&
          i.selectedSize === item.selectedSize &&
          i.selectedMaterial === item.selectedMaterial,
      )

      if (existingItem) {
        return prevItems.map((i) =>
          i.product.id === item.product.id &&
          i.selectedColor === item.selectedColor &&
          i.selectedSize === item.selectedSize &&
          i.selectedMaterial === item.selectedMaterial
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        )
      }

      return [...prevItems, item]
    })
  }

  const removeItem = (productId: string, color: string, size: string, material: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size &&
            item.selectedMaterial === material
          ),
      ),
    )
  }

  const updateQuantity = (productId: string, color: string, size: string, material: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, color, size, material)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId &&
        item.selectedColor === color &&
        item.selectedSize === size &&
        item.selectedMaterial === material
          ? { ...item, quantity }
          : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
