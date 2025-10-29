import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // PRODUÇÃO: Não ignorar erros - forçar qualidade de código
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === "development",
  },

  // Habilitar otimização de imagens para produção
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ]
  },

  // Compressão e otimizações
  compress: true,
  poweredByHeader: false,

  // Redirecionar trailing slashes
  trailingSlash: false,

  // Otimizações de produção
  productionBrowserSourceMaps: false,

  // Configuração de experimental features (opcional)
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Temporarily disable Turbopack to avoid build issues
  // turbopack: {
  //   root: "e:/task/20251029_workana_paypal&stripe_integration/NewPrint",
  // },
}

export default nextConfig
