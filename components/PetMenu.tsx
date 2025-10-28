"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function PetMenu() {
  const [menu, setMenu] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSpecies, setExpandedSpecies] = useState<string | null>(null);
  const [active, setActive] = useState({ s: "", b: "", c: "" });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const inPetSection =
        pathname.startsWith("/deals") || pathname.startsWith("/your-pet");

  // 🧭 Fetch dynamic menu once
  useEffect(() => {
    fetch("/api/menu/pets")
      .then((r) => r.json())
      .then(setMenu)
      .catch(console.error);
  }, []);

  // 🧭 Auto-close dropdown when leaving section
  useEffect(() => {
    if (!inPetSection) {
      setIsOpen(false);
      setExpandedSpecies(null);
    }
  }, [pathname]);

  // 🟡 Update active state + auto-expand
  useEffect(() => {
    const species = (searchParams.get("species") || "").toLowerCase();
    const breed = (searchParams.get("breedCompatibility") || "").toLowerCase();
    const category = (searchParams.get("category") || "").toLowerCase();
    setActive({ s: species, b: breed, c: category });
    if (species) setExpandedSpecies(species);
    else setExpandedSpecies(null);
  }, [pathname, searchParams]);

  // 🧩 Click to expand/collapse species (both desktop & mobile)
  const handleSpeciesClick = (sp: string) => {
    const slug = sp.toLowerCase();
    setExpandedSpecies((prev) => (prev === slug ? null : slug));
  };

  // 🧭 Hover top menu
  const handleMouseEnter = () => {
    if (window.innerWidth > 768) setIsOpen(true);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth > 768) setIsOpen(false);
  };
  const handleToggleClick = () => {
    if (window.innerWidth <= 768) setIsOpen((o) => !o);
  };


  return (
    <div
      className="petnav-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 🐾 Toggle button */}
      <button
        className={`petnav-toggle ${inPetSection ? "active" : ""}`}
        onClick={handleToggleClick}
        aria-expanded={isOpen}
      >
        🐾 Your Pet Deals
      </button>

      {/* 🧩 Dropdown */}
      {isOpen && (
        <div
          className="petnav-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 18,
            zIndex: 9999,
            minWidth: 260,
          }}
        >
          {menu.map((sp) => {
            const spKey = sp.species.toLowerCase();
            const isExpanded = expandedSpecies === spKey;
            const isActiveSpecies = active.s === spKey;

            return (
              <div key={sp.species} className="petnav-species">
                {/* 🐠 Species name (click to expand) */}
                <div
                  className={`petnav-species-name ${
                    isActiveSpecies ? "active" : ""
                  }`}
                  onClick={() => handleSpeciesClick(sp.species)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{capitalize(sp.species)}</span>
                  <span style={{ fontSize: 10, opacity: 0.6 }}>
                    {isExpanded ? "▲" : "▼"}
                  </span>
                </div>

                {/* 🧬 Breeds and categories */}
                {isExpanded && (
                  <div className="petnav-breeds">
                    {sp.breeds.map((b: any) => (
                      <div key={b.breed} className="petnav-breed">
                        <div
                          className={`petnav-breed-name ${
                            active.b === b.breed.toLowerCase() ? "active" : ""
                          }`}
                        >
                          {formatCategory(b.breed)}
                        </div>

                        <ul className="petnav-category-list">
                          {b.categories.map((cat: string) => {
                            const catKey = cat.toLowerCase();
                            const isActive = active.c === catKey;
                            return (
                              <li key={cat}>
                                <Link
                                  href={`/deals?species=${sp.species}&breedCompatibility=${b.breed}&category=${cat}`}
                                  className={isActive ? "active" : ""}
                                  onClick={() => setIsOpen(false)}
                                >
                                  {formatCategory(cat)}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .petnav-container {
          position: relative;
          display: inline-block;
        }

        .petnav-toggle {
          background: none;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          color: #333;
          transition: color 0.2s;
        }
        .petnav-toggle:hover {
          color: #f5a623;
        }
        .petnav-toggle.active {
          color: #f5a623;
          font-weight: 700;
        }

        .petnav-species-name {
          font-weight: 700;
          color: #333;
          margin-bottom: 6px;
          transition: color 0.2s;
        }
        .petnav-species-name.active {
          color: #f5a623;
        }

        .petnav-breed-name {
          font-weight: 600;
          color: #555;
          margin-left: 10px;
          transition: color 0.2s;
        }
        .petnav-breed-name.active {
          color: #f5a623;
        }

        .petnav-category-list {
          list-style: none;
          margin: 0;
          padding-left: 20px;
        }

        :global(.petnav-category-list a) {
          color: #333;
          text-decoration: none;
          transition: color 0.2s;
          font-size: 0.95rem;
        }

        :global(.petnav-category-list a:hover),
        :global(.petnav-category-list a.active) {
          color: #f5a623;
        }

        .petnav-breeds {
          transition: all 0.25s ease-in-out;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

function formatCategory(s: string) {
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
