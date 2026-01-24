import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || "NEWPRINT3D2026"

function hasValidAdminKey(request: Request) {
  const key = request.headers.get("x-admin-key") || ""
  return key === ADMIN_ACCESS_KEY
}

// GET - Listar produtos (ativos)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const localeParam = (searchParams.get("locale") || "es").toLowerCase()
    const locale = localeParam === "pt" || localeParam === "en" || localeParam === "es" ? localeParam : "es"

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

      return { ...product, name, description }
    })

    return NextResponse.json({ products: productsLocalized })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

// POST - Criar novo produto (admin)
export async function POST(request: Request) {
  // ✅ se tiver admin key válida, libera. Senão, exige token admin.
  if (!hasValidAdminKey(request)) {
    const authResult = await requireAdmin(request)
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
  }

  try {
    if (isDemoMode || !sql) {
      return NextResponse.json({ error: "Banco de dados não configurado" }, { status: 503 })
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

    if (!name_en || !name_pt || !name_es || !description_en || !description_pt || !description_es) {
      return NextResponse.json({ error: "Todos os nomes e descrições são obrigatórios" }, { status: 400 })
    }

    if (!category || base_price === undefined || base_price === null) {
      return NextResponse.json({ error: "Categoria e preço são obrigatórios" }, { status: 400 })
    }

    const price = Number(base_price)
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Preço inválido" }, { status: 400 })
    }

    const now = new Date()

    const result = await sql`
      INSERT INTO products (
        name_en, name_pt, name_es,
        description_en, description_pt, description_es,
        category, base_price, image_url,
        colors, sizes, materials,
        featured, stock_quantity,
        active,
        created_at,
        updated_at
      )
      VALUES (
        ${name_en}, ${name_pt}, ${name_es},
        ${description_en}, ${description_pt}, ${description_es},
        ${category}, ${price}, ${image_url || null},
        ${Array.isArray(colors) ? colors : []},
        ${Array.isArray(sizes) ? sizes : []},
        ${Array.isArray(materials) ? materials : []},
        ${Boolean(featured)},
        ${Number(stock_quantity || 0)},
        true,
        ${now},
        ${now}
      )
      RETURNING *
    `

    return NextResponse.json({ product: result[0] }, { status: 201 })
  } catch (error) {
    console.error("ERRO AO CRIAR PRODUTO:", error)
    return NextResponse.json({ error: "Erro interno ao criar produto" }, { status: 500 })
  }
}
