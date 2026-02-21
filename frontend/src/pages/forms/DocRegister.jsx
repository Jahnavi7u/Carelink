import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import { motion } from "framer-motion";

const Register = () => {
    const { setUser } = useUser();  // Import from context
    const { register, handleSubmit, setValue } = useForm();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) navigate("/home");
    }, [navigate]);

    const handleNext = (data) => {
        setFormData({ ...formData, ...data });
        setStep(step + 1);
    };

    const handleRegister = async (data) => {
        const finalData = { ...formData, ...data };
        try {
            const response = await axios.post("http://localhost:8080/v1/registerdoc", finalData);
            if (response.data.success) {
                localStorage.setItem("userToken", response.data.token);
                setUser(response.data.user);  // Update user context after login
                navigate("/home", { replace: true });
            } else {
                throw new Error("Username or Email already exists");
            }
        } catch (error) {
            console.error(error.message || "Something went wrong!");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100">
            <motion.div
                className="bg-white shadow-lg rounded-lg flex w-full max-w-5xl p-5 min-h-[80vh] my-3 relative"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="flex w-1/2 justify-center items-center h-full flex-col">
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className="bg-indigo-600 font-bold text-white py-1 px-5 rounded-full absolute left-3 top-3 hover:cursor-pointer">Back</button>
                    )}
                    <h2 className="text-2xl font-bold text-center mb-4">Welcome to CareLink</h2>
                    <img src="/illustrations/patientReg.svg" alt="Medicine Illustration" className="my-auto" />
                </div>
                <div className="w-full md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold text-center mb-4">
                        {step === 1 ? "Basic Details" :
                            (step === 2 ? "Credentials" :
                                (step === 3 ? "Availablity Details" :
                                    "Verification"))
                        }
                    </h2>
                    <hr className="mb-4" />

                    {step === 1 && (
                        <motion.form
                            onSubmit={handleSubmit(handleNext)}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div>
                                <input
                                    type="text"
                                    {...register("name")}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    {...register("age", { min: 1, max: 120 })}
                                    required
                                    placeholder="Enter your age"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <select
                                    {...register("gender")}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </div>
                            <input
                                type="email"
                                {...register("email")}
                                required
                                placeholder="Enter your email"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <div>
                                <input
                                    type="tel"
                                    {...register("phone", { pattern: /^[0-9]{10}$/ })}
                                    required
                                    placeholder="Enter your Contact"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    {...register("password", { required: "Password is required" })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye /> : <EyeOff />}
                                </button>
                            </div>
                            <button type="submit" className="btn-primary">Next</button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form
                            onSubmit={handleSubmit(handleNext)}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Medical License Number */}
                            <div>
                                <input
                                    type="text"
                                    id="mlno"
                                    {...register("mlno", { required: "Medical License Number is required" })}
                                    placeholder="Medical License Number"
                                    className="input-field"
                                />
                            </div>

                            {/* License Issuing Body */}
                            <div>
                                <input
                                    type="text"
                                    {...register("libody", { required: "Issuing Body is required" })}
                                    placeholder="License Issuing Body"
                                    className="input-field"
                                />
                            </div>

                            {/* Specialization */}
                            <div>
                                <input
                                    type="text"
                                    {...register("specialization", { required: "Specialization is required" })}
                                    placeholder="Specialization"
                                    className="input-field"
                                />
                            </div>

                            {/* Year Of Experience */}
                            <div>
                                <input
                                    type="number"
                                    {...register("yoe", { required: "Years of Experience is required", min: 0 })}
                                    placeholder="Years of Experience"
                                    className="input-field"
                                />
                            </div>

                            {/* Medical Degree */}
                            <div>
                                <input
                                    type="text"
                                    {...register("degree", { required: "Medical Degree is required" })}
                                    placeholder="Medical Degree"
                                    className="input-field"
                                />
                            </div>

                            <button type="submit" className="btn-primary">Next</button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.form
                            onSubmit={handleSubmit(handleNext)}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Clinic Name */}
                            <div>
                                <input
                                    type="text"
                                    {...register("clinicname")}
                                    required
                                    placeholder="Clinic Name"
                                    className="input-field"
                                />
                            </div>

                            {/* Clinic Location */}
                            <div>
                                <input
                                    type="text"
                                    {...register("clinicloc")}
                                    required
                                    placeholder="Clinic Location"
                                    className="input-field"
                                />
                            </div>

                            {/* Availability (Doctor Timing) */}
                            <div>
                                <label className="block text-gray-700">Availability (Timings)</label>
                                <input
                                    type="text"
                                    {...register("availability")}
                                    required
                                    placeholder="Eg: 10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM"
                                    className="input-field"
                                />
                            </div>

                            {/* Consultation Fee */}
                            <div>
                                <input
                                    type="number"
                                    {...register("fee")}
                                    required
                                    placeholder="Consultation Fee (in INR)"
                                    className="input-field"
                                />
                            </div>

                            {/* Language Selection */}
                            <div>
                                <input
                                    type="text"
                                    {...register("language")}
                                    required
                                    placeholder="Enter known languages (Eg: English, Hindi)"
                                    className="input-field"
                                />
                            </div>

                            <button type="submit" className="btn-primary">Next</button>
                        </motion.form>
                    )}
                    {step === 4 && (
                        <motion.form
                            onSubmit={handleSubmit(handleRegister)}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div>
                                <input
                                    type="text"
                                    {...register("aadhar", { required: "Aadhar number is required", pattern: /^[0-9]{12}$/ })}
                                    placeholder="Enter your Aadhar Number"
                                    className="input-field"
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register("tnc", { required: "You must accept the terms and conditions" })}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">I accept the <Link to="/terms" className="text-blue-600">Terms and Conditions</Link></label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    {...register("consent", { required: "You must give consent" })}
                                    className="mr-2"
                                />
                                <label className="text-gray-700">I give my consent for data usage</label>
                            </div>
                            <button type="submit" className="btn-primary">Register</button>
                        </motion.form>
                    )}
                    <p className="text-center mt-4">Already registered? <Link to="/login" className="text-blue-600">Sign in</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;