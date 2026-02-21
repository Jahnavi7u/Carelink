import axios from "axios";
import React, { useState } from "react";
import { motion } from "framer-motion";

const DoctorCard = ({ doctor, onActionComplete }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(doctor.verify);
    const [actionColor, setActionColor] = useState(""); // Color based on action
    const [isHidden, setIsHidden] = useState(false); // Hide card after action

    const handleAction = async (action) => {
        try {
            setLoading(true);
            const newStatus = action === "accept" ? "Verified" : "Rejected";
            const newColor = action === "accept" ? "bg-green-200" : "bg-red-200";

            // Update local state to trigger color change
            setStatus(newStatus);
            setActionColor(newColor);

            // Simulate a delay for smooth transition
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Call parent function to update the admin page
            onActionComplete(doctor._id, action);

            // Hide card after 2 seconds
            setTimeout(() => {
                setIsHidden(true);
            }, 2000);
        } catch (err) {
            console.error("Error updating doctor status:", err);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    if (isHidden) return null; // Remove the card after animation

    return (
        <motion.div
            className={`bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition flex flex-col md:flex-row gap-6 ${actionColor}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
        >
            {/* Left Section */}
            <div className="flex-1">
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">{doctor.name}</h3>
                <p className="text-gray-600 mb-1"><strong>Degree:</strong> {doctor.degree}</p>
                <p className="text-gray-600 mb-1"><strong>Experience:</strong> {doctor.yoe} years</p>
                <p className="text-gray-600 mb-1"><strong>Clinic:</strong> {doctor.clinicname} ({doctor.clinicloc})</p>
                <p className="text-gray-600 mb-1"><strong>Availability:</strong> {doctor.availability.join(", ")}</p>
                <p className="text-gray-600 mb-1"><strong>Fee:</strong> ₹{doctor.fee}</p>
                <p className="text-gray-600 mb-1"><strong>Languages:</strong> {doctor.language.join(", ")}</p>
            </div>

            {/* Right Section */}
            <div className="flex-1 flex flex-col gap-2">
                {/* Status Message */}
                <motion.p
                    className={`text-lg font-semibold ${status === "Verified" ? "text-green-600" : "text-red-600"
                        }`}
                    key={status}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                >
                    {status}
                </motion.p>

                {/* Accept Button */}
                <motion.button
                    className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
                    onClick={() => handleAction("accept")}
                    disabled={loading}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? "Processing..." : "Accept"}
                </motion.button>

                {/* Reject Button */}
                <motion.button
                    className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                    onClick={() => handleAction("reject")}
                    disabled={loading}
                    whileTap={{ scale: 0.95 }}
                >
                    {loading ? "Processing..." : "Reject"}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default DoctorCard;
