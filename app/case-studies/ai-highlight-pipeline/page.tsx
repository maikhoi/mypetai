// app/case-studies/ai-highlight-pipeline/page.tsx
import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";

export const metadata = {
  title: "MyPetAI — Case Study - AI-Powered Highlight & SEO Content Pipeline",
  description:
    "Automated pipeline that ingests pet articles via RSS, generates summaries and images, and publishes SEO-friendly highlight pages.",
};

export default function AIHighlightPipelineCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="AI-Powered Highlight & SEO Content Pipeline"
      subtitle="Automated pipeline that ingests pet articles via RSS, generates summaries and images, and publishes SEO-friendly highlight pages."
      role="Automation & AI Engineer"
      techStack={[
        "Node.js",
        "TypeScript",
        "MongoDB",
        "RSS",
        "OpenAI API",
        "Pexels API",
      ]}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Problem</h2>
        <p className="text-gray-700">
          I wanted MyPetAI to have fresh, high-quality content without manually
          writing blog posts. The goal was to automatically ingest pet-related
          articles, summarize them, attach images, and expose them as
          highlight pages that improve SEO and user value.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pipeline Design</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Fetch RSS feeds from curated pet blogs and resources.</li>
          <li>Parse items, deduplicate by URL and title, and skip old entries.</li>
          <li>
            Generate short, readable summaries using the OpenAI API (with
            fallbacks when not available).
          </li>
          <li>
            Attach images: try AI-generated first, then patch to use Pexels
            search with category-aware keywords (fish, dog, cat, etc.).
          </li>
          <li>
            Store the result in MongoDB as a Highlight document with slug,
            image, source, and metadata.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Category & Image Matching Challenges</h2>
        <p className="text-gray-700">
          Articles can mention both &quot;cat&quot; and &quot;fish&quot; in the
          same URL or title, even if the main topic is &quot;how to stop your
          cat eating your fish&quot;. I had to design a basic categorization
          strategy that:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Uses both URL and title context when inferring the main species.</li>
          <li>
            Avoids misclassifying content just because one keyword appears in
            the URL.
          </li>
          <li>
            Provides reasonable defaults so the content is still useful even if
            category detection is imperfect.
          </li>
        </ul>
      </section>
    </CaseStudyLayout>
  );
}
