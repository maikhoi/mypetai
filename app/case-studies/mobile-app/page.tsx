import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout"; 

export const metadata = {
  title: "MyPetAI Mobile App — Case Study",
  description:
    "Cross-platform mobile app built with React Native + AI-powered pet identification, feeding management, and a scalable architecture designed to connect to the MyPetAI backend.",
};

export default function MobileAppCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="MyPetAI Mobile App (iOS & Android)"
      subtitle="AI-powered mobile companion that lets pet owners manage pets, track feeding schedules, and identify pet species and breeds from photos."
      role="Mobile Engineer"
      techStack={[
        "React Native",
        "Expo",
        "TypeScript",
        "AsyncStorage",
        "React Navigation",
        "Vision API / Image Upload",
        "MyPetAI Backend (Node.js + MongoDB)",
      ]}
    >
      
      {/* Overview */}
      <section className="space-y-3 mt-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-gray-700">
          The MyPetAI mobile app extends the MyPetAI ecosystem into a personal,
          always-with-you companion for pet owners. Built with React Native and
          Expo for fast cross-platform development, the app focuses on
          streamlined pet management — with an AI-powered identification feature
          that recognises species and breed directly from user-uploaded photos.
        </p>

        <p className="text-gray-700">
          While Version 1 stores data locally using AsyncStorage, the app is
          architected to later sync with the MyPetAI backend (Node.js + MongoDB)
          for cloud profiles, cross-device sharing, reminders, and deeper
          personalisation.
        </p>
      </section>

      {/* Key Features */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>AI Pet Identification</strong>: Users upload a photo, and
            the app uses AI to detect the species (dog, cat, fish, bird, etc.)
            and suggest likely breeds. The model also improves over time —
            building a knowledge base from confirmed user selections.
          </li>
          <li>
            <strong>Pet Profiles</strong>: Create and manage multiple pets with
            name, species, breed, and thumbnail image. Profiles are
            locally cached and optimised for instant access.
          </li>
          <li>
            <strong>Feeding Schedule Tracking</strong>: For each pet, users can
            configure meals per day and cups per meal. Data persists via
            AsyncStorage with simple hydration on screen focus.
          </li>
          <li>
            <strong>Auto-refresh with <code>useFocusEffect</code></strong>: Pet
            data is automatically reloaded whenever a screen becomes active,
            ensuring up-to-date information without manual refresh.
          </li>
          <li>
            <strong>Expandable Architecture</strong>: The UI and data models are
            intentionally lightweight, ready for future integration with
            cloud sync, push notifications, and real-time data from the main
            MyPetAI platform.
          </li>
          <li>
            <strong>Simple, clean UI</strong>: Designed for small screens,
            fast gestures, and real pets in real homes. Buttons, spacing,
            and lists are optimised for practical use.
          </li>
        </ul>
      </section>

      {/* AI Integration */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">AI Identification & Learning</h2>
        <p className="text-gray-700">
          A major differentiator of the MyPetAI mobile app is its
          smart-identification pipeline. When a user uploads a photo of their
          pet, the app sends it to an AI endpoint capable of:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>Detecting the species</li>
          <li>Proposing the most likely breeds</li>
          <li>Suggesting alternative matches when confidence is low</li>
          <li>Learning from the option the user finally selects</li>
        </ul>

        <p className="text-gray-700">
          This learning loop gradually builds a personalised knowledge base
          tailored to the types of pets the user actually owns — improving
          accuracy over time without requiring manual dataset updates.
        </p>
      </section>

      {/* Architecture */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Architecture</h2>
        <p className="text-gray-700">
          The mobile app follows a modular and future-proofed architecture:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>UI Layer</strong>: React Native views optimised for mobile.
          </li>
          <li>
            <strong>State Layer</strong>: Lightweight state per screen using
            React state/hooks.
          </li>
          <li>
            <strong>Local Storage</strong>: AsyncStorage for pets and feeding
            schedules.
          </li>
          <li>
            <strong>Backend Integration (Planned)</strong>: Secure
            synchronisation with MyPetAI backend for persistent profiles,
            shared devices, chat integration, and analytics.
          </li>
        </ul>
      </section>

      {/* Conclusion */}
      <section className="space-y-3 mt-8 mb-10">
        <h2 className="text-xl font-semibold">Outcome</h2>
        <p className="text-gray-700">
          The MyPetAI mobile app demonstrates strong mobile engineering skills
          in UX, offline-first storage, image processing, and AI integration.
          It acts as a foundation for a scalable mobile ecosystem where users
          can identify pets, track daily care habits, and eventually integrate
          seamlessly with the MyPetAI platform.
        </p>
      </section>
    </CaseStudyLayout>
  );
}
