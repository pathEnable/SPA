import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  console.log('API_COMMENTS: Env check:', !!process.env.DATABASE_URL, process.env.DATABASE_URL?.substring(0, 10));
  try {
    const comments = await prisma.comment.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('API: public/comments error:', error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rating, text } = body;

    if (!name || !rating || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        name,
        rating: parseInt(rating),
        text,
        status: "pending", // Always pending by default
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit comment" }, { status: 500 });
  }
}
