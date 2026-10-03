import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function parseItems(items: any) {
  if (typeof items === "string") {
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }
  return items || [];
}

function buildEmailHtml(order: any, title: string, subtitle: string, accentColor = "#b91c1c") {
  const items = parseItems(order.items);
  const itemsHtml = items
    .map(
      (item: any) => `
      <tr>
        <td style="padding:10px; border-bottom:1px solid #eee; color:#333;">${item.name}</td>
        <td style="padding:10px; border-bottom:1px solid #eee; text-align:center; color:#333;">${item.quantity}</td>
        <td style="padding:10px; border-bottom:1px solid #eee; text-align:right; color:#333;">₹${item.price}</td>
        <td style="padding:10px; border-bottom:1px solid #eee; text-align:right; color:#333; font-weight:bold;">₹${item.price * item.quantity}</td>
      </tr>
    `
    )
    .join("");

  const shipping = order.shipping ?? 0;
  const productTotal = order.total - shipping;
  const subtotal = order.subtotal ?? Math.round(productTotal / 1.18);
  const gst = order.gst ?? Number((productTotal - subtotal).toFixed(2));
  const invoiceNo =
    order.invoiceNumber || `INV-${order.id.slice(-6).toUpperCase()}`;
  const displayOrderId = `ORD-${order.id.slice(-8).toUpperCase()}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
      <!-- Header -->
      <div style="background-color: ${accentColor}; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Kirubai Masala</h1>
        <p style="margin: 4px 0 0 0; font-size: 14px; opacity: 0.9;">Authentic Homemade Spices</p>
      </div>

      <!-- Title & Greeting -->
      <div style="padding: 24px;">
        <h2 style="color: ${accentColor}; margin-top: 0;">${title}</h2>
        <p style="color: #374151; font-size: 15px; line-height: 1.5;">Hello <strong>${order.name}</strong>,</p>
        <p style="color: #374151; font-size: 15px; line-height: 1.5;">${subtitle}</p>

        <!-- Order Meta Badge -->
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px 16px; margin: 16px 0; font-size: 14px; color: #4b5563;">
          <p style="margin: 4px 0;"><strong>Order ID:</strong> ${displayOrderId}</p>
          <p style="margin: 4px 0;"><strong>Invoice Number:</strong> ${invoiceNo}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="display:inline-block; padding:2px 8px; background:#fee2e2; color:${accentColor}; border-radius:4px; font-weight:bold;">${order.status}</span></p>
          ${order.estimatedDelivery ? `<p style="margin: 4px 0; color:#15803d;"><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>` : ''}
        </div>

        <!-- Address -->
        <h3 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Delivery Address</h3>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 4px 0;">
          ${order.name}<br/>
          📞 ${order.phone}<br/>
          📍 ${order.address}${order.city ? `, ${order.city}` : ''}${order.state ? `, ${order.state}` : ''}${order.pincode ? ` - ${order.pincode}` : ''}
        </p>

        <!-- Ordered Products -->
        <h3 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 24px;">Ordered Items</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 12px;">
          <thead>
            <tr style="background-color: #f3f4f6; text-align: left; color: #374151;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <!-- Summary -->
        <div style="margin-top: 20px; text-align: right; font-size: 14px; color: #4b5563;">
          <p style="margin: 4px 0;">Product Subtotal: <strong>₹${subtotal}</strong></p>
          <p style="margin: 4px 0;">GST (18% included): <strong>₹${gst}</strong></p>
          <p style="margin: 4px 0;">Shipping Charge: <strong>₹${shipping}</strong></p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 8px 0;"/>
          <p style="margin: 8px 0; font-size: 18px; color: ${accentColor}; font-weight: bold;">Grand Total: ₹${order.total}</p>
        </div>

        <p style="color: #6b7280; font-size: 13px; margin-top: 24px; border-top: 1px solid #f3f4f6; pt-16;">
          Thank you for ordering with Kirubai Masala! If you have any questions, reply directly to this email or contact support.
        </p>
      </div>
    </div>
  `;
}

// 1. Order Placed / Confirmed Email
export async function sendOrderEmail(order: any) {
  try {
    const html = buildEmailHtml(
      order,
      "Order Placed Successfully 🎉",
      "Thank you for your order! We have received your request and are processing it."
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Order Received - Kirubai Masala (${order.invoiceNumber || order.id})`,
      html,
    });
  } catch (error) {
    console.error("Order Email failed:", error);
  }
}

// 2. Order Confirmed Email
export async function sendConfirmedEmail(order: any) {
  try {
    const html = buildEmailHtml(
      order,
      "Order Confirmed ✅",
      "Your payment/order details have been successfully verified and confirmed!"
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Order Confirmed - Kirubai Masala (${order.invoiceNumber || order.id})`,
      html,
    });
  } catch (error) {
    console.error("Confirmed Email failed:", error);
  }
}

// 3. Order Processing Email
export async function sendProcessingEmail(order: any) {
  try {
    const html = buildEmailHtml(
      order,
      "Order Processing 📦",
      "Great news! Your order is currently being prepared and packed with fresh homemade spices."
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Order Processing - Kirubai Masala (${order.invoiceNumber || order.id})`,
      html,
    });
  } catch (error) {
    console.error("Processing Email failed:", error);
  }
}

// 4. Order Shipped Email
export async function sendShippedEmail(order: any) {
  try {
    const html = buildEmailHtml(
      order,
      "Order Shipped 🚚",
      "Your order has been handed over to our delivery partner and is on its way to you!"
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Your Order is Shipped 🚚 - Kirubai Masala`,
      html,
    });
  } catch (error) {
    console.error("Shipped Email Error:", error);
  }
}

// 5. Order Delivered Email
export async function sendDeliveredEmail(order: any) {
  try {
    const html = buildEmailHtml(
      order,
      "Order Delivered ✅",
      "Your order has been successfully delivered! We hope you enjoy our authentic spices."
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Order Delivered ✅ - Kirubai Masala`,
      html,
    });
  } catch (error) {
    console.error("Delivered Email Error:", error);
  }
}

// 6. Order Cancelled Email
export async function sendCancelledEmail(order: any) {
  try {
    const html = buildEmailHtml(
      order,
      "Order Cancelled ❌",
      "Your order has been cancelled. If you have any questions or require assistance, please contact customer care.",
      "#dc2626"
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: order.email,
      subject: `Order Cancelled - Kirubai Masala`,
      html,
    });
  } catch (error) {
    console.error("Cancelled Email Error:", error);
  }
}