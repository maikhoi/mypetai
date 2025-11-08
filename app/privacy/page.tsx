'use client';

export default function PrivacyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main
      style={{
        background: 'linear-gradient(135deg, #fffaf2 0%, #fff2e1 100%)',
        fontFamily: "'Poppins', sans-serif",
        color: '#333',
        minHeight: '100vh',
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
        <h2 style={{ color: '#f5a623', textAlign: 'center', marginTop: 0 }}>Privacy Policy</h2>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Effective Date:</strong> October 14, 2025
        </p>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Website:</strong>{' '}
          <a href="https://mypetai.app" style={{ color: '#f5a623', textDecoration: 'none' }}>
            https://mypetai.app
          </a>
        </p>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Mobile App:</strong> MyPetAI+
        </p>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Owner:</strong> MyPetAI
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>1. Introduction</h3>
        <p style={{ lineHeight: 1.8 }}>Welcome to <strong>MyPetAI+</strong>!</p>
        <p style={{ lineHeight: 1.8 }}>
          We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains
          how we collect, use, and protect the data you provide when using our website and app.
        </p>
        <p style={{ lineHeight: 1.8 }}>
          By visiting or using <strong>mypetai.app</strong>, you agree to the terms of this Privacy Policy.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>2. Information We Collect</h3>
        <ul style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <li>
            <strong>Email Address</strong> — when you sign up for early access, reminders, or updates.
          </li>
          <li>
            <strong>Optional Info</strong> — such as your pet’s name or type, if you provide it in future features.
          </li>
          <li>
            <strong>Facebook Login</strong> — MyPetAI only uses Facebook Login to verify your identity and display
        your name and profile picture in chat. We do not store or share any
        personal Facebook data.
          </li>
        </ul>
        <p style={{ lineHeight: 1.8 }}>
          We do not collect payment details or sensitive personal information through the website.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>3. How We Use Information</h3>
        <ul style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <li>To send product updates, launch announcements, and pet care content.</li>
          <li>To improve our website and app experience.</li>
          <li>To share relevant promotions or partner offers for pet products.</li>
        </ul>
        <p style={{ lineHeight: 1.8 }}>You can unsubscribe from emails at any time via the “Unsubscribe” link.</p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>4. Affiliate Links and Commissions</h3>
        <p style={{ lineHeight: 1.8 }}>
          MyPetAI may include affiliate links to third-party stores (e.g., Petbarn, Petstock, PetCulture). If you click an
          affiliate link and make a purchase, we may earn a small commission at no extra cost to you. We aim to recommend
          brands and products we believe are genuinely useful to pet owners.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>5. Data Storage and Security</h3>
        <p style={{ lineHeight: 1.8 }}>
          Your data may be stored with reputable third-party services (for example, email marketing or analytics
          providers). We take reasonable steps to protect your information from unauthorised access, loss, or misuse.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>6. Third-Party Services</h3>
        <p style={{ lineHeight: 1.8 }}>
          We may use third-party tools for analytics, email delivery, or affiliate tracking. These providers are expected
          to comply with applicable privacy standards, including the{' '}
          <strong>Australian Privacy Principles (APPs)</strong>.
        </p>

        <h3 id="data-deletion" style={{ color: '#f5a623', marginTop: 25 }}>7. Facebook User Data Deletion</h3>
        <p  className="text-gray-700 leading-relaxed">        
            If you have logged in to MyPetAI using your Facebook account and would like to delete your
            Facebook-related data from our system, you can do so in one of the following ways:
        </p>
        <ul  className="list-disc list-inside my-4 text-gray-700">
          <li>Send an email to <a href="mailto:support@mypetai.app" className="text-blue-600 underline">
        support@mypetai.app
      </a> requesting removal of your data.</li>
          <li>Or visit your Facebook settings and remove “MyPetAI” from the list of connected apps.
      Facebook will automatically send us a deletion request for your associated data.</li>
        </ul>
        <p style={{ lineHeight: 1.8 }}>        
        Once we receive a valid deletion request, all Facebook-linked user information (name, email, and
    profile image) will be permanently removed from our records within 7 days.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>8. Your Rights</h3>
        <ul style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <li>Access and update your personal information.</li>
          <li>Request deletion of your data.</li>
          <li>Withdraw consent to receive communications.</li>
        </ul>
        <p style={{ lineHeight: 1.8 }}>
          To make a request, contact us at{' '}
          <a href="mailto:support@mypetai.app" style={{ color: '#f5a623', textDecoration: 'none' }}>
            support@mypetai.app
          </a>
          .
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>9. Changes to This Policy</h3>
        <p style={{ lineHeight: 1.8 }}>
          We may update this Privacy Policy to reflect new features or legal requirements. Updates will be posted here
          with a new effective date.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: 25 }}>10. Contact Us</h3>
        <p style={{ lineHeight: 1.8 }}>
          If you have questions about this Privacy Policy, please email{' '}
          <a href="mailto:support@mypetai.app" style={{ color: '#f5a623', textDecoration: 'none' }}>
            support@mypetai.app
          </a>
          .
        </p>
      </section>
    </main>
  );
}
