import React from "react";
import { useNavigate } from "react-router-dom";

function DataSharingConsent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-2xl text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600">Data Sharing Consent</h1>
        <p className="text-gray-600 mt-4">
          This page explains how CareLink may share your data and how we protect your privacy.
        </p>

        {/* Why We Share Data */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-purple-600">Why We Share Data</h2>
          <p className="text-gray-600 mt-2">
            We may share necessary data with healthcare providers to improve your experience
            and provide better medical services.
          </p>
        </div>

        {/* Who We Share Data With */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-purple-600">Who We Share Data With</h2>
          <ul className="list-disc pl-6 text-gray-600 mt-2">
            <li>Verified healthcare professionals for medical consultations.</li>
            <li>Secure third-party services for analytics and functionality improvements.</li>
            <li>Regulatory bodies if required by law.</li>
          </ul>
        </div>

        {/* Privacy Protection */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-purple-600">Your Privacy Matters</h2>
          <p className="text-gray-600 mt-2">
            We never sell your data. All data sharing is done securely and with privacy safeguards in place.
          </p>
        </div>

        {/* Notice */}
        <p className="text-gray-500 text-sm mt-6">
          For more details, please read our
          <a href="/terms" className="text-indigo-600 underline ml-1">Terms & Conditions</a>.
        </p>

        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default DataSharingConsent;
