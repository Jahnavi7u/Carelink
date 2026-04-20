import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, User, CheckCircle } from "lucide-react";

const AppointmentCardDoc = ({ appointment: initialAppointment, docName }) => {
    const [appointment, setAppointment] = useState(initialAppointment);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateStatus = async (status) => {
        const appointmentId = appointment._id;
        const token = localStorage.getItem("userToken");

        setLoading(true);
        try {
            const response = await axios.patch(
                "http://localhost:8080/v1/update-appointment-status",
                { appointmentId, status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                setAppointment({ ...appointment, status });
            }
        } catch (error) {
            console.error(`Error updating status:`, error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Confirmed": return "text-green-600 bg-green-50";
            case "Rejected": return "text-red-600 bg-red-50";
            case "Completed": return "text-blue-600 bg-blue-50";
            case "Pending": return "text-yellow-600 bg-yellow-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    if (!appointment) {
        return <p className="text-gray-600">No appointment data available.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-indigo-700 mb-3">Appointment Details</h3>
            <p className="text-gray-600 mb-1"><strong>Patient Name:</strong> {appointment.userName || "N/A"}</p>
            <p className="text-gray-600 mb-1"><strong>Date:</strong> {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : "N/A"}</p>
            <p className="text-gray-600 mb-1"><strong>Time Slot:</strong> {appointment.timeSlot || "N/A"}</p>
            <p className="text-gray-600 mb-3">
                <strong>Status:</strong>{" "}
                <span className={`font-semibold px-2 py-0.5 rounded ${getStatusColor(appointment.status)}`}>
                    {appointment.status || "N/A"}
                </span>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-2">
                {/* Pending: Confirm or Reject */}
                {appointment.status === "Pending" && (
                    <>
                        <button
                            onClick={() => updateStatus("Confirmed")}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer disabled:opacity-50 text-sm"
                        >
                            {loading ? "..." : "✓ Confirm"}
                        </button>
                        <button
                            onClick={() => updateStatus("Rejected")}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer disabled:opacity-50 text-sm"
                        >
                            {loading ? "..." : "✗ Reject"}
                        </button>
                    </>
                )}

                {/* Confirmed: Mark Complete or Write Prescription */}
                {appointment.status === "Confirmed" && (
                    <>
                        <button
                            onClick={() => updateStatus("Completed")}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer disabled:opacity-50 text-sm flex items-center gap-1"
                        >
                            <CheckCircle className="w-4 h-4" /> {loading ? "..." : "Mark Complete"}
                        </button>
                        <button
                            onClick={() => navigate(`/write-prescription/${appointment._id}/${appointment.userId}/${encodeURIComponent(appointment.userName)}`)}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer text-sm flex items-center gap-1"
                        >
                            <FileText className="w-4 h-4" /> Write Prescription
                        </button>
                    </>
                )}

                {/* Completed: View Prescription */}
                {appointment.status === "Completed" && (
                    <button
                        onClick={() => navigate(`/write-prescription/${appointment._id}/${appointment.userId}/${encodeURIComponent(appointment.userName)}`)}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded transition cursor-pointer text-sm flex items-center gap-1"
                    >
                        <FileText className="w-4 h-4" /> Write Prescription
                    </button>
                )}

                {/* View Patient History (always visible) */}
                <button
                    onClick={() => navigate(`/patient-history/${appointment.userId}`)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded transition cursor-pointer text-sm flex items-center gap-1 border border-gray-300"
                >
                    <User className="w-4 h-4" /> Patient History
                </button>
            </div>
        </div>
    );
};

export default AppointmentCardDoc;
