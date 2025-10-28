"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import StoreProductGrid from "@/components/StoreProductGrid";
import ProductSearchBar from "@/components/ProductSearchBar";

// ✅ Outer component: rendered by the server safely (no hooks here)
export default function DealsPage() {
  return (
    <Suspense fallback={<div>Loading deals...</div>}>
      <DealsInner />
    </Suspense>
  );
}

function DealsInner() {
  const searchParams = useSearchParams();

  // Extract query params dynamically
  const species = searchParams.get("species") || "";
  const breed = searchParams.get("breedCompatibility") || "";
  const category = searchParams.get("category") || "";

  // Base query string
  const baseParams = new URLSearchParams();
  if (species) baseParams.set("species", species);
  if (breed) baseParams.set("breedCompatibility", breed);
  if (category) baseParams.set("category", category);

  const [search, setSearch] = useState("");
  const [apiPath, setApiPath] = useState(`/api/products?${baseParams.toString()}`);

  // Update API path on search
  useEffect(() => {
    const params = new URLSearchParams(baseParams);
    if (search) params.set("search", search);
    setApiPath(`/api/products?${params.toString()}`);
  }, [search, species, breed, category]);

  // 🧭 Build breadcrumb dynamically
  const breadcrumbItems = [
    { label: "Pet Deals", href: "/deals" },
    ...(species
      ? [{ label: formatCategory(species), href: `/deals?species=${species}` }]
      : [{label: "All Pet Deals", href: "/deals"}]),
    ...(breed
      ? [{ label: formatCategory(breed), href: `/deals?species=${species}&breedCompatibility=${breed}` }]
      : []),
    ...(category ? [{ label: formatCategory(category) }] : []),
  ];

  // 🏷️ Dynamic titles
  const titleParts = [formatCategory(breed || species || "Pet"),  formatCategory(category || "")];
  const title = `🛍️ ${titleParts.join(" ")=="Pet Deals"?titleParts.join(" "):titleParts.join(" ")+" Deals"}`;



  //const title = `🛍️ ${titleParts.join(" ")=="Pet Deals"?titleParts.join(" "):titleParts.join(" ") Deals} `;
  const subtitle = `Compare ${capitalize(breed) || formatCategory(species)} ${formatCategory(category) || ""} prices from multiple stores`;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <Breadcrumb items={breadcrumbItems} />
      <ProductSearchBar
        onSearch={(term) => setSearch(term)}
        placeholder={`Search ${breed || species} ${category || "products"}...`}
      />
      
      <StoreProductGrid apiPath={apiPath} title={title} subtitle={subtitle} />
      {/* 📝 Disclaimer & Feedback */}
      <DealsPageFooter />

    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function formatCategory(str: string) {
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
 

export function DealsPageFooter() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
  
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = Object.fromEntries(new FormData(form).entries());
      const { name, email, product, store } = formData as any;
  
      if (!name || !email || !product || !store) {
        alert("⚠️ Please fill in all fields.");
        return;
      }
  
      try {
        setLoading(true);
        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            productName: product,
            storeName: store,
            type: "price_sync",
          }),
        });
  
        const data = await res.json();
        if (data.success) {
          alert("✅ Thanks for reporting! We’ll review this shortly.");
          form.reset();
          setIsOpen(false);
        } else {
          alert("⚠️ Failed to send, please try again later.");
        }
      } catch (err: any) {
        alert("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    }
  
    return (
      <>
        {/* 📝 Footer note */}
        <footer
          style={{
            marginTop: 40,
            padding: "20px 16px",
            background: "#fffaf3",
            borderTop: "1px solid #eee",
            borderRadius: 8,
            textAlign: "center",
            fontSize: 14,
            color: "#555",
          }}
        >
          <p style={{ marginBottom: 6 }}>
            ⚠️ <strong>Note:</strong> Deal prices may exclude shipping costs.
          </p>
          <p style={{ marginBottom: 6 }}>
            Prices may differ slightly from actual listings depending on when
            we last captured them.
          </p>
          <p style={{ marginBottom: 0 }}>
            Found a mismatch?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
              style={{
                color: "#f5a623",
                fontWeight: 600,
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Report price issue
            </a>
          </p>
        </footer>
  
        {/* 💬 Bottom Sheet Modal */}
        {isOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 1000,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
            onClick={() => setIsOpen(false)}
          >
            <div
              style={{
                background: "#fff",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: 20,
                width: "100%",
                maxWidth: 480,
                boxShadow: "0 -6px 20px rgba(0,0,0,0.2)",
                animation: "slideUp 0.3s ease-out",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  width: 40,
                  height: 4,
                  background: "#ccc",
                  borderRadius: 2,
                  margin: "0 auto 16px auto",
                }}
              ></div>
  
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 14,
                  background: "transparent",
                  border: "none",
                  fontSize: 22,
                  cursor: "pointer",
                  color: "#999",
                }}
              >
                ×
              </button>
  
              <h3 style={{ color: "#f5a623", marginBottom: 8 }}>
                🐾 Report Price Issue
              </h3>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                Let us know if you find a price that seems outdated or incorrect.
              </p>
  
              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 15,
                  }}
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 15,
                  }}
                />
                <input
                  name="product"
                  type="text"
                  placeholder="Product name"
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 15,
                  }}
                />
                <input
                  name="store"
                  type="text"
                  placeholder="Store name"
                  style={{
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                    fontSize: 15,
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    marginTop: 8,
                    background: "#f5a623",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: 15,
                  }}
                >
                  {loading ? "Submitting..." : "📩 Submit Feedback"}
                </button>
              </form>
            </div>
  
            <style jsx>{`
              @keyframes slideUp {
                from {
                  transform: translateY(100%);
                }
                to {
                  transform: translateY(0);
                }
              }
              @media (min-width: 700px) {
                div[style*='max-width: 480px'] {
                  border-radius: 12px !important;
                  max-width: 420px !important;
                  margin-bottom: auto !important;
                  animation: fadeIn 0.2s ease;
                }
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                    transform: scale(0.95);
                  }
                  to {
                    opacity: 1;
                    transform: scale(1);
                  }
                }
              }
            `}</style>
          </div>
        )}
      </>
    );
  }