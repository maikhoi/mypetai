import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import { DateTime } from "luxon";
import { getAdminUser } from "@/lib/userAuth";

const ADMIN_KEY = process.env.ADMIN_KEY!;

/** Returns a Date that stores Melbourne local wall-clock time (not UTC) */
function getMelbourneDate() {
  const mel = DateTime.now().setZone("Australia/Melbourne");
  const fixed = mel.plus({ minutes: mel.offset }).toJSDate();
  return fixed;
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await dbConnect();

    // 🆕 If the request is for dropdown options
    if (id === "options") {
      const allProducts = await Product.find({}, {
        species: 1,
        categories: 1,
        breedCompatibility: 1,
      });

      const speciesSet = new Set<string>();
      const categorySet = new Set<string>();
      const breedSet = new Set<string>();

      allProducts.forEach((p) => {
        (p.species || []).forEach((s: string) => speciesSet.add(s));
        (p.categories || []).forEach((c: string) => categorySet.add(c));
        (p.breedCompatibility || []).forEach((b: string) => breedSet.add(b));
      });

      return NextResponse.json({
        success: true,
        species: Array.from(speciesSet).sort(),
        categories: Array.from(categorySet).sort(),
        breeds: Array.from(breedSet).sort(),
      });
    }

    // 🧩 Otherwise, load a single product by ID
    const product = await Product.findById(id).lean();

    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await context.params;
    const body = await req.json();
    await dbConnect();

    const melDate = getMelbourneDate();
    const melReadable = melDate.toISOString();

    if (Array.isArray(body.stores)) {
      body.stores = body.stores.map((s: any) => ({
        ...s,
        lastUpdated: melDate,
      }));
    }
    // 🧩 Track who updated it
    body.updatedBy = admin?.username || "unknown";;
    body.updatedAt = melDate;


    console.log("🧩 PUT product payload:", body);
    console.log("Types:", {
      species: typeof body.species,
      categories: typeof body.categories,
      breedCompatibility: typeof body.breedCompatibility,
    });
    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      product: updated,
      message: `✅ Updated at ${melReadable} (Melbourne time stored) by ${admin.username}`,
    });
  } catch (err: any) {
    console.error("❌ Product update failed:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const { url, type } = await req.json();
    if (!url) {
      return NextResponse.json({ success: false, message: "Missing URL" });
    }

    const res = await fetch(url, { method: type === "image" ? "GET" : "HEAD" });
    return NextResponse.json({ success: res.ok });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
