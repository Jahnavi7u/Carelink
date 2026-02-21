import React, { useState, useEffect } from "react";
import DoctorCard from "../components/DoctorListAdminCard";
import useFetch from "../hooks/useFetch";
import axios from "axios";

const Admin = () => {
    const { data, loading, error, reFetch } = useFetch("http://localhost:8080/v1/getunder");
    const [doctors, setDoctors] = useState([]);

    // Update doctors when data is fetched
    useEffect(() => {
        if (data?.doctor) {
            setDoctors(data.doctor);
        }
    }, [data]);

    // Callback function to remove a doctor from the list after accepting/rejecting
    const handleActionComplete = async (doctorId, action) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) return alert("User not authenticated.");

            // API call to update verification status
            await axios.put(
                `http://localhost:8080/v1/change-verify`,
                { id: doctorId, verify: action === "accept" ? "Verified" : "Rejected" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            // **Option 1: Remove the doctor from the list dynamically**
            setDoctors((prevDoctors) => prevDoctors.filter((doc) => doc._id !== doctorId));

            // **Option 2: Re-fetch data (if API is fast)**
            // reFetch();

        } catch (err) {
            console.error("Error updating doctor status:", err);
            alert("Something went wrong!");
        }
    };

    if (loading) return <p className="text-blue-500">Loading doctors...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Non-Verified Doctors</h2>

            {doctors.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {doctors.map((doctor) => (
                        <DoctorCard key={doctor._id} doctor={doctor} onActionComplete={handleActionComplete} />
                    ))}
                </div>
            ) : (
                <p>No non-verified doctors found.</p>
            )}
        </div>
    );
};

export default Admin;
