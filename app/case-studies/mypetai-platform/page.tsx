// app/case-studies/mypetai-platform/page.tsx
import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";

export const metadata = {
  title: "MyPetAI — Case Study - Full-Stack Pet Care & Price Comparison Platform",
  description:
    "A production-grade web platform combining real-time chat, price comparison, SEO automation, and community features for pet owners.",
};

export default function MyPetAIPlatformCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="MyPetAI — Full-Stack Pet Care & Price Comparison Platform"
      subtitle="A production-grade web platform combining real-time chat, price comparison, SEO automation, and community features for pet owners."
      role="Founder & Full-Stack Engineer"
      period="From early 2025"
      techStack={[
        "Next.js (App Router)",
        "TypeScript",
        "Node.js",
        "Express",
        "Socket.IO",
        "MongoDB (Mongoose)",
        "Playwright",
        "NextAuth (Facebook OAuth)",
        "Tailwind CSS",
        "Vercel",
        "Render",
      ]}
      stats={[
        { label: "Products indexed", value: "6,000+ items" },
        { label: "Stores monitored", value: "15+ retailers" },
        { label: "Community size", value: "3,500+ guppy members" },
        { label: "Chat channels", value: "Topic & region-based rooms" },
      ]}
      links={[
        { label: "Live site", href: "https://www.mypetai.app" },
        // { label: "Frontend repo", href: "https://github.com/..." },
        // { label: "Backend repo", href: "https://github.com/..." },
      ]}
    >
      {/* Problem / Goal */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Problem & Goal</h2>
        <p className="text-gray-700">
          Pet owners in Australia constantly compare prices across Petbarn,
          Petstock, and many smaller stores to save money on food and
          accessories. At the same time, niche communities like the Melbourne
          Guppy Group are stuck inside Facebook, where search, history, and
          structured discussion are limited.
        </p>
        <p className="text-gray-700">
          I wanted to build a platform that solves both problems: a
          production-grade app that lets pet owners discover the best deals,
          manage their pets, and join real-time communities — while also
          showcasing my ability to design and ship an end-to-end system.
        </p>
      </section>

      {/* Architecture */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Architecture Overview</h2>
        <p className="text-gray-700">
          The platform is built as a modern full-stack system with a clear
          separation between frontend, backend, and background workers:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <span className="font-medium">Frontend:</span> Next.js App Router
            (React server components, dynamic routes) deployed on Vercel,
            styled with Tailwind CSS.
          </li>
          <li>
            <span className="font-medium">Backend:</span> Node.js + Express API
            with Socket.IO for real-time chat, deployed on Render.
          </li>
          <li>
            <span className="font-medium">Database:</span> MongoDB with
            Mongoose models for products, messages, users, highlights, and
            admin data.
          </li>
          <li>
            <span className="font-medium">Data ingestion:</span> Playwright
            crawlers running as separate scripts to pull and normalize pet
            products from multiple retailers.
          </li>
          <li>
            <span className="font-medium">AI & SEO layer:</span> scripts that
            fetch RSS feeds, generate summaries, and publish SEO-friendly
            highlight pages.
          </li>
        </ul>
        <p className="text-gray-700">
          This architecture lets me evolve each part independently (frontend,
          backend, crawlers) while keeping deployment simple.
        </p>
      </section>

      {/* Key Features */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Key Features & Responsibilities</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Designed and implemented a{" "}
            <span className="font-medium">deal search experience</span> where
            users can filter by species, category, breed compatibility, and
            free-text search.
          </li>
          <li>
            Built a <span className="font-medium">real-time chat</span> system
            with topic-based rooms (e.g. guppy, dog training, buy/sell), image
            uploads, message persistence, and guest vs logged-in flows.
          </li>
          <li>
            Integrated <span className="font-medium">Facebook OAuth</span> via
            NextAuth, handling tricky edge cases such as account linking and
            OAuth error loops.
          </li>
          <li>
            Created an <span className="font-medium">admin interface</span> to
            manage products, highlights, and internal tools without exposing
            raw database access.
          </li>
          <li>
            Implemented <span className="font-medium">SEO-friendly routing</span>{" "}
            with slugs, metadata, and constantly updating content via crawlers
            and RSS pipelines.
          </li>
        </ul>
      </section>

      {/* Challenges */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Challenges & How I Solved Them</h2>
        <h3 className="font-medium text-gray-800">
          1. Keeping product data consistent across multiple retailers
        </h3>
        <p className="text-gray-700">
          Different stores use different URL patterns, variant parameters, and
          naming conventions. I designed a normalization layer and introduced
          logging that surfaces when too many products fail to update, helping
          me quickly detect crawler breakages without corrupting data.
        </p>

        <h3 className="font-medium text-gray-800">
          2. Handling OAuth loops and account linking issues
        </h3>
        <p className="text-gray-700">
          During Facebook login, mismatched account IDs caused users to get
          stuck in a sign-in loop. I debugged the NextAuth callbacks and user
          profile mapping, ensuring consistent IDs across the account, user,
          and user profile collections in MongoDB.
        </p>

        <h3 className="font-medium text-gray-800">
          3. Balancing community UX across desktop and mobile
        </h3>
        <p className="text-gray-700">
          The chat layout had different needs on desktop (sidebar + chat side
          by side) vs mobile (toggleable room list, full-width chat). I
          refactored the layout logic to keep a single source of truth for the
          current room while conditionally rendering the sidebar based on
          viewport, avoiding duplicate state and broken layouts.
        </p>
      </section>

      {/* Outcome */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Outcome</h2>
        <p className="text-gray-700">
          MyPetAI is now a fully functioning platform for real communities: it aggregates thousands of
          products, supports live chat for 3,500+ guppy members, and provides a
          solid foundation for future AI personalization and mobile features.
          More importantly, it demonstrates my ability to design, build, and
          maintain a complex system end-to-end on my own.
        </p>
      </section>
    </CaseStudyLayout>
  );
}
