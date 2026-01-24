import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

// ✅ Chave de acesso temporário (ideal: configurar no Render como ENV ADMIN_ACCESS_KEY)
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || "NEWPRINT3D2026"

// ✅ Autoriza por key (header) quando você estiver acessando o admin sem token
function hasValidAdminKey(request: Request) {
  const key = request.headers.get("x-admin-key") || ""
  return key === ADMIN_ACCESS_KEY
}

// GET - Listar todos os produtos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const localeParam = (searchParams.get("locale") || "es").toLowerCase()
    const locale = localeParam === "pt" || localeParam === "en" || localeParam === "es" ? localeParam : "es"

    // Se não tiver DB, não tenta consultar
    if (isDemoMode || !sql) {
      return NextResponse.json({ products: [] })
    }

    let products

    if (category && featured === "true") {
      products = await sql`
        SELECT * FROM products
        WHERE active = true
          AND category = ${category}
          AND featured = true
        ORDER BY created_at DESC
      `
    } else if (category) {
      products = await sql`
        SELECT * FROM products
        WHERE active = true
          AND category = ${category}
        ORDER BY created_at DESC
      `
    } else if (featured === "true") {
      products = await sql`
        SELECT * FROM products
        WHERE active = true
          AND featured = true
        ORDER BY created_at DESC
      `
    } else {
      products = await sql`
        SELECT * FROM products
        WHERE active = true
        ORDER BY created_at DESC
      `
    }

    const productsLocalized = (products || []).map((product: any) => {
      const name = locale === "es" ? product.name_es : locale === "pt" ? product.name_pt : product.name_en
      const description =
        locale === "es"
          ? product.description_es
          : locale === "pt"
          ? product.description_pt
          : product.description_en

      return {
        ...product,
        name,
        description,
      }
    })

    return NextResponse.json({ products: productsLocalized })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

// POST - Criar novo produto (admin)
export async function POST(request: Request) {
  // ✅ Se tiver key válida, libera. Se não tiver, exige token de admin.
  if (!hasValidAdminKey(request)) {
    const authResult = await requireAdmin(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
  }

  try {
    if (isDemoMode || !sql) {
      return NextResponse.json(
        { error: "Modo demonstração: banco não configurado. Configure DATABASE_URL." },
        { status: 503 },
      )
    }

    const data = await request.json()

    const {
      name_en,
      name_pt,
      name_es,
      description_en,
      description_pt,
      description_es,
      category,
      base_price,
      image_url,
      colors,
      sizes,
      materials,
      featured,
      stock_quantity,
    } = data

    // Validar campos obrigatórios
    if (!name_en || !name_pt || !name_es || !description_en || !description_pt || !description_es) {
      return NextResponse.json({ error: "Todos os campos de nome e descrição são obrigatórios" }, { status: 400 })
    }

    // ⚠️ base_price pode ser 0, então valida diferente
    if (!category || base_price === undefined || base_price === null) {
      return NextResponse.json({ error: "Categoria e preço são obrigatórios" }, { status: 400 })
    }

    const basePriceNumber = Number(base_price)
    if (!Number.isFinite(basePriceNumber) || basePriceNumber < 0) {
      return NextResponse.json({ error: "Preço inválido" }, { status: 400 })
    }

    const stockNumber = Number(stock_quantity ?? 0)
    const safeStock = Number.isFinite(stockNumber) && stockNumber >= 0 ? stockNumber : 0

    const safeColors = Array.isArray(colors) ? colors : []
    const safeSizes = Array.isArray(sizes) ? sizes : []
    const safeMaterials = Array.isArray(materials) ? materials : []

    // Criar produto (garantindo active = true)
    const newProducts = await sql`
      INSERT INTO products (
        name_en, name_pt, name_es,
        description_en, description_pt, description_es,
        category, base_price, image_url,
        colors, sizes, materials,
        featured, stock_quantity,
        active
      )
      VALUES (
        ${name_en}, ${name_pt}, ${name_es},
        ${description_en}, ${description_pt}, ${description_es},
        ${category}, ${basePriceNumber}, ${image_url || null},
        ${safeColors}, ${safeSizes}, ${safeMaterials},
        ${Boolean(featured)}, ${safeStock},
        true
      )
      RETURNING *
    `

    return NextResponse.json({ product: newProducts[0] }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
