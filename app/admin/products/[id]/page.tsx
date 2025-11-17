"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminGate from "@/components/admin/AdminGate";

export default function ProductEditPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🧩 Fetch product on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();

        if (data.success) {
          setProduct(data.product);
        } else {
          setError(data.error || "Failed to load product");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // 💾 Save changes
  async function handleSave() {
    if (!product) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        alert(`✅ Product updated successfully`);
        setProduct(data.product);
      } else {
        alert("⚠️ " + (data.error || "Update failed"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  // 🧱 Helper for updating nested store field
  const updateStoreField = (field: string, value: any) => {
    const updatedStores = [...(product.stores || [{}])];
    if (!updatedStores[0]) updatedStores[0] = {};
    updatedStores[0][field] = value;
    setProduct({ ...product, stores: updatedStores });
  };

  return (
    <AdminGate>
      <div
        style={{
          padding: 30,
          fontFamily: "Poppins, sans-serif",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <h2>🐾 Edit Product</h2>

        {loading && <p>Loading product...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {product && !loading && (
          <div>
            <label>
              Name:
              <input
                value={product.name || ""}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <label>
              Description:
              <textarea
                value={product.description || ""}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 8,
                  margin: "6px 0",
                  minHeight: 80,
                }}
              />
            </label>

            <label>
              Image URL:
              <input
                value={product.imageUrl || ""}
                onChange={(e) =>
                  setProduct({ ...product, imageUrl: e.target.value })
                }
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <label>
              Average Price ($):
              <input
                type="number"
                value={product.averagePrice || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    averagePrice: Number(e.target.value),
                  })
                }
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            {product.lastModifiedAt && (
              <p style={{ color: "#888", marginTop: 8 }}>
                🕓 Last modified: {product.lastModifiedAt}
              </p>
            )}

            {/* 🏬 Store info */}
            <h3 style={{ marginTop: 24, color: "#f5a623" }}>Store Info</h3>

            <label>
              Store Name:
              <input
                value={product.stores?.[0]?.storeName || ""}
                onChange={(e) => updateStoreField("storeName", e.target.value)}
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <label>
              Product URL:
              <input
                value={product.stores?.[0]?.productUrl || ""}
                onChange={(e) => updateStoreField("productUrl", e.target.value)}
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <label>
              Product Image URL:
              <input
                value={product.stores?.[0]?.productImageUrl || ""}
                onChange={(e) =>
                  updateStoreField("productImageUrl", e.target.value)
                }
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <label>
              Regular Price ($):
              <input
                type="number"
                value={product.stores?.[0]?.regularPrice || ""}
                onChange={(e) =>
                  updateStoreField("regularPrice", Number(e.target.value))
                }
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <label>
              Member Price ($):
              <input
                type="number"
                value={product.stores?.[0]?.memberPrice || ""}
                onChange={(e) =>
                  updateStoreField("memberPrice", Number(e.target.value))
                }
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <label>
              Repeat Price ($):
              <input
                type="number"
                value={product.stores?.[0]?.repeatPrice || ""}
                onChange={(e) =>
                  updateStoreField("repeatPrice", Number(e.target.value))
                }
                style={{ width: "100%", padding: 8, margin: "6px 0" }}
              />
            </label>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                marginTop: 18,
                background: "#f5a623",
                color: "white",
                padding: "10px 18px",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        )}
      </div>
    </AdminGate>
  );
}
