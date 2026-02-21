import React, { useState } from "react";

export default function Contact() {
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Illustration */}
        <div className="md:w-1/2 hidden md:flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
          <img
            src="/illustrations/contact.svg"
            alt="Contact Illustration"
            className="w-3/4"
          />
        </div>

        {/* Right Contact Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-2xl font-bold text-indigo-600">Contact Us</h2>
          <p className="text-gray-600 mt-2">We'd love to hear from you.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-gray-700 font-semibold">Name</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Subject</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="text-gray-700 font-semibold">Message</label>
              <textarea
                className="w-full mt-1 p-2 border rounded h-24"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded shadow-md hover:from-indigo-700 hover:to-purple-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded shadow-md">
          Message sent successfully!
        </div>
      )}
    </div>
  );
}
