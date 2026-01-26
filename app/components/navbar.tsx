"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"

import { ShoppingCart, Menu, X, User, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { t } = useLanguage()
  const { totalItems } = useCart()
  const { user, logout, isAdmin } = useAuth()

  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ✅ Compat: alguns projetos usam t.nav, outros t.navbar, etc.
  const nav = ((t as any)?.nav ?? (t as any)?.navbar ?? (t as any)?.navigation ?? {}) as Record<string, string>
  const tr = (key: string, fallback: string) => nav?.[key] ?? fallback

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-[#0b1117] border-b border-white/10",
        isScrolled && "shadow-lg",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* LOGO (com animação 360° no N3D) */}
        <Link href="/" className="flex items-center gap-3 font-bold text-lg group">
          <span
            className={cn(
              "inline-flex items-center justify-center",
              "w-11 h-11 rounded-xl",
              "bg-[#0f1720] border border-white/10",
              "text-primary",
              "transition-transform duration-700",
              "group-hover:rotate-[360deg]",
            )}
          >
            N3D
          </span>
          <span>NewPrint3D</span>
        </Link>

        {/* LINKS (CENTRO) */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link href="/">{tr("home", "Home")}</Link>
          <Link href="/products">{tr("products", "Productos")}</Link>
          <Link href="/about">{tr("about", "Sobre")}</Link>
          <Link href="/contact">{tr("contact", "Contacto")}</Link>
        </nav>

        {/* AÇÕES (DIREITA) */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <LanguageSwitcher />

          {/* ADMIN AO LADO DO GLOBO (só se for admin) */}
          {isAdmin ? (
            <Button asChild variant="ghost" size="icon" aria-label="Admin">
              <Link href="/admin">
                <Shield className="w-5 h-5" />
              </Link>
            </Button>
          ) : null}

          {/* USER MENU (bonequinho) */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User menu">
                  <User className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          {/* CART */}
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-xs rounded-full px-1">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE: botão menu */}
        <button className="md:hidden ml-auto" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <Menu />
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black z-50 p-6">
          <button className="mb-6" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
            <X />
          </button>

          <nav className="flex flex-col gap-4 text-lg">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              {tr("home", "Home")}
            </Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
              {tr("products", "Productos")}
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              {tr("about", "Sobre")}
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              {tr("contact", "Contacto")}
            </Link>

            <div className="pt-4 flex items-center gap-2">
              <LanguageSwitcher />

              {isAdmin ? (
                <Button
                  asChild
                  variant="outline"
                  className="border-white/15"
                  aria-label="Admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href="/admin" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                </Button>
              ) : null}
            </div>

            {user ? (
              <div className="pt-4 flex flex-col gap-3">
                <button
                  className="text-left flex items-center gap-2"
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  )
}
