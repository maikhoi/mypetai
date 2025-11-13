"use client";
import { useState, useEffect, useCallback } from "react";

interface ProductSwitcherProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function ProductSwitcher({ selectedId, onSelect }: ProductSwitcherProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);

  // 🔥 Debounce search function
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (!term || term.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      const res = await fetch(`/api/admin/products/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setLoading(false);

      if (data.success) setResults(data.products);
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  function handleSelect(p: any) {
    setQuery(p.name);
    setShowList(false);
    onSelect(p._id);
  }

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowList(true);
        }}
        placeholder="Search product to edit..."
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 6,
          border: "1px solid #ccc",
        }}
      />

      {/* 🔽 Dropdown result list */}
      {showList && (results.length > 0 || loading) && (
        <div
          style={{
            position: "absolute",
            top: "105%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 6,
            maxHeight: 300,
            overflowY: "auto",
            zIndex: 999,
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          {loading && (
            <div style={{ padding: 10, textAlign: "center", color: "#888" }}>
             Searching...
            </div>
          )}

          {results.map((p) => (
            <div
              key={p._id}
              onClick={() => handleSelect(p)}
              style={{
                padding: "10px 12px",
                cursor: "pointer",
                background: p._id === selectedId ? "#fff6e0" : "white",
                borderBottom: "1px solid #eee",
              }}
            >
              <strong>{p.name}</strong>
              <br />
              <span style={{ fontSize: 12, color: "#666" }}>{p.species?.join(", ")}</span>
            </div>
          ))}

          {!loading && results.length === 0 && (
            <div style={{ padding: 10, textAlign: "center", color: "#999" }}>
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ⏳ Debounce util
function debounce(fn: Function, delay: number) {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
