import React from "react";
import { ArrowRight, UserPlus, MessageSquareText, CalendarClock, ShieldAlert, Activity, Thermometer, Bandage } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <motion.section
          className="w-full py-12 md:py-24 lg:py-32 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Health, Connected
          </h1>
          <p className="max-w-xl mx-auto text-gray-600 mt-4">
            Access healthcare from anywhere. Connect with verified doctors, store your medical history, and get the care you need.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Link to={"/registeruser"} className="bg-indigo-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition">
              Register as a Patient <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to={"/registerdoctor"} className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-full hover:bg-indigo-50 transition">
              Register as a Doctor
            </Link>
          </div>
        </motion.section>

        {/* Features Section */}
        <Section id="features" title="Everything You Need" description="A seamless telemedicine experience at your fingertips.">
          <div className="flex justify-center flex-wrap gap-6">
            <Feature icon={<UserPlus />} title="Secure Medical Records" description="Store and access your complete medical history securely." />
            <Feature icon={<MessageSquareText />} title="Connect with Doctors" description="Consult with verified healthcare professionals." />
            <Feature icon={<CalendarClock />} title="Virtual Adviser" description="AI-driven chatbot at your service 24/7." />
          </div>
        </Section>

        {/* First Aid Tips Section */}
        <Section id="first-aid" title="Basic First Aid Tips" description="Learn essential first aid techniques to handle emergencies effectively.">
          <div className="flex justify-center flex-wrap gap-6">
            <Feature icon={<ShieldAlert />} title="CPR" description="Perform chest compressions for cardiac arrest." />
            <Feature icon={<Activity />} title="Choking" description="Use the Heimlich maneuver to help a choking person." />
            <Feature icon={<Thermometer />} title="Burns" description="Run cool water over burns and cover with a clean cloth." />
            <Feature icon={<Bandage />} title="Cuts & Bleeding" description="Apply pressure to stop bleeding and clean the wound." />
          </div>
        </Section>
      </main>
    </div>
  );
}

/* Reusable Section Component */
function Section({ id, title, description, children }) {
  return (
    <motion.section
      id={id}
      className="w-full py-12 md:py-24 bg-white text-center"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold text-indigo-600">{title}</h2>
      <p className="max-w-xl mx-auto text-gray-500 mt-2">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-6">{children}</div>
    </motion.section>
  );
}

/* Feature Card - Unified Design */
function Feature({ icon, title, description }) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-6 border rounded-lg shadow bg-gradient-to-br from-white to-gray-100 hover:shadow-lg transition transform hover:scale-105 w-64 h-64"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-16 w-16 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-gray-500 mt-2">{description}</p>
    </motion.div>
  );
}

export default Home;