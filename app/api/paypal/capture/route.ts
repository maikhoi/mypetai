import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product, { ProductDoc } from "@/models/Product";
import Order, { OrderDoc } from "@/models/Order";
import {
  getPayPalAccessToken,
  getShippingCost,
  PAYPAL_BASE,
} from "@/lib/paypal";

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
