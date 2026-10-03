export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendOrderEmail,
  sendConfirmedEmail,
  sendProcessingEmail,
  sendShippedEmail,
  sendDeliveredEmail,
  sendCancelledEmail,
} from "@/lib/sendEmail";

// =========================
// ✅ GET ALL ORDERS
// =========================
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

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
// 🔄 UPDATE ORDER STATUS
// =========================
export async function PATCH(req: Request) {
  try {
    const { id, status, paymentStatus } = await req.json();

    if (!id || (!status && !paymentStatus)) {
      return NextResponse.json(
        { error: "Order ID and Status/PaymentStatus required" },
        { status: 400 }
      );
    }

    const dataToUpdate: any = {};
    if (status) dataToUpdate.status = status;
    if (paymentStatus) dataToUpdate.paymentStatus = paymentStatus;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: dataToUpdate,
    });

    // 📧 Trigger status email notifications asynchronously
    if (status === "PLACED") {
      sendOrderEmail(updatedOrder).catch(console.error);
    } else if (status === "CONFIRMED") {
      sendConfirmedEmail(updatedOrder).catch(console.error);
    } else if (status === "PROCESSING") {
      sendProcessingEmail(updatedOrder).catch(console.error);
    } else if (status === "SHIPPED") {
      sendShippedEmail(updatedOrder).catch(console.error);
    } else if (status === "DELIVERED") {
      sendDeliveredEmail(updatedOrder).catch(console.error);
    } else if (status === "CANCELLED") {
      sendCancelledEmail(updatedOrder).catch(console.error);
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