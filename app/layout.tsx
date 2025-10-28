'use client';

import './globals.css';
import Script from "next/script";
import type { Metadata } from "next";
import { Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "MyPetAI+ — Smart Pet Care & Best Deals Finder",
  description:
    "MyPetAI+ helps pet owners manage care reminders, find cheaper pet food and supplies, and track health schedules — all powered by smart recommendations.",
  keywords:
    "pet care, pet food deals, pet reminders, pet tracking, MyPetAI, best prices, dog food, cat food, aquarium, fish care, aquatic, pet supplies, pet health, pet wellness, pet discounts",
  authors: [{ name: "MyPetAI Team" }],
  openGraph: {
    title: "MyPetAI+ — Smarter Pet Care & Best Deals",
    description:
      "Track your pet’s care, find great deals, and simplify your pet’s daily routine with MyPetAI+.",
    url: "https://mypetai.app",
    siteName: "MyPetAI+",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://mypetai.app/preview.jpg",
        width: 1200,
        height: 630,
        alt: "MyPetAI+ Smart Pet Care and Deals Finder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyPetAI+ — Smart Pet Care & Deals",
    description:
      "Find the best deals for your pets and manage their care easily.",
    images: ["https://mypetai.app/preview.jpg"],
  },
};

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={poppins.className}>
      <body>
      <Suspense fallback={null}>
          <Navbar />
        </Suspense>

        <main className="page-container">{children}</main>

        <footer className="footer">
          <p>
            © {currentYear} MyPetAI+. All Rights Reserved. |{' '}
            <a href="/about">About</a> | <a href="/privacy">Privacy</a> |{' '}
            <a href="mailto:hello@mypetai.app">Contact Us</a>
          </p>
        </footer>

        {/* ✅ Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0Z0JHTF516"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0Z0JHTF516', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
