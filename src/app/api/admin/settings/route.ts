import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    // Transform array to key-value object for easier frontend consumption
    const settingsMap = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
    
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// Accept a key-value object and upsert all
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // We expect body to be like { "concept_title": "...", "concept_text": "..." }
    const operations = Object.entries(body).map(([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string },
      });
    });

    await prisma.$transaction(operations);
    revalidatePath('/');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
