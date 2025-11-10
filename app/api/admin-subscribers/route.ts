import { NextResponse } from 'next/server';
import mongoose from "mongoose";
import { getAdminUser } from "@/lib/userAuth";
import { dbConnect } from "@/lib/mongoose";

const dbName = process.env.MONGO_DB || 'mypetai';

export async function GET(req: Request) {
  try {
    const session = await getAdminUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // ✅ Reuse existing Mongoose connection
    await dbConnect();

    // ✅ Use native MongoDB driver via Mongoose
    const db = mongoose.connection.useDb(dbName);
    const subscribers = db.collection("subscribers");


    const data = await subscribers
      .find({}, { projection: { _id: 0 } })
      .sort({ joinedAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ Error in /api/admin-subscribers:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
