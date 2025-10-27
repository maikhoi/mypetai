"use client";

import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trap = (e.currentTarget.elements.namedItem("petname") as HTMLInputElement)?.value;
    if (trap) return alert("🤖 Suspicious activity detected.");

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
      console.error(err);
      alert("⚠️ Network error — please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="homepage">
      <section className="premium-card">
        {/* 🧠 LEFT: App Overview */}
        <div className="card-content">
          <h1>
            🐾 Welcome to <span>MyPetAI+</span>
          </h1>
          <p className="lead">
            <strong><span>MyPetAI+</span> Mobile app</strong> is your pet’s intelligent companion — combining AI-driven insights, smart reminders, and money-saving deals to make pet care simpler, smarter, and more affordable.
          </p>

          <div className="features2">
            <div>
              <h3>🤖 AI Pet Insights</h3>
              <p>
                Get to know your pet better with instant, AI-powered analysis. From diet and health recommendations to
                mood tracking and breed-specific advice — everything you need to care like a pro.
              </p>
            </div>
            <div>
              <h3>🕐 Smart Care Reminders</h3>
              <p>
                Never miss feeding time, flea treatment, or vet visits again. MyPetAI+ keeps your pet’s care schedule organized, sending timely alerts tailored to their species, age, and needs.
              </p>
            </div>
            <div>
              <h3>💰 Exclusive Deals & Rewards</h3>
              <p>
                Save more every time you shop. Get personalized offers from Australia’s most trusted pet retailers — plus
                earn bonus <strong>Paw Coins</strong> for every action you take.
              </p>
            </div>
          </div>

          {/* 📬 Signup */}
          <form onSubmit={handleSubmit} className="signup-form">
            <h3>🚀 Join Early Access</h3>
            <input type="text" name="petname" style={{ display: "none" }} />
            <input
              type="email"
              value={email}
              placeholder="Enter your email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Join Now"}
            </button>
          </form>

          <p className="note">
            Be the first to experience <strong>MyPetAI+</strong> and unlock early adopter bonuses. 🐶🐱🐠
          </p>
          <p className="note-small">Launching soon on iOS & Android</p><hr/>
        </div>

        {/* 🛒 RIGHT: Shop & Deals */}
        <div className="shop-card">
          <div className="card-content">
            <h2>🛍️ Shop & Save with <span>MyPetAI+</span> Website</h2>
            <p>
              Shop smarter, not harder. Our website brings together high-quality pet essentials and intelligent deal
              comparisons — so you always find the right product at the best possible price.
            </p>

            <div className="features2">
              <div>
                <h3>🏬 MyPetAI+ Store</h3>
                <p>
                  Browse handpicked essentials for dogs, cats, fish, and small pets. Every product is AI-recommended for
                  quality, safety, and nutritional value — because your pet deserves the best.
                </p>
                <a href="/shop" className="shop-btn secondary"  target="_blank">
                  Visit Store
                </a>
              </div>
              <div>
                <h3>🔎 Find Pet Deals</h3>
                <p>
                  Discover real-time discounts from top Australian pet stores. Compare prices instantly, filter by
                  species or category, and never overpay again for your furry (or finned) friend.
                </p>
                <a href="/deals" className="shop-btn secondary" target="_blank">
                  Find Deals
                </a>
              </div>
            </div>
          </div>
          <div className="socials">
            <a href="https://tiktok.com/@mypetai" target="_blank">
              TikTok
            </a>{" "}
            •{" "}
            <a href="https://facebook.com/mypetai" target="_blank">
              Facebook
            </a>{" "}
            •{" "}
            <a href="https://instagram.com/mypetai" target="_blank">
              Instagram
            </a>
          </div>
        </div>
        
      </section>

      {/* 🎨 Styles remain same, look preserved */}
      <style jsx>{`
        .homepage {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #fff8ef 0%, #ffffff 100%);
          padding: 40px 20px;
          font-family: "Poppins", sans-serif;
        }

        .premium-card {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          background: linear-gradient(135deg, #fff 0%, #fff6e3 100%);
          box-shadow: 0 12px 30px rgba(245, 166, 35, 0.2);
          border-radius: 28px;
          padding: 60px;
          max-width: 1200px;
          width: 100%;
          gap: 5px;
          transition: all 0.3s ease;
          padding-top: 20px;
        }

        .premium-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(245, 166, 35, 0.25);
        }

        .card-content {
          flex: 1 1 550px;
        }

        .card-content h1 {
          font-size: 2.6rem;
          color: #333;
        }

        .card-content h1 span {
          color: #f5a623;
        }

        .card-content span {            
          color: #f5a623;
        } 

        .lead {
          margin: 12px 0 32px;
          font-size: 1.25rem;
          color: #444;
          line-height: 1.6;
        }

        .shop-btn {
          display: inline-block;
          padding: 12px 28px;
          border-radius: 10px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: all 0.25s ease;
          width: 100%;
          max-width: 180px;
          margin-top: 10px;
        }

        .shop-btn.primary {
          background: #f5a623;
          color: #fff;
          border: 2px solid #f5a623;
        }

        .shop-btn.primary:hover {
          background: #e6951d;
          border-color: #e6951d;
        }

        .shop-btn.secondary {
          background: #fff;
          color: #f5a623;
          border: 2px solid #f5a623;
        }

        .shop-btn.secondary:hover {
          background: #f5a623;
          color: #fff;
        }

        .features2 {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 30px;
          margin-top: 25px;
        }

        .features2 > div {
          flex: 1;
          text-align: center;
          background: #e2e9deff;
          border-radius: 16px;
          box-shadow: 0 5px 15px rgba(245, 166, 35, 0.1);
          padding: 25px 20px;
          transition: all 0.3s ease;
        }

        .features2 > div:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(245, 166, 35, 0.18);
        }

        .features2 h3 {
          color: #f5a623;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }

        .features2 p {
          color: #555;
          font-size: 0.95rem;
          margin-bottom: 12px;
        }

        @media (max-width: 768px) {
          .features2 {
            flex-direction: column;
            gap: 20px;
          }

          .shop-btn {
            max-width: 100px;
          }
        }

        .signup-form {
          margin-top: 20px;
        }

        .signup-form input[type="email"] {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #ddd;
          margin-right: 8px;
          width: 240px;
        }

        .signup-form button {
          padding: 10px 18px;
          background: #f5a623;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .signup-form button:hover {
          background: #e5941f;
        }

        .note {
          color: #444;
          margin-top: 16px;
          font-size: 1rem;
        }

        .note-small {
          color: #777;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        .socials {
          margin-top: 20px;
          color: #f5a623;
          font-weight: 600;
        }
      `}</style>
    </main>
  );
}
