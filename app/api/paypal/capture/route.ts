import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product, { ProductDoc } from "@/models/Product";
import Order, { OrderDoc } from "@/models/Order";
import {
  getPayPalAccessToken,
  getShippingCost,
  PAYPAL_BASE,
} from "@/lib/paypal";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailParams {
  to: string;
  buyerName: string;
  orderID: string;
  product: ProductDoc;
  quantity: number;
  amount: number;
  shippingCost: number;
  shippingAddress?: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    countryCode: string;
  };
}

function getMyPetAIShopMemberPrice(product: ProductDoc): number {
  const stores = (product as any).stores as
    | { storeName: string; memberPrice?: number; salePrice?: number; price?: number }[]
    | undefined;

  if (!stores || !Array.isArray(stores)) return 0;

  const mypetaiStore = stores.find(
    (s) => s.storeName?.toLowerCase() === "mypetai shop"
  );

  if (!mypetaiStore) return 0;

  // Prefer memberPrice, then salePrice, then price
  return (
    (mypetaiStore.memberPrice ??
      mypetaiStore.salePrice ??
      mypetaiStore.price ??
      0)
  );
}


async function sendOrderConfirmationEmail(params: OrderEmailParams) {
  const {
    to,
    buyerName,
    orderID,
    product,
    quantity,
    amount,
    shippingCost,
    shippingAddress,
  } = params;
  const memberPrice = getMyPetAIShopMemberPrice(product);
  try {
    const html = `
      <h2>🐾 Thanks for your purchase!</h2>

      <p>Hi <strong>${buyerName}</strong>,</p>
      <p>Your payment has been successfully captured. Here are your order details:</p>

      <h3>🛒 Order Summary</h3>
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>Quantity:</strong> ${quantity}</p>
      <p><strong>Product Price:</strong> $${memberPrice.toFixed(2)}</p>
      <p><strong>Shipping Cost:</strong> $${shippingCost.toFixed(2)}</p>
      <p><strong>Total Paid:</strong> $${amount.toFixed(2)}</p>
      <p><strong>PayPal Order ID:</strong> ${orderID}</p>

      <h3>📦 Shipping Details</h3>
      ${
        shippingAddress
          ? `
          <p>${shippingAddress.fullName}</p>
          <p>${shippingAddress.line1}${shippingAddress.line2 ? `, ${shippingAddress.line2}` : ""}</p>
          <p>${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}</p>
          <p>${shippingAddress.countryCode}</p>
        `
          : "<p>No shipping address provided.</p>"
      }

      <br>
      <p>Thank you for shopping at <strong>MyPetAI Shop</strong> 🐶🐱🐟</p>
      <p style="font-size: 12px; color: #999;">This is an automated email from MyPetAI. Please do not reply.</p>
    `;

    await resend.emails.send({
      from: "MyPetAI Shop <noreply@mypetai.app>",
      to,
      subject: `🐾 Your MyPetAI Order Confirmation – ${product.name}`,
      html,
    });

    return { success: true };
  } catch (err) {
    console.error("❌ sendOrderConfirmationEmail error:", err);
    return { success: false, error: "Failed to send email" };
  }
}

export async function POST(req: Request) {
  try {
    const { orderID, productId, quantity = 1 } = await req.json();

    await dbConnect();
    const product = (await Product.findById(productId).lean()) as ProductDoc | null;
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const shippingCost = getShippingCost(product);
    const token = await getPayPalAccessToken();

    // ✅ Capture order
    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "PayPal capture failed");

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const amount = parseFloat(capture?.amount?.value || "0");
    const status = capture?.status || "UNKNOWN";
    const buyerEmail = data?.payer?.email_address;
    const buyerName = `${data?.payer?.name?.given_name || ""} ${data?.payer?.name?.surname || ""}`.trim();

    const shipping = data?.purchase_units?.[0]?.shipping;
    const shippingAddress = shipping
      ? {
          fullName: shipping?.name?.full_name,
          line1: shipping?.address?.address_line_1,
          line2: shipping?.address?.address_line_2,
          city: shipping?.address?.admin_area_2,
          state: shipping?.address?.admin_area_1,
          postalCode: shipping?.address?.postal_code,
          countryCode: shipping?.address?.country_code,
        }
      : undefined;

    const newOrder: OrderDoc = await Order.create({
      productId,
      paypalOrderId: orderID,
      amount,
      quantity,
      shippingCost,
      buyerEmail,
      buyerName,
      shippingAddress,
      status,
    });

    // ✉️ Send email
    await sendOrderConfirmationEmail({
      to: buyerEmail,
      buyerName,
      orderID,
      product,
      quantity,
      amount,
      shippingCost,
      shippingAddress,
    });

    return NextResponse.json({
      success: true,
      orderID,
      status,
      buyerEmail,
      order: newOrder,
    });
  } catch (error: any) {
    console.error("PayPal capture error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
