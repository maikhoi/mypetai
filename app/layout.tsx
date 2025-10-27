'use client';

import './globals.css';
import { Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Suspense } from "react";

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
      </body>
    </html>
  );
}
