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
        "border-b border-white/10",
        "bg-[#0b1117]/85 backdrop-blur-md",
        isScrolled && "shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 select-none group">
         <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary/95 to-primary/55 flex items-center justify-center shadow-[0_10px_25px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-transform duration-700 group-hover:rotate-[360deg]">
            <span className="font-black text-white tracking-tight">N3D</span>
          </div>

          <div className="leading-tight">
            <div className="text-white font-extrabold tracking-tight text-lg transition-all duration-300 group-hover:tracking-wide">
              NewPrint3D
            </div>
          </div>
        </Link>

        {/* DESKTOP MENU CENTRAL */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <Link href="/" className="text-white/90 hover:text-white transition">
            {t.nav.home}
          </Link>

          <Link href="/products" className="text-white/90 hover:text-white transition">
            {t.nav.products}
          </Link>

          <Link href="/about" className="text-white/90 hover:text-white transition">
            {t.nav.about}
          </Link>

          <Link href="/contact" className="text-white/90 hover:text-white transition">
            {t.nav.contact}
          </Link>
        </nav>

        {/* ÍCONES À DIREITA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/90 hover:text-white">
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
          ) : (
            <Button asChild variant="ghost" size="icon" className="text-white/90 hover:text-white">
              <Link href="/login" aria-label="Login">
                <User className="w-5 h-5" />
              </Link>
            </Button>
          )}

          <Link href="/cart" className="relative text-white/90 hover:text-white transition" aria-label="Cart">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-white/90 hover:text-white transition"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu />
        </button>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/95 to-primary/55 flex items-center justify-center ring-1 ring-white/10">
                <span className="font-black text-white tracking-tight">N3D</span>
              </div>
              <div className="text-white font-extrabold tracking-tight text-lg">NewPrint3D</div>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/90 hover:text-white transition"
              aria-label="Close menu"
            >
              <X />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <LanguageSwitcher />

            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-white/90 hover:text-white transition"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <Button variant="ghost" size="icon" className="text-white/90 hover:text-white" onClick={logout}>
                <LogOut className="w-5 h-5" />
              </Button>
            ) : (
              <Button asChild variant="ghost" size="icon" className="text-white/90 hover:text-white">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} aria-label="Login">
                  <User className="w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>

          <nav className="flex flex-col gap-4 text-lg font-semibold">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white">
              {t.nav.home}
            </Link>
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/90 hover:text-white"
            >
              {t.nav.products}
            </Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white">
              {t.nav.about}
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white/90 hover:text-white"
            >
              {t.nav.contact}
            </Link>

            {isAdmin && user && (
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-white/90 hover:text-white">
                Admin
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
