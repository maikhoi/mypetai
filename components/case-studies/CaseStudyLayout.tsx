// components/case-studies/CaseStudyLayout.tsx
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";

type Stat = {
  label: string;
  value: string;
};

type LinkItem = {
  label: string;
  href: string;
};

interface CaseStudyLayoutProps {
  title: string;
  subtitle: string;
  role: string;
  period?: string;
  techStack: string[];
  stats?: Stat[];
  links?: LinkItem[];
  children: React.ReactNode;
}

export default function CaseStudyLayout({
  title,
  subtitle,
  role,
  period,
  techStack,
  stats,
  links,
  children,
}: CaseStudyLayoutProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
          { label: title },
        ]} />
      {/* Hero */}
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-amber-500">
          Case Study
        </p>
        <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
        <p className="text-gray-600 text-base md:text-lg">{subtitle}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-2">
          <span className="inline-flex items-center rounded-full border px-3 py-1 bg-white">
            <span className="font-medium text-gray-700">Role:&nbsp;</span>
            {role}
          </span>
          {period && (
            <span className="inline-flex items-center rounded-full border px-3 py-1 bg-white">
              <span className="font-medium text-gray-700">Period:&nbsp;</span>
              {period}
            </span>
          )}
        </div>
      </header>

      {/* Meta row */}
      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
            Tech stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <span
                key={t}
                className="text-xs rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-amber-800"
              >
                {t}
              </span>
            ))}
          </div>

          {links && links.length > 0 && (
            <div className="pt-4 space-y-2">
              <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                Links
              </h3>
              <div className="flex flex-wrap gap-3 text-sm">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="inline-flex items-center gap-1 border px-3 py-1.5 rounded-full text-gray-700 hover:border-amber-500 hover:text-amber-700 transition"
                  >
                    <span>🔗</span>
                    <span>{l.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {stats && stats.length > 0 && (
          <aside className="border rounded-xl bg-white p-4 space-y-3">
            <h2 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
              Impact & scale
            </h2>
            <dl className="space-y-2">
              {stats.map((s) => (
                <div key={s.label} className="flex justify-between gap-3 text-sm">
                  <dt className="text-gray-500">{s.label}</dt>
                  <dd className="font-medium text-gray-800 text-right">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </section>

      {/* Main content (sections) */}
      <main className="space-y-10">{children}</main>

      <footer className="border-t pt-6 text-xs text-gray-400">
        Built by Khoi Mai — Full-Stack Engineer
      </footer>
    </div>
  );
}
