import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

type UpdatePostInput = {
  title?: string;
  description?: string;
  image?: string;
  categoryId?: number;
};

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      id, 
      title, 
      description, 
      image, 
      categoryId, 
      category 
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "O ID do post é obrigatório." },
        { status: 400 }
      );
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post não encontrado." },
        { status: 404 }
      );
    }

    const updateData: UpdatePostInput = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;

    if (categoryId !== undefined) {
      updateData.categoryId = Number(categoryId);
    } else if (category && category.id !== undefined) {
      updateData.categoryId = Number(category.id);
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: updateData,
      include: {
        category: true
      }
    });

    return NextResponse.json({
      message: "Post atualizado com sucesso", 
      post: updatedPost
    }, { status: 200 });

  } catch (error) {
    console.error("Erro ao editar o post:", error);
    return NextResponse.json(
      { error: "Falha ao editar o post." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
