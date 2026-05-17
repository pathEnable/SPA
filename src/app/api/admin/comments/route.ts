import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all comments for admin
export async function GET() {
  try {
    const comments = await prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

// PATCH update comment status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const comment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update comment" }, { status: 500 });
  }
}

// DELETE comment
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
