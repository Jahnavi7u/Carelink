import axios from "axios";
import React, { useState } from "react";

const AppointmentCardDoc = ({ appointment: initialAppointment, docName }) => {
    const [appointment, setAppointment] = useState(initialAppointment); // Manage local appointment state
    const [loading, setLoading] = useState(false); // New loading state

    // Logic for confirming an appointment
    const onConfirm = async () => {
        const appointmentId = appointment._id;
        const status = "Confirmed";
        const token = localStorage.getItem("userToken");

        setLoading(true); // Start loading
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
                setAppointment({ ...appointment, status: "Confirmed" });
            } else {
                console.error("Error confirming appointment:", response.data.message);
            }
        } catch (error) {
            console.error("Error confirming appointment:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Logic for rejecting an appointment
    const onReject = async () => {
        const appointmentId = appointment._id;
        const status = "Rejected";
        const token = localStorage.getItem("userToken");

        setLoading(true); // Start loading
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
                setAppointment({ ...appointment, status: "Rejected" });
            } else {
                console.error("Error rejecting appointment:", response.data.message);
            }
        } catch (error) {
            console.error("Error rejecting appointment:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    if (!appointment) {
        return <p className="text-gray-600">No appointment data available.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">Appointment Details</h3>
            <p className="text-gray-600 mb-1"><strong>Patient Name:</strong> {appointment.userName || "N/A"}</p>
            <p className="text-gray-600 mb-1"><strong>Date:</strong> {appointment.appointmentDate ? new Date(appointment.appointmentDate).toLocaleDateString() : "N/A"}</p>
            <p className="text-gray-600 mb-1"><strong>Time Slot:</strong> {appointment.timeSlot || "N/A"}</p>
            <p className="text-gray-600 mb-1">
                <strong>Status:</strong>{" "}
                <span
                    className={`font-semibold ${appointment.status === "Confirmed"
                            ? "text-green-600"
                            : appointment.status === "Rejected"
                                ? "text-red-600"
                                : "text-yellow-600"
                        }`}
                >
                    {appointment.status || "N/A"}
                </span>
            </p>

            {/* Action Buttons */}
            {appointment.status === "Pending" && (
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>
                    <button
                        onClick={onReject}
                        disabled={loading}
                        className={`bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Processing..." : "Reject"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppointmentCardDoc;
