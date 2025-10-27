"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function ProductEditPage() {
  const params = useParams();
  const id = params?.id as string;

  const [token, setToken] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🧩 Fetch product details
  async function fetchProduct() {
    if (!token) {
      alert("Please enter your admin key first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  // 💾 Save changes
  async function handleSave() {
    if (!product) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Product updated successfully at ${data.message}`);
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
    <div
      style={{
        padding: 30,
        fontFamily: "Poppins, sans-serif",
        maxWidth: 700,
        margin: "0 auto",
      }}
    >
      <h2>🐾 Edit Product</h2>

      {/* Admin key input */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="password"
          placeholder="Enter admin key"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button
          onClick={fetchProduct}
          disabled={!token || loading}
          style={{
            background: "#f5a623",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {loading ? "Loading..." : "Load Product"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Main product fields */}
      {product && (
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

          {product.stores?.[0]?.lastUpdated && (
            <p style={{ color: "#888", marginTop: 8 }}>
              🕓 Last store update: {product.stores[0].lastUpdated}
            </p>
          )}

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
  );
}
