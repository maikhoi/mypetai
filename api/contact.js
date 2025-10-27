import { MongoClient } from "mongodb";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

let cachedClient = null; // to reuse connection between calls

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (req.body.petname) return res.status(403).json({ success: false, error: "Bot detected" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Missing email address" });

  try {
    const client = await getMongoClient();
    const db = client.db("mypetai"); // you can rename this to "katenails" if you prefer
    const collection = db.collection("subscribers");

    // prevent duplicates
    const existing = await collection.findOne({ email });
    if (existing) return res.status(200).json({ success: true, message: "Already subscribed" });

    // insert new subscriber
    await collection.insertOne({
      email,
      joinedAt: new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" }),
      source: "mypetai.app",
    });

    // send thank-you email
    await resend.emails.send({
      from: "MyPetAI+ <hello@mypetai.app>",
      to: email,
      subject: "🎉 Welcome to MyPetAI+ Early Access!",
      html: `
        <div style="font-family:Poppins,sans-serif;background:linear-gradient(135deg,#fff9e5 0%,#ffe7d4 100%);
                    padding:40px;text-align:center;border-radius:20px;color:#333;">
          <h2 style="color:#f5a623;">🐾 Welcome to MyPetAI+</h2>
          <p style="font-size:1.1rem;">Thanks for joining our Early Access list!<br/>
          You’ll be among the first to try the app and earn bonus Paw Coins when we launch 🐾</p>
          <div style="margin-top:20px;">
            <a href="https://mypetai.app" style="display:inline-block;background:#f5a623;color:white;
              text-decoration:none;padding:12px 24px;border-radius:30px;font-weight:600;">Visit MyPetAI+</a>
          </div>
          <p style="margin-top:30px;font-size:0.85rem;color:#777;">© 2025 MyPetAI+ | Smarter Care for Happier Pets</p>
        </div>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
