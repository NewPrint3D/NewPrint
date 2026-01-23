"use client"

import { useState } from "react"
import Link from "next/link"

import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Button } from "@/components/ui/button"

import { ShoppingCart, Menu, X, User, LogOut } from "lucide-react"

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b1117] border-b border-white/10 shadow-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-wide">
          <span className="text-primary font-extrabold">N3D</span>
          <span className="text-white">NewPrint3D</span>
        </Link>

        {/* DESKTOP */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition">
            {t.nav.home}
          </Link>

          <Link href="/products" className="hover:text-primary transition">
            {t.nav.products}
          </Link>

          <Link href="/contact" className="hover:text-primary transition">
            {t.nav.contact}
          </Link>

          <LanguageSwitcher />

          <Link href="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-xs rounded-full px-1">{totalItems}</span>
            )}
          </Link>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
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
          )}
        </nav>

        {/* MOBILE BUTTON */}
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
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
              {t.nav.contact}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
