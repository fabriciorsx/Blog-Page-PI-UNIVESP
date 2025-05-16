import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        description: body.description,
        image: body.image,
        categoryId: body.categoryId,
        userid: body.userId,
        username: body.userName,
        userimage: body.userImage,
        comments: body.comments,
        uploaddate: new Date(body.uploadDate),
        tags: "",
      },
    })

    return NextResponse.json(newPost)
  } catch (error) {
    console.error("Erro ao criar post:", error)
    return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 })
  }
}
