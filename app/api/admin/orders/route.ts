export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { sendShippedEmail, sendDeliveredEmail } from "@/lib/sendEmail"; // ✅ ADD THIS

// =========================
// ✅ GET ORDERS (EXISTING)
// =========================
export async function GET() {
  try {
    console.log("Fetching orders...");

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log("Orders fetched:", orders);

    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// =========================
// 🔥 ADD THIS PATCH FUNCTION
// =========================
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    console.log("Updating order:", id, status);

    // ✅ Update DB
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // ✅ Send emails based on status
    if (status === "SHIPPED") {
      await sendShippedEmail(updatedOrder);
    }

    if (status === "DELIVERED") {
      await sendDeliveredEmail(updatedOrder);
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });

  } catch (error) {
    console.error("PATCH ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}