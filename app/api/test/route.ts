export const dynamic = "force-dynamic"
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const order = await prisma.order.create({
      data: {
        name: "Test User",
        phone: "9999999999",
        email: "test@gmail.com",
        address: "Chennai",
        total: 100,
        items: "Test Item",
        payment: "COD",
        shipping: 50
      }
    })

    return Response.json(order)
  } catch (error) {
    console.error(error)
    return new Response("Error creating order", { status: 500 })
  }
}