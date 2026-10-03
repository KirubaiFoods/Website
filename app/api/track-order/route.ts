export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("id");

    if (!query) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const cleanQuery = query.trim().toUpperCase();

    // Look up by id, cuid prefix/suffix, or invoiceNumber
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { id: query.trim() },
          { invoiceNumber: cleanQuery },
          { invoiceNumber: { contains: query.trim() } },
        ],
      },
    });

    let order = orders[0];

    // If not found, try search by cuid ending
    if (!order) {
      const allOrders = await prisma.order.findMany({ take: 100 });
      order = allOrders.find(
        (o) =>
          o.id.toUpperCase().endsWith(cleanQuery.replace("ORD-", "")) ||
          `ORD-${o.id.slice(-8).toUpperCase()}` === cleanQuery
      ) as any;
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("TRACK ORDER ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
