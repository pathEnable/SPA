import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const faqs = await prisma.faqItem.findMany({ 
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ] 
    });
    return NextResponse.json(faqs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch faqs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const faq = await prisma.faqItem.create({
      data: {
        question: body.question,
        answer: body.answer,
        order: body.order || 0,
        isActive: body.isActive ?? true,
      }
    });
    revalidatePath('/');
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create faq' }, { status: 500 });
  }
}
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    const faq = await prisma.faqItem.update({
      where: { id: parseInt(id.toString()) },
      data,
    });
    revalidatePath('/');
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update faq' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await prisma.faqItem.delete({
      where: { id: parseInt(id) },
    });
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete faq' }, { status: 500 });
  }
}
