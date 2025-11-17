// app/case-studies/price-crawler-engine/page.tsx
import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";


export const metadata = {
  title: "MyPetAI — Case Study - High-Scale Price Crawler Engine for Pet Products",
  description:
    "Playwright-based data pipeline that keeps 6,000+ pet products up to date across multiple Australian retailers.",
};

export default function PriceCrawlerEngineCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="High-Scale Price Crawler Engine for Pet Products"
      subtitle="Playwright-based data pipeline that keeps 6,000+ pet products up to date across multiple Australian retailers."
      role="Backend & Data Engineer"
      period="2024 – 2025"
      techStack={["Node.js", "TypeScript", "Playwright", "MongoDB", "Cron Jobs"]}
      stats={[
        { label: "Products tracked", value: "6,000+ items" },
        { label: "Retailers", value: "15+ stores" },
        { label: "Update cadence", value: "Daily / per-catalog" },
      ]}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Goal</h2>
        <p className="text-gray-700">
          Build a reliable, repeatable crawling pipeline to fetch prices,
          variants, and availability for thousands of pet products from
          multiple retailers — without breaking when sites change layout or add
          query parameters.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Approach & Architecture</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Used <span className="font-medium">Playwright</span> to handle
            dynamic content, pagination, and JavaScript-heavy catalogs.
          </li>
          <li>
            Designed a <span className="font-medium">catalog configuration</span>{" "}
            model that defines site URL, category, species, and selectors
            without hard-coding per-site logic.
          </li>
          <li>
            Implemented robust <span className="font-medium">URL matching</span>{" "}
            that supports variants (&quot;size&quot;, &quot;flavour&quot;,
            etc.) without accidentally modifying the input URL, keeping the
            system safe from writing to the wrong product.
          </li>
          <li>
            Added <span className="font-medium">structured logging</span> for
            each run, including total items, updated items, and a JSON file of
            missing products for later review.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Key Challenge: URL & Variant Matching</h2>
        <p className="text-gray-700">
          Some products are stored in MongoDB with variant query parameters,
          while the live site removed those parameters and moved variants into
          the path. This created a risk of either missing updates or updating
          the wrong product.
        </p>
        <p className="text-gray-700">
          To solve this, I built a safe URL-matching strategy that:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Escapes user-provided URLs before building regex patterns.</li>
          <li>Allows controlled flexibility for variant/query differences.</li>
          <li>
            Never mutates the original input URL (to avoid corrupting
            canonical product URLs).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Monitoring & Data Quality</h2>
        <p className="text-gray-700">
          I added per-catalog metrics such as &quot;updated vs missing&quot;.
          If missing items exceed a threshold (e.g., &gt;20–30%), the script
          flags that catalog as suspicious, which usually indicates that:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>The site has changed layout.</li>
          <li>Selectors are outdated.</li>
          <li>Pagination or filtering has changed.</li>
        </ul>
        <p className="text-gray-700">
          This gives me an early warning system without failing the whole run
          or silently corrupting data.
        </p>
      </section>
    </CaseStudyLayout>
  );
}
