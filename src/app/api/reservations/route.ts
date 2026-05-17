import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, service, date, time, message } = body;

    if (!name || !phone || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        phone,
        service,
        date,
        time,
        message,
        status: "new",
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
  }
}
