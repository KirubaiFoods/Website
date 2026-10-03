import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        image: data.image,
        category: data.category,
        stock: Number(data.stock),
        weight: data.weight,
        isActive: data.isActive,
        gstInfo: data.gstInfo ? Number(data.gstInfo) : null,
      },
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
