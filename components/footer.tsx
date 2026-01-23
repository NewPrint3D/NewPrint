"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Instagram } from "lucide-react"

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21 8.5c-1.9.1-3.6-.6-4.9-1.9C14.8 5.3 14.1 3.6 14 2h-3.6v13.2c0 1.8-1.5 3.3-3.3 3.3S3.8 17 3.8 15.2s1.5-3.3 3.3-3.3c.4 0 .8.1 1.2.2V8.4c-.4-.1-.8-.1-1.2-.1C4 8.3 1.5 10.8 1.5 14s2.5 5.7 5.7 5.7 5.7-2.5 5.7-5.7V9.1c1.4 1 3.1 1.6 5 1.6V8.5z" />
    </svg>
  )
}

export function Footer() {
  const { locale } = useLanguage()

  const labels =
    locale === "pt"
      ? {
          privacy: "Política de privacidade",
          terms: "Termos de uso",
          warranty: "Garantia",
          cookies: "Configuração de cookies",
        }
      : locale === "en"
        ? {
            privacy: "Privacy Policy",
            terms: "Terms of Use",
            warranty: "Warranty",
            cookies: "Cookie Settings",
          }
        : {
            // ✅ padrão ES (seu site principal)
            privacy: "Política de privacidad",
            terms: "Términos de uso",
            warranty: "Garantía",
            cookies: "Configuración de cookies",
          }

  return (
    <footer className="border-t border-white/10 bg-[#0b1117]">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 md:items-center md:justify-between">
          {/* Brand */}
          <div>
            <div className="text-lg font-bold">NewPrint3D</div>
            <p className="text-sm text-white/60 mt-1">
              Impresión 3D premium • Hecho bajo pedido
            </p>
          </div>

          {/* Social (ONLY IG + TikTok) */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
            >
              <Instagram className="h-5 w-5" />
            </a>

            <a
              href="https://www.tiktok.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center transition"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="text-xs text-white/50">
            © {new Date().getFullYear()} NewPrint3D. All rights reserved.
          </div>

          {/* Legal links */}
          <div className="text-xs text-white/70 flex flex-wrap gap-x-3 gap-y-2">
            <Link className="hover:underline" href="/privacy">
              {labels.privacy}
            </Link>
            <span className="text-white/20">|</span>
            <Link className="hover:underline" href="/terms">
              {labels.terms}
            </Link>
            <span className="text-white/20">|</span>
            <Link className="hover:underline" href="/warranty">
              {labels.warranty}
            </Link>
            <span className="text-white/20">|</span>
            <Link className="hover:underline" href="/cookies">
              {labels.cookies}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
