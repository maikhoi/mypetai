import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    // Use name instead of title
    const products = await Product.find({}, { _id: 1, name: 1, stores:1 })
      .sort({ name: 1 })
      .lean();

    // Make sure everything has a string name and ID
    const safeList = products.map((p: any) => {
      const storeNames = p.stores?.map((s: any) => s.storeName).join(", ") || "No Store";
      return {
        _id: p._id.toString(),
        name: `${storeNames} - ${p.name || "(No name)"}`,
      };
    });

    return NextResponse.json({ success: true, products: safeList });
  } catch (err) {
    console.error("❌ Error loading product list:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load products" },
      { status: 500 }
    );
  }
}
