import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "TransitSense+ AI — Case Study",
  description:
    "A real-time public transport intelligence platform built with Node.js, Prisma, PostgreSQL, and GTFS ingestion. Includes predictive routing, live departures, and a planned companion mobile app built with React Native.",
};

export default function TransitSenseCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="TransitSense+ AI"
      subtitle="A real-time public transport data engine built for instant departure lookups, delay insights, and future predictive commuting using GTFS feeds and a TypeScript backend."
      role="Backend & Full-Stack Engineer"
      techStack={[
        "Node.js",
        "TypeScript",
        "Fastify / Express",
        "Prisma ORM",
        "PostgreSQL",
        "GTFS Static + Real-Time Feeds",
        "Cron & Scheduled Pipelines",
        "Linux (Rocky)",
        "Docker (future)",
        "React Native (planned)",
      ]}
    >
      {/* Overview */}
      <section className="space-y-3 mt-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-gray-700">
          TransitSense+ AI is a next-generation public transport data engine
          designed to give commuters fast, clean, and accurate departure
          predictions. It processes GTFS feeds, stores structured timetable data,
          and exposes real-time API endpoints for use in future mobile and web
          apps.
        </p>

        <p className="text-gray-700">
          The goal of TransitSense+ AI is simple: create the fastest and most
          reliable way for users to check the next bus, tram, or train arrival—
          without the clutter and complexity of existing transport apps. The
          backend is fully custom-built using Node.js, Prisma, and PostgreSQL,
          focusing on speed, correctness, and a predictable data model that can
          scale to millions of departures.
        </p>

        <p className="text-gray-700">
          TransitSense+ AI is currently in development and will evolve into a
          fully featured mobile experience built with React Native.
        </p>
      </section>

      {/* Key Features */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Real-Time Departure Lookups</strong>: API returns the next
            departures for any stop, route, or direction with microsecond-level
            database filtering.
          </li>
          <li>
            <strong>GTFS Static Feed Ingestion</strong>: Timetables, routes,
            shapes, and stop metadata imported into PostgreSQL using Prisma.
          </li>
          <li>
            <strong>Schedule-Aware Logic</strong>: Computes upcoming departures
            based on weekday, weekend, and holiday variations.
          </li>
          <li>
            <strong>Precision Filtering</strong>: Backend finds the next
            departures within seconds using optimised SQL queries and
            pre-indexed GTFS data.
          </li>
          <li>
            <strong>High-Performance API Layer</strong>: Built using Fastify or
            Express, depending on the environment.
          </li>
          <li>
            <strong>Future Prediction Engine</strong>: Planned ML-powered delay
            prediction based on historical actual vs scheduled arrival deltas.
          </li>
        </ul>
      </section>

      {/* Data Pipeline */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">GTFS Data Pipeline</h2>
        <p className="text-gray-700">
          TransitSense+ AI relies on high-quality, structured transport data. The
          GTFS ingestion and processing pipeline works as follows:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            A scheduled cron task downloads the latest GTFS dataset from the
            transport authority.
          </li>
          <li>
            Files are parsed and transformed into normalized tables such as
            <code> routes </code>, <code> trips </code>, <code> stops </code>,{" "}
            <code> stop_times </code>, and <code> calendar </code>.
          </li>
          <li>
            Prisma loads data efficiently into PostgreSQL using batch upserts and
            indexed tables.
          </li>
          <li>
            The departure engine calculates next arrivals based on the current
            time, trip schedule, and route–stop relationships.
          </li>
        </ul>

        <p className="text-gray-700">
          The design ensures queries remain fast even as the dataset grows. In
          earlier tests, the backend returned the next departures for a stop in
          under 5ms using indexed SQL.
        </p>
      </section>

      {/* Architecture */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Architecture</h2>
        <p className="text-gray-700">
          TransitSense+ AI’s architecture focuses on speed, simplicity, and the
          ability to scale into a full mobile ecosystem.
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Backend</strong>: Node.js + TypeScript with Fastify or
            Express for ultra-low-latency responses.
          </li>
          <li>
            <strong>Database</strong>: PostgreSQL with Prisma for schema
            migrations, type-safe queries, and optimized indexes.
          </li>
          <li>
            <strong>Data Ingestion</strong>: Cron-based GTFS import pipeline with
            batch processing.
          </li>
          <li>
            <strong>API Layer</strong>: Endpoints for stops, routes, real-time
            departures, and future predictive schedules.
          </li>
          <li>
            <strong>Deployment</strong>: Rocky Linux VM (Docker and container
            orchestration planned).
          </li>
          <li>
            <strong>Future Client App</strong>: React Native mobile app for fast,
            location-aware public transport lookups.
          </li>
        </ul>

        <p className="text-gray-700">
          The architecture intentionally mirrors enterprise-grade transport
          systems but remains lightweight for rapid iteration. Its modular nature
          makes it ideal for future expansion into event-driven streams,
          historical analytics, and predictive modelling.
        </p>
      </section>

      {/* Future Mobile App */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Future Mobile App</h2>
        <p className="text-gray-700">
          The upcoming React Native app will serve as the main user interface for
          commuters. Planned features include:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Instant Departure Lookup</strong> based on the user’s current
            location.
          </li>
          <li>
            <strong>Saved Stops & Routes</strong> for quick access.
          </li>
          <li>
            <strong>Delay Insights</strong> based on real-time vs scheduled data.
          </li>
          <li>
            <strong>Push Notifications</strong> for morning commute reminders or
            service disruptions.
          </li>
          <li>
            <strong>Predictive Arrival Engine</strong> using historical patterns
            (planned).
          </li>
        </ul>

        <p className="text-gray-700">
          The UI will prioritise speed, minimalism, and actionable information—
          no clutter, no heavy maps, just clear next departures.
        </p>
      </section>

      {/* Conclusion */}
      <section className="space-y-3 mt-8 mb-10">
        <h2 className="text-xl font-semibold">Outcome</h2>
        <p className="text-gray-700">
          TransitSense+ AI demonstrates the backend engineering required to power
          a fast, reliable public transport companion app. From GTFS data
          modelling to real-time departure queries, the system is engineered for
          accuracy, performance, and future scalability.
        </p>

        <p className="text-gray-700">
          With continued development of the React Native app and predictive
          arrival engine, TransitSense+ AI has the potential to become a
          lightweight commuter tool that rivals existing transport apps while
          delivering a cleaner, faster user experience.
        </p>
      </section>
    </CaseStudyLayout>
  );
}