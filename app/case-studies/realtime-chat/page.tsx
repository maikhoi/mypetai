// app/case-studies/realtime-chat/page.tsx
import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";

export const metadata = {
  title: "MyPetAI — Case Study - Real-Time Community Chat for Pet Owners",
  description:
    "Socket.IO chat system with topic-based rooms, guest access, Facebook login, and message persistence.",
};

export default function RealtimeChatCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="Real-Time Community Chat for Pet Owners"
      subtitle="Socket.IO chat system with topic-based rooms, guest access, Facebook login, and message persistence."
      role="Full-Stack Engineer"
      techStack={[
        "Node.js",
        "Express",
        "Socket.IO",
        "MongoDB",
        "Next.js",
        "NextAuth (Facebook)",
        "Tailwind CSS",
      ]}
      stats={[
        { label: "Chat rooms", value: "Multiple per topic" },
        { label: "Auth modes", value: "Guest + Facebook OAuth" },
      ]}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Scope</h2>
        <p className="text-gray-700">
          Build a real-time chat experience for hobbyist pet communities (e.g.
          guppies, dogs) that feels like a modern app, supports images, and can
          eventually replace fragmented Facebook group chats.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Design & Implementation</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Backend: Express server with Socket.IO managing rooms (topic +
            channel), broadcasting events, and persisting messages to MongoDB.
          </li>
          <li>
            Frontend: Next.js client that connects via Socket.IO, shows a room
            sidebar, message list, and a message composer with Shift+Enter for
            new lines.
          </li>
          <li>
            Auth: NextAuth with Facebook OAuth plus guest mode, with different
            UI labs for logged-in vs guest users.
          </li>
          <li>
            Layout logic carefully tuned so that desktop keeps sidebar + chat
            side by side, while mobile toggles the room list without duplicating
            state or double-rendering components.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Notable Challenges</h2>
        <p className="text-gray-700">
          While iterating on mobile layouts, it was easy to accidentally render
          the chat twice or keep separate &quot;current room&quot; states. I
          refactored to use a single source of truth for the room and only
          toggle visibility of the sidebar on small screens. This keeps the
          behavior predictable and easier to extend.
        </p>
      </section>
    </CaseStudyLayout>
  );
}
