import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, productName, storeName, type } = await req.json();

    if (!name || !email || !productName || !storeName) {
      return NextResponse.json({ success: false, error: "Missing fields" });
    }

    // ✉️ Send email
    await resend.emails.send({
      from: "MyPetAI Support <noreply@mypetai.app>",
      to: "support@mypetai.app",
      subject: "🐾 Price Sync Feedback Received",
      html: `
        <h2>🐾 New Price Issue Report</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Store:</strong> ${storeName}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p>Captured at: ${new Date().toLocaleString("en-AU", { timeZone: "Australia/Melbourne" })}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Feedback error:", err);
    return NextResponse.json({ success: false, error: "Failed to send" });
  }
}
