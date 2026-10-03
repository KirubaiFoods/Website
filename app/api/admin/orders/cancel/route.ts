export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendCancelledEmail } from "@/lib/sendEmail";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
    });

    await sendCancelledEmail(updatedOrder);

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  return PATCH(req);
}