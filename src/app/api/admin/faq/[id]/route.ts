import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    const body = await request.json();
    
    const faq = await prisma.faqItem.update({
      where: { id },
      data: {
        question: body.question,
        answer: body.answer,
        order: body.order,
        isActive: body.isActive,
      }
    });
    revalidatePath('/');
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update faq' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);
    await prisma.faqItem.delete({ where: { id } });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete faq' }, { status: 500 });
  }
}
