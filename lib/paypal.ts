import { ProductDoc } from "@/models/Product";

const PAYPAL_ENV = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
export const PAYPAL_BASE =
  PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";


    /** 🚚 Determine if product is sold by MyPetAI Shop */
    export function isSoldByMyPetAI(product: ProductDoc): boolean {
        const myShop = (process.env.MYPETAI_SHOP_NAME || "MyPetAI Shop").toLowerCase();
        return product.stores?.some(
          (s) => s.storeName?.trim().toLowerCase() === myShop
        );
      }
      

/** 🔐 Get a short-lived OAuth access token */
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`PayPal token error: ${errBody}`);
  }

  const data = await res.json();
  if (!data.access_token) throw new Error("Missing PayPal access token");
  return data.access_token as string;
}

/** 💵 Get shipping cost (flat $19.99 if MyPetAI product) */
export function getShippingCost(product: ProductDoc): number {
  return isSoldByMyPetAI(product) ? 0 : 99;
}

/** 🧾 Helper to call PayPal API endpoints with automatic headers */
export async function paypalFetch<T = any>(
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  token: string,
  body?: any
): Promise<T> {
  const res = await fetch(`${PAYPAL_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("PayPal API error:", data);
    throw new Error(data?.message || "PayPal API request failed");
  }
  return data;
}
