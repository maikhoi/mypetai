"use client";

import Link from "next/link";

export default function MelbourneBusAssistSupportPage() {
  const currentYear = new Date().getFullYear();

  const linkStyle: React.CSSProperties = {
    color: "#f5a623",
    fontWeight: 600,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  };

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
          Melbourne Bus Assist – Support
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
          Need help with <strong>Melbourne Bus Assist</strong>? Use the options
          below to contact support, report a bug, or request a feature.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          1. Contact Support
        </h2>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>
            Email: <strong>support-mbbassist@mypetai.app</strong>
          </li>
          <li>
            Website:{" "}
            <Link
              href="https://www.mypetai.app/melbourne-bus-assist"
              style={linkStyle}
            >
              https://www.mypetai.app/melbourne-bus-assist
            </Link>
          </li>
          <li>
            Privacy Policy:{" "}
            <Link
              href="https://www.mypetai.app/melbourne-bus-assist-privacy"
              style={linkStyle}
            >
              https://www.mypetai.app/melbourne-bus-assist-privacy
            </Link>
          </li>
        </ul>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          2. Frequently Asked Questions
        </h2>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>
          2.1 Why does the app ask for location?
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Location is used to show nearby bus stops and improve relevance of
          departures. You can still browse without location by denying
          permission and using the app normally.
        </p>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>
          2.2 Why am I not receiving alerts?
        </h3>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Check that notifications are enabled for the app in iOS Settings.</li>
          <li>Confirm the alert is active inside the app.</li>
          <li>Make sure your device has an internet connection.</li>
          <li>
            If Low Power Mode is enabled, some background behaviours may be limited.
          </li>
        </ul>

        <h3 style={{ fontSize: "1.1rem", marginTop: 18, marginBottom: 8 }}>
          2.3 Does the app support trains and trams?
        </h3>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Not yet. Melbourne Bus Assist currently focuses on{" "}
          <strong>Melbourne bus services</strong>. Future updates may expand
          support to other transport modes.
        </p>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          3. Report a Bug
        </h2>
        <p style={{ lineHeight: 1.8, marginBottom: 18 }}>
          Please email{" "}
          <strong>support-mbbassist@mypetai.app</strong> with:
        </p>
        <ul style={{ lineHeight: 1.8, marginBottom: 18, paddingLeft: 22 }}>
          <li>Your device model (e.g. iPhone 14)</li>
          <li>iOS version</li>
          <li>App version</li>
          <li>What you were trying to do + what happened</li>
          <li>Screenshots (if possible)</li>
        </ul>

        <h2 style={{ fontSize: "1.4rem", marginTop: 32, marginBottom: 12 }}>
          4. Disclaimer
        </h2>
        <p style={{ lineHeight: 1.8, marginBottom: 0 }}>
          Melbourne Bus Assist is an independent app and is{" "}
          <strong>not affiliated with Public Transport Victoria (PTV)</strong>.
          Data accuracy depends on available public transport information.
        </p>
      </section>
    </main>
  );
}