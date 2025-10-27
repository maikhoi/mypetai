"use client";
import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav style={{ margin: "10px 0", fontSize: "0.9rem" }}>
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <Link href={item.href} style={{ color: "#f5a623", textDecoration: "none" }}>
              {item.label}
            </Link>
          ) : (
            <span style={{ color: "#333" }}>{item.label}</span>
          )}
          {i < items.length - 1 && <span style={{ color: "#999" }}> → </span>}
        </span>
      ))}
    </nav>
  );
}
