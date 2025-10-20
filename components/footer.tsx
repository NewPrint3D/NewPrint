"use client"

import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  const { t } = useLanguage()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/30 border-t border-border mt-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-wave"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse-glow" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg">
                  <span className="text-primary-foreground font-bold text-xl">N3D</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] group-hover:animate-[gradient_2s_linear_infinite]">
                NewPrint3D
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md hover:text-foreground/80 transition-colors duration-300">
              {t.footer.description}
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-gradient-to-br hover:from-primary hover:to-accent flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:rotate-12 shadow-md hover:shadow-lg"
              >
                <Facebook className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300 group-hover:scale-110" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-gradient-to-br hover:from-primary hover:to-accent flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:rotate-12 shadow-md hover:shadow-lg"
              >
                <Instagram className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300 group-hover:scale-110" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-gradient-to-br hover:from-primary hover:to-accent flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:rotate-12 shadow-md hover:shadow-lg"
              >
                <Twitter className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300 group-hover:scale-110" />
              </Link>
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-primary/10 hover:bg-gradient-to-br hover:from-primary hover:to-accent flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:rotate-12 shadow-md hover:shadow-lg"
              >
                <Linkedin className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300 group-hover:scale-110" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground hover:text-primary transition-colors duration-300 inline-block">
              {t.footer.quickLinks}
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block"
              >
                {t.nav.home}
              </Link>
              <Link
                href="/products"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block"
              >
                {t.nav.products}
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block"
              >
                {t.nav.about}
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-2 inline-block"
              >
                {t.nav.contact}
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-foreground hover:text-primary transition-colors duration-300 inline-block">
              {t.footer.contact}
            </h3>
            <div className="flex flex-col gap-2 text-muted-foreground text-sm">
              <p className="hover:text-primary transition-colors duration-300 cursor-pointer">
                contact@newprint3d.com
              </p>
              <p className="hover:text-primary transition-colors duration-300 cursor-pointer">+1 (555) 123-4567</p>
              <p className="hover:text-primary transition-colors duration-300 cursor-pointer">123 Print Street</p>
              <p className="hover:text-primary transition-colors duration-300 cursor-pointer">Tech City, TC 12345</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p className="hover:text-foreground transition-colors duration-300 inline-block hover:scale-105">
            {currentYear} NewPrint3D. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
