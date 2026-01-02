import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/contexts/language-context"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { PageTransition } from "@/components/page-transition"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "NewPrint3D - Custom 3D Printing Services",
    template: "%s | NewPrint3D",
  },
  description: "Premium 3D printing with full customization - colors, sizes, and materials for all your projects",
  keywords: ["3D printing", "custom printing", "PLA", "ABS", "PETG", "3D models", "personalized products"],
  authors: [{ name: "NewPrint3D" }],
  creator: "NewPrint3D",
  publisher: "NewPrint3D",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://newprint3d.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "NewPrint3D - Custom 3D Printing Services",
    description: "Premium 3D printing with full customization - colors, sizes, and materials for all your projects",
    siteName: "NewPrint3D",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewPrint3D - Custom 3D Printing Services",
    description: "Premium 3D printing with full customization",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
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
