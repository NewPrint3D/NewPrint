import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import productsData from "@/data/products.json"

// GET - Listar todos os produtos
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    let products

    if (category && featured === "true") {
      products = await sql!`
        SELECT * FROM products
        WHERE active = true
        AND category = ${category}
        AND featured = true
        ORDER BY created_at DESC
      `
    } else if (category) {
      products = await sql!`
        SELECT * FROM products
        WHERE active = true
        AND category = ${category}
        ORDER BY created_at DESC
      `
    } else if (featured === "true") {
      products = await sql!`
        SELECT * FROM products
        WHERE active = true
        AND featured = true
        ORDER BY created_at DESC
      `
    } else {
      products = await sql!`
        SELECT * FROM products
        WHERE active = true
        ORDER BY created_at DESC
      `
    }

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

// POST - Criar novo produto (apenas admin)
export async function POST(request: Request) {
  const authResult = await requireAdmin(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
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

    if (!category || !base_price) {
      return NextResponse.json({ error: "Categoria e preço são obrigatórios" }, { status: 400 })
    }

    // Criar produto
    const newProducts = await sql!`
      INSERT INTO products (
        name_en, name_pt, name_es,
        description_en, description_pt, description_es,
        category, base_price, image_url,
        colors, sizes, materials, featured, stock_quantity
      )
      VALUES (
        ${name_en}, ${name_pt}, ${name_es},
        ${description_en}, ${description_pt}, ${description_es},
        ${category}, ${base_price}, ${image_url || null},
        ${colors || []}, ${sizes || []}, ${materials || []},
        ${featured || false}, ${stock_quantity || 0}
      )
      RETURNING *
    `

    return NextResponse.json({ product: newProducts[0] }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar produto:", error)
    return NextResponse.json({ error: "Erro ao criar produto" }, { status: 500 })
  }
}
