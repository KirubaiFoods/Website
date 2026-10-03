export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Order ID missing" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items || [];
    
    // Calculate totals
    const shipping = order.shipping || 0;
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const gst = order.gst || Math.round(subtotal * 0.18); // fallback if not saved
    
    const displayOrderId = `ORD-${order.id.slice(-8).toUpperCase()}`;
    const invoiceNo = order.invoiceNumber || displayOrderId;

    // Generate HTML String
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoiceNo}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 40px; background-color: #f9fafb; }
        .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #b91c1c; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #b91c1c; margin: 0; }
        .company-details { text-align: right; font-size: 14px; color: #6b7280; }
        .invoice-title { font-size: 36px; font-weight: bold; color: #111827; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 2px; }
        .details-container { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .bill-to h3, .invoice-details h3 { margin: 0 0 10px 0; font-size: 14px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; }
        .bill-to p, .invoice-details p { margin: 4px 0; font-size: 15px; color: #111827; }
        .invoice-details { text-align: right; }
        table { w-full; width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background-color: #f3f4f6; color: #4b5563; font-weight: 600; text-transform: uppercase; font-size: 12px; padding: 12px 15px; text-align: left; }
        th.right { text-align: right; }
        td { padding: 15px; border-bottom: 1px solid #e5e7eb; color: #1f2937; }
        td.right { text-align: right; }
        .totals { width: 50%; margin-left: auto; border-top: 2px solid #e5e7eb; padding-top: 15px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px; color: #4b5563; }
        .total-row.grand-total { font-size: 20px; font-weight: bold; color: #b91c1c; border-top: 2px solid #e5e7eb; margin-top: 10px; padding-top: 15px; }
        .footer { text-align: center; margin-top: 50px; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="invoice-box">
        <div class="header">
            <div>
                <h1 class="logo">Kirubai Foods</h1>
                <p style="margin: 5px 0 0 0; color: #6b7280;">Authentic & Pure Masalas</p>
            </div>
            <div class="company-details">
                <h1 class="invoice-title">INVOICE</h1>
                <p>Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                <p>Invoice #: ${invoiceNo}</p>
            </div>
        </div>

        <div class="details-container">
            <div class="bill-to">
                <h3>Bill To</h3>
                <p style="font-weight: bold;">${order.name}</p>
                <p>${order.address}</p>
                ${order.city ? `<p>${order.city}, ${order.state || ''} - ${order.pincode || ''}</p>` : ''}
                <p>Phone: ${order.phone}</p>
                <p>Email: ${order.email}</p>
            </div>
            <div class="invoice-details">
                <h3>Order Info</h3>
                <p>Order ID: <strong>${displayOrderId}</strong></p>
                <p>Payment: <strong>${order.payment}</strong></p>
                <p>Status: <strong>${order.status}</strong></p>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Item Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th class="right">Total</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item: any) => `
                <tr>
                    <td>
                        <span style="font-weight: 500;">${item.name}</span>
                    </td>
                    <td>₹${item.price}</td>
                    <td>${item.quantity}</td>
                    <td class="right">₹${item.price * item.quantity}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row">
                <span>Subtotal</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="total-row">
                <span>GST (18% Included)</span>
                <span>₹${gst}</span>
            </div>
            <div class="total-row">
                <span>Shipping</span>
                <span>₹${shipping}</span>
            </div>
            <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>₹${order.total}</span>
            </div>
        </div>

        <div class="footer">
            <p style="font-weight: bold; margin-bottom: 5px;">Thank you for shopping with Kirubai Foods!</p>
            <p>If you have any questions concerning this invoice, contact our support.</p>
        </div>
    </div>
    <script>
      window.onload = function() { window.print(); }
    </script>
</body>
</html>
    `;

    const filename = `Invoice_${invoiceNo}.html`;

    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("GET INVOICE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice HTML" },
      { status: 500 }
    );
  }
}
