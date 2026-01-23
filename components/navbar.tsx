"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"

import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react"
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

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "bg-[#0b1117] border-b border-white/10",
        isScrolled && "shadow-lg"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">N3D</span>
          <span>NewPrint3D</span>
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/">{t.nav.home}</Link>
          <Link href="/products">{t.nav.products}</Link>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/contact">{t.nav.contact}</Link>

          <LanguageSwitcher />

          {/* USER / ADMIN (bonequinho) */}
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
                  {t.nav.logout ?? "Sair"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-xs rounded-full px-1">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>

        {/* MOBILE */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
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
              {t.nav.home}
            </Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.products}
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.about}
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.contact}
            </Link>

            <div className="pt-4">
              <LanguageSwitcher />
            </div>

            {/* USER / ADMIN (mobile) */}
            {user ? (
              <div className="pt-4 flex flex-col gap-3">
                {isAdmin && (
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <button
                  className="text-left flex items-center gap-2"
                  onClick={() => {
                    logout()
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout ?? "Sair"}
                </button>
              </div>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  )
}
