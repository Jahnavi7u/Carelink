import React from "react";
import { Link } from "react-router-dom"; // For internal navigation

export default function AboutUs() {
  // Team data with LinkedIn links
  const teamMembers = [
    { name: "Akshat Pratyush", linkedIn: "https://www.linkedin.com/in/akshat-pratyush/" },
    { name: "Aditya Pratap Singh", linkedIn: "https://www.linkedin.com/in/aditya-pratap-singh-594003308/" },
    { name: "Satwik Tomar", linkedIn: "https://www.linkedin.com/in/satwik-tomar-58112a215/" },
    { name: "Satyam Kumar", linkedIn: "https://www.linkedin.com/in/satyam-kumar-6723a22a8" },
  ];

  return (
    <section className="bg-gray-100 py-16 flex flex-col items-center justify-center">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center">
        {/* Image on the Left */}
        <img
          src="/illustrations/aboutus.svg"
          alt="About Us"
          className="w-full md:w-1/2 rounded-lg shadow-md"
        />

        {/* Text on the Right */}
        <div className="md:ml-12 mt-8 md:mt-0 text-center md:text-left">
          <h2 className="text-4xl font-semibold text-gray-900">About Us</h2>
          <p className="mt-4 text-lg text-gray-700 leading-relaxed">
            Welcome to{" "}
            <Link to="/" className="font-semibold text-indigo-600 hover:underline">
              CareLink
            </Link>
            , your trusted telemedicine platform connecting patients with verified doctors.
            Our mission is to provide seamless, AI-powered healthcare solutions, ensuring
            accessibility, security, and efficiency. Whether you need a quick consultation
            or long-term medical guidance, we're here for you—anytime, anywhere.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-900">Meet the Team</h3>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <a
              key={index}
              href={member.linkedIn}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-lg shadow-sm hover:text-indigo-600 transition duration-300"
            >
              <h4 className="text-lg font-medium text-gray-800 hover:text-indigo-600">
                {member.name}
              </h4>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
