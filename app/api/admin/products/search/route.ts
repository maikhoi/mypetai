import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() || "";

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, products: [] });
  }

  const products = await Product.find({
    name: { $regex: q, $options: "i" }
  })
    .select("_id name species categories")
    .limit(20)
    .lean();

  return NextResponse.json({ success: true, products });
}
