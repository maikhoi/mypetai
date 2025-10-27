import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { DateTime } from "luxon";
import { getAdminUser } from "@/lib/userAuth"; // optional if you track who added

// ✅ Helper to get Melbourne-local time
function getMelbourneDate() {
  const mel = DateTime.now().setZone("Australia/Melbourne");
  return mel.toJSDate();
}

// 🆕 CREATE new product
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Optional: track admin user who added
    let createdBy = "admin";
    try {
      const user = await getAdminUser();
      if (user?.username) createdBy = user.username;
    } catch {}

    // 🧠 Normalize arrays (in case frontend sends single strings)
    const normalizeArray = (value: any) => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return [value];
    };

    body.species = normalizeArray(body.species);
    body.categories = normalizeArray(body.categories);
    body.breedCompatibility = normalizeArray(body.breedCompatibility);

    const now = getMelbourneDate();

    // 🏬 If no store data, at least add one placeholder
    if (!body.stores || body.stores.length === 0) {
      body.stores = [
        {
          storeName: "MyPetAI Shop",
          productUrl: "https://mypetai.app/local-product",
          productImageUrl: body.imageUrl || "https://mypetai.app/placeholder.png",
          regularPrice: body.averagePrice || 0,
          lastUpdated: now,
        },
      ];
    } else {
      body.stores = body.stores.map((s: any) => ({
        ...s,
        lastUpdated: now,
      }));
    }

    body.createdAt = now;
    body.updatedAt = now;
    body.updatedBy = createdBy;

    const product = await Product.create(body);

    return NextResponse.json({
      success: true,
      product,
      message: `✅ Created at ${now.toISOString()} (Melbourne time stored)`,
    });
  } catch (error: any) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// (Optional) GET all products — useful for debugging
export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}, { name: 1, species: 1 })
      .sort({ name: 1 })
      .lean();
    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
