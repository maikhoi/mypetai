"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type FormState = {
  email: string;
  persona: "Commuter" | "Student" | "Parent" | "Shift worker" | "Other";
  useCase: "Bus alerts" | "Nearby stops" | "Timetables" | "Trip planning" | "Other";
  suburbs: string;
  frequency: "Daily" | "A few times a week" | "Weekly" | "Occasionally";
  biggestPain:
    | "Unreliable arrival times"
    | "Not knowing which stop"
    | "Missing the bus"
    | "Long waiting"
    | "Crowded / capacity"
    | "Other";
  featureWish: string;
  notes: string;
  consent: boolean;
};

export default function MelbourneBusAssistPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>({
    email: "",
    persona: "Commuter",
    useCase: "Bus alerts",
    suburbs: "",
    frequency: "Daily",
    biggestPain: "Missing the bus",
    featureWish: "",
    notes: "",
    consent: true,
  });

  const appStoreUrl = useMemo(() => {
    // TODO: replace with your real App Store link once live
    return "https://apps.apple.com/";
  }, []);

  async function handleQuestionnaireSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.email.trim()) return alert("Please enter a valid email.");
    if (!form.consent) return alert("Please confirm consent so we can contact you.");

    try {
      setLoading(true);

      // Reuse your existing subscribe endpoint.
      // You can update /api/subscribe later to store these extra fields (it will still work if it ignores them).
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          source: "melbourne-bus-assist-page",
          questionnaire: {
            persona: form.persona,
            useCase: form.useCase,
            suburbs: form.suburbs,
            frequency: form.frequency,
            biggestPain: form.biggestPain,
            featureWish: form.featureWish,
            notes: form.notes,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.ok)) {
        setSubmitted(true);
        setForm((prev) => ({ ...prev, email: "", featureWish: "", notes: "" }));
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
    <main className="mba-root">
      {/* HERO */}
      <section className="mba-hero">
        <div className="mba-hero-text">
          <h1>
            🚌 <span>Melbourne Bus Assist</span>
          </h1>

          <p className="mba-hero-sub">
            Simple bus alerts and nearby stops for Melbourne commuters.
            <br />
            Find your stop faster, see upcoming departures, and get notified before your bus arrives.
          </p>

          <div className="mba-hero-ctas">
            <a href={appStoreUrl} target="_blank" className="mba-btn primary" rel="noreferrer">
              🍏 Download on the App Store
            </a>
            <span className="mba-platform-note">Android version planned.</span>
          </div>

          <div className="mba-tagline">
            Part of the <Link href="/">MyPetAI+</Link> ecosystem — building helpful tools across web and mobile.
          </div>

          <div className="mba-mini-links">
            <Link href="/melb-bus-assist/support">Support</Link>
            <span>•</span>
            <Link href="/melbourne-bus-assist/privacy-policy">Privacy</Link>
          </div>
        </div>

        {/* Phone mockup / placeholder */}
        <div className="mba-hero-mock">
          <div className="mba-phone-frame">
            <div className="mba-phone-screen">
              <div className="mba-screen-header">Melb Bus Assist</div>
              <div className="mba-screen-body">
                <div className="mba-map-placeholder">Nearby Stops</div>
                <div className="mba-card">
                  <div className="mba-card-label">Next departures</div>
                  <div className="mba-card-row">
                    <span className="mba-route">🚌 232</span>
                    <span className="mba-dest">City (example)</span>
                    <span className="mba-time">5 min</span>
                  </div>
                  <div className="mba-card-row">
                    <span className="mba-route">🚌 411</span>
                    <span className="mba-dest">Footscray (example)</span>
                    <span className="mba-time">12 min</span>
                  </div>
                  <div className="mba-card-note">Set an alert for a bus you care about.</div>
                </div>

                <div className="mba-pill">🔔 Alert: Notify me 3 min before</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS */}
      <section className="mba-section">
        <h2>What is Melbourne Bus Assist?</h2>
        <p className="mba-section-text">
          <strong>Melbourne Bus Assist</strong> is a lightweight mobile app focused on Melbourne{" "}
          <strong>bus</strong> services. It helps you find nearby stops, check upcoming departures,
          and enable alerts so you can catch your bus with less stress.
        </p>
        <div className="mba-callout">
          <strong>Scope:</strong> This release focuses on <strong>buses only</strong>. Train/tram support may be added later.
        </div>
      </section>

      {/* FEATURES */}
      <section className="mba-section">
        <h2>Key Features</h2>
        <div className="mba-grid">
          <div className="mba-card2">
            <h3>📍 Nearby Stops</h3>
            <p>Use your location (optional) to list bus stops around you quickly.</p>
          </div>
          <div className="mba-card2">
            <h3>⏱️ Upcoming Departures</h3>
            <p>See departures in a clean list so you can decide if you need to run or relax.</p>
          </div>
          <div className="mba-card2">
            <h3>🔔 Bus Alerts</h3>
            <p>Create alerts for the routes you care about and get notified before the bus arrives.</p>
          </div>
          <div className="mba-card2">
            <h3>🧭 Built for Daily Commuting</h3>
            <p>Fast, simple UI — focused on “what stop, what time, what bus”.</p>
          </div>
          <div className="mba-card2">
            <h3>🔐 Privacy-minded</h3>
            <p>No account required. Location is used for nearby stops and can be disabled anytime.</p>
          </div>
          <div className="mba-card2">
            <h3>🧩 Evolving Roadmap</h3>
            <p>We’re actively improving reliability, adding smarter alerts, and expanding coverage over time.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mba-section">
        <h2>How It Works</h2>
        <ol className="mba-steps">
          <li>
            <strong>Open the app</strong> and allow location to instantly find nearby stops (optional).
          </li>
          <li>
            <strong>Select a stop</strong> to view upcoming departures and route details.
          </li>
          <li>
            <strong>Create an alert</strong> for your bus (e.g. “notify me 3 minutes before”).
          </li>
          <li>
            <strong>Get notified</strong> so you can leave at the right time and avoid long waiting.
          </li>
        </ol>
      </section>

      {/* PREVIEW */}
      <section className="mba-section">
        <h2>App Preview</h2>
        <p className="mba-section-text mba-center">
          Example layouts — the live app shows real stops and departures.
        </p>
        <div className="mba-screens">
          <div className="mba-screen-card">
            <div className="mba-screen-title">1. Nearby Stops</div>
            <div className="mba-screen-box">See stops around you.</div>
          </div>
          <div className="mba-screen-card">
            <div className="mba-screen-title">2. Departures</div>
            <div className="mba-screen-box">Upcoming buses by route/time.</div>
          </div>
          <div className="mba-screen-card">
            <div className="mba-screen-title">3. Alerts</div>
            <div className="mba-screen-box">Notify before your bus arrives.</div>
          </div>
        </div>
      </section>

      {/* QUESTIONNAIRE */}
      <section className="mba-section">
        <h2>Help Shape the App (Quick Questionnaire)</h2>
        <p className="mba-section-text">
          Answer 6 quick questions so I can prioritise the next update for Melbourne bus users.
          If you leave an email, I can contact you for early access / updates.
        </p>

        <div className="mba-formWrap">
          {submitted ? (
            <div className="mba-success">
              ✅ Thanks — your feedback has been recorded!
              <div className="mba-success-sub">
                If you want to add more notes, just submit again anytime.
              </div>
            </div>
          ) : null}

          <form onSubmit={handleQuestionnaireSubmit} className="mba-form">
            <label>
              Email (for updates)
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
            </label>

            <div className="mba-row">
              <label>
                I’m mainly a…
                <select
                  value={form.persona}
                  onChange={(e) => setForm((p) => ({ ...p, persona: e.target.value as FormState["persona"] }))}
                >
                  <option>Commuter</option>
                  <option>Student</option>
                  <option>Parent</option>
                  <option>Shift worker</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                I mostly want…
                <select
                  value={form.useCase}
                  onChange={(e) => setForm((p) => ({ ...p, useCase: e.target.value as FormState["useCase"] }))}
                >
                  <option>Bus alerts</option>
                  <option>Nearby stops</option>
                  <option>Timetables</option>
                  <option>Trip planning</option>
                  <option>Other</option>
                </select>
              </label>
            </div>

            <div className="mba-row">
              <label>
                Which suburb(s) do you use buses in?
                <input
                  type="text"
                  placeholder="e.g. Hoppers Crossing, Footscray"
                  value={form.suburbs}
                  onChange={(e) => setForm((p) => ({ ...p, suburbs: e.target.value }))}
                />
              </label>

              <label>
                How often?
                <select
                  value={form.frequency}
                  onChange={(e) => setForm((p) => ({ ...p, frequency: e.target.value as FormState["frequency"] }))}
                >
                  <option>Daily</option>
                  <option>A few times a week</option>
                  <option>Weekly</option>
                  <option>Occasionally</option>
                </select>
              </label>
            </div>

            <label>
              Biggest pain point?
              <select
                value={form.biggestPain}
                onChange={(e) =>
                  setForm((p) => ({ ...p, biggestPain: e.target.value as FormState["biggestPain"] }))
                }
              >
                <option>Unreliable arrival times</option>
                <option>Not knowing which stop</option>
                <option>Missing the bus</option>
                <option>Long waiting</option>
                <option>Crowded / capacity</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              One feature you really want
              <input
                type="text"
                placeholder="e.g. alerts by stop + route, favorites, widgets..."
                value={form.featureWish}
                onChange={(e) => setForm((p) => ({ ...p, featureWish: e.target.value }))}
              />
            </label>

            <label>
              Extra notes (optional)
              <textarea
                placeholder="Tell me what’s annoying about catching buses in Melbourne..."
                rows={4}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </label>

            <label className="mba-consent">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))}
              />
              I consent to being contacted about Melbourne Bus Assist updates.
            </label>

            <button className="mba-btn primary mba-submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>

            <p className="mba-small">
              Prefer not to share email? Use{" "}
              <Link href="/melb-bus-assist-support">Support</Link> to message us.
            </p>
          </form>
        </div>
      </section>

      {/* FAQ */}
      <section className="mba-section">
        <h2>FAQ</h2>
        <div className="mba-faq">
          <details>
            <summary>Is Melbourne Bus Assist affiliated with PTV?</summary>
            <p>No. This is an independent app and is not affiliated with Public Transport Victoria (PTV).</p>
          </details>

          <details>
            <summary>Do I need to allow location?</summary>
            <p>
              No. Location helps show nearby stops faster, but you can deny permission and still use the app.
            </p>
          </details>

          <details>
            <summary>Does it support trains and trams?</summary>
            <p>
              Not yet — this release focuses on Melbourne bus services only. Train/tram support may be added later.
            </p>
          </details>

          <details>
            <summary>How do alerts work?</summary>
            <p>
              You select a stop/route and choose a reminder time. The app then sends you a notification when it’s close.
            </p>
          </details>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="mba-section mba-bottom-cta">
        <h2>Get Melbourne Bus Assist</h2>
        <p className="mba-section-text mba-center">
          Catch buses with less waiting and fewer surprises. Built for Melbourne bus commuters.
        </p>

        <a href={appStoreUrl} target="_blank" className="mba-btn primary mba-bottom-btn" rel="noreferrer">
          🍏 Download on the App Store
        </a>

        <p className="mba-footer-links">
          Links: <Link href="/melb-bus-assist-support">Support</Link> •{" "}
          <Link href="/melbourne-bus-assist-privacy">Privacy</Link> • <Link href="/">MyPetAI+ Home</Link>
        </p>
      </section>

      <style jsx>{`
        .mba-root {
          padding: 40px 20px 80px;
          background: linear-gradient(135deg, #fff8ef 0%, #ffffff 100%);
          font-family: "Poppins", sans-serif;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* HERO */
        .mba-hero {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 50px;
        }

        .mba-hero-text {
          flex: 1 1 340px;
        }

        .mba-hero h1 {
          font-size: 2.6rem;
          color: #333;
          margin-bottom: 10px;
        }

        .mba-hero h1 span {
          color: #f5a623;
        }

        .mba-hero-sub {
          font-size: 1.05rem;
          color: #555;
          line-height: 1.6;
        }

        .mba-hero-ctas {
          margin-top: 22px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }

        .mba-btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: 0.25s ease;
          border: 2px solid transparent;
          display: inline-block;
          cursor: pointer;
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

        .mba-platform-note {
          font-size: 0.9rem;
          color: #777;
        }

        .mba-tagline {
          margin-top: 14px;
          font-size: 0.95rem;
          color: #666;
        }

        .mba-tagline :global(a) {
          color: #f5a623;
          font-weight: 600;
        }

        .mba-mini-links {
          margin-top: 14px;
          display: flex;
          gap: 10px;
          align-items: center;
          color: #888;
          font-size: 0.95rem;
        }

        .mba-mini-links :global(a) {
          color: #f5a623;
          font-weight: 600;
          text-decoration: underline;
          textUnderlineOffset: 3px;
        }

        /* Phone mockup */
        .mba-hero-mock {
          flex: 1 1 260px;
          display: flex;
          justify-content: center;
        }

        .mba-phone-frame {
          width: 270px;
          border-radius: 32px;
          padding: 10px;
          background: linear-gradient(145deg, #ffddaa, #ffeede);
          box-shadow: 0 18px 45px rgba(245, 166, 35, 0.35);
        }

        .mba-phone-screen {
          background: #111827;
          border-radius: 24px;
          padding: 10px;
          height: 500px;
          display: flex;
          flex-direction: column;
        }

        .mba-screen-header {
          text-align: center;
          color: #f9fafb;
          font-size: 0.9rem;
          padding: 4px 0 8px;
          border-bottom: 1px solid rgba(249, 250, 251, 0.08);
        }

        .mba-screen-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 12px;
          gap: 10px;
        }

        .mba-map-placeholder {
          flex: 1;
          border-radius: 16px;
          border: 1px dashed rgba(249, 250, 251, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #e5e7eb;
          font-size: 0.9rem;
        }

        .mba-card {
          background: #020617;
          border-radius: 14px;
          padding: 10px 12px;
          border: 1px solid rgba(249, 250, 251, 0.08);
        }

        .mba-card-label {
          font-size: 0.75rem;
          color: #9ca3af;
          margin-bottom: 6px;
        }

        .mba-card-row {
          display: grid;
          grid-template-columns: 56px 1fr 56px;
          gap: 8px;
          align-items: center;
          padding: 6px 0;
          border-top: 1px solid rgba(249, 250, 251, 0.06);
        }

        .mba-card-row:first-of-type {
          border-top: none;
        }

        .mba-route {
          color: #fefce8;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .mba-dest {
          color: #e5e7eb;
          font-size: 0.85rem;
        }

        .mba-time {
          color: #fefce8;
          text-align: right;
          font-weight: 700;
          font-size: 0.85rem;
        }

        .mba-card-note {
          margin-top: 6px;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .mba-pill {
          border-radius: 999px;
          padding: 10px 12px;
          background: rgba(245, 166, 35, 0.18);
          border: 1px solid rgba(245, 166, 35, 0.35);
          color: #fefce8;
          font-size: 0.85rem;
          text-align: center;
        }

        /* Sections */
        .mba-section {
          margin-bottom: 50px;
        }

        .mba-section h2 {
          font-size: 1.9rem;
          color: #333;
          margin-bottom: 14px;
        }

        .mba-section-text {
          font-size: 1rem;
          color: #555;
          line-height: 1.7;
          max-width: 900px;
        }

        .mba-center {
          text-align: center;
          margin: 0 auto;
        }

        .mba-callout {
          margin-top: 14px;
          background: #fffdf7;
          border: 1px solid rgba(245, 166, 35, 0.25);
          border-radius: 14px;
          padding: 12px 14px;
          color: #555;
          max-width: 900px;
        }

        /* Features grid */
        .mba-grid {
          max-width: 1000px;
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .mba-card2 {
          background: #fffdf7;
          padding: 20px 18px;
          border-radius: 18px;
          box-shadow: 0 8px 22px rgba(245, 166, 35, 0.12);
          transition: 0.25s ease;
        }

        .mba-card2:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(245, 166, 35, 0.18);
        }

        .mba-card2 h3 {
          font-size: 1.1rem;
          color: #f5a623;
          margin-bottom: 6px;
        }

        .mba-card2 p {
          font-size: 0.95rem;
          color: #555;
          line-height: 1.6;
        }

        /* Steps */
        .mba-steps {
          margin-top: 10px;
          padding-left: 20px;
          color: #555;
          line-height: 1.7;
          max-width: 900px;
        }

        .mba-steps li {
          margin-bottom: 8px;
        }

        /* Screens */
        .mba-screens {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .mba-screen-card {
          background: #fffdf7;
          border-radius: 16px;
          padding: 14px 14px 18px;
          box-shadow: 0 6px 18px rgba(245, 166, 35, 0.12);
        }

        .mba-screen-title {
          font-size: 0.98rem;
          font-weight: 600;
          color: #f5a623;
          margin-bottom: 10px;
        }

        .mba-screen-box {
          border-radius: 12px;
          border: 1px dashed #f3c57e;
          padding: 18px 10px;
          text-align: center;
          font-size: 0.9rem;
          color: #666;
        }

        /* Questionnaire form */
        .mba-formWrap {
          margin-top: 18px;
          max-width: 900px;
          background: #fffdf7;
          border: 1px solid rgba(245, 166, 35, 0.2);
          border-radius: 18px;
          padding: 18px;
          box-shadow: 0 10px 26px rgba(245, 166, 35, 0.08);
        }

        .mba-success {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.25);
          padding: 12px 14px;
          border-radius: 14px;
          margin-bottom: 12px;
          color: #14532d;
          font-weight: 700;
        }

        .mba-success-sub {
          margin-top: 4px;
          font-weight: 500;
          color: #166534;
          font-size: 0.9rem;
        }

        .mba-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mba-form label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #444;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .mba-form input,
        .mba-form select,
        .mba-form textarea {
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-weight: 500;
          outline: none;
          background: #fff;
        }

        .mba-form textarea {
          resize: vertical;
        }

        .mba-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .mba-consent {
          display: flex !important;
          flex-direction: row !important;
          align-items: center;
          gap: 10px !important;
          font-weight: 600;
        }

        .mba-consent input {
          width: 18px;
          height: 18px;
        }

        .mba-submit {
          margin-top: 6px;
          width: fit-content;
        }

        .mba-small {
          margin-top: 6px;
          color: #777;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* FAQ */
        .mba-faq {
          margin-top: 16px;
          max-width: 900px;
        }

        .mba-faq details {
          background: #fffdf7;
          border-radius: 14px;
          padding: 10px 14px;
          margin-bottom: 8px;
          border: 1px solid rgba(245, 166, 35, 0.2);
        }

        .mba-faq summary {
          cursor: pointer;
          font-weight: 700;
          color: #444;
        }

        .mba-faq p {
          margin-top: 6px;
          font-size: 0.92rem;
          color: #555;
          line-height: 1.6;
        }

        /* Bottom */
        .mba-bottom-cta {
          text-align: center;
        }

        .mba-bottom-btn {
          margin-top: 14px;
        }

        .mba-footer-links {
          margin-top: 18px;
          font-size: 0.95rem;
          color: #666;
        }

        .mba-footer-links :global(a) {
          color: #f5a623;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .mba-hero {
            flex-direction: column;
          }

          .mba-hero h1 {
            font-size: 2.2rem;
          }

          .mba-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}