import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
//import { getServerSession } from "next-auth";

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }  // ✅ must be a Promise
  ) {
    const { id } = await context.params; // ✅ await it here
  await dbConnect();

  const { name, rating, comment } = await req.json();
  const session = null;//await getServerSession();

  //if (!session?.user) {
    //return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  //}

  const product = await Product.findById(id);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  product.reviews.push({
    //userId: session.user.id,
    name,
    rating,
    comment,
  });

  product.updateRating?.();
  await product.save();

  return NextResponse.json({ success: true });
}
