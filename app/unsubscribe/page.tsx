"use client";

import { useEffect, useState } from "react";

export default function UnsubscribePage() {
  const [status, setStatus] = useState<"loading" | "success" | "form">("loading");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") {
      setStatus("success");
    } else {
      setStatus("form");
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) setStatus("success");
  }

  if (status === "success")
    return (
      <div style={{ textAlign: "center", padding: 60, fontFamily: "Poppins, sans-serif" }}>
        <h2 style={{ color: "#f5a623" }}>✅ You’ve been unsubscribed</h2>
        <p style={{ color: "#555" }}>We’re sad to see you go. You won’t receive any more updates.</p>
      </div>
    );

  if (status === "form")
    return (
      <div style={{ textAlign: "center", padding: 60, fontFamily: "Poppins, sans-serif" }}>
        <h2 style={{ color: "#f5a623" }}>Unsubscribe from MyPetAI+</h2>
        <p>Enter your email to stop receiving updates.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              width: "100%",
              maxWidth: 320,
              marginBottom: 10,
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              background: "#f5a623",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Unsubscribe
          </button>
        </form>
      </div>
    );

  return null;
}
