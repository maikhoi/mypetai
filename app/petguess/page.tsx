"use client";

import { useState } from "react";

export default function PetGuessPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return alert("Please enter a valid email.");

    try {
      setLoading(true);
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "petguess-page" }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.ok)) {
        alert("✅ Thanks! You’ll get PetGuess+ updates.");
        setEmail("");
      } else {
        alert("⚠️ Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("⚠️ Network error — please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pg-root">
      {/* HERO */}
      <section className="pg-hero">
        <div className="pg-hero-text">
          <h1>
            📱 <span>PetGuess+ AI</span>
          </h1>
          <p className="pg-hero-sub">
            Snap a photo. Let AI guess your pet’s species and breed.  
            Built to help curious pet owners and hobby breeders understand their animals better.
          </p>

          <div className="pg-hero-ctas">
            <a
              href="https://apps.apple.com/us/app/petguess-ai/id6755983803"
              target="_blank"
              className="pg-btn primary"
            >
              🍏 Download on the App Store
            </a>
            <span className="pg-platform-note">Android version coming soon.</span>
          </div>

          <div className="pg-tagline">
            Part of the <a href="/">MyPetAI+</a> ecosystem — powering smarter pet care across web and mobile.
          </div>
        </div>

        {/* Simple phone mockup / placeholder */}
        <div className="pg-hero-mock">
          <div className="pg-phone-frame">
            <div className="pg-phone-screen">
              <div className="pg-screen-header">PetGuess+ AI</div>
              <div className="pg-screen-body">
                <div className="pg-photo-placeholder">Your Pet Photo</div>
                <div className="pg-result-card">
                  <div className="pg-result-label">Detected:</div>
                  <div className="pg-result-breed">🐶 Dog — Kuvasz (example)</div>
                  <div className="pg-result-note">Tap to confirm or pick another breed.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS PETGUESS */}
      <section className="pg-section">
        <h2>What is PetGuess+ AI?</h2>
        <p className="pg-section-text">
          <strong>PetGuess+ AI</strong> is a mobile app that uses AI and ONNX models to identify your pet’s
          species and likely breed from a single photo. Whether you adopted a rescue dog, bought a mystery fish,
          or are just curious about your cat’s background, PetGuess+ helps you get answers in seconds.
        </p>
      </section>

      {/* FEATURES */}
      <section className="pg-section">
        <h2>Key Features</h2>
        <div className="pg-grid">
          <div className="pg-card">
            <h3>📸 Instant Species & Breed Detection</h3>
            <p>
              Take or upload a photo and let PetGuess+ analyse it using an ONNX-powered model to estimate
              the species and likely breed.
            </p>
          </div>
          <div className="pg-card">
            <h3>🧠 Learns from User Feedback</h3>
            <p>
              When you confirm or correct the result, your feedback helps improve the shared knowledge base,
              making predictions smarter over time.
            </p>
          </div>
          <div className="pg-card">
            <h3>📚 Smart Care Hints</h3>
            <p>
              For recognised breeds, PetGuess+ can connect into the wider MyPetAI+ knowledge base to surface
              helpful care tips, feeding hints, and things to watch out for.
            </p>
          </div>
          <div className="pg-card">
            <h3>🎯 Designed for Real Pet Owners</h3>
            <p>
              Built for everyday pet parents and hobby keepers — from dogs and cats to fish and small pets —
              with a simple, friendly UI.
            </p>
          </div>
          <div className="pg-card">
            <h3>🔄 Evolving AI Models</h3>
            <p>
              Behind the scenes, PetGuess+ connects to models and datasets that are actively maintained and expanded
              as new photos and feedback come in.
            </p>
          </div>
          <div className="pg-card">
            <h3>🔐 Privacy First</h3>
            <p>
              Photos are processed for breed detection and not used for marketing. The focus is on improving
              accuracy and your experience, not selling your data.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="pg-section">
        <h2>How It Works</h2>
        <ol className="pg-steps">
          <li>
            <strong>Take or upload a photo</strong> of your pet in good lighting, with the animal clearly visible.
          </li>
          <li>
            <strong>AI analyses the image</strong> and predicts the species and most likely breed candidates.
          </li>
          <li>
            <strong>You confirm or adjust</strong> the result if you know your pet’s breed, or explore the suggestions.
          </li>
          <li>
            <strong>PetGuess+ learns</strong> from confirmed results to refine future predictions.
          </li>
          <li>
            <strong>Optionally, explore care hints</strong> for that species/breed through the wider MyPetAI+ ecosystem.
          </li>
        </ol>
      </section>

      {/* SCREENSHOT PLACEHOLDERS */}
      <section className="pg-section">
        <h2>App Preview</h2>
        <p className="pg-section-text pg-section-text-center">
          These are example layouts — in the live app you’ll see real detection results, breed images, and care hints.
        </p>
        <div className="pg-screens">
          <div className="pg-screen-card">
            <div className="pg-screen-title">1. Home / Capture</div>
            <div className="pg-screen-box">Upload or snap a pet photo.</div>
          </div>
          <div className="pg-screen-card">
            <div className="pg-screen-title">2. Detection Result</div>
            <div className="pg-screen-box">AI suggests species & breed.</div>
          </div>
          <div className="pg-screen-card">
            <div className="pg-screen-title">3. Breed Details</div>
            <div className="pg-screen-box">View basic info and tips.</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pg-section">
        <h2>FAQ</h2>
        <div className="pg-faq">
          <details>
            <summary>Does PetGuess+ save my photos?</summary>
            <p>
              Photos are used for AI analysis and improvements, not for advertising. Where possible, processing is kept lean and focused on
              model accuracy and user experience.
            </p>
          </details>
          <details>
            <summary>Which animals can PetGuess+ recognise?</summary>
            <p>
              The app is primarily focused on common pets like dogs, cats, fish, and small animals. Over time, more species and breeds will be
              added as the dataset grows.
            </p>
          </details>
          <details>
            <summary>How accurate is the AI?</summary>
            <p>
              Accuracy depends on photo quality, lighting, and how common the breed is in the training data. That’s why your confirmations
              and corrections are important — they help improve the model.
            </p>
          </details>
          <details>
            <summary>Is there an Android version?</summary>
            <p>
              An Android version is planned. Leave your email below and you’ll be notified when it’s ready.
            </p>
          </details>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="pg-section pg-bottom-cta">
        <h2>Get PetGuess+ AI</h2>
        <p className="pg-section-text pg-section-text-center">
          Start identifying pets in seconds — whether you’re a pet parent, breeder, or just curious.
        </p>
        <a
          href="https://apps.apple.com/us/app/petguess-ai/id6755983803"
          target="_blank"
          className="pg-btn primary pg-bottom-btn"
        >
          🍏 Download on the App Store
        </a>

        <div className="pg-email-wrap">
          <p className="pg-section-text pg-section-text-center">
            No iPhone? Get an email when Android is available:
          </p>
          <form onSubmit={handleSubmit} className="pg-email-form">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={loading}>
              {loading ? "Joining..." : "Notify Me"}
            </button>
          </form>
        </div>

        <p className="pg-footer-links">
          Or explore the rest of the ecosystem:{" "}
          <a href="/deals">Pet Deals</a> • <a href="/shop">MyPetAI+ Store</a> • <a href="/">MyPetAI+ Home</a>
        </p>
      </section>

      <style jsx>{`
        .pg-root {
          padding: 40px 20px 80px;
          background: linear-gradient(135deg, #fff8ef 0%, #ffffff 100%);
          font-family: "Poppins", sans-serif;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HERO */
        .pg-hero {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 50px;
        }

        .pg-hero-text {
          flex: 1 1 320px;
        }

        .pg-hero h1 {
          font-size: 2.6rem;
          color: #333;
          margin-bottom: 10px;
        }

        .pg-hero h1 span {
          color: #f5a623;
        }

        .pg-hero-sub {
          font-size: 1.05rem;
          color: #555;
          line-height: 1.6;
        }

        .pg-hero-ctas {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .pg-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: 0.25s ease;
          border: 2px solid transparent;
          display: inline-block;
        }

        .primary {
          background: #f5a623;
          color: #fff;
          border-color: #f5a623;
        }

        .primary:hover {
          background: #e6951d;
          border-color: #e6951d;
        }

        .pg-platform-note {
          font-size: 0.9rem;
          color: #777;
        }

        .pg-tagline {
          margin-top: 14px;
          font-size: 0.95rem;
          color: #666;
        }

        .pg-tagline a {
          color: #f5a623;
          font-weight: 600;
        }

        /* Phone mockup */
        .pg-hero-mock {
          flex: 1 1 260px;
          display: flex;
          justify-content: center;
        }

        .pg-phone-frame {
          width: 260px;
          border-radius: 32px;
          padding: 10px;
          background: linear-gradient(145deg, #ffddaa, #ffeede);
          box-shadow: 0 18px 45px rgba(245, 166, 35, 0.35);
        }

        .pg-phone-screen {
          background: #111827;
          border-radius: 24px;
          padding: 10px;
          height: 480px;
          display: flex;
          flex-direction: column;
        }

        .pg-screen-header {
          text-align: center;
          color: #f9fafb;
          font-size: 0.9rem;
          padding: 4px 0 8px;
          border-bottom: 1px solid rgba(249, 250, 251, 0.08);
        }

        .pg-screen-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 10px;
        }

        .pg-photo-placeholder {
          flex: 1;
          border-radius: 16px;
          border: 1px dashed rgba(249, 250, 251, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e5e7eb;
          font-size: 0.85rem;
        }

        .pg-result-card {
          background: #020617;
          border-radius: 14px;
          padding: 10px 12px;
          border: 1px solid rgba(249, 250, 251, 0.08);
        }

        .pg-result-label {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .pg-result-breed {
          margin-top: 4px;
          font-size: 0.9rem;
          color: #fefce8;
          font-weight: 600;
        }

        .pg-result-note {
          margin-top: 4px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        /* Generic sections */
        .pg-section {
          margin-bottom: 50px;
        }

        .pg-section h2 {
          font-size: 1.9rem;
          color: #333;
          margin-bottom: 14px;
        }

        .pg-section-text {
          font-size: 1rem;
          color: #555;
          line-height: 1.7;
          max-width: 850px;
        }

        .pg-section-text-center {
          text-align: center;
          margin: 0 auto;
        }

        /* Features grid */
        .pg-grid {
        max-width:1000px;
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .pg-card {
          background: #fffdf7;
          padding: 20px 18px;
          border-radius: 18px;
          box-shadow: 0 8px 22px rgba(245, 166, 35, 0.12);
          transition: 0.25s ease;
        }

        .pg-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(245, 166, 35, 0.18);
        }

        .pg-card h3 {
          font-size: 1.1rem;
          color: #f5a623;
          margin-bottom: 6px;
        }

        .pg-card p {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.6;
        }

        /* Steps */
        .pg-steps {
          margin-top: 10px;
          padding-left: 20px;
          color: #555;
          line-height: 1.7;
        }

        .pg-steps li {
          margin-bottom: 6px;
        }

        /* Screens preview */
        .pg-screens {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .pg-screen-card {
          background: #fffdf7;
          border-radius: 16px;
          padding: 14px 14px 18px;
          box-shadow: 0 6px 18px rgba(245, 166, 35, 0.12);
        }

        .pg-screen-title {
          font-size: 0.98rem;
          font-weight: 600;
          color: #f5a623;
          margin-bottom: 10px;
        }

        .pg-screen-box {
          border-radius: 12px;
          border: 1px dashed #f3c57e;
          padding: 18px 10px;
          text-align: center;
          font-size: 0.9rem;
          color: #666;
        }

        /* FAQ */
        .pg-faq {
          margin-top: 16px;
          max-width: 850px;
        }

        .pg-faq details {
          background: #fffdf7;
          border-radius: 14px;
          padding: 10px 14px;
          margin-bottom: 8px;
          border: 1px solid rgba(245, 166, 35, 0.2);
        }

        .pg-faq summary {
          cursor: pointer;
          font-weight: 600;
          color: #444;
        }

        .pg-faq p {
          margin-top: 6px;
          font-size: 0.92rem;
          color: #555;
          line-height: 1.6;
        }

        /* Bottom CTA */
        .pg-bottom-cta {
          text-align: center;
        }

        .pg-bottom-btn {
          margin-top: 14px;
        }

        .pg-email-wrap {
          margin-top: 24px;
        }

        .pg-email-form {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .pg-email-form input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #ddd;
          min-width: 220px;
        }

        .pg-email-form button {
          padding: 10px 18px;
          border-radius: 8px;
          border: none;
          background: #f5a623;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }

        .pg-footer-links {
          margin-top: 22px;
          font-size: 0.95rem;
          color: #666;
        }

        .pg-footer-links a {
          color: #f5a623;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .pg-hero {
            flex-direction: column;
          }

          .pg-hero h1 {
            font-size: 2.2rem;
          }
        }
      `}</style>
    </main>
  );
}