export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      phone,
      email,
      address,
      city,
      pincode,
      state,
      total,
      items,
      shipping: customShipping,
      paymentMethod = "COD", // "COD" or "ONLINE"
    } = body;

    const isTamilNadu =
      state && state.toLowerCase().trim() === "tamil nadu";

    // 🚚 Auto shipping calculation
    const shipping =
      typeof customShipping === "number"
        ? customShipping
        : isTamilNadu
        ? 50
        : 100;

    // 🗓️ Estimated Delivery Date Calculation
    const orderDate = new Date();
    const minDays = isTamilNadu ? 3 : 5;
    const maxDays = isTamilNadu ? 5 : 7;

    const minEstDate = new Date(orderDate);
    minEstDate.setDate(minEstDate.getDate() + minDays);

    const maxEstDate = new Date(orderDate);
    maxEstDate.setDate(maxEstDate.getDate() + maxDays);

    const formatDateShort = (d: Date) =>
      d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });

    const estimatedDelivery = `${minDays}–${maxDays} days (Expected by ${formatDateShort(
      minEstDate
    )} - ${formatDateShort(maxEstDate)})`;

    // 🧾 Invoice Number Generation
    const timestampStr = Date.now().toString().slice(-6);
    const randStr = Math.floor(10 + Math.random() * 90).toString();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${timestampStr}${randStr}`;

    // 💰 Subtotal & GST Calculation
    const productTotal = total - shipping;
    const subtotal = Math.round(productTotal / 1.18);
    const gst = Number((productTotal - subtotal).toFixed(2));

    const order = await prisma.order.create({
      data: {
        invoiceNumber,
        name: `${firstName} ${lastName}`.trim(),
        phone,
        email,
        address,
        city,
        pincode,
        state,
        total,
        subtotal,
        gst,
        shipping,
        status: paymentMethod === "ONLINE" ? "PLACED" : "CONFIRMED", // Require payment for ONLINE
        payment: paymentMethod,
        paymentStatus: paymentMethod === "ONLINE" ? "PENDING" : "PENDING", // Cash is collected on delivery
        estimatedDelivery,
        items: JSON.stringify(items || []),
        orderItems: {
          create: (items || []).map((item: any) => ({
             name: item.name,
             price: item.price,
             quantity: item.quantity,
             // Note: if item.id is a CUID/valid ID from Product table, we can link it. For now, rely on name/price.
          }))
        }
      },
    });

    // 📧 Send Confirmation Email (For COD, send now. For ONLINE, wait until payment is verified)
    if (paymentMethod === "COD") {
      try {
        await sendOrderEmail(order);
      } catch (e) {
        console.error("Failed to send order email:", e);
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json({ success: false, error: "Failed to place order" }, { status: 500 });
  }
}