"use client";

import { useSession, signIn, signOut } from "next-auth/react";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import PetMenu from "./PetMenu";
import ChatMenu from "./ChatMenu";


export function AuthStatus() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <img
          src={session.user?.image || '/default-avatar.png'}
          alt="avatar"
          className="w-6 h-6 rounded-full"
        />
        <span className="text-sm">{session.user?.name}</span>
        <button onClick={() => signOut()} className="text-xs text-blue-500 ml-2">
          Logout
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => signIn("facebook")}
      className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md"
    >
      Login with Facebook
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openPet, setOpenPet] = useState(false);
  const [openDog, setOpenDog] = useState(false);
  const [openFish, setOpenFish] = useState(false);
  const [openGuppy, setOpenGuppy] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
  };
  

  const isActive = (href: string) => pathname === href;

  // 🔁 Expand menus automatically when navigating
  useEffect(() => {
    setOpenDog(pathname.startsWith("/your-pet/dog"));
    setOpenFish(pathname.startsWith("/your-pet/fish"));
    setOpenGuppy(pathname.startsWith("/your-pet/fish/guppy"));
  }, [pathname]);

  // 🧭 Close mobile nav when PetMenu triggers event or route changes
  useEffect(() => {
    const handleClose = () => closeMenu();

    // Listen for the custom event dispatched by PetMenu
    window.addEventListener("mypetai:close-mobile-nav", handleClose);

    // Also close whenever the route (pathname) changes
    handleClose(); // optional: ensure closed on first mount
    return () => window.removeEventListener("mypetai:close-mobile-nav", handleClose);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
  }, [menuOpen]);
  


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

        <ChatMenu /> {/* 👈 CHAT MENU dropdown */}
        {/*  <Link href="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
          Home
        </Link> */}

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
        <Link
          href="/contact"
          className={`nav-link ${isActive("/contact") ? "active" : ""}`}
        >
          Contact
        </Link>

        
      </nav>
    </header>
  );
}