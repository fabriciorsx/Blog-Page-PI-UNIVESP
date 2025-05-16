import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "ID da categoria não fornecido" }, { status: 400 });
    }

    const categoryId = Number(id);

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { posts: true },
    });

    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 });
    }

    if (category.posts.length > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir uma categoria que possui posts" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Categoria deletada com sucesso!" }, { status: 200 });

  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return NextResponse.json({ error: "Erro interno ao deletar categoria" }, { status: 500 });
  }
}
