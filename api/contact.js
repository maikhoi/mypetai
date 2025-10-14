// /api/contact.js
import { google } from "googleapis";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (req.body.petname) return res.status(403).json({ success: false, error: "Bot detected" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Missing email address" });

  try {
    // --- Google Auth: prefer key file (local dev), fallback to env vars (deploy) ---
    let auth;
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      // Uses the JSON file path (no escaping headaches)
      const googleAuth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      auth = await googleAuth.getClient();
    } else if (process.env.GOOGLE_SHEETS_CLIENT_EMAIL && process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
      // Env string mode (for Vercel deployment)
      auth = new google.auth.JWT(
        process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        undefined,
        process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/\r/g, ""),
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
      await auth.authorize();
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      // Optional: whole JSON stuffed into one env var
      const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      auth = new google.auth.JWT(
        creds.client_email,
        undefined,
        creds.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );
      await auth.authorize();
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        auth = new google.auth.JWT(
          creds.client_email,
          undefined,
          creds.private_key,
          ["https://www.googleapis.com/auth/spreadsheets"]
        );
        await auth.authorize();
      }
      
     else {
      throw new Error("Missing Google credentials. Set GOOGLE_APPLICATION_CREDENTIALS or service account env vars.");
    }

    const sheets = google.sheets({ version: "v4", auth });
    const melTime = new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" });
    
    
    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID,
      range: "A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[email, melTime]] },
    });

    // Send thank-you email
    await resend.emails.send({
      from: "MyPetAI+ <hello@mypetai.app>",
      to: email,
      subject: "🎉 Welcome to MyPetAI+ Early Access!",
      html: `<div style="font-family:Poppins,sans-serif;background:linear-gradient(135deg,#fff9e5 0%,#ffe7d4 100%);padding:40px;text-align:center;border-radius:20px;color:#333;">
               <h2 style="color:#f5a623;">🐾 Welcome to MyPetAI+</h2>
               <p style="font-size:1.1rem;">Thanks for joining our Early Access list!<br/>You’ll be among the first to try the app and earn bonus Paw Coins when we launch 🐾</p>
               <div style="margin-top:20px;">
                 <a href="https://mypetai.app" style="display:inline-block;background:#f5a623;color:#fff;text-decoration:none;padding:12px 24px;border-radius:30px;font-weight:600;">Visit MyPetAI+</a>
               </div>
               <p style="margin-top:30px;font-size:0.85rem;color:#777;">© 2025 MyPetAI+ | Smarter Care for Happier Pets</p>
             </div>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
