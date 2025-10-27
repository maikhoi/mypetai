import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getAdminUser } from "@/lib/userAuth";

const uri = process.env.MONGO_URI!;
const dbName = process.env.MONGO_DB || 'mypetai';
const adminKey = process.env.ADMIN_KEY!;

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

export async function GET(req: Request) {
  try {
    const session = await getAdminUser();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });


    const client = await connectToDatabase();
    const db = client.db(dbName);
    const subscribers = db.collection('subscribers');

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
