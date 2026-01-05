'use client';

import Link from "next/link";

export default function MelbourneBusAssistSupportPage() {
  const currentYear = new Date().getFullYear();

  return (
<main
      style={{
        background: "linear-gradient(135deg, #fffaf2 0%, #fff2e1 100%)",
        fontFamily:
          "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#333",
        minHeight: "60vh",
      }}
    >
     <h1>Melb Bus Assist – Support</h1>

<p>If you need help, want to report a bug, or have feedback about Melb Bus Assist, please contact us:</p>

<p>Email: support@mypetai.app</p>

<p>Melb Bus Assist provides bus stop and departure information for Melbourne bus services only.</p>

<p>This app is not affiliated with Public Transport Victoria (PTV).</p>   
    </main>
      );
}