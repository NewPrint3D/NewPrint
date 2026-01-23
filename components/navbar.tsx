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
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        // ✅ sem transparência
        "bg-[#0b1117] border-b border-white/10",
        isScrolled && "shadow-lg"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* LOGO (esquerda) */}
        <Link href="/" className="flex items-center gap-3 font-bold text-lg group select-none">
          <span
            className={cn(
              "inline-flex items-center justify-center",
              "w-11 h-11 rounded-xl",
              "bg-gradient-to-br from-cyan-500/25 to-emerald-500/10",
              "border border-white/10",
              // ✅ gira 360 no hover
              "transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]"
            )}
          >
            <span className="text-primary font-extrabold">N3D</span>
          </span>

          <span className="text-white/95 tracking-tight transition-all duration-300 group-hover:tracking-wide">
            NewPrint3D
          </span>
        </Link>

        {/* MENU (centro) */}
        <nav className="hidden md:flex items-center gap-8 text-white/90">
          <Link href="/" className="hover:text-white transition-colors">
            {t.nav.home}
          </Link>

          <Link href="/products" className="hover:text-white transition-colors">
            {t.nav.products}
          </Link>

          {/* ✅ voltar “Acerca” */}
          <Link href="/about" className="hover:text-white transition-colors">
            {t.nav.about}
          </Link>

          <Link href="/contact" className="hover:text-white transition-colors">
            {t.nav.contact}
          </Link>
        </nav>

        {/* AÇÕES (direita) */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          <Link href="/cart" className="relative inline-flex items-center justify-center p-2 rounded-md hover:bg-white/5 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-[10px] leading-none rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/5">
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

          {/* MOBILE */}
          <button className="md:hidden p-2 rounded-md hover:bg-white/5" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#0b1117] z-50 p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-3 font-bold text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/5 border border-white/10">
                <span className="text-primary font-extrabold">N3D</span>
              </span>
              <span className="text-white/95">NewPrint3D</span>
            </Link>

            <button className="p-2 rounded-md hover:bg-white/5" onClick={() => setIsMobileMenuOpen(false)}>
              <X />
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-lg text-white/90">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">
              {t.nav.home}
            </Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">
              {t.nav.products}
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">
              {t.nav.about}
            </Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-white transition-colors">
              {t.nav.contact}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
