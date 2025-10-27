import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET() {
  await dbConnect();

  // Get only active products
  const products = await Product.find({ isActive: { $ne: false } })
    .select("species breedCompatibility categories")
    .lean();

  // 🧠 Build dynamic menu tree
  const menu: Record<string, Record<string, Set<string>>> = {};

  for (const p of products) {
    const speciesArr = p.species || [];
    const breeds = p.breedCompatibility?.length ? p.breedCompatibility : ["Generic"];
    const categories = p.categories?.length ? p.categories : ["Uncategorized"];

    for (const s of speciesArr) {
      if (!menu[s]) menu[s] = {};
      for (const b of breeds) {
        if (!menu[s][b]) menu[s][b] = new Set();
        for (const c of categories) {
          menu[s][b].add(c);
        }
      }
    }
  }

  // 🧩 Convert Sets to arrays for JSON
  const result = Object.entries(menu).map(([species, breeds]) => ({
    species,
    breeds: Object.entries(breeds).map(([breed, cats]) => ({
      breed,
      categories: Array.from(cats),
    })),
  }));

  return NextResponse.json(result);
}
