export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { orderId } = body

    if (!orderId) {
      return new Response("Order ID required", { status: 400 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" }
    })

    return Response.json(updatedOrder)
  } catch (error) {
    console.error("Cancel Order Error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}