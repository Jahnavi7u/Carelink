import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { ArrowLeft, User, Calendar, FileText, Pill } from "lucide-react";

const PatientHistory = () => {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const res = await axios.get(
                    `http://localhost:8080/v1/patient-history/${patientId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data.success) setData(res.data);
            } catch (err) {
                setError("Failed to load patient history");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [patientId]);

    if (loading) return <p className="text-center text-xl text-indigo-600 mt-10">Loading...</p>;
    if (error) return <p className="text-center text-xl text-red-500 mt-10">{error}</p>;
    if (!data) return null;

    const { patient, appointments, prescriptions } = data;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-indigo-600 mb-6 hover:text-indigo-800 cursor-pointer"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Appointments
                </button>

                {/* Patient Info Card */}
                <motion.div
                    className="bg-white p-6 rounded-2xl shadow-md border border-indigo-300 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-indigo-600">{patient.name}</h2>
                            <p className="text-gray-500">{patient.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Age</p>
                            <p className="font-semibold">{patient.age || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Gender</p>
                            <p className="font-semibold">{patient.gender === "M" ? "Male" : "Female"}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Blood Group</p>
                            <p className="font-semibold">{patient.blood || "N/A"}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-semibold">{patient.phone || "N/A"}</p>
                        </div>
                    </div>

                    {/* Medical Info */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-red-50 p-3 rounded-lg">
                            <p className="text-xs text-red-500 font-medium">Allergies</p>
                            <p className="text-sm">{Array.isArray(patient.allergy) ? patient.allergy.join(", ") : patient.allergy || "None"}</p>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                            <p className="text-xs text-orange-500 font-medium">Chronic Illness</p>
                            <p className="text-sm">{Array.isArray(patient.chronic) ? patient.chronic.join(", ") : patient.chronic || "None"}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-blue-500 font-medium">Current Medications</p>
                            <p className="text-sm">{Array.isArray(patient.currentmed) ? patient.currentmed.join(", ") : patient.currentmed || "None"}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-xs text-purple-500 font-medium">Past Surgeries</p>
                            <p className="text-sm">{Array.isArray(patient.pastsur) ? patient.pastsur.join(", ") : patient.pastsur || "None"}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Appointment History */}
                <motion.div
                    className="bg-white p-6 rounded-2xl shadow-md border border-indigo-300 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" /> Appointment History ({appointments.length})
                    </h3>
                    {appointments.length > 0 ? (
                        <div className="space-y-3">
                            {appointments.map((apt) => (
                                <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{new Date(apt.appointmentDate).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-500">{apt.timeSlot} • Dr. {apt.doctorName}</p>
                                    </div>
                                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                        apt.status === "Completed" ? "bg-blue-100 text-blue-700" :
                                        apt.status === "Confirmed" ? "bg-green-100 text-green-700" :
                                        apt.status === "Rejected" ? "bg-red-100 text-red-700" :
                                        "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No appointments found.</p>
                    )}
                </motion.div>

                {/* Prescriptions */}
                <motion.div
                    className="bg-white p-6 rounded-2xl shadow-md border border-indigo-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" /> Prescriptions ({prescriptions.length})
                    </h3>
                    {prescriptions.length > 0 ? (
                        <div className="space-y-4">
                            {prescriptions.map((pres) => (
                                <div key={pres._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">{pres.diagnosis}</p>
                                            <p className="text-xs text-gray-400">By Dr. {pres.doctorName} • {new Date(pres.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xs font-medium text-gray-500 mb-1">Medicines:</p>
                                        {pres.medicines.map((med, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 ml-2">
                                                <Pill className="w-3 h-3 text-indigo-400" />
                                                <span><strong>{med.name}</strong> — {med.dosage}, {med.frequency}, {med.duration}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {pres.notes && (
                                        <p className="text-sm text-gray-600 mt-2 italic">📝 {pres.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No prescriptions found.</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default PatientHistory;
