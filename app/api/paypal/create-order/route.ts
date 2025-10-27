import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product, { ProductDoc } from "@/models/Product";
import {
  getPayPalAccessToken,
  getShippingCost,
  paypalFetch,
} from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { productId, amount, description, quantity = 1, currency = "AUD" } =
      await req.json();

    await dbConnect();
    const product = (await Product.findById(productId).lean()) as ProductDoc | null;
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    const shippingCost = getShippingCost(product);
    const totalAmount = Number(amount) + shippingCost;

    const token = await getPayPalAccessToken();

    const order = await paypalFetch(
      "/v2/checkout/orders",
      "POST",
      token,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: productId,
            description: `${description || product.name} (x${quantity})`,
            amount: {
              currency_code: currency,
              value: totalAmount.toFixed(2),
              breakdown: {
                item_total: { currency_code: currency, value: amount.toFixed(2) },
                shipping: { currency_code: currency, value: shippingCost.toFixed(2) },
              },
            },
          },
        ],
      }
    );

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("PayPal create-order error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
