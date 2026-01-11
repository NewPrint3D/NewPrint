"use client"

import { useState, useEffect } from "react"
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

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20)
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [])

useEffect(() => {
  if (typeof window === "undefined") return

  document.body.style.overflow = isMobileMenuOpen ? "hidden" : ""

  return () => {
    document.body.style.overflow = ""
  }
}, [isMobileMenuOpen])

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" })
    setIsMobileMenuOpen(false)
  }
}


  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 relative z-50">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 animate-rotate-slow" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center transform group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700 shadow-lg group-hover:shadow-2xl">
                <span className="text-primary-foreground font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                  N3D
                </span>
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] group-hover:animate-[gradient_2s_linear_infinite]">
              NewPrint3D
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group hover:scale-110"
            >
              {t.nav.home}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              <span className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </Link>
            <Link
              href="/products"
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group hover:scale-110"
            >
              {t.nav.products}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              <span className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </Link>
            <button
              onClick={() => scrollToSection("custom")}
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group hover:scale-110"
            >
              {t.customProjects.navLink}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              <span className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </button>
            <Link
              href="/about"
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group hover:scale-110"
            >
              {t.nav.about}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              <span className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </Link>
            <Link
              href="/contact"
              className="text-foreground/80 hover:text-primary transition-all duration-300 font-medium relative group hover:scale-110"
            >
              {t.nav.contact}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
              <span className="absolute inset-0 bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative group">
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">{t.auth.profile}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">{t.auth.myOrders}</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">{t.auth.adminPanel}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    {t.auth.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t.auth.login}</Link>
              </Button>
            )}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="relative group hover:scale-110 transition-all duration-300"
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-accent to-chart-3 text-accent-foreground text-xs rounded-full flex items-center justify-center font-bold animate-bounce-subtle shadow-lg group-hover:scale-125 transition-transform duration-300">
                    {totalItems}
                  </span>
                )}
                <span className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

       {isMobileMenuOpen && (
  <>
    {/* Overlay (escurece o fundo) */}
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md md:hidden z-40"
      onClick={() => setIsMobileMenuOpen(false)}
      aria-hidden="true"
    />

    {/* Painel do menu */}
    <div className="fixed top-16 left-0 right-0 md:hidden z-50 bg-background/95 backdrop-blur-lg border-t border-border shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 ease-out

      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.nav.home}
          </Link>

          <Link
            href="/products"
            className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.nav.products}
          </Link>

          <button
            onClick={() => scrollToSection("custom")}
            className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium py-2 text-left"
          >
            {t.customProjects.navLink}
          </button>

          <Link
            href="/about"
            className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.nav.about}
          </Link>

          <Link
            href="/contact"
            className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium py-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </div>
)}
      </div>
    </nav>
  )
}
