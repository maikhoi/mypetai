'use client';

export default function AffiliateDisclosurePage() {
  return (
    <main
      style={{
        background: 'linear-gradient(135deg, #fffaf2 0%, #fff2e1 100%)',
        fontFamily: "'Poppins', sans-serif",
        color: '#333',
        minHeight: '50vh',
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
          Affiliate Disclosure
        </h2>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>MyPetAI.app</strong> participates in affiliate marketing programs designed to provide a means for pet
          owners to discover and purchase products from trusted retailers. This means we may earn a small commission
          when you make a purchase through links on our website — at no extra cost to you.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          These affiliate partnerships help us maintain and improve the platform, allowing us to continue offering tools,
          content, and features that make pet ownership easier, more fun, and more affordable.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We only recommend products and retailers that we personally believe provide genuine value to pet owners.
          Our mission is to make caring for pets smarter, simpler, and more rewarding for everyone. 🐾
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 0, textAlign: 'center' }}>
          💛 Thank you for supporting <strong>MyPetAI+</strong> and helping us grow!
        </p>
      </section>
    </main>
  );
}
