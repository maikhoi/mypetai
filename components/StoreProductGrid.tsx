"use client";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

// ====== TYPES ======

type DigitalAsset = {
  url: string;
  type: "image" | "video";
};

type StorePrice = {
  storeName: string;
  productUrl: string;
  productImageUrl?: string;
  regularPrice?: number | null;
  memberPrice?: number | null;
  repeatPrice?: number | null;
  lastUpdated?: Date;
  lastUpdatedLocal?: string;
};

type Product = {
  _id: string;
  name: string;
  imageUrl?: string;
  averagePrice?: number;
  stores: StorePrice[];  
  digitalAssets?: DigitalAsset[];
};

type Props = {
  apiPath: string;
  title?: string;
  subtitle?: string;
};

// ====== HELPERS ======
function bestStoreOffer(stores: StorePrice[], storeName?: string) {
  if (!stores || stores.length === 0) return null;

  const filtered = storeName
    ? stores.filter((s) => s.storeName?.toLowerCase() === storeName.toLowerCase())
    : stores;

  const priced = filtered
    .map((s) => {
      // Treat 0 as missing price
      const regular = typeof s.regularPrice === "number" && s.regularPrice > 0 ? s.regularPrice : null;
      const member = typeof s.memberPrice === "number" && s.memberPrice > 0 ? s.memberPrice : null;
      const repeat = typeof s.repeatPrice === "number" && s.repeatPrice > 0 ? s.repeatPrice : null;

      const available = [member, regular, repeat].filter(
        (v): v is number => typeof v === "number" && !Number.isNaN(v)
      );
      if (available.length === 0) return null;

      const best = Math.min(...available);

      return { ...s, bestPrice: best, _normalized: { regular, member, repeat } };
    })
    .filter(Boolean) as (StorePrice & { bestPrice: number; _normalized: any })[];

  if (priced.length === 0) return null;
  return priced.sort((a, b) => a.bestPrice - b.bestPrice)[0];
}

function normalizeStorePrice(s: StorePrice) {
  const regular = typeof s.regularPrice === "number" && s.regularPrice > 0 ? s.regularPrice : null;
  const member  = typeof s.memberPrice  === "number" && s.memberPrice  > 0 ? s.memberPrice  : null;
  const repeat  = typeof s.repeatPrice  === "number" && s.repeatPrice  > 0 ? s.repeatPrice  : null;
  const available = [member, regular, repeat].filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  if (available.length === 0) return null;
  const bestPrice = Math.min(...available);
  return { bestPrice, _normalized: { regular, member, repeat } };
}

function getCheapestItemForStore(
  items: (Product & { store: StorePrice })[]
): { product: Product & { store: StorePrice }, bestPrice: number, _normalized: { regular: number|null, member: number|null, repeat: number|null } } | null {
  const scored = items
    .map((product) => {
      const norm = normalizeStorePrice(product.store);
      return norm ? { product, bestPrice: norm.bestPrice, _normalized: norm._normalized } : null;
    })
    .filter(Boolean) as { product: Product & { store: StorePrice }, bestPrice: number, _normalized: any }[];

  if (scored.length === 0) return null;
  scored.sort((a, b) => a.bestPrice - b.bestPrice);
  return scored[0];
}


// ====== MAIN COMPONENT ======
export default function StoreProductGrid({ apiPath, title, subtitle }: Props) {
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});

  const [storeSummaries, setStoreSummaries] = useState<
    { storeName: string; items: (Product & { store: StorePrice })[]; cheapestPrice: number }[]
  >([]);
  const [expandedStores, setExpandedStores] = useState<Record<string, boolean>>({});
  const [showTop, setShowTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🧭 Scroll-to-top button toggle
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🧩 Fetch data whenever apiPath changes
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError("");
        const baseUrl =
          typeof window !== "undefined"
            ? window.location.origin
            : process.env.NEXT_PUBLIC_SITE_URL || "https://mypetai.app";

        const res = await fetch(`${baseUrl}${apiPath}`, { cache: "no-store" });
        const { success, products = [] } = await res.json();

        if (!success) throw new Error("Failed to fetch products");

        // Group by store — make sure p.stores is an array
        const grouped: Record<string, (Product & { store: StorePrice })[]> = {};
        const seenKeys = new Set<string>();

        for (const p of products) {
          const storeArray = Array.isArray(p.stores)
            ? p.stores
            : Array.isArray(p.productStorePrice)
            ? p.productStorePrice
            : [];

          for (const s of storeArray) {
            if (!s?.storeName) continue;
            const key = `${s.storeName}-${p._id}`;
            if (seenKeys.has(key)) continue; // skip duplicate same-store entry
            seenKeys.add(key);

            if (!grouped[s.storeName]) grouped[s.storeName] = [];
            grouped[s.storeName].push({ ...p, store: s });
          }
        }


        // 🧹 Deduplicate products within each store group
        for (const storeName in grouped) {
          const seen = new Set<string>();

          grouped[storeName] = grouped[storeName].filter((p) => {
            const key = [
              p.name?.trim().toLowerCase(),
              p.store?.productUrl?.trim().toLowerCase().replace(/\/$/, ""), // remove trailing slash
              p.store?.regularPrice,
              p.store?.memberPrice,
            ].join("|");

            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          });
        }

        // Summaries
        const summary = Object.entries(grouped)
          .map(([storeName, items]) => {
            const cheapest = items
              .map((p) => bestStoreOffer(p.stores, storeName))
              .filter(Boolean)
              .sort((a, b) => a!.bestPrice - b!.bestPrice)[0];
            return { storeName, items, cheapestPrice: cheapest?.bestPrice ?? Infinity };
          })
          .sort((a, b) => a.cheapestPrice - b.cheapestPrice);

        // Auto-expand top 2 stores
        const initialExpanded: Record<string, boolean> = {};
        summary.slice(0, 2).forEach((s) => (initialExpanded[s.storeName] = true));

        if (!cancelled) {
          const initialVisible: Record<string, number> = {};
          summary.forEach(({ storeName }) => (initialVisible[storeName] = 10));
          setVisibleCount(initialVisible);

          setExpandedStores(initialExpanded);
          setStoreSummaries(summary);
        }
      } catch (err: any) {
        console.error("❌ Error loading products:", err);
        if (!cancelled) setError(err.message || "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [apiPath]);

  const toggleStore = (name: string) =>
    setExpandedStores((prev) => ({ ...prev, [name]: !prev[name] }));

  const isSearching = apiPath.includes("search=");
  // ====== RENDER ======
  return (
    <div style={{ padding: 20, fontFamily: "Poppins, sans-serif" }}>
      {title && <h2 style={{ color: "#f5a623" }}>{title}</h2>}
      {subtitle && <p style={{ color: "#555", marginBottom: 24 }}>{subtitle}</p>}

      {/* 🔄 Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#999" }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: "4px solid #f5a623",
              borderTop: "4px solid transparent",
              borderRadius: "50%",
              margin: "0 auto 12px",
              animation: "spin 0.9s linear infinite",
            }}
          />
          <p>Loading products...</p>
          <style>
            {`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
          </style>
        </div>
      )}

      {/* ❌ Error */}
      {!loading && error && (
        <p style={{ textAlign: "center", color: "red" }}>⚠️ {error}</p>
      )}

      {/* 🐾 No products found */}
      {!loading && !error && storeSummaries.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#777",
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ fontSize: "1.1rem", marginBottom: 10 }}>
            {isSearching
              ? "No products match your search — try a different keyword."
              : "No products found for this category yet."}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: "#f5a623",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "10px 18px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🔄 Clear Filters
          </button>
        </div>
      )}

      {/* ✅ Product groups by store */}
      {!loading &&
        !error &&
        storeSummaries.map(({ storeName, items, cheapestPrice }, index) => {
          const expanded = expandedStores[storeName];
          const totalItems = items.length;
          const previewBest = bestStoreOffer(
            items.flatMap((p) => p.stores.filter((s) => s.storeName === storeName), storeName)
          );

          return (
            <div
              key={storeName}
              style={{
                background: "#fff",
                borderRadius: 10,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                marginBottom: 30,
                overflow: "hidden",
              }}
            >
              {/* Store header */}
              <div
                onClick={() => toggleStore(storeName)}
                style={{
                  cursor: "pointer",
                  background: "#fff9ed",
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600, color: "#f5a623" }}>
                  🏪 {storeName}{" "}
                  <span style={{ color: "#777", fontSize: "0.9rem" }}>
                    (from ${cheapestPrice !== Infinity ? cheapestPrice.toFixed(2) : "—"})
                  </span>
                </span>
                <span style={{ color: "#f5a623", fontWeight: 700 }}>
                  {expanded ? "▲" : "▼"}
                </span>
              </div>

              {/* Preview when collapsed (use the actual cheapest product in this store) */}
              {!expanded && (() => {
                const cheapest = getCheapestItemForStore(items);
                if (!cheapest) return null;
                const { product, bestPrice } = cheapest;
                const previewSrc =
                  product.store.productImageUrl?.trim() ||
                  product.digitalAssets?.[0]?.url ||
                  product.imageUrl ||
                  "/placeholder.png";

                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 16px",
                      background: "#fff",
                      borderTop: "1px solid #f2f2f2",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={previewSrc}
                        alt={storeName}
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        style={{ width: 50, height: 50, objectFit: "contain", borderRadius: 6 }}
                      />
                      <span style={{ color: "#333", fontWeight: 500 }}>
                        ${bestPrice.toFixed(2)}
                      </span>
                    </div>
                    {(totalItems > 1 && <span style={{ color: "#777", fontSize: "0.85rem" }}>
                      +{totalItems - 1} more deals
                    </span>)}
                  </div>
                );
              })()}

              {/* Product list */}
              {expanded && (
                <div
                  className="store-products"
                >
                  {/* ✅ Sort products by best (lowest) price before showing */}
                  {items
                    .map((p) => {
                      const best = bestStoreOffer(p.stores, storeName);
                      return best
                        ? { ...p, _bestPrice: best.bestPrice || Infinity }
                        : { ...p, _bestPrice: Infinity };
                    })
                    .sort((a, b) => a._bestPrice - b._bestPrice) // ascending (cheapest first)
                    .slice(0, visibleCount[storeName] || 10)     //.slice(0, 10)
                    .map((p, idx) => {
                const storeArray = Array.isArray(p.stores) ? p.stores : [];
                const best = bestStoreOffer(storeArray, storeName);
                const repeat = storeArray.find(
                    (s) =>
                    s.storeName === storeName &&
                    s.repeatPrice &&
                    s.repeatPrice > 0
                );

                // 🕒 Determine last update string
                const storeMatch = storeArray.find((s) => s.storeName === storeName);
                let lastUpdatedText = "Unknown";
                
                if (storeMatch?.lastUpdated) {
                  try {
                    // Convert stored timestamp (string or Date) → Melbourne DateTime
                    const melbourneTime = DateTime.fromISO(
                      typeof storeMatch.lastUpdated === "string"
                        ? storeMatch.lastUpdated
                        : storeMatch.lastUpdated.toISOString(),
                      { zone: "utc" }
                    ).setZone("Australia/Melbourne");
                
                    // Get current Melbourne time
                    const now = DateTime.now().setZone("Australia/Melbourne");
                
                    // Calculate difference in units
                    const diff = now.diff(melbourneTime, [
                      "days",
                      "hours",
                      "minutes",
                      "seconds",
                    ]).toObject();
                
                    // Build human-readable text
                    const parts: string[] = [];
                    if (diff.days && diff.days >= 1) parts.push(`${Math.floor(diff.days)} day${diff.days >= 2 ? "s" : ""}`);
                    if (diff.hours && diff.hours >= 1) parts.push(`${Math.floor(diff.hours)} hour${diff.hours >= 2 ? "s" : ""}`);
                    if (diff.minutes && diff.minutes >= 1) parts.push(`${Math.floor(diff.minutes)} min${diff.minutes >= 2 ? "s" : ""}`);
                
                    if (parts.length === 0) {
                      lastUpdatedText = "just now";
                    } else {
                      lastUpdatedText = `Last updated ${parts.join(" ")} ago`;
                    }
                  } catch (err) {
                    lastUpdatedText = "Invalid date";
                  }
                } else if (storeMatch?.lastUpdatedLocal) {
                  // Fallback to provided formatted text
                  lastUpdatedText = storeMatch.lastUpdatedLocal;
                }
                const isSale =
                        best &&
                        best._normalized?.member &&
                        best._normalized?.regular &&
                        best._normalized.member < best._normalized.regular;


                return (
                    <div
                        key={`${storeName}-${p._id}-${p.store?.productUrl || idx}`}
                        className="product-card"
                        onMouseEnter={(e) => {
                          const tip = e.currentTarget.querySelector(".tooltip") as HTMLElement;
                          if (tip) tip.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          const tip = e.currentTarget.querySelector(".tooltip") as HTMLElement;
                          if (tip) tip.style.opacity = "0";
                        }}
                        onTouchStart={(e) => {
                          const tip = e.currentTarget.querySelector(".tooltip") as HTMLElement;
                          if (tip) {
                            tip.style.visibility = "visible";
                            tip.style.opacity = "1";
                            setTimeout(() => {
                              tip.style.visibility = "hidden";
                              tip.style.opacity = "0";
                            }, 2000);
                          }
                        }}
                        style={{
                          position: "relative", // <— important for tooltip positioning
                          flex: "0 0 auto",
                          width: 220,
                          scrollSnapAlign: "start",
                          background: "#fff",
                          borderRadius: 10,
                          boxShadow: "0 3px 6px rgba(0,0,0,0.05)",
                          padding: 14,
                          textAlign: "center",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          height: 360, // fixed consistent height
                        }}
                    >

                {/* 🧠 Tooltip */}
                  <div
                    className="tooltip"
                    style={{
                      position: "absolute",
                      top: -4,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.85)",
                      color: "#fff",
                      padding: "6px 10px",
                      borderRadius: 6,
                      fontSize: "0.8rem",
                      whiteSpace: "nowrap",
                      pointerEvents: "none",
                      opacity: 0,
                      transition: "opacity 0.25s ease",
                      zIndex: 20,
                    }}
                  >
                    🕒 {lastUpdatedText}<br/>(Melbourne time)
                  </div>

                    <div
                        style={{
                        height: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        }}
                    >
                        <img
                            src={
                              best?.productImageUrl?.trim() ||
                              p.digitalAssets?.[0]?.url ||                              
                              p.imageUrl ||
                              "/placeholder.png"
                            }
                            alt={p.name}
                            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                            style={{
                              maxWidth: "100%",
                              maxHeight: 120,
                              objectFit: "contain",
                            }}
                          />

                    </div>
                    <h4 style={{ margin: "8px 0 4px", color: "#333" }}>{p.name}</h4>
                    {/* 🏷️ Label for the first (cheapest) item 
                    {idx === 0 && (
                      <div
                        style={{
                          color: "#4caf50",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          marginBottom: 6,
                        }}
                      >
                        🏷️ Lowest Price
                      </div>
                    )}  */}
                    {best ? (
                        <p style={{ margin: 0 }}>
                        {isSale && best.regularPrice && best.memberPrice && (
                            <><span
                            style={{
                                textDecoration: "line-through",
                                color: "#aaa",
                                marginRight: 6,
                                fontSize: "0.9rem",
                            }}
                            >
                            ${best.regularPrice.toFixed(2)}
                            </span><span
                                style={{
                                fontWeight: 700,
                                color: isSale ? "#e94e1b" : "#f5a623",
                                fontSize: "1.05rem",
                                }}
                            >
                                ${best.memberPrice.toFixed(2)}
                            </span>                            
                            </>
                        )}
                        {!isSale && best.regularPrice && (<span
                            style={{
                            fontWeight: 700,
                            color: isSale ? "#e94e1b" : "#f5a623",
                            fontSize: "1.05rem",
                            }}
                        >
                            ${best.regularPrice.toFixed(2)}
                        </span>)}
                        </p>
                    ) : (
                        <p style={{ color: "#777", margin: 0 }}>Price unavailable</p>
                    )}

                    {repeat && (
                        <p
                        style={{
                            color: "#555",
                            fontSize: "0.9rem",
                            margin: "4px 0",
                        }}
                        >
                        🔁 Repeat:{" "}
                        <span style={{ color: "#1a73e8", fontWeight: 600 }}>
                            ${repeat.repeatPrice?.toFixed(2)}
                        </span>
                        </p>
                    )}

                    {best?.productUrl && (
                        <a
                        href={best.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          padding: "8px 18px",
                          background: "#f5a623",
                          color: "#fff",
                          borderRadius: 6,
                          textDecoration: "none",
                          fontWeight: 600,
                          marginTop: 8,
                          marginLeft: "auto",
                          marginRight: "auto",                          
                          transition: "background 0.2s",
                        }}
                        >
                        View Deal
                        </a>
                    )}
                    </div>
                );
                })}

                {/* Browse more card */}
                {items.length > (visibleCount[storeName] || 10) ? (
            <div
              className="browse-more-card"
              style={{
                flex: "0 0 auto",
                width: 160,
                height: 220,
                background: "transparent",
                color: "#f5a623",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                textAlign: "center",
                cursor: "pointer",
                opacity: 0.8,
                scrollSnapAlign: "center",
              }}
              onClick={() =>
                setVisibleCount((prev) => ({
                  ...prev,
                  [storeName]: (prev[storeName] || 10) + 10,
                }))
              }
            >
              <span style={{ fontSize: "0.9rem" }}>
                <br />
                <br />
                <br />
                Browse <br />
                more <br />
                product <br />
                this <br />
                store
              </span>
              <span style={{ fontSize: "1.2rem", marginTop: 2 }}>→</span>
            </div>
          ) : (
            <div
              className="browse-more-card"
              style={{
                flex: "0 0 auto",
                width: 160,
                height: 220,
                background: "transparent",
                color: "#f5a623",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                textAlign: "center",
                cursor: "pointer",
                opacity: 0.8,
                scrollSnapAlign: "center",
              }}
              onClick={() =>
                window.open(
                  `https://www.google.com/search?q=${encodeURIComponent(
                    storeName + " pet food site:.au"
                  )}`,
                  "_blank"
                )
              }
            >
              <span style={{ fontSize: "0.9rem" }}>
                <br />
                <br />
                <br />
                No more.<br />
                Browse  <br />
                more on <br />
                Google
              </span>
              <span style={{ fontSize: "1.2rem", marginTop: 2 }}>→</span>
            </div>
          )}

            </div>
            )}
            </div>
          );
        })}

      {/* ⬆️ Scroll-to-top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#f5a623",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 48,
            height: 48,
            fontSize: 20,
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          ↑
        </button>
      )}

      {/* Mobile responsiveness styles */}
      <style jsx>{`
      .store-products {
        display: flex;
        overflow-x: auto;
        gap: 16px;
        padding: 16px;
        }
        /* 💻 Default: scroll horizontally */
        .store-products::-webkit-scrollbar {
          height: 6px;
        }
        .store-products::-webkit-scrollbar-thumb {
          background: #f5a62366;
          border-radius: 4px;
        }
      
        /* 📱 Mobile: switch to grid layout */
        @media (max-width: 768px) {
          .store-products {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            overflow-x: hidden !important;
          }
      
          .product-card {
            width: 90% !important;
          }

          .browse-more-card {
            width: auto !important;
            height: auto !important;
            background: none !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 10px 0 !important;
            font-size: 0.95rem !important;
            opacity: 1 !important;
          }
        
          .browse-more-card span {
            display: inline !important;
            font-size: 0.95rem !important;
          }
        
          .browse-more-card br {
            display: none !important;
          }
        }
        @media (max-width: 480px) {
          .store-products {
            grid-template-columns: repeat(2, 1fr);
          }
          .browse-more-card {
            width: auto !important;
            height: auto !important;
            background: none !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 10px 0 !important;
            font-size: 0.95rem !important;
            opacity: 1 !important;
          }
        
          .browse-more-card span {
            display: inline !important;
            font-size: 0.95rem !important;
          }
        
          .browse-more-card br {
            display: none !important;
          }
        }
        
      `}</style>
    </div>
  );
}
