import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: data.image,
        category: data.category,
        stock: Number(data.stock || 0),
        weight: data.weight,
        isActive: data.isActive !== undefined ? data.isActive : true,
        gstInfo: data.gstInfo ? Number(data.gstInfo) : null,
      },
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
