import axios from "axios";
import React, { useEffect, useState } from "react";

const AppointmentCardUser = ({ appointment }) => {
    if (!appointment) {
        return <p className="text-gray-600">No appointment data available.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">Appointment Details</h3>
            <p className="text-gray-600 mb-1">
                <strong>Doctor:</strong> {appointment.doctorName || "Unknown"} {/* ✅ FIXED */}
            </p>
            <p className="text-gray-600 mb-1">
                <strong>Patient Name:</strong> {appointment.userName || "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
                <strong>Date:</strong>{" "}
                {appointment.appointmentDate
                    ? new Date(appointment.appointmentDate).toLocaleDateString()
                    : "N/A"}
            </p>
            <p className="text-gray-600 mb-1">
                <strong>Time Slot:</strong> {appointment.timeSlot || "N/A"}
            </p>
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
        </div>
    );
};

export default AppointmentCardUser;
