import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({ 
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ] 
    });
    return NextResponse.json(slides);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch slides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slide = await prisma.heroSlide.create({
      data: {
        title: body.title || "",
        subtitle: body.subtitle || "",
        badge: body.badge || "",
        description: body.description || "",
        image: body.image,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      }
    });
    revalidatePath('/');
    return NextResponse.json(slide);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create slide' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const slide = await prisma.heroSlide.update({
      where: { id: parseInt(id.toString()) },
      data,
    });
    revalidatePath('/');
    return NextResponse.json(slide);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.heroSlide.delete({ where: { id: parseInt(id) } });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
