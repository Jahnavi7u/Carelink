import axios from "axios";
import React, { useState } from "react";
import { MapPinned } from 'lucide-react';
import { useEffect } from "react";

const DoctorCard = ({ doctor }) => {
    const [appointmentDate, setAppointmentDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const today = new Date();
    const [mapURL, setMapURL] = useState(''); // Initialize mapURL state

    // Format as YYYY-MM-DD in local time
    const formatDate = (date) => {
        return date.toLocaleDateString('en-CA'); // 'en-CA' = YYYY-MM-DD format
    };

    useEffect(() => {
        const response = async () => {
            const res = await axios.post("http://localhost:8080/v1/maps", { address: doctor.clinicname + " " + doctor.clinicloc });
            setMapURL(res.data.mapsUrl);
        }
        response();
    }, [])


    const handleAppointment = async () => {
        if (!appointmentDate) {
            alert("Please select a date for the appointment.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("userToken");
            if (!token) {
                setError("User is not authenticated.");
                return;
            }

            const response = await axios.get("http://localhost:8080/v1/current-user", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.data.success) {
                throw new Error("Failed to fetch user data.");
            }

            const user = response.data.user;
            const UserID = user._id;
            const DoctorID = doctor._id;

            const bookResponse = await axios.post(
                "http://localhost:8080/v1/book-appointment",
                {
                    userId: UserID,
                    doctorId: DoctorID,
                    appointmentDate,
                    timeSlot: doctor.availability[0]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (bookResponse.data.success) {
                alert("Appointment booked successfully!");
            } else {
                throw new Error(bookResponse.data.message || "Failed to book appointment.");
            }

        } catch (err) {
            console.error("Error booking appointment:", err);
            setError(err.response?.data?.message || err.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition flex flex-col md:flex-row gap-6">
            {/* Left Section */}
            <div className="flex-1">
                <a href={mapURL} target="_blank" className="hover:cursor-pointer" rel="noopener noreferrer">
                    <h3 className="text-2xl font-bold text-indigo-700 mb-2 flex gap-2 items-center">
                        <MapPinned />
                        {doctor.name}
                    </h3>
                </a>
                <p className="text-gray-600 mb-1"><strong>Degree:</strong> {doctor.degree}</p>
                <p className="text-gray-600 mb-1"><strong>Experience:</strong> {doctor.yoe} years</p>
                <p className="text-gray-600 mb-1"><strong>Clinic:</strong> {doctor.clinicname} ({doctor.clinicloc})</p>
                <p className="text-gray-600 mb-1"><strong>Availability:</strong> {doctor.availability.join(", ")}</p>
            </div>

            {/* Right Section */}
            <div className="flex-1">
                <p className="text-gray-600 mb-1"><strong>Fee:</strong> ₹{doctor.fee}</p>
                <p className="text-gray-600 mb-1"><strong>Languages:</strong> {doctor.language.join(", ")}</p>

                {/* Date Picker */}
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="appointmentDate">
                    Select Appointment Date:
                </label>
                <input
                    type="date"
                    id="appointmentDate"
                    className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={formatDate(today)}
                />

                {error && <p className="text-red-600 mb-2">{error}</p>}

                <button
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
                    onClick={handleAppointment}
                    disabled={loading}
                >
                    {loading ? "Booking..." : "Book Appointment"}
                </button>
            </div>
        </div>
    );
};

export default DoctorCard;
