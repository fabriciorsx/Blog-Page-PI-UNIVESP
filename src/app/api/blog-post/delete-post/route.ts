import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID do post não fornecido' }, { status: 400 });
    }

    await prisma.post.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'Post deletado com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao deletar post:', error);

    return NextResponse.json({ error: 'Erro interno ao deletar post' }, { status: 500 });
  }
}
