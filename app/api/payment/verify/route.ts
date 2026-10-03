import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, db_order_id } = await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      if (db_order_id) {
        const order = await prisma.order.update({
          where: { id: db_order_id },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED"
          }
        });
        
        try {
          await sendOrderEmail(order);
        } catch (e) {
          console.error("Failed to send order email:", e);
        }
      }
      return NextResponse.json({ success: true, message: "Payment verified successfully" }, { status: 200 });
    } else {
      if (db_order_id) {
        await prisma.order.update({
          where: { id: db_order_id },
          data: {
            paymentStatus: "FAILED",
            status: "CANCELLED"
          }
        });
      }
      return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Razorpay Verification Error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
