"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import PetMenu from "./PetMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPet, setOpenPet] = useState(false);
  const [openDog, setOpenDog] = useState(false);
  const [openFish, setOpenFish] = useState(false);
  const [openGuppy, setOpenGuppy] = useState(false);

  const isActive = (href: string) => pathname === href;

  // 🔁 Expand menus automatically when navigating
  useEffect(() => {
    setOpenDog(pathname.startsWith("/your-pet/dog"));
    setOpenFish(pathname.startsWith("/your-pet/fish"));
    setOpenGuppy(pathname.startsWith("/your-pet/fish/guppy"));
  }, [pathname]);

  

  return (
    <header className="header">
      {/* 🔹 Logo */}
      <Link href="/" className="logo">
        🐾 MyPetAI+
      </Link>

      {/* 🔹 Mobile hamburger */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      {/* 🔹 Main nav */}
      <nav className={`nav ${menuOpen ? "open" : ""}`}>
        <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
          Home
        </Link>

        <Link
          href="/shop"
          className={`nav-link ${pathname.startsWith("/shop") ? "active" : ""}`}
        >
          Shop@MyPetAI+
        </Link>

        {/* 🐾 YOUR PET DROPDOWN */}
        <PetMenu />

        {/* 📘 Other pages */}
        <Link
          href="/about"
          className={`nav-link ${isActive("/about") ? "active" : ""}`}
        >
          About
        </Link>
        <a href="mailto:hello@mypetai.app" className="nav-link">
          Contact
        </a>
      </nav>
    </header>
  );
}



/*


<div className="nav-item">
        <button
            className={`dropdown-btn ${openPet ? "active" : ""}`}
            onClick={() => setOpenPet((p) => !p)}
            >
            Your Pet Deals ▾
            </button>


          {openPet && (
            <div className="dropdown-panel">
              
              <div className="dropdown-section">
                <button
                  className={`sub-btn ${openDog ? "active" : ""}`}
                  onClick={() => setOpenDog((p) => !p)}
                >
                  🐶 Dog ▾
                </button>
                {openDog && (
                  <div className="dropdown-sub">
                    <a href="/your-pet/dog/food" className={pathname === "/your-pet/dog/food" ? "active-sub" : ""}>🍖 Food</a>
                  </div>
                )}
              </div>

              <div className="dropdown-section">
                <a href="/your-pet/cat">🐱 Cat</a>
              </div>

        
              <div className="dropdown-section">
                <button
                  className={`sub-btn ${openFish ? "active" : ""}`}
                  onClick={() => setOpenFish((p) => !p)}
                >
                  🐠 Fish ▾
                </button>

                {openFish && (
                  <div className="dropdown-sub">
                    <div className="dropdown-section">
                      <button
                        className={`sub-btn ${openGuppy ? "active" : ""}`}
                        onClick={() => setOpenGuppy((p) => !p)}
                      >
                        🐡 Guppy ▾
                      </button>
                      {openGuppy && (
                        <div className="dropdown-sub">
                          <a href="/your-pet/fish/guppy/food" className={pathname === "/your-pet/fish/guppy/food" ? "active-sub" : ""}>🍽️ Food</a>
                          <a href="/your-pet/fish/guppy/test-kit" className={pathname === "/your-pet/fish/guppy/test-kit" ? "active-sub" : ""}>🧪 Test Kit</a>
                          <a href="/your-pet/fish/guppy/live-fish" className={pathname === "/your-pet/fish/guppy/live-fish" ? "active-sub" : ""}>💧 Live Fish</a>
                          <a href="/your-pet/fish/guppy/treatments" className={pathname === "/your-pet/fish/guppy/treatments" ? "active-sub" : ""}>💊 Treatments</a>
                        </div>
                      )}
                    </div>

                    <a href="/your-pet/fish/gold-fish">🐟 Gold Fish</a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
*/