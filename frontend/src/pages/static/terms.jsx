import React from "react";
import { useNavigate } from "react-router-dom";

function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 py-12 px-6 md:px-12 lg:px-32">
      <h1 className="text-4xl font-bold text-indigo-600 text-center">
        Terms and Conditions
      </h1>
      <p className="text-gray-600 text-center mt-4">
        Welcome to CareLink. Please read these terms carefully before using our platform.
      </p>

      <div className="mt-8 space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-purple-600">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CareLink, you agree to be bound by these terms. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600">2. Medical Disclaimer</h2>
          <p>
            CareLink provides telemedicine services but does not replace in-person medical consultations. Always seek professional advice for serious health concerns.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600">3. User Responsibilities</h2>
          <p>
            Users must provide accurate information and comply with all applicable laws when using CareLink’s services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600">4. Privacy and Data Security</h2>
          <p>
            We prioritize your privacy. Your medical records are securely stored and will not be shared without your consent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600">5. Account Termination</h2>
          <p>
            We reserve the right to terminate accounts that violate our terms, engage in fraudulent activities, or misuse the platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-purple-600">6. Changes to Terms</h2>
          <p>
            CareLink may update these terms periodically. Continued use of the platform after updates constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default TermsAndConditions;
