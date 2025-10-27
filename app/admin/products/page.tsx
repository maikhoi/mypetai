"use client";
import { useState, useEffect } from "react";
import ProductSwitcher from "@/components/admin/ProductSwitcher";

// Example dropdown options — you can later fetch these dynamically

const SPECIES_OPTIONS = ["Dog", "Cat", "Fish", "Bird", "Reptile"];
const BREED_OPTIONS = [
  "Guppy",
  "Goldfish",
  "Bulldog",
  "Persian Cat",
  "Parrot",
  "Generic",
];
const CATEGORY_OPTIONS = ["Food","Dry Food","Wet Food", "Treats", "FTW", "Toys", "Health", "Accessories", "Test Kit", "Live Fish", "Live Plant"];

export default function ProductAdminDashboard() {
  const [selectedId, setSelectedId] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [showDetails, setShowDetails] = useState(false); // for Description + Average Price

  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me").then(async (res) => {
      if (res.ok) setLoggedIn(true);
    });
  }, []);

  async function handleLogin() {
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) setLoggedIn(true);
    else setError("Invalid login");
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    setLoggedIn(false);
  }

  if (!loggedIn) {
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

        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Remember me
          </label>
        </div>

        <button
          onClick={handleLogin}
          style={{
            padding: "8px 16px",
            background: "#f5a623",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }


  // 🧩 Load product
  async function loadProduct(id: string) {
    if (!id) {
      setProduct(null);
      return;
    }
    setLoading(true);
    setError("");
  
    try {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      if (data.success) {
        const p = data.product || {};
  
        p.species = Array.isArray(p.species) ? p.species : [];
        p.categories = Array.isArray(p.categories) ? p.categories : [];
        p.breedCompatibility = Array.isArray(p.breedCompatibility)
          ? p.breedCompatibility
          : [];
  
        // 🧩 Normalizer: ignore case + replace hyphens with spaces
        function normalize(text: string) {
          return text.replace(/-/g, " ").trim().toLowerCase();
        }
  
        // 🧠 Filter and normalize arrays against known options
        function filterByOptions(values: string[] = [], options: string[]) {
          const lowerOptions = options.map((o) => normalize(o));
          return values
            .map((v) => {
              const norm = normalize(v);
              const i = lowerOptions.indexOf(norm);
              return i >= 0 ? options[i] : null; // keep original-cased option
            })
            .filter(Boolean) as string[];
        }
  
        // ✅ Apply normalization filters
        p.species = filterByOptions(p.species, SPECIES_OPTIONS);
        p.categories = filterByOptions(p.categories, CATEGORY_OPTIONS);
        p.breedCompatibility = filterByOptions(
          p.breedCompatibility,
          BREED_OPTIONS
        );
  
        setProduct(p);

        // 🧩 After setProduct(p);
        if (Array.isArray(p.stores) && p.stores.length > 0) {
          const verifiedStores = await Promise.all(
            p.stores.map(async (store: any) => {
              const validProductUrl = true; // Skip verify for product links
              const validImageUrl = await verifyUrl(store.productImageUrl, "image");
              return {
                ...store,
                _urlStatus: {
                  productUrl: validProductUrl,
                  productImageUrl: validImageUrl,
                },
              };
            })
          );
        
          setProduct({ ...p, stores: verifiedStores });
        } else {
          setProduct(p);
        }
        

      } else {
        setError(data.error || "Failed to load product");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
 
  
  // 💾 Save or create product 
  async function handleSave() {
    if (!product) return alert("Please select or create a product first");

    setSaving(true);
    try {
      // 🧩 Copy product safely
      const payload = { ...product };

      // 🧠 Convert multiple selections to lower-case hyphen form
      function normalizeForSave(values: string[] = []) {
        return values.map((v) =>
          v
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-") // replace spaces with hyphens
        );
      }

      payload.species = normalizeForSave(product.species || []);
      payload.categories = normalizeForSave(product.categories || []);
      payload.breedCompatibility = normalizeForSave(
        product.breedCompatibility || []
      );

      // 🕓 Decide if PUT (edit) or POST (new)
      const method = selectedId ? "PUT" : "POST";
      const url = selectedId
        ? `/api/admin/products/${selectedId}`
        : `/api/admin/products`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        alert(
          selectedId
            ? `✅ Product updated successfully at ${data.message}`
            : `✅ New product added successfully!`
        );
        setProduct(data.product);
        if (!selectedId) {
          setSelectedId(data.product._id);
          setRefreshKey((k) => k + 1);
        }
      } else {
        alert("⚠️ " + (data.error || "Save failed"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  }



  const updateStoreField = (field: string, value: any) => {
    const updatedStores = [...(product.stores || [{}])];
    if (!updatedStores[0]) updatedStores[0] = {};
    updatedStores[0][field] = value;
    setProduct({ ...product, stores: updatedStores });
  };

  const updateArrayField = (field: string, value: string) => {
    if (!product) return;
    const array = product[field] || [];
    const updated = array.includes(value)
      ? array.filter((v: string) => v !== value)
      : [...array, value];
    setProduct({ ...product, [field]: updated });
  };

  const startNewProduct = () => {
    setSelectedId("");
    setProduct({
      name: "",
      description: "",
      digitalAssets: [],
      averagePrice: 0,
      species: [],
      categories: [],
      breedCompatibility: [],
      stores: [{ storeName: "", productUrl: "", regularPrice: 0 }],
    });
  };

  async function verifyUrl(url: string, type: "image" | "page" = "page"): Promise<boolean> {
    if (!url) return false;
  
    // 🖼️ For image URLs, use <img> in browser
    if (type === "image") {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url + (url.includes("?") ? "&" : "?") + "_t=" + Date.now();
      });
    }
  
    // 🔗 For normal pages, ask server to check (bypass CORS)
    try {
      const res = await fetch("/api/admin/products/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, type }),
      });
      const data = await res.json();
      return !!data.success;
    } catch {
      return false;
    }
  }
  
  
  

  return (
    <div
      style={{
        padding: 10,
        fontFamily: "Poppins, sans-serif",
        maxWidth: 750,
        margin: "0 auto",
      }}
    >

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2 style={{ marginBottom: 20 }}>🐾 Admin Product Editor</h2>
      <button
          onClick={handleLogout}
          style={{
            background: "#a5a476ff",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 14px",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>
      {/* Dropdown selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <ProductSwitcher
            key={refreshKey}
            selectedId={selectedId}
            onSelect={(id) => {
              setSelectedId(id);
              loadProduct(id);
            }}
          />
        </div>
        <button
          onClick={() => setRefreshKey((prev) => prev + 1)}
          style={{
            background: "#f5a623",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          🗘 Refresh
        </button>
        <button
          onClick={startNewProduct}
          style={{
            background: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "8px 12px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ➕ New Product
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading product...</p>}

      {product && !loading && (
        <div>

<label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
  <input
    type="checkbox"
    checked={product.isActive ?? true}
    onChange={(e) => setProduct({ ...product, isActive: e.target.checked })}
  />
  Active / Visible on MyPetAI
</label>

          <label>
            Name:
            <input
              value={product.name || ""}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              style={{ width: "100%", padding: 8, margin: "6px 0" }}
            />
          </label>
          {/* 🧩 Collapsible Details Section */}
          <div
            style={{
              marginTop: 16,
              padding: "10px 12px",
              border: "1px solid #ddd",
              borderRadius: 8,
              background: "#fafafa",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                userSelect: "none",
              }}
              onClick={() => setShowDetails(!showDetails)}
            >
              <h4 style={{ margin: 0, color: "#444" }}>📝 Details</h4>
              <span style={{ fontWeight: 600, color: "#f5a623" }}>
                {showDetails ? "▲ Collapse" : "▼ Expand"}
              </span>
            </div>

            {/* Smooth expand/collapse with scrollable content */}
<div
  style={{
    maxHeight: showDetails ? 500 : 0, // limit height when expanded
    overflowY: showDetails ? "auto" : "hidden", // add vertical scroll
    overflowX: "hidden",
    transition: "max-height 0.4s ease",
    marginTop: showDetails ? 12 : 0,
    paddingRight: showDetails ? 8 : 0, // space for scrollbar
  }}
>
  {showDetails && (
    <div
      style={{
        paddingRight: 6,
        paddingBottom: 10,
        scrollbarWidth: "thin",
      }}
    >
      <label>
        Description:
        <textarea
          value={product.description || ""}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          style={{
            width: "100%",
            maxWidth: "100%",
            padding: 8,
            margin: "6px 0",
            minHeight: 80,
            borderRadius: 6,
            border: "1px solid #ccc",
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />
      </label>

      {/* 🎨 Digital Assets (Images / Videos) */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ color: "#f5a623" }}>🎨 Digital Assets</h3>
        <p style={{ color: "#777", marginBottom: 8 }}>
          Upload or paste URLs for product images or short video clips.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 10,
          }}
        >
          {product.digitalAssets?.map((asset: any, idx: number) => (
            <div
              key={idx}
              style={{
                position: "relative",
                width: 120,
                height: 120,
                border: "1px solid #ccc",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              {asset.type === "video" ? (
                <video
                  src={asset.url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <img
                  src={asset.url}
                  alt="asset"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={() => {
                  const updated = [...product.digitalAssets];
                  updated.splice(idx, 1);
                  setProduct({ ...product, digitalAssets: updated });
                }}
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "#ff4d4f",
                  border: "none",
                  color: "white",
                  borderRadius: "50%",
                  width: 22,
                  height: 22,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add asset by URL */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="url"
            placeholder="Enter image or video URL"
            id="newAssetUrl"
            style={{
              flex: 1,
              padding: 8,
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          />
          <select id="newAssetType" style={{ padding: 8, borderRadius: 6 }}>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <button
            type="button"
            onClick={() => {
              const url = (
                document.getElementById("newAssetUrl") as HTMLInputElement
              )?.value;
              const type = (
                document.getElementById("newAssetType") as HTMLSelectElement
              )?.value as "image" | "video";
              if (!url) return alert("Please enter a valid URL");
              const updated = [...(product.digitalAssets || []), { url, type }];
              setProduct({ ...product, digitalAssets: updated });
              (
                document.getElementById("newAssetUrl") as HTMLInputElement
              ).value = "";
            }}
            style={{
              background: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            ➕ Add
          </button>
        </div>

        {/* Upload new image file */}
        <div style={{ marginTop: 10 }}>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              try {
                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });
                const data = await res.json();
                if (data.success && data.url) {
                  const fileType = file.type.startsWith("video")
                    ? "video"
                    : "image";
                  const updated = [
                    ...(product.digitalAssets || []),
                    { url: data.url, type: fileType },
                  ];
                  setProduct({ ...product, digitalAssets: updated });
                } else {
                  alert("⚠️ Upload failed: " + (data.error || "Unknown error"));
                }
              } catch (err: any) {
                alert("❌ Upload failed: " + err.message);
              }
            }}
          />
        </div>
      </div>

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
          style={{
            width: "97%",
            padding: 8,
            margin: "6px 0",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />
      </label>
    </div>
  )}
</div>

              </div>


          {/* 🧩 Species (buttons) + Breed + Categories (dropdowns) in one row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "12px", 
              alignItems: "start",
            }}
          >
            {/* 🐶 Species */}
            <div>
              <h4 style={{ marginBottom: 6 }}>Species:</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SPECIES_OPTIONS.map((sp) => (
                  <button
                    key={sp}
                    onClick={() => updateArrayField("species", sp)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: product.species?.includes(sp)
                        ? "2px solid #f5a623"
                        : "1px solid #ccc",
                      background: product.species?.includes(sp)
                        ? "#fff7e6"
                        : "white",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {sp}
                  </button>
                ))}
              </div>
            </div>

            {/* 🧬 Breed Compatibility */}
            <div>
              <h4 style={{ marginBottom: 6 }}>Breed Compatibility:</h4>
              <select
                multiple
                value={product.breedCompatibility || []}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    breedCompatibility: Array.from(
                      e.target.selectedOptions,
                      (opt) => opt.value
                    ),
                  })
                }
                style={{
                  width: "100%",
                  height: 100,
                  padding: 6,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              >
                {BREED_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 🧺 Categories */}
            <div>
              <h4 style={{ marginBottom: 6 }}>Categories:</h4>
              <select
                multiple
                value={product.categories || []}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    categories: Array.from(
                      e.target.selectedOptions,
                      (opt) => opt.value
                    ),
                  })
                }
                style={{
                  width: "100%",
                  height: 100,
                  padding: 6,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 🏬 Multi-Store Info */}
<div style={{ marginTop: 24 }}>
  <h3 style={{ color: "#f5a623" }}>🏬 Store Listings</h3>

  {product.stores?.map((store: any, idx: number) => (
    <div
      key={idx}
      style={{
        marginBottom: 16,
        padding: 12,
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h4 style={{ margin: 0 }}>
          {store.storeName || `Store #${idx + 1}`}
        </h4>
        <button
          type="button"
          onClick={() => {
            const updated = [...product.stores];
            updated.splice(idx, 1);
            setProduct({ ...product, stores: updated });
          }}
          style={{
            background: "#ff6b6b",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          🗑️ Remove
        </button>
      </div>

      {/* Store fields */}
      <div style={{ marginTop: 10 }}>
        <label>
          Store Name:
          <input
            value={store.storeName || ""}
            onChange={(e) => {
              const updated = [...product.stores];
              updated[idx].storeName = e.target.value;
              setProduct({ ...product, stores: updated });
            }}
            style={{ width: "100%", padding: 8, margin: "6px 0" }}
          />
        </label>

        {/* Product URL */}
        <label>Product URL:</label>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            value={store.productUrl || ""}
            onChange={(e) => {
              const updated = [...product.stores];
              updated[idx].productUrl = e.target.value;
              setProduct({ ...product, stores: updated });
            }}
            style={{ flex: 1, padding: 8 }}
          />
          {store.productUrl && (
            <button
              type="button"
              onClick={() => window.open(store.productUrl, "_blank")}
              style={{
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              🔗 Open
            </button>
          )}
        </div>

        {/* Product Image URL */}
        <label>Product Image URL:</label>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <input
            value={store.productImageUrl || ""}
            onChange={(e) => {
              const updated = [...product.stores];
              updated[idx].productImageUrl = e.target.value;
              setProduct({ ...product, stores: updated });
            }}
            style={{ flex: 1, padding: 8 }}
          />

          {store.productImageUrl && (
            <button
              type="button"
              onClick={() => window.open(store.productImageUrl, "_blank")}
              style={{
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: 6,
                padding: "6px 10px",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              🖼️ Open
            </button>
          )}
        </div>

        {/* Price grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginTop: 10,
          }}
        >
          <label>
            Regular Price ($):
            <input
              type="number"
              value={store.regularPrice || ""}
              onChange={(e) => {
                const updated = [...product.stores];
                updated[idx].regularPrice = Number(e.target.value);
                setProduct({ ...product, stores: updated });
              }}
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Member (or Sale) Price ($):
            <input
              type="number"
              value={store.memberPrice || ""}
              onChange={(e) => {
                const updated = [...product.stores];
                updated[idx].memberPrice = Number(e.target.value);
                setProduct({ ...product, stores: updated });
              }}
              style={{ width: "100%", padding: 8 }}
            />
          </label>

          <label>
            Repeat Price ($):
            <input
              type="number"
              value={store.repeatPrice || ""}
              onChange={(e) => {
                const updated = [...product.stores];
                updated[idx].repeatPrice = Number(e.target.value);
                setProduct({ ...product, stores: updated });
              }}
              style={{ width: "100%", padding: 8 }}
            />
          </label>
        </div>
      </div>
    </div>
  ))}

  {/* ➕ Add Store button */}
  <button
    type="button"
    onClick={() =>
      setProduct({
        ...product,
        stores: [
          ...(product.stores || []),
          {
            storeName: "",
            productUrl: "",
            productImageUrl: "",
            regularPrice: 0,
            memberPrice: 0,
            repeatPrice: 0,
          },
        ],
      })
    }
    style={{
      background: "#2196f3",
      color: "white",
      border: "none",
      borderRadius: 6,
      padding: "8px 14px",
      cursor: "pointer",
      fontWeight: 600,
    }}
  >
    ➕ Add Store
  </button>
</div>
       


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
            {saving ? "Saving..." : selectedId ? "💾 Save Changes" : "🆕 Add Product"}
          </button>

          {product.updatedAt && (
  <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>
    🕓 Last saved by <strong>{product.updatedBy || "unknown"}</strong> on{" "}
    {new Date(product.updatedAt).toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}
  </p>
)}
        </div>
      )}
      <style jsx>{`
  /* Scrollbars for detail area */
  div[style*='overflow-y: auto']::-webkit-scrollbar {
    width: 6px;
  }
  div[style*='overflow-y: auto']::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }
  div[style*='overflow-y: auto']::-webkit-scrollbar-track {
    background-color: transparent;
  }

  /* 📱 MOBILE OPTIMIZATION */
  @media (max-width: 900px) {
    /* Reduce padding and max width on main container */
    div[style*='max-width: 750px'] {
      padding: 12px !important;
      max-width: 100% !important;
    }

    /* Stack top header and logout button vertically */
    div[style*='justify-content: space-between'] {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 10px !important;
    }

    /* Stack dropdown selector buttons */
    div[style*='gap: 10px'][style*='margin-bottom: 20px'] {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    /* Grid for species / breed / category becomes vertical */
    div[style*='grid-template-columns: 1fr 1fr 1fr'] {
      display: flex !important;
      flex-direction: column !important;
      gap: 20px !important;
    }

    /* Inputs, selects, buttons: full width */
    input,
    select,
    textarea,
    button {
      width: 100% !important;
      box-sizing: border-box;
    }

    textarea {
      font-size: 14px;
      min-height: 100px;
    }

    /* Product cards (for stores) spacing */
    div[style*='border: 1px solid #ddd'][style*='background: #fafafa'] {
      padding: 10px !important;
    }

    /* Store prices grid becomes stacked */
    div[style*='grid-template-columns: 1fr 1fr 1fr'] {
      grid-template-columns: 1fr !important;
      gap: 10px !important;
    }

    /* Fix small screens for scrollable content */
    div[style*='overflow-y: auto'] {
      max-height: 400px !important;
    }

    /* Buttons spacing */
    button {
      margin-top: 8px !important;
    }
  }

  /* 📲 EXTRA SMALL (phones < 480px) */
  @media (max-width: 480px) {
    h2, h3, h4 {
      font-size: 1rem !important;
    }

    input,
    select,
    textarea,
    button {
      font-size: 0.9rem !important;
    }

    label {
      font-size: 0.9rem !important;
    }
  }
`}</style>

    </div>
  );
}
