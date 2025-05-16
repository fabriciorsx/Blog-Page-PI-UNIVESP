import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.categoryname || typeof body.categoryname !== "string") {
      return NextResponse.json(
        { error: "O nome da categoria é obrigatório e deve ser uma string." },
        { status: 400 }
      );
    }

    const novaCategoria = await prisma.category.create({
      data: {
        categoryname: body.categoryname,
      },
    });

    return NextResponse.json(novaCategoria, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar a categoria:", error);
    return NextResponse.json(
      { error: "Falha ao criar a categoria." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const categorias = await prisma.category.findMany({
      include: {
        posts: true,
      },
    });

    return NextResponse.json(categorias);
  } catch (error) {
    console.error("Erro ao buscar as categorias:", error);
    return NextResponse.json(
      { error: "Falha ao buscar as categorias." },
      { status: 500 }
    );
  }
}
