"use client";
import React, { useEffect, useState } from "react";

interface ProductInfo {
  _id: string;
  name: string;
}

interface Props {
  onSelect: (id: string) => void;
  selectedId?: string;
}

export default function ProductSwitcher({ onSelect, selectedId }: Props) {
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/products/list");
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Failed to load product list", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex items-center gap-3 mb-4">
      <label className="font-medium text-sm">Select Product:</label>
      {loading ? (
        <span className="text-gray-500 text-sm">Loading...</span>
      ) : (
        <select
          className="border rounded-lg px-3 py-2 max-h-52 overflow-y-auto"
          value={selectedId || ""}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">-- Choose a product --</option>
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
