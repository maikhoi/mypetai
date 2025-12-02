'use client';

import Link from "next/link";

export default function PetGuessPrivacyPolicyPage() {
  const currentYear = new Date().getFullYear();

  return (
    <main
      style={{
        background: "linear-gradient(135deg, #fffaf2 0%, #fff2e1 100%)",
        fontFamily: "'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        color: "#333",
        minHeight: "60vh",
      }}
    >
      <section
        style={{
          maxWidth: "900px",
          margin: "60px auto",
          background: "#fff",
          padding: "60px 40px",
          borderRadius: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
        }}
      >
        <h1
          style={{
            color: "#f5a623",
            textAlign: "center",
            marginTop: 0,
            fontSize: "2.4rem",
          }}
        >
          PetGuess+ AI – Privacy Policy
        </h1>

        <p style={{ lineHeight: 1.8, marginBottom: 18, textAlign: "center", fontSize: "0.95rem", color: "#777" }}>
          Last updated: {currentYear}
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          This Privacy Policy explains how <strong>PetGuess+ AI</strong> (the “App”) handles information when you use
          the app to identify pets and view pet care content. PetGuess+ AI is part of the{" "}
          <strong>MyPetAI</strong> project operated from <strong>Australia</strong>.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We designed this app to work with as little personal data as possible. You do not need to create an account
          to use the App, and we do not ask for your name, email address, or other direct identifiers.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>1. Information We Collect</h2>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>1.1 Photos You Provide</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          When you use PetGuess+ AI to identify a pet, you can take a photo with your camera or choose a photo from
          your device. These images are used solely to:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Run AI models that detect the pet’s species and breed.</li>
          <li>Show you the result and optional care information for that pet.</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Depending on your settings and how you use the App, some images or derived data (for example, cropped images,
          AI predictions, or confidence scores) may be temporarily sent to our backend services at{" "}
          <strong>mypetai.app</strong> for processing. We do not use these images to identify you personally.
        </p>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>1.2 Saved Pets & Local Data</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          The App allows you to save identified pets (for example, “My Buddy – Bull Mastiff”) so you can view them
          later in the <strong>My Pets</strong> section. These records are primarily stored on your device. If we sync
          this data with our backend in the future, it will be for app functionality only (for example, backup and
          multi-device support) and not for advertising-based tracking.
        </p>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>1.3 Analytics & Diagnostics</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We may collect basic, non-identifying analytics and diagnostic information such as:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>App version and device model.</li>
          <li>Crash logs and performance metrics.</li>
          <li>Anonymous usage patterns (for example, which screens are used most).</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          This information helps us improve stability and usability. We do not use analytics data to track you across
          other companies’ apps or websites.
        </p>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>1.4 Advertising</h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          The App may show ads or optional rewarded video content (for example, “Watch Video to Support Us”). We aim to
          configure advertising so that we do not collect or share data for cross-app tracking. If a third-party ad
          provider is used, their data practices are governed by their own privacy policies, and we will keep their use
          as limited and privacy-friendly as possible.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>2. How We Use Information</h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>We use the information described above to:</p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Identify pet species and breeds using AI models.</li>
          <li>Display pet care tips, feeding guidelines, and other educational content.</li>
          <li>Let you save and manage a list of your pets inside the App.</li>
          <li>Maintain and improve the performance, reliability, and user experience of the App.</li>
        </ul>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>3. Data Sharing & Third Parties</h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We do not sell your personal data. We may share limited information with service providers who help us run
          the App, such as:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Cloud hosting providers for our APIs and AI models.</li>
          <li>Analytics or crash reporting tools.</li>
          <li>Advertising networks, where applicable, for showing in-app ads.</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          These providers are only allowed to use the data on our behalf and must handle it in line with applicable
          privacy laws.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>4. Data Retention</h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We keep data only for as long as necessary to provide and improve the App. Photos and AI predictions used for
          a single identification request may be kept temporarily for processing and quality monitoring. Saved pets and
          related information remain on your device until you delete them (for example, using the delete button in the
          My Pets screen) or uninstall the App.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>5. Your Choices</h2>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>
            <strong>Camera & Photo Access:</strong> You can disable camera or photo library access in your device
            settings. This will limit identification features but the rest of the App (for example, pet care knowledge)
            may still work.
          </li>
          <li>
            <strong>Deleting Saved Pets:</strong> You can remove saved pets directly in the App, and you can uninstall
            the App at any time to remove locally stored app data.
          </li>
        </ul>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>6. Children’s Privacy</h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          PetGuess+ AI is designed for general audiences and may be used by families and younger users under adult
          supervision. We do not knowingly collect personal information from children. If you believe we have collected
          personal data from a child without appropriate consent, please contact us so we can investigate and delete the
          information where required.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>7. International Transfers</h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Our servers and service providers may be located in different countries. By using the App, you understand
          that your information may be processed in regions outside your home country where privacy laws may differ.
          We will take reasonable steps to protect your data in line with this Privacy Policy.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>8. Changes to This Policy</h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We may update this Privacy Policy from time to time as the App evolves or as legal requirements change. When
          we make material changes, we will update the “Last updated” date at the top of this page. We encourage you to
          review this page periodically.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>9. Contact Us</h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          If you have any questions about this Privacy Policy or how PetGuess+ AI handles data, you can contact us at:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>
            Website:{" "}
            <Link
              href="https://www.mypetai.app"
              style={{ color: "#f5a623", fontWeight: 600, textDecoration: "underline", textUnderlineOffset: "3px" }}
            >
              https://www.mypetai.app
            </Link>
          </li>
          <li>Email: <strong>support@mypetai.app</strong></li>
        </ul>

        <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
          By using PetGuess+ AI, you agree to this Privacy Policy.
        </p>
      </section>
    </main>
  );
}