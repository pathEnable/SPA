import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    
    const slide = await prisma.heroSlide.update({
      where: { id },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        badge: body.badge,
        description: body.description,
        image: body.image,
        order: body.order,
        isActive: body.isActive,
      }
    });
    revalidatePath('/');
    return NextResponse.json(slide);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update slide' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    await prisma.heroSlide.delete({ where: { id } });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete slide' }, { status: 500 });
  }
}
