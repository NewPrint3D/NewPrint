import { NextResponse } from "next/server"
import { sql, isDemoMode } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"
import productsData from "@/data/products.json"

// GET - Buscar produto por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params
  const db = sql
  if (!db) {
    return NextResponse.json(
      { error: "Banco não configurado (DATABASE_URL ausente)." },
      { status: 500 }
    )
  }

  try {
       const products = await db`
      SELECT *
      FROM products
      WHERE id = ${resolvedParams.id}
      LIMIT 1
    
 
    if (products.length === 0) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ product: products[0] })
  } catch (error) {
    console.error("Erro ao buscar produto:", error)
    return NextResponse.json({ error: "Erro ao buscar produto" }, { status: 500 })
  }
}

// PUT - Atualizar produto (apenas admin)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params

  if (isDemoMode) {
    console.log("[DEMO MODE] PUT /api/products - operação não permitida em modo demo")
    return NextResponse.json({
      error: "Modo demonstração: Para editar produtos, configure o banco de dados (DATABASE_URL)",
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
      active,
       variants,
      color_images,
    } = data
      const normalizedVariants = Array.isArray(variants) ? variants : []
      const normalizedColorImages = Array.isArray(color_images) ? color_images : []
     const variantsJson = JSON.stringify(normalizedVariants)
    const colorImagesJson = JSON.stringify(normalizedColorImages)

 const normalizedColors =
    Array.isArray(colors)
    ? colors
    : typeof colors === "string"
      ? [colors]
      : []
    // Atualizar produto
    const updatedProducts = await db
      UPDATE products
      SET
        name_en = ${name_en},
        name_pt = ${name_pt},
        name_es = ${name_es},
        description_en = ${description_en},
        description_pt = ${description_pt},
        description_es = ${description_es},
        category = ${category},
        base_price = ${base_price},
        image_url = ${image_url},
       colors = ${normalizedColors},
        sizes = ${sizes},
        materials = ${materials},
        featured = ${featured},
        stock_quantity = ${stock_quantity},
         variants = ${variantsJson}::jsonb,
        color_images = ${colorImagesJson}::jsonb,
             updated_at = CURRENT_TIMESTAMP
  
      WHERE id = ${resolvedParams.id}
      RETURNING *
    

    if (updatedProducts.length === 0) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

  } catch (error: any) {
  console.error("PUT /api/products/[id] ERROR:", error)

  return NextResponse.json(
    {
      error: "Erro ao atualizar produto",
      details: error?.message ?? String(error),
    },
    { status: 500 }
  )
}
}

// DELETE - Deletar produto (apenas admin)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params

  if (isDemoMode) {
    console.log("[DEMO MODE] DELETE /api/products - operação não permitida em modo demo")
    return NextResponse.json({
      error: "Modo demonstração: Para deletar produtos, configure o banco de dados (DATABASE_URL)",
      demoMode: true
    }, { status: 403 })
  }

  const authResult = await requireAdmin(request)

  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  try {
    // Soft delete - apenas marca como inativo
    const deletedProducts =await db
      UPDATE products
      SET active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${resolvedParams.id}
      RETURNING id
    

    if (deletedProducts.length === 0) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Produto deletado com sucesso" })
  } catch (error) {
    console.error("Erro ao deletar produto:", error)
    return NextResponse.json({ error: "Erro ao deletar produto" }, { status: 500 })
  }
}
}
