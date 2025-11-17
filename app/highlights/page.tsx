// app/highlights/page.tsx
import Breadcrumbs from "@/components/Breadcrumb";
import Highlight from "@/models/Highlight";

export default async function HighlightsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    Highlight.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    Highlight.countDocuments(),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Highlights", href: "/highlights" },
        ]}
      />

      <h1 className="text-2xl font-semibold">Highlights</h1>

      <ul className="divide-y rounded-lg border bg-white">
        {items.map((h: any) => (
          <li key={h.slug} className="p-4 hover:bg-gray-50">
            <a href={`/highlights/${h.slug}`} className="font-medium text-blue-600">
              {h.title}
            </a>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{h.summary}</p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between pt-6">
        <a
          href={`?page=${page - 1}`}
          className={`px-4 py-2 rounded border ${page <= 1 ? "pointer-events-none opacity-40" : ""}`}
        >
          Previous
        </a>

        <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>

        <a
          href={`?page=${page + 1}`}
          className={`px-4 py-2 rounded border ${page >= totalPages ? "pointer-events-none opacity-40" : ""}`}
        >
          Next
        </a>
      </div>
    </div>
  );
}
