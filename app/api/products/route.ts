import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import productsData from "@/data/products.json"

// GET - Listar todos os produtos
export async function GET(request: Request) {
  // Modo demonstração: retornar produtos do arquivo JSON
  if (isDemoMode) {
    console.log("[DEMO MODE] GET /api/products - retornando produtos do arquivo JSON")
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    let filteredProducts = productsData

    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    if (featured === "true") {
      filteredProducts = filteredProducts.filter(p => p.featured === true)
    }

    const normalizedProducts = filteredProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      name_en: product.name?.en ?? product.name_en,
      name_pt: product.name?.pt ?? product.name_pt,
      name_es: product.name?.es ?? product.name_es,
      description_en: product.description?.en ?? product.description_en,
      description_pt: product.description?.pt ?? product.description_pt,
      description_es: product.description?.es ?? product.description_es,
      category: product.category,
      base_price: product.base_price ?? product.basePrice ?? 0,
      basePrice: product.base_price ?? product.basePrice ?? 0,
      image_url: product.image_url ?? product.image ?? null,
      image: product.image ?? product.image_url ?? null,
      colors: product.colors ?? [],
      sizes: product.sizes ?? [],
      materials: product.materials ?? [],
      featured: Boolean(product.featured),
      active: true,
      stock_quantity: product.stock_quantity ?? 0,
    }))

    return NextResponse.json({
      products: normalizedProducts,
      demoMode: true,
      message: "Produtos carregados do arquivo local (data/products.json)"
    })
  }

  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    let query = `SELECT * FROM products WHERE active = true`
    const params: any[] = []

    if (category) {
      query += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    if (featured === "true") {
      query += ` AND featured = true`
    }

    query += ` ORDER BY created_at DESC`

    const products = await sql!(query, params)

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Erro ao buscar produtos:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

// POST - Criar novo produto (apenas admin)
export async function POST(request: Request) {
  // Modo demonstração: não permite criar produtos
  if (isDemoMode) {
    console.log("[DEMO MODE] POST /api/products - operação não permitida em modo demo")
    return NextResponse.json({
      error: "Modo demonstração: Para criar produtos, configure o banco de dados (DATABASE_URL)",
      demoMode: true
    }, { status: 403 })
  }

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
