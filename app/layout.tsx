import type React from "react"
import type { Metadata } from "next"

import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { PageTransition } from "@/components/page-transition"

import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "NewPrint3D - Impresión 3D personalizada",
    template: "%s | NewPrint3D",
  },
  description:
    "Impresión 3D premium con personalización total: colores, tamaños y materiales para todos tus proyectos.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <PageTransition>{children}</PageTransition>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
