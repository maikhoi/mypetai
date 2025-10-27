import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

function rx(v: string) {
  return new RegExp(v, "i"); // case-insensitive search
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const species = searchParams.get("species") || undefined;
    const breedCompatibility = searchParams.get("breedCompatibility") || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search")?.trim() || undefined;
    const sortParam = searchParams.get("sort") || "price_asc";

    await dbConnect();

    const and: any[] = [];

    // 🐾 Species filter
    if (species) {
      const r = rx(species);
      and.push({
        $or: [{ species: { $in: [r] } }, { species: r }],
      });
    }

    // 🐠 Breed Compatibility
    if (breedCompatibility) {
      const r = rx(breedCompatibility);
      and.push({
        $or: [{ breedCompatibility: { $in: [r] } }, { breedCompatibility: r }],
      });
    }

    // 🍽 Category
    if (category) {
      const r = rx(category);
      and.push({
        $or: [{ categories: { $in: [r] } }, { category: r }],  
      });
    }

    // 🔍 Product name / description / store product title search
    if (search) {
      const r = rx(search);
      and.push({
        $or: [
          { name: r },
          { description: r },
          { "stores.productTitle": r },
        ],
      });
    }

    // ✅ Always exclude inactive products (unless explicitly allowed)
    and.push({ isActive: { $ne: false } });

    const query = and.length ? { $and: and } : {};
    let products = await Product.find(query).lean();

    // 🧮 Sort by lowest price or newest
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

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("❌ Product API error:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch products",
    });
  }
}
