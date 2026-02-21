import React from 'react';
import DoctorCard from '../../components/DoctorCard';
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";

const DoctorLists = () => {
    const { data, loading, error } = useFetch("http://localhost:8080/v1/getverified");

    if (loading) return <p className="text-blue-500">Loading doctors...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    const verifiedDoctors = data?.doctor || []; // Ensure we get an array

    return (
        <div className="p-4">
            <motion.h2
                className="text-xl font-bold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                Verified Doctors
            </motion.h2>

            {verifiedDoctors.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {verifiedDoctors.map((doctor) => (
                        <motion.div
                            key={doctor._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <DoctorCard doctor={doctor} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p>No verified doctors found.</p>
            )}
        </div>
    );
};

export default DoctorLists;