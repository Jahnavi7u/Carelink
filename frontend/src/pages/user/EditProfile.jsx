import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const { data, loading, error } = useFetch("http://localhost:8080/v1/current-user");
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    if (loading) return <p className="text-center text-xl text-indigo-600">Loading...</p>;
    if (error) return <p className="text-center text-xl text-red-500">Error loading profile</p>;

    const user = data?.user;
    if (!user) return <p>User not found</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        const formData = new FormData(e.target);
        const updates = {};
        formData.forEach((value, key) => {
            if (value !== "") updates[key] = value;
        });

        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.put(
                "http://localhost:8080/v1/update-profile",
                updates,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setUser(response.data.user);
                setMessage("Profile updated successfully!");
                setTimeout(() => navigate("/home"), 1500);
            }
        } catch (err) {
            setMessage("Error updating profile");
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8">
            <motion.div
                className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-indigo-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-bold text-indigo-600 mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={user.name}
                            className="input-field"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-1">Age</label>
                            <input
                                type="number"
                                name="age"
                                defaultValue={user.age}
                                min="1"
                                max="120"
                                className="input-field"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-gray-700 font-medium mb-1">Gender</label>
                            <select name="gender" defaultValue={user.gender} className="input-field">
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            defaultValue={user.phone}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Emergency Phone</label>
                        <input
                            type="tel"
                            name="ephone"
                            defaultValue={user.ephone}
                            className="input-field"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Blood Group</label>
                        <select name="blood" defaultValue={user.blood || ""} className="input-field">
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="input-field bg-gray-100 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>

                    {message && (
                        <p className={`text-sm font-medium ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex-1"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/home")}
                            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditProfile;
