import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { PageTransition } from "@/components/page-transition"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "NewPrint3D - Impresión 3D personalizada",
    template: "%s | NewPrint3D",
  },
  description:
    "Impresión 3D premium con personalización total: colores, tamaños y materiales para todos tus proyectos.",
  keywords: [
    "impresión 3D",
    "impresión personalizada",
    "PLA",
    "ABS",
    "PETG",
    "modelos 3D",
    "productos personalizados",
  ],
  authors: [{ name: "NewPrint3D" }],
  creator: "NewPrint3D",
  publisher: "NewPrint3D",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://newprint3d.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "/",
    title: "NewPrint3D - Impresión 3D personalizada",
    description:
      "Impresión 3D premium con personalización total: colores, tamaños y materiales para todos tus proyectos.",
    siteName: "NewPrint3D",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewPrint3D - Impresión 3D personalizada",
    description: "Impresión 3D premium con personalización total.",
  },
  robots: { index: true, follow: true },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <PageTransition>{children}</PageTransition>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
