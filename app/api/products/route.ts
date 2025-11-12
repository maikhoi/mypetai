export const dynamic = "force-dynamic";  // disable caching
export const revalidate = 300;

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

function rx(v: string) {
  return new RegExp(v, "i");
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const species = searchParams.get("species") || undefined;
    const breedCompatibility = searchParams.get("breedCompatibility") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search")?.trim() || undefined;
    const sortParam = searchParams.get("sort") || "price_asc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    await dbConnect();

    const and: any[] = [];

    // 🐾 Species
    if (species) {
      const r = rx(species);
      and.push({ $or: [{ species: { $in: [r] } }, { species: r }] });
    }

    // 🐠 Breed
    if (breedCompatibility) {
      const r = rx(breedCompatibility);
      and.push({ $or: [{ breedCompatibility: { $in: [r] } }, { breedCompatibility: r }] });
    }

    // 🍽 Category
    if (category) {
      const r = rx(category);
      and.push({ $or: [{ categories: { $in: [r] } }, { category: r }] });
    }

    // 🔍 Search
    if (search) {
      const r = rx(search);
      and.push({ $or: [{ name: r }, { description: r }, { "stores.productTitle": r }] });
    }

    // 🏪 Only MyPetAI Shop products
    and.push({ "stores.storeName": /mypetai shop/i });

    // ✅ Active only
    and.push({ isActive: { $ne: false } });

    const query = and.length ? { $and: and } : {};

    // ✅ Select only essential fields
    const products = await Product.find(query)
      .select("name slug averagePrice digitalAssets.url species categories stores storeName")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 🧮 Sort
    if (sortParam.startsWith("price")) {
      const direction = sortParam.endsWith("_desc") ? -1 : 1;
      products.sort((a: any, b: any) => {
        const minA = Math.min(
          ...(a.stores?.map((s: any) =>
            typeof s.memberPrice === "number"
              ? s.memberPrice
              : typeof s.regularPrice === "number"
              ? s.regularPrice
              : Infinity
          ) || [Infinity])
        );
        const minB = Math.min(
          ...(b.stores?.map((s: any) =>
            typeof s.memberPrice === "number"
              ? s.memberPrice
              : typeof s.regularPrice === "number"
              ? s.regularPrice
              : Infinity
          ) || [Infinity])
        );
        return (minA - minB) * direction;
      });
    } else if (sortParam === "newest") {
      products.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const total = await Product.countDocuments(query);
    const json = JSON.stringify({ success: true, total, page, limit, products });
    console.log("🔍 MyPetAI Shop products:", products.length);
    console.log(`🧮 Payload size: ${(json.length / 1024 / 1024).toFixed(2)} MB`);

    return new NextResponse(json, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Product API error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" });
  }
}
