"use client";

import { useState } from "react";

export default function ReviewModal({
  productId,
  onReviewAdded,
}: {
  productId: string;
  onReviewAdded?: (review: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newReview = { ...form, createdAt: new Date().toISOString() };
        onReviewAdded?.(newReview); // ✅ trigger parent update

        setMessage("✅ Thank you! Your review has been submitted.");
        setForm({ name: "", rating: 5, comment: "" });
        setTimeout(() => setIsOpen(false), 1000);
      } else {
        setMessage("❌ Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          marginTop: 10,
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          padding: "10px 14px",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        ✍️ Leave a Review
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 12,
              padding: 20,
              width: "90%",
              maxWidth: 400,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>
              Leave a Review
            </h3>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <input
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 15,
                }}
                required
              />

              <select
                name="rating"
                value={form.rating}
                onChange={(e) =>
                  setForm({ ...form, rating: Number(e.target.value) })
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 15,
                }}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 && "s"}
                  </option>
                ))}
              </select>

              <textarea
                name="comment"
                placeholder="Your review..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                rows={4}
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  fontSize: 15,
                  resize: "none",
                }}
                required
              />

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 8,
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 15,
                }}
              >
                {loading ? "Submitting..." : "📩 Submit Review"}
              </button>

              {message && (
                <p
                  style={{
                    marginTop: 6,
                    color: message.startsWith("✅") ? "green" : "red",
                    fontSize: 14,
                  }}
                >
                  {message}
                </p>
              )}
            </form>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 10,
                background: "transparent",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
