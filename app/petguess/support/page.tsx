'use client';

import Link from "next/link";

export default function PetGuessSupportPage() {
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
          PetGuess+ AI Support
        </h2>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Welcome to the official support page for <strong>PetGuess+ AI</strong>.  
          If you need help using the app, have questions, or want to report an issue,
          you will find all relevant information below.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: '40px' }}>About PetGuess+ AI</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          PetGuess+ AI helps users identify pet species and breeds using image recognition
          technology. The app also provides general breed information and care guidance based
          on the identification results.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: '40px' }}>Frequently Asked Questions</h3>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>How does the app work?</strong><br />
          You can take a photo or upload one from your gallery. PetGuess+ AI analyzes the
          image and predicts the most likely species and breed.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Does the app collect personal data?</strong><br />
          No. The app does not require an account, does not ask for personal details,
          and does not link photos to user identities.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Why is the prediction sometimes inaccurate?</strong><br />
          Predictions can vary depending on image quality, lighting, angle, and whether
          the pet is a mixed breed. Clear, front-facing photos usually produce the best results.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>What types of pets can the app identify?</strong><br />
          The app supports dogs, cats, birds, and various small animals. More categories will
          be added over time as the model improves.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Why does the app contain advertisements?</strong><br />
          PetGuess+ AI is free to use. Advertisements help support ongoing development
          and server maintenance.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: '40px' }}>Troubleshooting</h3>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Identification is not working.</strong><br />
          Ensure the pet's face is clearly visible, avoid blurry images, and try retaking the photo with better lighting.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>The app is slow or not responding.</strong><br />
          Check your internet connection, close and reopen the app, or restart your device.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Camera or photo upload is not working.</strong><br />
          Make sure the app has permission to access your camera and photo library.
        </p>

        <h3 style={{ color: '#f5a623', marginTop: '40px' }}>Contact Support</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          If you need assistance or would like to report an issue, please contact us at:<br />
          <strong>Email:</strong> support@mypetai.app
        </p>

        <h3 style={{ color: '#f5a623', marginTop: '40px' }}>Additional Resources</h3>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Privacy Policy:</strong><br />
          <Link
            href="https://mypetai.app/privacy"
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
            https://mypetai.app/privacy
          </Link>
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          <strong>Official Website:</strong><br />
          <Link
            href="https://mypetai.app/petguess"
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
            https://mypetai.app/petguess
          </Link>
        </p>

      </section>
    </main>
  );
}