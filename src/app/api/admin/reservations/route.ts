import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all reservations
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 });
  }
}

// PATCH update reservation status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const reservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 });
  }
}

// DELETE reservation
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    await prisma.reservation.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete reservation" }, { status: 500 });
  }
}
