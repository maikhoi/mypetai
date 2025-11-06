'use client';

import Link from "next/link";
export default function AboutPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main
      style={{
        background: 'linear-gradient(135deg, #fffaf2 0%, #fff2e1 100%)',
        fontFamily: "'Poppins', sans-serif",
        color: '#333',
        minHeight: '60vh',
      }}
    >
      {/* Main Content */}
      <section
        style={{
          maxWidth: '900px',
          margin: '60px auto',
          background: '#fff',
          padding: '60px 40px',
          borderRadius: '20px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        }}
      >
        <h2
          style={{
            color: '#f5a623',
            textAlign: 'center',
            marginTop: 0,
            fontSize: '2.2rem',
          }}
        >
          About MyPetAI+
        </h2>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>MyPetAI+</strong> is an intelligent pet care assistant designed to simplify the lives of pet parents.
          From feeding reminders and grooming alerts to finding the best product deals — we’ve got you covered.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Our mission is to use <strong>AI</strong> to help owners understand and care for their pets better, making daily
          routines more rewarding and less stressful. The app was built by a passionate team of pet lovers who believe
          technology should make caring for animals easier and more joyful. 🐶🐱🐠
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Currently in <strong>Early Access</strong>, MyPetAI+ continues to evolve with features like:
        </p>

        <ul style={{ lineHeight: 1.8, marginBottom: 18, fontSize: '1rem' }}>
          <li>🤖 AI-powered breed recognition & care insights</li>
          <li>🕐 Smart reminders for feeding, grooming, and vet visits</li>
          <li>💰 Deal Finder to compare prices across major pet stores</li>
          <li>🎖️ Paw Coin reward system for early supporters</li>
        </ul>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          At <strong>MyPetAI+</strong>, we believe that caring for your pet shouldn’t be stressful — it should be smart,
          fun, and rewarding. Our goal is to build a companion app that learns from your habits and helps you create a
          better daily routine for your furry, feathered, or finned friends.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
        We’re proud to grow out of the <strong>Melbourne Guppy Group</strong>, a warm and welcoming community of over 3,600 fish keepers and pet enthusiasts from across Australia.
Together, we share care tips, product finds, and the joy of raising happy, healthy pets.

🐠 Join us on Facebook Group:{" "}
<Link
href="https://www.facebook.com/groups/melbourne.guppy"
style={{
  color: "#f5a623",
  fontWeight: 600,
  textDecoration: "underline",
  textDecorationStyle: "dotted",
  textUnderlineOffset: "3px",
  transition: "color 0.2s ease",
}}
onMouseEnter={(e) => (e.currentTarget.style.color = "#e28a0d")}
onMouseLeave={(e) => (e.currentTarget.style.color = "#f5a623")}
>
Melbourne Guppy Group →
</Link></p>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          🧡 Built with love in Australia, for pet lovers everywhere.
        </p>
      </section>
    </main>
  );
}
