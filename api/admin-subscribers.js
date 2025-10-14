import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

let cachedClient = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

// simple access token (you can use something more secure later)
const ADMIN_KEY = process.env.ADMIN_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // ✅ basic security check
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token !== ADMIN_KEY) return res.status(401).json({ error: "Unauthorized" });

  try {
    const client = await getMongoClient();
    const db = client.db("mypetai");
    const collection = db.collection("subscribers");
    const subs = await collection.find().sort({ joinedAt: -1 }).toArray();

    res.status(200).json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
