export const dynamic = "force-dynamic"
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
      whatsappUpdates,
      items,
      shipping,
    } = body;

  
const order = await prisma.order.create({
  data: {
    name: `${firstName} ${lastName}`,
    phone,
    email,
    address,
    city,
    pincode,
    state,
    total,
    status: "PLACED",
    items: JSON.stringify(items || []),
    payment: "COD", 
    shipping,
  },
});
    
    // ✅ Send email AFTER saving
    await sendOrderEmail({
  ...order,
  items,
});
    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
  console.error("FULL ERROR:", error);
  return NextResponse.json(
    { success: false },
    { status: 500 }
  );
}
}