import React from "react";
import useFetch from "../../hooks/useFetch";
import { motion } from "framer-motion";

const Doctor = () => {
    const { data: user, loading, error } = useFetch("http://localhost:8080/v1/current-user");

    if (loading) return <p className="text-center text-xl text-indigo-600">Loading...</p>;
    if (error) return <p className="text-center text-xl text-red-500">Error fetching user data</p>;

    return (
        <div className="w-full mx-auto p-8 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
            <motion.div
                className="w-4xl mx-auto bg-white p-10 rounded-2xl shadow-md flex items-center justify-around border border-indigo-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div className="w-32 h-32 border-4 border-indigo-600 rounded-full overflow-hidden">
                    <img src="/illustrations/docmale.png" alt="Doctor Profile Photo" className="w-full h-full" />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-bold text-indigo-600">
                            HELLO, Dr. {user.user.name}! 👋
                        </h1>
                    </div>
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

            <motion.div
                className="w-4xl mx-auto bg-white p-10 rounded-2xl shadow-md items-center border border-indigo-300 mt-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Personal Details</h2>
                </div>
                <div className="flex">
                    <div className="ml-5">
                        <p><strong>Age</strong></p>
                        <p><strong>Gender</strong></p>
                        <p><strong>E-mail</strong></p>
                        <p><strong>Phone</strong></p>
                        <p><strong>Clinic Name</strong></p>
                        <p><strong>Clinic Location</strong></p>
                        <p><strong>Languages</strong></p>
                    </div>
                    <div className="mx-5">
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                    </div>
                    <div>
                        <p>{user.user.age}</p>
                        <p>{user.user.gender}</p>
                        <p>{user.user.email}</p>
                        <p>{user.user.phone}</p>
                        <p>{user.user.clinicname}</p>
                        <p>{user.user.clinicloc}</p>
                        <p>{user.user.language}</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="w-4xl mx-auto bg-white p-10 rounded-2xl shadow-md items-center border border-indigo-300 mt-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                <div>
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Professional Details</h2>
                </div>
                <div className="flex">
                    <div className="ml-5">
                        <p><strong>Licence Number</strong></p>
                        <p><strong>Licensing Authority</strong></p>
                        <p><strong>Degree</strong></p>
                        <p><strong>Years of Experience</strong></p>
                        <p><strong>Availability</strong></p>
                        <p><strong>Fee (INR ₹)</strong></p>
                    </div>
                    <div className="mx-5">
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                        <p><strong>:</strong></p>
                    </div>
                    <div>
                        <p>{user.user.mlno}</p>
                        <p>{user.user.libody}</p>
                        <p>{user.user.degree}</p>
                        <p>{user.user.yoe}</p>
                        <p>{user.user.availability}</p>
                        <p>{user.user.fee}</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Doctor;