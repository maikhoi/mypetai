"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import ReviewModal from "@/components/ReviewModal";
import type { ProductDoc, DigitalAsset, Review } from "@/models/Product";



/* re|double declare ???
type StorePrice = {
  storeName: string;
  productUrl?: string;
  productImageUrl?: string;
  regularPrice?: number | null;
  memberPrice?: number | null;
  repeatPrice?: number | null;
};
type DigitalAsset = {
  url: string;
  type: "image" | "video";
};

type ProductDoc = {
  _id: string;
  name: string;
  description?: string;
  digitalAssets?: DigitalAsset[];
  stores?: StorePrice[];
  categories?: string[];
  averagePrice?: number;
};
*/
function formatCategory(str: string) {
    return str.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

export default function ProductPageClient({ product }: { product: ProductDoc }) {
  // 🧠 local state for reviews
  const [reviews, setReviews] = useState(product.reviews || []);

  // Handler to add new review after submission
  function handleNewReview(newReview: Review) {
    setReviews((prev) => [newReview, ...prev]);
  }

  const [quantity, setQuantity] = useState(1);
  
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");


  const digitalAssets = product.digitalAssets || [];
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset>(
    digitalAssets[0] || { url: "/placeholder.png", type: "image" }
  );

  const mypetaiStore = product.stores?.find(
    (s) => s.storeName?.toLowerCase() === "mypetai shop"
  );
  const isMyPetAiProduct = !!mypetaiStore;

  const regularPrice =
    mypetaiStore?.regularPrice ??
    product.averagePrice ??
    (product.stores?.[0]?.regularPrice ?? 0);

  const memberPrice =
    mypetaiStore?.memberPrice ?? product.stores?.[0]?.memberPrice ?? null;

  // 🧮 Active sale price
  const unitPrice = memberPrice && memberPrice < regularPrice ? memberPrice : regularPrice;

  // 🚚 Flat shipping
  const shippingCost = 19.99;

  // 🧾 Total cost
  const totalAmount = unitPrice * quantity + shippingCost;

  return (

    
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 0.9fr",
        gridTemplateRows: "auto auto",
        gap: 40,
        padding: "40px 24px",
        maxWidth: 1200,
        margin: "0 auto",
        fontFamily: "Poppins, sans-serif",
      }}
    >

{/* 🧭 Breadcrumbs */}
      <div style={{ gridColumn: "1 / -1" }}>
        <nav
          style={{
            fontSize: "0.95rem",
            marginBottom: 8,
            color: "#777",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <a
            href="/"
            style={{
              color: "#1a73e8",
              textDecoration: "none",
              marginRight: 6,
            }}
          >
            Home
          </a>
          <span style={{ color: "#aaa" }}>/</span>
          <a
            href="/shop"
            style={{
              color: "#1a73e8",
              textDecoration: "none",
              margin: "0 6px",
            }}
          >
            Shop@MyPetAI+
          </a>
          {product.categories && product.categories.length > 0 && (
            <>
              <span style={{ color: "#aaa" }}>/</span>
              <a
                href={`/shop?category=${encodeURIComponent(product.categories[0])}`}
                style={{
                  color: "#1a73e8",
                  textDecoration: "none",
                  margin: "0 6px",
                }}
              >
                {formatCategory(product.categories[0])}
              </a>
            </>
          )}
          <span style={{ color: "#aaa" }}>/</span>
          <span
            style={{
              color: "#333",
              marginLeft: 6,
              fontWeight: 500,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "60vw",
            }}
            title={product.name}
          >
            {product.name.length > 40
              ? product.name.slice(0, 37) + "..."
              : product.name}
          </span>
        </nav>
      </div>
    
      {/* 🎞️ MEDIA GALLERY */}
      <div>
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 10,
            background: "#fff",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {selectedAsset.type === "video" ? (
            <video
              key={selectedAsset.url}
              src={selectedAsset.url}
              controls
              style={{
                width: "100%",
                maxHeight: 400,
                borderRadius: 8,
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              key={selectedAsset.url}
              src={selectedAsset.url}
              alt={product.name}
              style={{
                width: "100%",
                maxHeight: 400,
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          )}
        </div>

        {/* 🎞️ Thumbnails */}
        {digitalAssets.length > 1 && (
          <div
            className="thumb-scroll-wrapper"
            style={{
              marginTop: 16,
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
            }}
          >
            <div
              className="thumb-strip"
              style={{
                display: "flex",
                flexWrap: "nowrap",
                gap: 10,
                paddingBottom: 8,
              }}
            >
              {digitalAssets.slice(0, 20).map((asset, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedAsset(asset)}
                  style={{
                    flex: "0 0 auto",
                    width: 90,
                    height: 90,
                    borderRadius: 8,
                    border:
                      selectedAsset.url === asset.url
                        ? "2px solid #f5a623"
                        : "1px solid #ddd",
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    background: "#fff",
                  }}
                >
                  {asset.type === "video" ? (
                    <>
                      <video
                        src={asset.url}
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0.3)",
                        }}
                      >
                        <span
                          style={{
                            background: "#fff",
                            borderRadius: "50%",
                            padding: 6,
                            fontSize: 12,
                          }}
                        >
                          ▶
                        </span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={asset.url}
                      alt={`Thumbnail ${i + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🧾 PRODUCT DETAILS */}
      <div>
        <h1 style={{ fontSize: "2rem", color: "#333", marginBottom: 8 }}>
          {product.name}
        </h1>

        {/* 💰 Pricing */}
        {unitPrice > 0 && (
          <div style={{ marginBottom: 20 }}>
            {memberPrice ? (
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: 700,
                    color: "#e67e22",
                  }}
                >
                  ${memberPrice.toFixed(2)} AUD
                </span>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "#999",
                    fontSize: "1.1rem",
                  }}
                >
                  ${regularPrice.toFixed(2)}
                </span>
                <span
                  style={{
                    fontSize: "0.95rem",
                    color: "#fff",
                    background: "#f5a623",
                    borderRadius: "6px",
                    padding: "2px 8px",
                    marginLeft: 6,
                  }}
                >
                  SALE
                </span>
              </div>
            ) : (
              <p
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#f5a623",
                  margin: 0,
                }}
              >
                ${regularPrice.toFixed(2)} AUD
              </p>
            )}
          </div>
        )}

        {/* 🪙 PayPal Purchase Section */}
        {isMyPetAiProduct && (
          <div
            style={{
              marginBottom: 24,
              border: "1px solid #eee",
              borderRadius: 12,
              padding: 20,
              background: "#fff8ed",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontWeight: 600 }}>
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value)))
                  }
                  style={{
                    marginLeft: 8,
                    width: 70,
                    padding: 6,
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    textAlign: "center",
                  }}
                />
              </label>
            </div>

            <p style={{ margin: "6px 0" }}>
              🚚 <strong>Flat Shipping Fee:</strong> $19.99
            </p>

            <p style={{ fontSize: 15 }}>
              <strong>Estimated Total:</strong> ${totalAmount.toFixed(2)} AUD
            </p>

            <div style={{ width: "100%", maxWidth: 400 }}>
              <PayPalScriptProvider
                options={{
                  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                  currency: "AUD",
                }}
              >
                <PayPalButtons
                  style={{
                    layout: "vertical",
                    color: "gold",
                    shape: "pill",
                    label: "buynow",
                  }}
                  createOrder={async () => {
                    const res = await fetch("/api/paypal/create-order", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        productId: product._id,
                        amount: unitPrice * quantity,
                        quantity,
                      }),
                    });
                    const data = await res.json();
                    if (!data.order?.id) {
                      console.error("⚠️ No orderID returned!", data);
                      throw new Error("Order ID missing");
                    }

                    return data.order?.id;
                  }}
                  onApprove={async (data) => {
                    const res = await fetch("/api/paypal/capture", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderID: data.orderID,
                        productId: product._id,
                        quantity,
                      }),
                    });
                    const result = await res.json();
                    if (result.success) alert("✅ Payment successful!");
                    else alert("❌ Payment failed");
                  }}
                />
              </PayPalScriptProvider>
            </div>
          </div>
        )}
      </div>

      {/* 🧠 Full-Width Description (spans both columns) */}
      {/* 🧠 TABBED CONTENT AREA */}
      <div
        style={{
          gridColumn: "1 / -1",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* Tab Headers */}
        <div
          style={{
            display: "flow",
            borderBottom: "1px solid #eee",
            background: "#fafafa",
          }}
        >
          <button
            onClick={() => setActiveTab("description")}
            style={{
              flex: 1,
              padding: "14px 20px",
              background: activeTab === "description" ? "#fff" : "transparent",
              border: "none",
              borderBottom:
                activeTab === "description" ? "3px solid #f5a623" : "none",
              fontWeight: 600,
              color: activeTab === "description" ? "#333" : "#777",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            📝 Description
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            style={{
              flex: 1,
              padding: "14px 20px",
              background: activeTab === "reviews" ? "#fff" : "transparent",
              border: "none",
              borderBottom:
                activeTab === "reviews" ? "3px solid #f5a623" : "none",
              fontWeight: 600,
              color: activeTab === "reviews" ? "#333" : "#777",
              cursor: "pointer",
              transition: "0.2s",
            }}
          >
            ⭐ Reviews
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: 20, lineHeight: 1.6, color: "#555",}}>
          {activeTab === "description" && (
            product.description ? (
              <ReactMarkdown>{product.description}</ReactMarkdown>
            ) : (
              <p>No description available.</p>
            )
          )}

          {activeTab === "reviews" && (
            <div style={{ textAlign: "center" }}>
              {product.reviews?.length ? (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {product.reviews.map((r, i) => (
                      <li
                        key={i}
                        style={{
                          background: "#f9fafb",
                          padding: 12,
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                      >
                        <strong>{r.name}</strong> &nbsp;
                        <span style={{ color: "#f59e0b" }}>
                          {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                        </span>
                        <p style={{ marginTop: 4 }}>{r.comment}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span style={{ color: "#888",  }}>
                          No reviews yet 🐾
                      </span>
              )}
              {/* 🔹 Review modal button here 🟢 Pass callback down */}
              <ReviewModal productId={product._id} onReviewAdded={handleNewReview} />
          </div>
          )}
        </div>
      </div>
      {/* 📱 Responsive Styles */}
      <style jsx>{`
        .thumb-scroll-wrapper::-webkit-scrollbar {
          height: 6px;
        }
        .thumb-scroll-wrapper::-webkit-scrollbar-thumb {
          background-color: #bbb;
          border-radius: 4px;
        }
        .thumb-scroll-wrapper::-webkit-scrollbar-track {
          background-color: transparent;
        }

        @media (min-width: 851px) {
          .thumb-scroll-wrapper {
            max-width: calc(7 * 90px + 6 * 10px);
          }
        }

        @media (max-width: 850px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }

          div[style*="grid-column: 1 / -1"] {
            grid-column: 1 / 1 !important;
          }

          .thumb-scroll-wrapper {
            max-width: calc(5 * 75px + 6 * 10px);
          }

          .thumb-strip div {
            width: 75px !important;
            height: 75px !important;
          }
        }
      `}</style>
    </div>
  );
}
