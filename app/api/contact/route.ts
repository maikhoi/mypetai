import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";

const resendKey = process.env.RESEND_API_KEY!;
const resend = new Resend(resendKey);

const CONTACT_TO = "hello@mypetai.app";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message, petname } = await req.json();

    // Honeypot: if this is filled, treat as spam and bail out silently
    if (petname && String(petname).trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    if (!email || !email.includes("@") || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 }
      );
    }

    const safeName = (name || "").toString().trim() || "Anonymous";
    const safeSubject =
      (subject || "").toString().trim() || "New contact from MyPetAI+ site";

    const bodyText = [
      `New contact message from MyPetAI+ website`,
      "",
      `Name: ${safeName}`,
      `Email: ${email}`,
      `Subject: ${safeSubject}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const bodyHtml = `
      <div style="font-family:Poppins,sans-serif;line-height:1.6;color:#333;">
        <h2>New contact message from MyPetAI+ website</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong><br/>${String(message)
          .replace(/\n/g, "<br/>")
          .trim()}</p>
      </div>
    `;

    await resend.emails.send({
      from: "MyPetAI+ <hello@mypetai.app>",
      to: CONTACT_TO,
      replyTo: email, // so you can just hit reply in your inbox
      subject: `📩 ${safeSubject}`,
      text: bodyText,
      html: bodyHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Error in /api/contact:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}