import React, { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";
import axios from "axios";
import { Users, Calendar, IndianRupee, Star, Clock, TrendingUp } from "lucide-react";

const Doctor = () => {
    const { data: user, loading, error } = useFetch("http://localhost:8080/v1/current-user");
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const res = await axios.get("http://localhost:8080/v1/doctor-stats", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data.success) setStats(res.data.stats);
            } catch (err) {
                console.error("Error fetching stats:", err);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p className="text-center text-xl text-indigo-600">Loading...</p>;
    if (error) return <p className="text-center text-xl text-red-500">Error fetching user data</p>;

    const statCards = stats ? [
        { icon: <Users className="w-8 h-8" />, label: "Total Patients", value: stats.totalPatients, color: "from-blue-500 to-blue-600" },
        { icon: <Calendar className="w-8 h-8" />, label: "This Week", value: `${stats.weeklyAppointments} appts`, color: "from-purple-500 to-purple-600" },
        { icon: <TrendingUp className="w-8 h-8" />, label: "This Month", value: `${stats.monthlyAppointments} appts`, color: "from-emerald-500 to-emerald-600" },
        { icon: <IndianRupee className="w-8 h-8" />, label: "Monthly Revenue", value: `₹${stats.monthlyRevenue.toLocaleString()}`, color: "from-amber-500 to-amber-600" },
        { icon: <Clock className="w-8 h-8" />, label: "Pending", value: stats.pendingAppointments, color: "from-red-400 to-red-500" },
        { icon: <Star className="w-8 h-8" />, label: "Rating", value: stats.totalReviews > 0 ? `${stats.averageRating} ⭐` : "No reviews", color: "from-yellow-400 to-yellow-500" },
    ] : [];

    return (
        <div className="w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
            {/* Profile Header */}
            <motion.div
                className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-md flex items-center justify-around border border-indigo-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="w-32 h-32 border-4 border-indigo-600 rounded-full overflow-hidden">
                    <img src="/illustrations/docmale.png" alt="Doctor Profile Photo" className="w-full h-full" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-indigo-600">
                        HELLO, Dr. {user.user.name}! 👋
                    </h1>
                    <div className="mt-5 ml-8">
                        <p className="text-lg text-gray-700">
                            <strong>Speciality :</strong> {user.user.specialization}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Clinic Name :</strong> {user.user.clinicname}
                        </p>
                        <p className="text-lg text-gray-700">
                            <strong>Experience :</strong> {user.user.yoe} years
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Dashboard Stats */}
            {!statsLoading && stats && (
                <motion.div
                    className="max-w-5xl mx-auto mt-8 grid grid-cols-2 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {statCards.map((card, index) => (
                        <motion.div
                            key={card.label}
                            className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 shadow-lg`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between mb-3">
                                {card.icon}
                            </div>
                            <p className="text-3xl font-bold">{card.value}</p>
                            <p className="text-sm opacity-90 mt-1">{card.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Personal Details */}
            <motion.div
                className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-md items-center border border-indigo-300 mt-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Personal Details</h2>
                <div className="grid grid-cols-[auto_auto_1fr] gap-x-6 gap-y-1 ml-5">
                    <p><strong>Age</strong></p><p><strong>:</strong></p><p>{user.user.age}</p>
                    <p><strong>Gender</strong></p><p><strong>:</strong></p><p>{user.user.gender}</p>
                    <p><strong>E-mail</strong></p><p><strong>:</strong></p><p>{user.user.email}</p>
                    <p><strong>Phone</strong></p><p><strong>:</strong></p><p>{user.user.phone}</p>
                    <p><strong>Clinic Name</strong></p><p><strong>:</strong></p><p>{user.user.clinicname}</p>
                    <p><strong>Clinic Location</strong></p><p><strong>:</strong></p><p>{user.user.clinicloc}</p>
                    <p><strong>Languages</strong></p><p><strong>:</strong></p><p>{Array.isArray(user.user.language) ? user.user.language.join(", ") : user.user.language}</p>
                </div>
            </motion.div>

            {/* Professional Details */}
            <motion.div
                className="max-w-5xl mx-auto bg-white p-10 rounded-2xl shadow-md items-center border border-indigo-300 mt-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Professional Details</h2>
                <div className="grid grid-cols-[auto_auto_1fr] gap-x-6 gap-y-1 ml-5">
                    <p><strong>Licence Number</strong></p><p><strong>:</strong></p><p>{user.user.mlno}</p>
                    <p><strong>Licensing Authority</strong></p><p><strong>:</strong></p><p>{user.user.libody}</p>
                    <p><strong>Degree</strong></p><p><strong>:</strong></p><p>{user.user.degree}</p>
                    <p><strong>Years of Experience</strong></p><p><strong>:</strong></p><p>{user.user.yoe}</p>
                    <p><strong>Availability</strong></p><p><strong>:</strong></p><p>{Array.isArray(user.user.availability) ? user.user.availability.join(", ") : user.user.availability}</p>
                    <p><strong>Fee (INR ₹)</strong></p><p><strong>:</strong></p><p>{user.user.fee}</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Doctor;