import Product from "@/models/Product";
import Menu from "@/models/Menu";
import { dbConnect } from "@/lib/mongoose";

export async function buildPetMenu() {
  await dbConnect();

  const products = await Product.find({ isActive: { $ne: false } })
    .select("species breedCompatibility categories")
    .lean();

  const menu: Record<string, Record<string, Set<string>>> = {};

  for (const p of products) {
    const speciesArr = p.species || [];
    const breeds = p.breedCompatibility?.length ? p.breedCompatibility : ["Generic"];
    const categories = p.categories?.length ? p.categories : ["Uncategorized"];

    for (const s of speciesArr) {
      if (!menu[s]) menu[s] = {};
      for (const b of breeds) {
        if (!menu[s][b]) menu[s][b] = new Set();
        for (const c of categories) menu[s][b].add(c);
      }
    }
  }

  const result = Object.entries(menu).map(([species, breeds]) => ({
    species,
    breeds: Object.entries(breeds).map(([breed, cats]) => ({
      breed,
      categories: Array.from(cats),
    })),
  }));

  // 🧾 Save to Menu collection
  await Menu.findOneAndUpdate(
    { type: "pet" },
    { items: result, lastBuilt: new Date() },
    { upsert: true, new: true }
  );

  return result;
}
