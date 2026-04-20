import React, { useState, useEffect } from 'react';
import DoctorCard from '../../components/DoctorCard';
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const SPECIALIZATIONS = [
    "All",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Psychiatry",
    "Ophthalmology",
    "Gynecology",
    "General Medicine",
    "ENT",
];

const DoctorLists = () => {
    const { data, loading, error } = useFetch("http://localhost:8080/v1/getverified");
    const [searchParams] = useSearchParams();
    const specFromUrl = searchParams.get("specialization");
    const [selectedSpec, setSelectedSpec] = useState(specFromUrl || "All");
    const [ratings, setRatings] = useState({});

    // Update filter when URL param changes (from symptom checker)
    useEffect(() => {
        if (specFromUrl && SPECIALIZATIONS.includes(specFromUrl)) {
            setSelectedSpec(specFromUrl);
        }
    }, [specFromUrl]);

    // Fetch all ratings
    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await axios.get("http://localhost:8080/v1/ratings");
                if (res.data.success) {
                    setRatings(res.data.ratings);
                }
            } catch (err) {
                // Ratings are optional, don't block rendering
            }
        };
        fetchRatings();
    }, []);

    if (loading) return <p className="text-blue-500">Loading doctors...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const verifiedDoctors = data?.doctor || [];

    const filteredDoctors = selectedSpec === "All"
        ? verifiedDoctors
        : verifiedDoctors.filter((doc) => doc.specialization === selectedSpec);

    return (
        <div className="p-4">
            <motion.h2
                className="text-2xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                Find a Doctor
            </motion.h2>

            {/* Specialization Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
                {SPECIALIZATIONS.map((spec) => (
                    <button
                        key={spec}
                        onClick={() => setSelectedSpec(spec)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition cursor-pointer ${selectedSpec === spec
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-indigo-50 hover:border-indigo-400"
                            }`}
                    >
                        {spec}
                    </button>
                ))}
            </div>

            {/* Show active filter info from symptom checker */}
            {specFromUrl && selectedSpec !== "All" && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 text-sm">
                        🎯 Showing <strong>{selectedSpec}</strong> specialists based on your symptom assessment.
                        <button
                            onClick={() => setSelectedSpec("All")}
                            className="ml-2 text-indigo-600 underline cursor-pointer"
                        >
                            Show all doctors
                        </button>
                    </p>
                </div>
            )}

            {filteredDoctors.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {filteredDoctors.map((doctor) => (
                        <motion.div
                            key={doctor._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <DoctorCard doctor={doctor} ratings={ratings} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center mt-10">No doctors found for "{selectedSpec}".</p>
            )}
        </div>
    );
};

export default DoctorLists;