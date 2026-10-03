import PDFDocument from "pdfkit";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  id: string;
  invoiceNumber?: string | null;
  name: string;
  phone: string;
  email: string;
  address: string;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  total: number;
  subtotal?: number | null;
  gst?: number | null;
  shipping: number;
  status: string;
  payment: string;
  estimatedDelivery?: string | null;
  createdAt: Date | string;
  items: string | OrderItem[];
}

export function generateInvoiceBuffer(order: OrderData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 40 });
      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      const parsedItems: OrderItem[] =
        typeof order.items === "string"
          ? JSON.parse(order.items || "[]")
          : order.items || [];

      const formattedDate = new Date(order.createdAt).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

      const invoiceNo =
        order.invoiceNumber ||
        `INV-${new Date(order.createdAt).getFullYear()}-${order.id
          .slice(-6)
          .toUpperCase()}`;

      const displayOrderId = `ORD-${order.id.slice(-8).toUpperCase()}`;

      // Calculated financials
      const shippingCharge = order.shipping ?? 0;
      const productTotal = order.total - shippingCharge;
      const subtotal = order.subtotal ?? Math.round(productTotal / 1.18);
      const gst = order.gst ?? Number((productTotal - subtotal).toFixed(2));
      const cgst = Number((gst / 2).toFixed(2));
      const sgst = Number((gst / 2).toFixed(2));

      // --- BRAND HEADER ---
      doc
        .fillColor("#b91c1c")
        .fontSize(22)
        .font("Helvetica-Bold")
        .text("KIRUBAI MASALA", 40, 40);

      doc
        .fillColor("#4b5563")
        .fontSize(10)
        .font("Helvetica")
        .text("Authentic Homemade Spices & Masala", 40, 66);

      doc
        .fontSize(9)
        .fillColor("#6b7280")
        .text("Sold By: Kirubai Masala", 40, 80)
        .text("GSTIN: 33ABCDE1234F1Z5 (Dummy)", 40, 93)
        .text("HSN Code: 0910 (Spices)", 40, 106);

      // --- INVOICE META (RIGHT ALIGNED) ---
      doc
        .fillColor("#111827")
        .fontSize(16)
        .font("Helvetica-Bold")
        .text("TAX INVOICE", 380, 40, { align: "right" });

      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#374151")
        .text(`Invoice No: ${invoiceNo}`, 300, 66, { align: "right" })
        .text(`Order ID: ${displayOrderId}`, 300, 80, { align: "right" })
        .text(`Date: ${formattedDate}`, 300, 94, { align: "right" })
        .text(`Payment: ${order.payment}`, 300, 108, { align: "right" });

      // Divider line
      doc
        .moveTo(40, 125)
        .lineTo(555, 125)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

      // --- CUSTOMER & SHIPPING DETAILS ---
      doc
        .fillColor("#b91c1c")
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Billed & Shipped To:", 40, 135);

      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#111827")
        .text(order.name, 40, 153);

      doc
        .font("Helvetica")
        .fillColor("#4b5563")
        .text(`Phone: ${order.phone}`, 40, 168)
        .text(`Email: ${order.email}`, 40, 182)
        .text(
          `Address: ${order.address}${order.city ? `, ${order.city}` : ""}${
            order.state ? `, ${order.state}` : ""
          }${order.pincode ? ` - ${order.pincode}` : ""}`,
          40,
          196,
          { width: 300 }
        );

      // Estimated Delivery on Right
      if (order.estimatedDelivery) {
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .fillColor("#15803d")
          .text(`Estimated Delivery:`, 300, 153, { align: "right" })
          .font("Helvetica")
          .fillColor("#374151")
          .text(order.estimatedDelivery, 300, 168, { align: "right" });
      }

      // --- PRODUCT TABLE ---
      let tableTop = 240;

      // Table Header Background
      doc
        .rect(40, tableTop, 515, 24)
        .fillColor("#f3f4f6")
        .fill();

      // Table Headers
      doc
        .fillColor("#111827")
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Product", 50, tableTop + 7, { width: 230 })
        .text("Qty", 290, tableTop + 7, { width: 40, align: "center" })
        .text("Unit Price", 340, tableTop + 7, { width: 90, align: "right" })
        .text("Total", 440, tableTop + 7, { width: 105, align: "right" });

      let currentY = tableTop + 28;

      parsedItems.forEach((item, index) => {
        const itemLineTotal = item.price * item.quantity;

        // Alternate background
        if (index % 2 === 1) {
          doc
            .rect(40, currentY - 4, 515, 20)
            .fillColor("#fafafa")
            .fill();
        }

        doc
          .fillColor("#374151")
          .fontSize(9.5)
          .font("Helvetica")
          .text(item.name, 50, currentY, { width: 230 })
          .text(item.quantity.toString(), 290, currentY, {
            width: 40,
            align: "center",
          })
          .text(`Rs. ${item.price}`, 340, currentY, {
            width: 90,
            align: "right",
          })
          .text(`Rs. ${itemLineTotal}`, 440, currentY, {
            width: 105,
            align: "right",
          });

        currentY += 22;
      });

      // Divider below table
      doc
        .moveTo(40, currentY + 5)
        .lineTo(555, currentY + 5)
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .stroke();

      currentY += 15;

      // --- FINANCIAL SUMMARY (RIGHT ALIGNED) ---
      const summaryXLabel = 350;
      const summaryXVal = 440;
      const summaryWidthVal = 105;

      doc
        .fontSize(9.5)
        .font("Helvetica")
        .fillColor("#4b5563")
        .text("Product Subtotal:", summaryXLabel, currentY)
        .text(`Rs. ${subtotal}`, summaryXVal, currentY, {
          width: summaryWidthVal,
          align: "right",
        });

      currentY += 16;
      doc
        .text("CGST (9%):", summaryXLabel, currentY)
        .text(`Rs. ${cgst}`, summaryXVal, currentY, {
          width: summaryWidthVal,
          align: "right",
        });

      currentY += 16;
      doc
        .text("SGST (9%):", summaryXLabel, currentY)
        .text(`Rs. ${sgst}`, summaryXVal, currentY, {
          width: summaryWidthVal,
          align: "right",
        });

      currentY += 16;
      doc
        .text("Shipping Charge:", summaryXLabel, currentY)
        .text(`Rs. ${shippingCharge}`, summaryXVal, currentY, {
          width: summaryWidthVal,
          align: "right",
        });

      currentY += 18;

      // Grand Total Box
      doc
        .rect(340, currentY - 4, 215, 26)
        .fillColor("#fef2f2")
        .fill();

      doc
        .fillColor("#b91c1c")
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("Grand Total:", summaryXLabel, currentY + 3)
        .text(`Rs. ${order.total}`, summaryXVal, currentY + 3, {
          width: summaryWidthVal,
          align: "right",
        });

      currentY += 38;

      // --- FOOTER NOTE ---
      doc
        .fillColor("#6b7280")
        .fontSize(8.5)
        .font("Helvetica-Oblique")
        .text("* Tax included in product price as per GST rules.", 40, currentY)
        .text(
          "Thank you for choosing Kirubai Masala! For queries, contact us at support@kirubaifoods.com",
          40,
          currentY + 14
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
