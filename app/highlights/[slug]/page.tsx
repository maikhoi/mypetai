import { dbConnect } from "@/lib/mongoose";
import mongoose, { Document, Model } from "mongoose";
import { notFound } from "next/navigation";
import Image from "next/image";

// ✅ Define a strong TypeScript interface for your highlight documents
interface HighlightDoc extends Document {
  title: string;
  slug: string;
  sourceUrl?: string;
  summary: string;
  keyTips?: string[];
  category?: string;
  image?: string;
  seoMeta?: {
    title?: string;
    description?: string;
  };
  updatedAt?: Date;
}

// ✅ Define schema with correct model typing
const highlightSchema = new mongoose.Schema<HighlightDoc>(
  {
    title: String,
    slug: String,
    sourceUrl: String,
    summary: String,
    keyTips: [String],
    category: String,
    image: String,
    seoMeta: {
      title: String,
      description: String,
    },
  },
  { timestamps: true }
);

const Highlight: Model<HighlightDoc> =
  mongoose.models.Highlight ||
  mongoose.model<HighlightDoc>("Highlight", highlightSchema);

// --- Metadata ---
export async function generateMetadata({ params }: { params: { slug: string } }) {
  await dbConnect();
  const doc = (await Highlight.findOne({ slug: params.slug }).lean()) as HighlightDoc | null;

  if (!doc) {
    return {
      title: "Pet Highlight | MyPetAI",
      description: "Community-driven pet care insights and tips.",
    };
  }

  return {
    title: doc.seoMeta?.title || doc.title,
    description: doc.seoMeta?.description || doc.summary?.slice(0, 160),
    openGraph: {
      title: doc.title,
      description: doc.summary?.slice(0, 150),
      images: doc.image ? [{ url: doc.image }] : [],
    },
  };
}

// --- Page ---
export default async function HighlightPage({ params }: { params: { slug: string } }) {
  await dbConnect();
  const doc = (await Highlight.findOne({ slug: params.slug }).lean()) as HighlightDoc | null;

  if (!doc) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-100 py-12 px-4">
      <article className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-amber-100">
        <h1 className="text-3xl font-bold text-amber-700 mb-4">{doc.title}</h1>

        {doc.image && (
          <div className="mb-6">
            <Image
              src={doc.image}
              alt={doc.title}
              width={800}
              height={450}
              className="rounded-xl mx-auto"
            />
          </div>
        )}

        <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
          {doc.summary}
        </p>

        {doc.keyTips?.length ? (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-6">
            <h2 className="text-lg font-semibold text-amber-700 mb-2">💡 Key Tips</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {doc.keyTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {doc.sourceUrl && (
          <p className="text-sm text-gray-500 mt-6">
            📚 Source:{" "}
            <a
              href={doc.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-600 hover:underline"
            >
              Original article
            </a>
          </p>
        )}
      </article>
    </main>
  );
}
