import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        uploaddate: 'desc',
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json({ error: 'Erro ao buscar posts' }, { status: 500 });
  }
}