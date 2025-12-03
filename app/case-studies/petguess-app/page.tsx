import CaseStudyLayout from "@/components/case-studies/CaseStudyLayout";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata = {
  title: "PetGuess+ AI — Case Study",
  description:
    "AI-powered pet breed recognition mobile app built with React Native, Expo, and a custom Express backend using ONNX runtime for real-time breed prediction. Published on the iOS App Store.",
};

export default function PetGuessAICaseStudyPage() {
  return (
    <CaseStudyLayout
      title="PetGuess+ AI (iOS App Store)"
      subtitle="A lightweight AI-powered mobile app that identifies pet breeds from photos using ONNX inference, image preprocessing, and a fast Node.js backend."
      role="Mobile & Full-Stack Engineer"
      techStack={[
        "React Native",
        "Expo",
        "TypeScript",
        "AsyncStorage",
        "React Navigation",
        "Node.js + Express API",
        "MongoDB",
        "ONNX Runtime",
        "Sharp Image Preprocessing",
        "PM2 + Rocky Linux Deployment",
      ]}
    >

      {/* Overview */}
      <section className="space-y-3 mt-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-gray-700">
          PetGuess+ AI is a fully featured mobile application that identifies dog, 
          cat and other pet breeds from photos using an ONNX-based inference pipeline 
          running on a custom Node.js backend. The app focuses on fast 
          predictions, clean UI, and a simple user workflow: upload a photo → 
          get breed suggestions → view tailored care information.
        </p>

        <p className="text-gray-700">
          The project showcases an end-to-end production build: React Native app,
          backend API, image preprocessing, AI inference, optimisation work, 
          storage, and full App Store submission. The goal was to create a small, 
          fast, elegant product that demonstrates high-quality engineering and 
          real-world deployment.
        </p>
        <p className="text-gray-700">
            PetGuess+ AI is currently available on the iOS App Store. 
            <a 
                href="https://apps.apple.com/app/petguess-ai/id6755983803" 
                target="_blank"
                className="text-blue-600 underline ml-1"
            >
                Download here
            </a>.
        </p>
      </section>

      {/* Key Features */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>AI Breed Identification</strong>: Users upload a photo and 
            instantly receive breed predictions powered by an ONNX model hosted on 
            a dedicated backend server.
          </li>
          <li>
            <strong>Smart Image Preprocessing</strong>: Images are resized, 
            center-cropped, and optimised using <code>sharp</code> before being 
            forwarded into the inference pipeline.
          </li>
          <li>
            <strong>Care Guide Integration</strong>: Each predicted breed includes 
            an AI-generated list of 10 care tips tailored to the species.
          </li>
          <li>
            <strong>History Tracking</strong>: Every identification is stored 
            offline using AsyncStorage so users can quickly revisit past results.
          </li>
          <li>
            <strong>Ultra-fast Startup</strong>: Initial startup time reduced from 
            ~10 seconds to under 1 second through bundle optimisation and 
            navigation restructuring.
          </li>
          <li>
            <strong>App Store Release</strong>: Completed full preparation, review 
            workflow, compliance checks, and deployment onto the iOS App Store.
          </li>
        </ul>
      </section>

      {/* AI Integration */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">AI Identification Pipeline</h2>
        <p className="text-gray-700">
          The backend AI pipeline is what powers the core functionality of 
          PetGuess+ AI. When a user uploads an image, several steps occur behind 
          the scenes to ensure accuracy and speed:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            The mobile app uploads the photo to a secure Express endpoint running 
            on Rocky Linux.
          </li>
          <li>
            The backend loads a high-resolution image with <code>sharp</code> and 
            performs preprocessing (resize → crop → normalize).
          </li>
          <li>
            A <strong>large ONNX model</strong> (stored locally on the server for 
            maximum read speed) performs inference to generate breed probabilities.
          </li>
          <li>
            The backend returns predicted breeds with confidence scores and 
            fetches care information.
          </li>
        </ul>

        <p className="text-gray-700">
          Accuracy depends heavily on preprocessing, so the backend pipeline was 
          carefully tuned to match the model's expected input resolution. As a 
          result, predictions remain consistent across device types and photo 
          variations.
        </p>

        <p className="text-gray-700">
          Because this is a lightweight daily-use app, the architecture was kept 
          simple and extremely fast—API responses typically return in under 
          300ms.
        </p>
      </section>

      {/* Architecture */}
      <section className="space-y-3 mt-8">
        <h2 className="text-xl font-semibold">Architecture</h2>
        <p className="text-gray-700">
          The system is intentionally compact and efficient. Each component is 
          built for reliability, low latency, and ease of iteration:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            <strong>Mobile App</strong>: React Native + Expo for cross-platform 
            speed and consistent UI.
          </li>
          <li>
            <strong>Offline Storage</strong>: AsyncStorage retains a full history 
            of identifications for fast access.
          </li>
          <li>
            <strong>API Layer</strong>: Express routes handle uploads, 
            preprocessing, inference, and care-tip generation.
          </li>
          <li>
            <strong>AI Engine</strong>: ONNX Runtime processes the pet breed model 
            hosted locally on Rocky Linux.
          </li>
          <li>
            <strong>Image Pipeline</strong>: Sharp enables fast resizing, 
            cropping, and normalisation.
          </li>
          <li>
            <strong>Deployment</strong>: PM2 manages uptime; Cloudflare Tunnel 
            secures public access to private server endpoints.
          </li>
        </ul>

        <p className="text-gray-700">
          This architecture makes PetGuess+ AI fast, robust, and ideal for future 
          expansions such as additional species, higher accuracy models, or 
          user-contributed training data.
        </p>
      </section>

      {/* Conclusion */}
      <section className="space-y-3 mt-8 mb-10">
        <h2 className="text-xl font-semibold">Outcome</h2>
        <p className="text-gray-700">
          PetGuess+ AI demonstrates end-to-end engineering capability: mobile 
          development, backend architecture, image processing, AI integration, 
          DevOps, and a complete App Store release cycle. What began as a simple 
          experiment developed into a polished, production-ready app used to 
          demonstrate mobile engineering skills to hiring managers and potential 
          employers.
        </p>

        <p className="text-gray-700">
          It also marks the foundation of a scalable AI pet ecosystem that can 
          grow into a multi-feature platform (notifications, geolocation, 
          training datasets, community content, and more).
        </p>
      </section>
    </CaseStudyLayout>
  );
}