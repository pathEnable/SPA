import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET dashboard statistics
export async function GET() {
  try {
    console.log('API: stats - starting fetch');
    const [
      totalReservations,
      newReservations,
      confirmedReservations,
      totalComments,
      pendingComments,
      approvedComments,
      rejectedComments,
      recentReservations,
      recentComments,
    ] = await Promise.all([
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: "new" } }),
      prisma.reservation.count({ where: { status: "confirmed" } }),
      prisma.comment.count(),
      prisma.comment.count({ where: { status: "pending" } }),
      prisma.comment.count({ where: { status: "approved" } }),
      prisma.comment.count({ where: { status: "rejected" } }),
      prisma.reservation.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.comment.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);
    console.log('API: stats - fetch complete');

    return NextResponse.json({
      reservations: {
        total: totalReservations,
        new: newReservations,
        confirmed: confirmedReservations,
      },
      comments: {
        total: totalComments,
        pending: pendingComments,
        approved: approvedComments,
        rejected: rejectedComments,
      },
      recentReservations,
      recentComments,
    });
  } catch (error) {
    console.error('API: stats - error:', error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
