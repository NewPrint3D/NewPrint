import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
      file: formData.get("file"),
    }

    console.log("📩 Novo contato recebido:", {
      ...data,
      file:
        data.file instanceof File
          ? {
              name: data.file.name,
              size: data.file.size,
              type: data.file.type,
            }
          : null,
    })

    return NextResponse.json(
      { success: true, message: "Contato recebido com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Erro em /api/contact:", error)

    return NextResponse.json(
      { success: false, message: "Erro interno no servidor" },
      { status: 500 }
    )
  }
}
