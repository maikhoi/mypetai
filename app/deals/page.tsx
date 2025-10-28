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
    { label: "Your Pet", href: "/your-pet" },
    ...(species
      ? [{ label: capitalize(species), href: `/your-pet/${species}` }]
      : [{label: "All Species", href: "/deals"}]),
    ...(breed
      ? [{ label: capitalize(breed), href: `/your-pet/${species}/${breed}` }]
      : []),
    ...(category ? [{ label: capitalize(category) }] : []),
  ];

  // 🏷️ Dynamic titles
  const titleParts = [capitalize(breed || species || "Pet"), capitalize(category || "Deals")];
  const title = `${titleParts.join(" ")=="Pet Deals"?titleParts.join(" "):titleParts.join(" ")+" Deals"}`;



  //const title = `🛍️ ${titleParts.join(" ")=="Pet Deals"?titleParts.join(" "):titleParts.join(" ") Deals} `;
  const subtitle = `Compare ${breed || species} ${category || ""} prices from multiple stores`;

  return (
    <div style={{ padding: "20px", fontFamily: "Poppins, sans-serif" }}>
      <Breadcrumb items={breadcrumbItems} />
      <ProductSearchBar
        onSearch={(term) => setSearch(term)}
        placeholder={`Search ${breed || species} ${category || "products"}...`}
      />
      
           <StoreProductGrid apiPath={apiPath} title={title} subtitle={subtitle} />
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
