import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB || "mypetai";

let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  if (!cachedPromise) {
    const client = new MongoClient(uri);
    cachedPromise = client.connect().then((client) => {
      cachedClient = client;
      return client;
    });
  }
  return cachedPromise;
}

// ✅ one-click GET handler
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) return NextResponse.json({ success: false, error: "Missing token" }, { status: 400 });

    const client = await connectToDatabase();
    const db = client.db(dbName);
    const collection = db.collection("subscribers");

    const result = await collection.updateOne({ token }, { $set: { unsubscribed: true } });
    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Invalid or already unsubscribed" });
    }

    return NextResponse.redirect("/unsubscribe?success=1");
  } catch (error) {
    console.error("Error in /api/unsubscribe (GET):", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// ✅ manual POST handler (for form)
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ success: false, error: "Missing email" }, { status: 400 });

    const client = await connectToDatabase();
    const db = client.db(dbName);
    const collection = db.collection("subscribers");

    const result = await collection.updateOne({ email }, { $set: { unsubscribed: true } });
    if (result.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: "Email not found" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/unsubscribe (POST):", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
