"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    petname: "", // honeypot
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);

    // simple honeypot: if filled, silently "succeed"
    if (form.petname.trim()) {
      setStatus("success");
      return;
    }

    if (!form.email.includes("@") || !form.message.trim()) {
      alert("Please enter a valid email and message.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
          petname: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="contact-root">
      <section className="contact-card">
        <h1>
          📩 Contact <span>MyPetAI+</span>
        </h1>
        <p className="contact-sub">
          Got a question about PetGuess+ AI, MyPetAI+ Store, pet deals, or early
          access? Send us a message and we’ll get back to you.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          {/* Honeypot */}
          <input
            type="text"
            name="petname"
            value={form.petname}
            onChange={(e) => setForm({ ...form, petname: e.target.value })}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="field-row">
            <div className="field">
              <label htmlFor="name">Name (optional)</label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="subject">Subject (optional)</label>
            <input
              id="subject"
              type="text"
              placeholder="Question about PetGuess+ / Store / Deals / Other"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          <div className="field">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {status === "success" && (
            <p className="status success">
              ✅ Thanks for reaching out! We’ll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="status error">
              ⚠️ Something went wrong. Please try again later.
            </p>
          )}
        </form>

        <p className="contact-footer">
          Prefer email? You can also reach us at{" "}
          <a href="mailto:hello@mypetai.app">hello@mypetai.app</a>
        </p>
      </section>

      <style jsx>{`
        .contact-root {
          padding: 40px 20px 80px;
          background: linear-gradient(135deg, #fff8ef 0%, #ffffff 100%);
          font-family: "Poppins", sans-serif;
          display: flex;
          justify-content: center;
        }

        .contact-card {
          max-width: 720px;
          width: 100%;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 12px 30px rgba(245, 166, 35, 0.15);
          padding: 32px 24px 28px;
        }

        .contact-card h1 {
          font-size: 2rem;
          color: #333;
          margin-bottom: 8px;
        }

        .contact-card span {
          color: #f5a623;
        }

        .contact-sub {
          font-size: 0.98rem;
          color: #555;
          margin-bottom: 22px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .field-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .field {
           
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        label {
          font-size: 0.9rem;
          color: #444;
        }

        input,
        textarea {
          border-radius: 10px;
          border: 1px solid #ddd;
          padding: 10px 12px;
          font-size: 0.95rem;
          font-family: inherit;
        }

        textarea {
          resize: vertical;
        }

        .btn {
          align-self: flex-start;
          padding: 10px 22px;
          border-radius: 10px;
          font-weight: 600;
          border: 2px solid transparent;
          cursor: pointer;
          transition: 0.25s ease;
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

        .status {
          margin-top: 10px;
          font-size: 0.9rem;
        }

        .status.success {
          color: #15803d;
        }

        .status.error {
          color: #b91c1c;
        }

        .contact-footer {
          margin-top: 20px;
          font-size: 0.9rem;
          color: #666;
        }

        .contact-footer a {
          color: #f5a623;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .contact-card {
            padding: 24px 18px;
          }
        }
      `}</style>
    </main>
  );
}