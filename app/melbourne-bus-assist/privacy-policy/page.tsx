'use client';

import Link from "next/link";

export default function MelbourneBusAssistPrivacyPolicyPage() {
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
          Melbourne Bus Assist – Privacy Policy
        </h1>

        <p
          style={{
            lineHeight: 1.8,
            marginBottom: 18,
            textAlign: "center",
            fontSize: "0.95rem",
            color: "#777",
          }}
        >
          Last updated: {currentYear}
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          This Privacy Policy explains how <strong>Melbourne Bus Assist</strong>{" "}
          (the “App”) collects, uses, and protects information when you use the
          App to view nearby bus stops, routes, and receive bus-related alerts in
          Melbourne, Australia.
        </p>

        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We designed Melbourne Bus Assist to work with minimal personal data.
          You do not need to create an account to use the App, and we do not ask
          for your name, email address, or other direct identifiers.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          1. Information We Collect
        </h2>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>
          1.1 Location Information
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Melbourne Bus Assist collects precise location data to:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Find nearby bus stops.</li>
          <li>Display relevant bus routes and departures.</li>
          <li>Trigger optional location-based bus alerts.</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Location data is used only for app functionality and is processed in
          real time. It is not used to identify you personally, and it is not
          stored long-term. You can disable location access at any time in your
          device settings.
        </p>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>
          1.2 Notifications & Alert Preferences
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          If you enable notifications, the App stores:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>A device notification token.</li>
          <li>Your selected bus stops, routes, or alert preferences.</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          This information is used solely to deliver the alerts you request.
        </p>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>
          1.3 Analytics & Diagnostics
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We may collect basic, non-identifying diagnostic information such as:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>App version and device type.</li>
          <li>Crash logs and performance metrics.</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          This data helps us improve reliability and performance and is not used
          for tracking users across apps or websites.
        </p>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>
          1.4 Advertising (Google AdMob)
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Melbourne Bus Assist displays ads provided by <strong>Google AdMob</strong>.
          AdMob may use device identifiers, such as the Android Advertising ID,
          to serve and measure ads in accordance with Google’s privacy policies.
        </p>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We do not have access to or control over how Google processes this data.
          You can learn more about how Google uses data in advertising here:{" "}
          <Link
            href="https://policies.google.com/privacy"
            target="_blank"
            style={{
              color: "#f5a623",
              fontWeight: 600,
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            https://policies.google.com/privacy
          </Link>
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          2. How We Use Information
        </h2>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Provide nearby bus and timetable information.</li>
          <li>Send bus alerts you explicitly enable.</li>
          <li>Display ads to support the operation of the App.</li>
          <li>Maintain and improve app stability and usability.</li>
        </ul>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          3. Data Sharing & Third Parties
        </h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We do not sell your personal data. Limited data may be shared with
          trusted third-party service providers, including:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Google AdMob (advertising services).</li>
          <li>Cloud hosting providers.</li>
          <li>Push notification delivery services.</li>
          <li>Crash reporting tools.</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          These providers are permitted to use data only to deliver their
          services and must handle it in accordance with applicable privacy
          laws.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          4. Data Retention
        </h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Location data is processed in real time and not stored long-term. Alert
          preferences and notification tokens are retained only while alerts are
          active. Advertising data is handled by Google AdMob according to their
          retention policies. You can stop all data collection by uninstalling
          the App.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          5. Your Choices
        </h2>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>
            <strong>Location access:</strong> You can enable or disable location
            permissions in your device settings.
          </li>
          <li>
            <strong>Ads personalisation:</strong> You can manage ad
            personalisation settings through your Google account or device
            settings.
          </li>
          <li>
            <strong>Uninstall:</strong> Removing the App stops further data
            collection.
          </li>
        </ul>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          6. Children’s Privacy
        </h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Melbourne Bus Assist is not directed at children under 13, and we do
          not knowingly collect personal information from children.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          7. Changes to This Policy
        </h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          We may update this Privacy Policy from time to time. When changes are
          made, the “Last updated” date will be revised.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          8. Contact Us
        </h2>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>
            Website:{" "}
            <Link
              href="https://www.mypetai.app/melbourne-bus-assist"
              style={{
                color: "#f5a623",
                fontWeight: 600,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              https://www.mypetai.app/melbourne-bus-assist
            </Link>
          </li>
          <li>Email: <strong>support-mbbassist@mypetai.app</strong></li>
        </ul>

        <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
          By using Melbourne Bus Assist, you agree to this Privacy Policy.
        </p>
      </section>
    </main>
  );
}