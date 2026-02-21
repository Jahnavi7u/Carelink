import React from "react";
import { useNavigate } from "react-router-dom";

function CookiesPolicy() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-2xl text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600">Cookies Policy</h1>
        <p className="text-gray-600 mt-4">
          This page explains how CareLink uses cookies to improve your experience.
        </p>

        {/* What Are Cookies */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-purple-600">What Are Cookies?</h2>
          <p className="text-gray-600 mt-2">
            Cookies are small text files stored on your device to enhance functionality,
            analyze site usage, and personalize content.
          </p>
        </div>

        {/* How We Use Cookies */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-purple-600">How We Use Cookies</h2>
          <ul className="list-disc pl-6 text-gray-600 mt-2">
            <li>To keep you logged in and remember your preferences.</li>
            <li>For analytics to improve our platform's performance.</li>
            <li>To personalize content based on your usage.</li>
          </ul>
        </div>

        {/* Managing Cookies */}
        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold text-purple-600">Managing Cookies</h2>
          <p className="text-gray-600 mt-2">
            You can manage or disable cookies through your browser settings,
            but some features may not work properly without them.
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

export default CookiesPolicy;
