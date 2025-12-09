// app/case-studies/page.tsx
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

const CASE_STUDIES = [
  {
    slug: "mypetai-platform",
    title: "MyPetAI Platform",
    subtitle: "Full-stack pet care & price comparison platform.",
    role: "Founder & Full-Stack Engineer",
    tags: ["Next.js", "Node.js", "MongoDB", "Real-time", "SEO", "AI"],
  },
  {
    slug: "price-crawler-engine",
    title: "Price Crawler Engine",
    subtitle: "High-scale Playwright-based product crawler.",
    role: "Backend / Data Engineer",
    tags: ["Node.js", "Playwright", "Data Pipelines"],
  },
  {
    slug: "realtime-chat",
    title: "Real-Time Community Chat",
    subtitle: "Socket.IO chat with rooms, auth & persistence.",
    role: "Full-Stack Engineer",
    tags: ["Socket.IO", "Express", "MongoDB", "Auth"],
  },
  {
    slug: "ai-highlight-pipeline",
    title: "AI Highlight & SEO Pipeline",
    subtitle: "Automated RSS → summary → image → SEO pages.",
    role: "Automation & AI Engineer",
    tags: ["Node.js", "OpenAI", "Pexels", "SEO"],
  },
  {
    slug: "mobile-app",
    title: "MyPetAI Mobile App",
    subtitle: "Cross-platform pet companion for iOS & Android.",
    role: "Mobile & API Integrations",
    tags: ["React Native", "Expo", "AsyncStorage"],
  },
  {
    slug: "petguess-app",
    title: "PetGuess+AI Mobile iOS & Android App",
    subtitle: "Cross-platform pet companion for iOS & Android.",
    role: "Mobile & API Integrations",
    tags: ["React Native", "Expo", "AsyncStorage", "ONNX Runtime"],
  },  
  // {
  //   slug: "transitsense-app",
  //   title: "TransitSense+AI Public Transport Engine",
  //   subtitle: "Real-time GTFS-powered transport insights and departure lookup.",
  //   role: "Backend Engineering & Future Mobile Development",
  //   tags: ["Node.js", "Prisma", "PostgreSQL", "GTFS", "TypeScript"],
  // },
];

export default function CaseStudiesIndexPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Case Studies"},
        ]}
      />
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-500">
          Portfolio
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">Case Studies</h1>
        <p className="text-gray-600 max-w-2xl">
          A selection of end-to-end projects I&apos;ve designed and built — from
          crawlers and real-time systems to mobile apps and AI-powered content
          pipelines.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {CASE_STUDIES.map((cs) => (
          <Link
            key={cs.slug}
            href={`/case-studies/${cs.slug}`}
            className="block border rounded-2xl bg-white p-5 shadow-sm hover:shadow-md hover:border-amber-400 transition"
          >
            <h2 className="font-semibold text-lg mb-1">{cs.title}</h2>
            <p className="text-sm text-gray-600 mb-3">{cs.subtitle}</p>
            <p className="text-xs text-gray-500 mb-3">{cs.role}</p>
            <div className="flex flex-wrap gap-2">
              {cs.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] uppercase tracking-wide rounded-full bg-amber-50 border border-amber-100 px-2 py-1 text-amber-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
