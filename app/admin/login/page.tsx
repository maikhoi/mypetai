"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("from") || "/admin/products";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push(redirectTo);
    } else {
      setError("Invalid login");
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto", textAlign: "center" }}>
      <h3>🔐 Admin Login</h3>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button
        onClick={handleLogin}
        style={{
          padding: "8px 16px",
          background: "#f5a623",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          width: "100%",
        }}
      >
        Login
      </button>

      {error && <p style={{ color: "red", marginTop: 12 }}>{error}</p>}
    </div>
  );
}
