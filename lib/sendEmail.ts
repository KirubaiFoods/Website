import nodemailer from "nodemailer";
import puppeteer from "puppeteer";


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOrderEmail(order: any) {
  try {
    const itemsHtml = order.items
  ?.map(
    (item: any) => `
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">${item.name}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:center;">${item.quantity}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:right;">₹${item.price}</td>
        <td style="padding:8px; border:1px solid #ddd; text-align:right;">₹${item.price * item.quantity}</td>
      </tr>
    `
  )
  .join("");
  const invoiceNumber = "INV-" + Date.now();
const orderId = "ORD-" + order.id.slice(-8).toUpperCase();
  const formattedDate = new Date().toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const shipping = order.shipping ?? 0; 

const productTotal = order.total - shipping;

const gstRate = 0.18;

const subtotal = Math.round(productTotal / (1 + gstRate));
const gst = productTotal - subtotal;

const cgst = gst / 2;
const sgst = gst / 2;


    // 🧾 Invoice HTML
    const html = `
 <div style="display:flex; justify-content:space-between; align-items:center;">

  <!-- LEFT -->
  <div style="display:flex; align-items:center; gap:10px;">
    <img src="https://i.ibb.co/8gwhLSQ9/logo.jpg" height="50" />

    <div>
      <h1 style="color:#b91c1c; margin:0;">Kirubai Masala</h1>
      <p style="font-size:12px; margin:0;">Authentic Homemade Spices</p>
    </div>
  </div>

  <!-- RIGHT -->
  <div style="text-align:right; font-size:14px;">
    <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
  </div>

</div>

<hr/>
<div style="margin-top:10px; font-size:13px;">
  <p><strong>GSTIN:</strong> 33ABCDE1234F1Z5 (Dummy)</p>
  <p><strong>Place of Supply:</strong> ${order.state}</p>
</div>

<hr/>

    <h3 style="margin-top:20px;">Customer Details</h3>

<p><strong>Name:</strong> ${order.name}</p>
<p><strong>Phone:</strong> ${order.phone}</p>
<p><strong>Email:</strong> ${order.email}</p>
<p><strong>Address:</strong> ${order.address}</p>

<hr/>

    <h3 style="margin-top:20px;">Order Summary</h3>

<table style="width:100%; border-collapse:collapse; font-size:14px;">
  <thead>
    <tr style="background:#f3f3f3;">
      <th style="padding:10px; border:1px solid #ddd; text-align:left;">Product</th>
      <th style="padding:10px; border:1px solid #ddd;">Qty</th>
      <th style="padding:10px; border:1px solid #ddd;">Price</th>
      <th style="padding:10px; border:1px solid #ddd;">Total</th>
    </tr>
  </thead>

  <tbody>
    ${itemsHtml}
  </tbody>
</table>
    <br/>

    <div style="margin-top:20px; text-align:right; font-size:14px;">

  <p><strong>Product Subtotal:</strong> ₹${subtotal}</p>
  <p><strong>CGST (9%):</strong> ₹${cgst.toFixed(2)}</p>
  <p><strong>SGST (9%):</strong> ₹${sgst.toFixed(2)}</p>

  <p><strong>Shipping Charges:</strong> ₹${shipping}</p>

  <hr/>

  <h2 style="color:#b91c1c;">
    Grand Total: ₹${order.total}
  </h2>

</div>

<p style="font-size:12px; color:#555; margin-top:10px;">
  *GST included in product pricing as per Indian taxation rules.
</p>
<p><strong>Sold By:</strong> Kirubai Masala</p>
<p><strong>GSTIN:</strong> 33ABCDE1234F1Z5 (Dummy)</p>
<p><strong>HSN Code:</strong> 0910 (Spices)</p>
`;

    // 🧾 Generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // 📧 Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: "Your Order has been placed - Kirubai Masala",

      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2 style="color:#b91c1c;">Kirubai Masala</h2>

          <p>Hello ${order.name},</p>
          <p>Your order has been placed successfully 🎉</p>

          <p>📎 Please find your invoice attached.</p>

          <p>– Team Kirubai</p>
        </div>
      `,

      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer as Buffer,
        },
      ],
    });

  } catch (error) {
    console.error("Email with PDF failed:", error);
  }
}
export async function sendShippedEmail(order: any) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: "Your Order has been Shipped 🚚",
      html: `
        <div style="font-family: Arial;">
          <h2 style="color:#b91c1c;">Kirubai Masala</h2>

          <p>Hello ${order.name},</p>

          <p>📦 Your order has been shipped!</p>


          <p><strong>Order ID:</strong> ${order.id}</p>

          <p>It will reach you soon.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Shipped Email Error:", error);
  }
}
export async function sendDeliveredEmail(order: any) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: "Your Order has been Delivered ✅",
      html: `
        <div style="font-family: Arial;">
          <h2 style="color:#b91c1c;">Kirubai Masala</h2>

          <p>Hello ${order.name},</p>

          <p>✅ Your order has been delivered successfully!</p>

          <p>We hope you enjoy it ❤️</p>

          <p>Thank you for your support 🙏</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Delivered Email Error:", error);
  }
}