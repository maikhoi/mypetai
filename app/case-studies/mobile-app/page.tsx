import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "MyPetAI Mobile App — Case Study",
  description:
    "Cross-platform mobile app built with React Native and powered by an ONNX-based AI pet identification engine capable of detecting species, breed, and learning from user feedback.",
};

export default function MobileAppCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="MyPetAI Mobile App (iOS & Android)"
      subtitle="AI-powered mobile companion that identifies pets using ONNX models, manages feeding schedules, and builds a personalised knowledge base through user feedback."
      role="Mobile Engineer"
      techStack={[
        "React Native",
        "Expo",
        "TypeScript",
        "AsyncStorage",
        "React Navigation",
        "ONNX Runtime",
        "Node.js Backend (Rocky Linux)",
        "MongoDB",
        "Local NAS Model Storage",
      ]}
    >
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
          { label: "Mobile App" },
        ]}
      />

      {/* Overview */}
      <section className="space-y-3 mt-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-gray-700">
          The MyPetAI mobile app brings intelligent pet management to iOS and
          Android through a clean React Native experience. Users can manage pet
          profiles, track feeding schedules, and—most importantly—identify their
          pet’s species and breed using an ONNX-based AI vision model running on
          the MyPetAI backend hosted on Rocky Linux.
        </p>

        <p className="text-gray-700">
          The app is designed to operate offline-first using AsyncStorage, while
          maintaining a scalable architecture that integrates with the server
          for AI identification, knowledge-base learning, and future cloud
          syncing.
        </p>
      </section>

      {/* Key Features */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>ONNX-Powered AI Pet Identification</strong>: Users upload a
            photo and the backend processes it through a high-performance ONNX
            model (stored locally on Rocky Linux for speed). The model detects
            species, predicts likely breeds, and supports future expansion with
            more categories.
          </li>
          <li>
            <strong>Pet Profiles</strong>: Users can create pets with name,
            species, breed, and thumbnail. Profiles persist locally for instant
            loading even without internet.
          </li>
          <li>
            <strong>Feeding Schedule Tracking</strong>: A lightweight feeding
            planner lets users configure meals/day, serving size, and reminders.
            Stored offline via AsyncStorage.
          </li>
          <li>
            <strong>Auto-refresh using <code>useFocusEffect</code></strong>:
            Ensures fresh data whenever a screen becomes active.
          </li>
          <li>
            <strong>Optimised UI/UX</strong>: The interface is intentionally
            simple, built for real pet owners to use daily with small screens,
            one-handed interactions, and quick input.
          </li>
          <li>
            <strong>Future-ready architecture</strong>: Data models are designed
            to sync with the MyPetAI backend for multi-device profiles, cloud
            backups, and community integration.
          </li>
        </ul>
      </section>

      {/* AI Integration */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">AI Identification & Learning</h2>
        <p className="text-gray-700">
          A major innovation in the MyPetAI app is its ONNX-powered pet
          identification pipeline. When a user uploads a photo:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            The image is uploaded to the MyPetAI backend on Rocky Linux using a
            secure upload endpoint.
          </li>
          <li>
            The backend loads a <strong>300MB+ ONNX model</strong> directly from
            local storage (<code>/opt/mypetai/models</code>) for maximum read
            performance.
          </li>
          <li>
            The ONNX Runtime executes species detection (e.g., dog, cat, fish,
            bird).
          </li>
          <li>
            If species is supported, a secondary breed classifier or
            OpenCLIP semantic search ranks the most likely breeds.
          </li>
        </ul>

        <p className="text-gray-700">
          The system supports multiple ONNX models (e.g., general animals,
          dedicated dog breeds, future expansion to birds or cats). The backend
          is designed so additional models can be mounted into the same
          inference engine with minimal configuration.
        </p>

        <p className="text-gray-700">
          After the AI returns predictions, the user chooses the correct breed.
          Their selection is recorded as feedback:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            The backend stores their photo, predicted species, and user’s
            correct breed.
          </li>
          <li>
            This feedback helps the knowledge base improve accuracy over time.
          </li>
          <li>
            Repeated misclassifications trigger model retraining flags for
            future dataset improvements.
          </li>
        </ul>

        <p className="text-gray-700">
          This creates a real feedback loop where the app’s breed detection
          becomes more accurate the more people use it.
        </p>
      </section>

      {/* Architecture */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Architecture</h2>
        <p className="text-gray-700">
          The mobile app follows a modular architecture built for long-term
          scalability:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>UI Layer</strong>: React Native screens and reusable
            components.
          </li>
          <li>
            <strong>Local State</strong>: Lightweight hook-based state
            management.
          </li>
          <li>
            <strong>Storage</strong>: AsyncStorage-powered offline persistence.
          </li>
          <li>
            <strong>Backend</strong>: Rocky Linux + Node.js + Express + ONNX
            Runtime for inference.
          </li>
          <li>
            <strong>Model Storage</strong>: Heavy ONNX models run from local disk
            (<code>/opt/mypetai/models</code>) to avoid NAS latency.
          </li>
          <li>
            <strong>Knowledge Base</strong>: MongoDB collections for species,
            breeds, and user AI feedback.
          </li>
        </ul>

        <p className="text-gray-700">
          This structure makes the mobile app flexible, fast, and ready for
          continuous iteration as the underlying AI models evolve.
        </p>
      </section>

      {/* Conclusion */}
      <section className="space-y-3 mt-8 mb-10">
        <h2 className="text-xl font-semibold">Outcome</h2>
        <p className="text-gray-700">
          The MyPetAI mobile app showcases expertise in mobile development, AI
          integration, ONNX model deployment, offline-first storage, and
          user-centered design. Combined with the backend identification service,
          it forms the foundation of a next-generation pet ecosystem where users
          can identify their pets, manage daily routines, and contribute to a
          growing AI-powered knowledge base.
        </p>
      </section>
    </CaseStudyLayout>
  );
}
