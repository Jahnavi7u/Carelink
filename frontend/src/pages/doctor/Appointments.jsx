import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import AppointmentCardDoc from "../../components/AppointmentCardDoc";
import { motion } from "framer-motion";

const Appointments = () => {
    const { data: upcomingApt, loading: uloading, error: uerror } = useFetch("http://localhost:8080/v1/upcomming-doc-appointments");
    const { data: pastApt, loading: ploading, error: perror } = useFetch("http://localhost:8080/v1/past-doc-appointments");

    const [showUpcoming, setShowUpcoming] = useState(true); // Toggle State

    const uAppointments = upcomingApt?.UpcommingAppointments || []; // Corrected key
    const pAppointments = pastApt?.pastAppointments || []; // Ensure correct key for past appointments

    const displayedAppointments = showUpcoming ? uAppointments : pAppointments;

    return (
        <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
            <motion.h1
                className="text-3xl font-bold text-indigo-600 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                My Appointments
            </motion.h1>

            {/* Toggle Buttons */}
            <div className="flex justify-center mb-6">
                <button
                    className={`px-4 py-2 font-semibold rounded-l-md transition ${showUpcoming ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setShowUpcoming(true)}
                >
                    Upcoming Appointments
                </button>
                <button
                    className={`px-4 py-2 font-semibold rounded-r-md transition ${!showUpcoming ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    onClick={() => setShowUpcoming(false)}
                >
                    Past Appointments
                </button>
            </div>

            {/* Loading & Error Handling */}
            {(uloading || ploading) && <p className="text-center text-blue-500">Loading appointments...</p>}
            {(uerror || perror) && <p className="text-center text-red-500">Error loading data.</p>}

            {/* Appointment Cards */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {displayedAppointments.length > 0 ? (
                    displayedAppointments.map((appointment) => (
                        <motion.div
                            key={appointment._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <AppointmentCardDoc appointment={appointment} docName={showUpcoming ? upcomingApt.docName : pastApt.docName} />
                        </motion.div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center col-span-full">
                        {showUpcoming ? "No upcoming appointments." : "No past appointments."}
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default Appointments;