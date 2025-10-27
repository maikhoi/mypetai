import { dbConnect } from "@/lib/mongoose";
import Product from "@/models/Product";
import ProductPageClient from "@/components/ProductPageClient"; // your client component


export default async function ProductPage({ params }: { params: { id: string } }) {
    await dbConnect();
  
    // ✅ Fetch single product as plain object
    const { id } = await params;
const product = await Product.findById(id).lean();

  
    if (!product) {
      return <p>Product not found.</p>;
    }
  
    // ✅ Serialize Mongoose ObjectIds, Dates, etc.
    const serialized = JSON.parse(JSON.stringify(product));
  
    return <ProductPageClient product={serialized} />;
  }


 