"use client";

import { useState, useEffect } from "react";

type Props = {
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number; // debounce delay in ms
};

export default function ProductSearchBar({
  onSearch,
  placeholder = "Search products...",
  delay = 400,
}: Props) {
  const [term, setTerm] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!onSearch) return;
    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      onSearch(term.trim());
    }, delay);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [term, delay, onSearch]); // ✅ added onSearch dependency

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        maxWidth: 400,
        margin: "0 auto 20px",
      }}
    >
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />
      {term && (
        <button
          onClick={() => setTerm("")}
          style={{
            background: "none",
            border: "none",
            color: "#999",
            fontSize: 18,
            cursor: "pointer",
          }}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}
