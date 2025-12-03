import { NextResponse } from 'next/server';
import mongoose from "mongoose";
import { dbConnect } from "@/lib/mongoose";
import { Resend } from 'resend';
import crypto from "crypto";

// ✅ Environment variables
const dbName = process.env.MONGO_DB || 'mypetai';
const resendKey = process.env.RESEND_API_KEY!;

// ✅ Resend client
const resend = new Resend(resendKey);

// ✅ API Route Handler
export async function POST(req: Request) {
  try {
    const { email, source = "homepage" } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    // Connect once via shared mongoose
    await dbConnect();
    const db = mongoose.connection.useDb(dbName);
    const subscribers = db.collection('subscribers');

    const existing = await subscribers.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already subscribed' });
    }

    const token = crypto.randomBytes(16).toString("hex");

    await subscribers.insertOne({
      email,
      source,
      joinedAt: new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Melbourne',
        dateStyle: 'short',
        timeStyle: 'medium',
      }).format(new Date()),
      token, // <-- unique unsubscribe token
    });

    // Build link
    const unsubscribeUrl = `https://mypetai.app/unsubscribe?token=${token}`;

    let subject = "";
    let htmlContent = "";
    let textContent = "";

    // 🎯 1. PetGuess+ Android Waiting List
    if (source === "petguess-page") {
      subject = "📱 You're on the PetGuess+ AI Android Waiting List!";
      
      textContent = [
        'Thanks for your interest in PetGuess+ AI!',
        'You’re now on the notification list for our upcoming Android release.',
        '',
        'PetGuess+ helps you identify your pet’s species & breed from a single photo.',
        'We’ll email you as soon as the Android version is ready.',
        '',
        '— The PetGuess+ Team (part of MyPetAI+)'
      ].join('\n');

      htmlContent = `
        <div style="font-family:Poppins,sans-serif;line-height:1.6;color:#333;">
          <h2>📱 PetGuess+ AI — Android Launch Reminder</h2>
          <p>Thanks for signing up! You’ll be notified the moment our <strong>Android version</strong> is available.</p>
          <p>PetGuess+ helps you identify your pet’s species and breed using AI-powered image recognition.</p>
          <p>We’re excited to bring this to Android soon 💛</p>
          <p>— The PetGuess+ Team</p>
          <p style="margin-top:16px;">Unsubscribe anytime:</p>
          <p><a href="${unsubscribeUrl}" style="color:#f5a623;">Unsubscribe instantly</a></p>
        </div>
      `;
    }


    // 🎯 2. MyPetAI+ Early Access (homepage, coming soon app)
    else {
      subject = "🎉 You’re on the MyPetAI+ Early Access List!";

      textContent = [
        'Welcome to MyPetAI+! You’re on our early access list.',
        'What to expect: smart reminders, AI pet analyzer, and the best pet-care deals.',
        'We’ll email you when we launch.',
        '',
        'Questions? Just reply to this email.',
        '— The MyPetAI+ Team',
      ].join('\n');

      htmlContent = `
        <div style="font-family:Poppins,sans-serif;line-height:1.6;color:#333;">
          <h2>🐾 Welcome to MyPetAI+</h2>
          <p>Thanks for signing up! You’re now part of our early access group — we’ll let you know as soon as we launch.</p>
          <p><strong>Coming soon:</strong><br/>
          🕐 Smart pet reminders<br/>
          🤖 AI Pet Analyzer<br/>
          💰 Best Deal Finder + Paw Coins</p>
          <p>We can’t wait to show you what we’ve built 💛</p>
          <p>— The MyPetAI+ Team</p>
          <p>Unsubscribe anytime:</p>
          <p><a href="${unsubscribeUrl}" style="color:#f5a623;">Unsubscribe instantly</a></p>
        </div>
      `;
    }
    // ✅ Send welcome email
    await resend.emails.send({
      from: 'MyPetAI+ <hello@mypetai.app>',
      to: email,
      replyTo: 'hello@mypetai.app',
      subject,
      headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
      text: textContent,
      html: htmlContent,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Error in /api/contact:', err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
