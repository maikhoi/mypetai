"use client";

import { useState } from "react";

export default function HomePage() {
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
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && (data.success || data.ok)) {
        alert("✅ Thank you! You’re on the list.");
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
    <main className="homepage">

      {/* 🔶 HERO SECTION */}
      <section className="hero">
        <h1>
          🐾 Welcome to <span>MyPetAI+</span>
        </h1>
        <p className="hero-sub">
          Smarter pet care — compare prices, identify breeds with AI, and explore 
          the growing MyPetAI ecosystem.
        </p>

        <div className="hero-buttons">
          <a
            href="https://apps.apple.com/us/app/petguess-ai/id6755983803"
            target="_blank"
            className="btn primary"
          >
            🍏 Download PetGuess+ AI (iOS)
          </a>

          <a href="/deals" target="_blank" className="btn secondary">
            🔎 Find Pet Deals
          </a>

          <a href="/shop" target="_blank" className="btn secondary">
            🛍️ Visit Store
          </a>
        </div>
      </section>

      {/* 🔹 SECTION 1 — ECOSYSTEM OVERVIEW */}
      <section className="ecosystem">
        <h2>Explore the MyPetAI+ Ecosystem</h2>

        <div className="eco-grid">
          {/* STORE */}
          <div className="eco-card">
            <h3>🏬 MyPetAI+ Store</h3>
            <p>Handpicked essentials for all pets — curated for safety and quality.</p>
            <a href="/shop" target="_blank" className="btn secondary small">
              Visit Store
            </a>
          </div>

          {/* DEALS */}
          <div className="eco-card">
            <h3>🔎 Pet Deals Finder</h3>
            <p>Compare prices across top Australian retailers in seconds.</p>
            <a href="/deals" target="_blank" className="btn secondary small">
              View Deals
            </a>
          </div>

          {/* PETGUESS+ AI */}
          <div className="eco-card">
            <h3>📱 PetGuess+ AI</h3>
            <p>Identify your pet’s species and breed from a single photo.</p>
            <div className="hero-buttons1">
            <a
              href="/petguess"
              target="_blank"
              className="btn secondary"
            >
              More Info
            </a>
            <a
              href="https://apps.apple.com/us/app/petguess-ai/id6755983803"
              target="_blank"
              className="btn primary small"
            >
              Download iOS App
            </a></div>
          </div>

          {/* COMING SOON APP */}
          <div className="eco-card">
            <h3>🚀 MyPetAI+ App (Coming Soon)</h3>
            <p>AI insights, smart reminders, and rewards — all in one app.</p>

            <form onSubmit={handleSubmit} className="signup">
              <input
                type="email"
                placeholder="Email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button disabled={loading}>
                {loading ? "Joining..." : "Notify Me"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* INLINE STYLES */}
      <style jsx>{`
        .homepage {
          padding: 40px 20px 80px;
          background: linear-gradient(135deg, #fff8ef 0%, #ffffff 100%);
          font-family: "Poppins", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* HERO */
        .hero {
          text-align: center;
          max-width: 900px;
          margin-bottom: 60px;
        }

        .hero h1 {
          font-size: 2.8rem;
          color: #333;
          font-weight: 700;
        }

        .hero span {
          color: #f5a623;
        }

        .hero-sub {
          margin-top: 12px;
          font-size: 1.2rem;
          color: #555;
          line-height: 1.6;
        }

        .hero-buttons {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }

        .hero-buttons1 {           
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        /* BUTTONS */
        .btn {
          padding: 12px 24px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: 0.25s ease;
        }

        .primary {
          background: #f5a623;
          color: white;
          border: 2px solid #f5a623;
        }

        .primary:hover {
          background: #e6951d;
          border-color: #e6951d;
        }

        .secondary {
          background: white;
          color: #f5a623;
          border: 2px solid #f5a623;
        }

        .secondary:hover {
          background: #f5a623;
          color: white;
        }

        .small {
          padding: 10px 16px;
          font-size: 0.9rem;
        }

        /* ECOSYSTEM */
        .ecosystem {
          max-width: 1100px;
          width: 100%;
          text-align: center;
        }

        .ecosystem h2 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 30px;
        }

        .eco-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }

        .eco-card {
          background: #fffdf7;
          padding: 25px 20px;
          border-radius: 18px;
          box-shadow: 0 8px 20px rgba(245, 166, 35, 0.12);
          transition: 0.3s ease;
        }

        .eco-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(245, 166, 35, 0.18);
        }

        .eco-card h3 {
          font-size: 1.3rem;
          color: #f5a623;
          margin-bottom: 10px;
        }

        .eco-card p {
          color: #555;
          font-size: 0.95rem;
          margin-bottom: 16px;
        }

        /* SIGNUP */
        .signup {
          display: flex;
          gap: 8px;
          justify-content: center;
        }

        .signup input {
          padding: 10px 14px;
          border: 1px solid #ddd;
          border-radius: 8px;
          width: 160px;
        }

        .signup button {
          padding: 10px 16px;
          background: #f5a623;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .hero h1 {
            font-size: 2.2rem;
          }

          .hero-sub {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
}