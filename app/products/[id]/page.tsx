import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import ProductPageClient from "@/components/ProductPageClient"; // your client component
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pet Deals — Compare Pet Food Prices | MyPetAI+",
  description: "Find the best deals on pet food, toys, and supplies from top stores.",
};

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
    await dbConnect();
  
    // ✅ Fetch single product as plain object
    const { id } = await props.params; // ✅ must await params in Next 15
    const product = await Product.findById(id).lean();

  
    if (!product) {
      return <p>Product not found.</p>;
    }
  
    // ✅ Serialize Mongoose ObjectIds, Dates, etc.
    const serialized = JSON.parse(JSON.stringify(product));
  
    return <ProductPageClient product={serialized} />;
  }


 