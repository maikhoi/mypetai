"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ChatMenu() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

 // const [topics, setTopics] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🧭 Fetch chat topics dynamically (optional)
  // 🧭 Static chat topics (hardcoded)
  const topics = [
    { name: "Guppy Discussion", slug: "guppy" },
    { name: "Dog Discussion", slug: "dog" },
    { name: "Cat Discussion", slug: "cat" },
    { name: "MyPetAI Discussion", slug: "mypetai" },
  ];

  // 🧭 Auto-close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // 🧭 Hover logic (like PetMenu)
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (window.innerWidth > 768) setIsOpen(true);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsOpen(false), 400);
    }
  };
  const handleToggleClick = () => {
    if (window.innerWidth <= 768) setIsOpen((o) => !o);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const inChatSection = pathname.startsWith("/community/chat");

  return (
    <div
      ref={rootRef}
      className="chatnav-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`chatnav-toggle ${inChatSection ? "active" : ""}`}
        onClick={handleToggleClick}
        aria-expanded={isOpen}
      >
        💬 Chat
      </button>

      {isOpen && (
        <div
          className="chatnav-dropdown"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            padding: 12,
            zIndex: 9999,
            minWidth: 220,
          }}
        >
          {topics.map((t) => {
            const isActive = pathname.includes(t.slug);
            return (
              <Link
                key={t.slug}
                href={`/community/${t.slug}/chat`}
                className={`block px-3 py-2 rounded-md text-sm ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t.name}
              </Link>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .chatnav-container {
          position: relative;
          display: inline-block;
        }

        .chatnav-toggle {
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
        .chatnav-toggle:hover {
          color: #0070f3;
        }
        .chatnav-toggle.active {
          color: #0070f3;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
