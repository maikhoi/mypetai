import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    // Case-insensitive match for 'guppy' in breedCompatibility
    const products = await Product.find(
      {
        species: 'fish',
        breedCompatibility: { $elemMatch: { $regex: /^guppy$/i } }, //for guppy, guppies, use { $elemMatch: { $regex: /gupp(y|ies)/i } }
      },
      // projection: only what the PLP needs
      {
        name: 1,
        species: 1,
        breedCompatibility: 1,
        imageUrl: 1,
        averagePrice: 1,
        stores: 1,
      }
    )
      .sort({ name: 1 })
      .lean()
      .limit(200);

    return NextResponse.json({ success: true, products });
  } catch (err) {
    console.error('❌ Error /api/guppy/food:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
