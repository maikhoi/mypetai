"use client"; // required for hooks in App Router

import { useState } from "react";

export default function AdminPage() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  async function fetchSubs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-subscribers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      setSubs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: 30 }}>
      <h2>🐾 MyPetAI+ Subscribers</h2>
      <div style={{ marginBottom: 20 }}>
        <input
          type="password"
          placeholder="Enter admin key"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button onClick={fetchSubs} disabled={!token || loading}>
          {loading ? "Loading..." : "View Subscribers"}
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {subs.length > 0 && (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Email</th>
              <th>Joined (Melbourne)</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s._id}>
                <td>{s.email}</td>
                <td>{s.joinedAt}</td>
                <td>{s.source || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
