import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import BloodGroupSelector from "../../components/BloodGroupSelector";
import { useUser } from "../../contexts/UserContext"; // Import useUser
import { motion } from "framer-motion";

const Register = () => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUser();  // Get setUser from context

    // Checkbox states
    const [hasAllergies, setHasAllergies] = useState(false);
    const [hasChronicIllness, setHasChronicIllness] = useState(false);
    const [hasMedication, setHasMedication] = useState(false);
    const [hasSurgeries, setHasSurgeries] = useState(false);
    const [smokes, setSmokes] = useState(false);
    const [drinks, setDrinks] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("userToken");
        if (token) navigate("/home");
    }, [navigate]);

    // Restore formData when navigating back to a previous step
    useEffect(() => {
        if (formData) {
            setHasAllergies(formData.hasAllergies || false);
            setHasChronicIllness(formData.hasChronicIllness || false);
            setHasMedication(formData.hasMedication || false);
            setHasSurgeries(formData.hasSurgeries || false);
            setSmokes(formData.smoking || false);
            setDrinks(formData.drinking || false);

            // Restore checkbox-related inputs
            setValue("allergy", formData.allergy || "");
            setValue("chronic", formData.chronic || "");
            setValue("currentmed", formData.currentmed || "");
            setValue("pastsur", formData.pastsur || "");
        }
    }, [formData, setValue]);

    const handleNext = (data) => {
        setFormData(prev => ({
            ...prev,
            ...data,
            hasAllergies,
            hasChronicIllness,
            hasMedication,
            hasSurgeries,
            smoking: smokes,
            drinking: drinks,
        }));
        setStep(step + 1);
    };

    const handleRegister = async (data) => {
        const finalData = { ...formData, ...data };
        console.log(finalData);

        try {
            const response = await axios.post("http://localhost:8080/v1/register", finalData);
            if (response.data.success) {
                localStorage.setItem("userToken", response.data.token);
                setUser(response.data.user); // Update context
                navigate("/home", { replace: true });
            } else {
                throw new Error("Username or Email already exists");
            }
        } catch (error) {
            setErrorMessage(error.message || "Something went wrong!");
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
                {/* Left Section - Illustration */}
                <div className="flex w-1/2 justify-center items-center h-full flex-col">
                    {step === 1 ? "" : <button onClick={() => setStep(step - 1)} className="bg-indigo-600 font-bold text-white py-1 px-5 rounded-full absolute left-3 top-3 hover:cursor-pointer">Back</button>}
                    <h2 className="text-2xl font-bold text-center mb-4">Welcome to CareLink</h2>
                    <img src="/illustrations/patientReg.svg" alt="Medicine Illustration" className="my-auto" />
                </div>

                {/* Right Section - Form */}
                <div className="w-full md:w-1/2 p-6">
                    <h2 className="text-2xl font-bold text-center mb-4">{step === 1 ? "Basic Details" : (step === 2 ? "Medical Details" : "Terms & Conditions")}</h2>
                    <hr className="mb-4" />

                    {step === 1 ? (
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
                            <div>
                                <input
                                    type="tel"
                                    {...register("ephone", { pattern: /^[0-9]{10}$/ })}
                                    required
                                    placeholder="Enter your Emergency Contact"
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
                    ) : (step === 2 ? (
                        <motion.form
                            onSubmit={handleSubmit(handleNext)}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Blood Group */}
                            <BloodGroupSelector register={register} />

                            {/* Allergies */}
                            <div className="toggle-section">
                                <label className="toggle-label">
                                    <input type="checkbox" onChange={() => setHasAllergies(!hasAllergies)} className="toggle-checkbox" />
                                    Any Allergies?
                                </label>
                                {hasAllergies && <input type="text" {...register("allergy")} placeholder="List allergies" className="input-field" />}
                            </div>

                            {/* Chronic Illness */}
                            <div className="toggle-section">
                                <label className="toggle-label">
                                    <input type="checkbox" onChange={() => setHasChronicIllness(!hasChronicIllness)} className="toggle-checkbox" />
                                    Any Chronic Illness?
                                </label>
                                {hasChronicIllness && <input type="text" {...register("chronic")} placeholder="List chronic illnesses" className="input-field" />}
                            </div>

                            {/* Current Medication */}
                            <div className="toggle-section">
                                <label className="toggle-label">
                                    <input type="checkbox" onChange={() => setHasMedication(!hasMedication)} className="toggle-checkbox" />
                                    Any Ongoing Medications?
                                </label>
                                {hasMedication && <input type="text" {...register("currentmed")} placeholder="List current medications" className="input-field" />}
                            </div>

                            {/* Past Surgeries */}
                            <div className="toggle-section">
                                <label className="toggle-label">
                                    <input type="checkbox" onChange={() => setHasSurgeries(!hasSurgeries)} className="toggle-checkbox" />
                                    Any Past Surgeries?
                                </label>
                                {hasSurgeries && <input type="text" {...register("pastsur")} placeholder="List past surgeries" className="input-field" />}
                            </div>

                            {/* Smoking */}
                            <div className="toggle-section">
                                <label className="toggle-label">
                                    <input type="checkbox" onChange={() => setSmokes(!smokes)} className="toggle-checkbox" />
                                    Do you Smoke?
                                </label>
                                {smokes && (
                                    <div className="flex gap-4 mt-2">
                                        <label className="radio-label">
                                            <input type="radio" {...register("ifsmoking")} value="Occasionally" className="radio-input" />
                                            Occasionally
                                        </label>
                                        <label className="radio-label">
                                            <input type="radio" {...register("ifsmoking")} value="Regularly" className="radio-input" />
                                            Regularly
                                        </label>
                                        <label className="radio-label">
                                            <input type="radio" {...register("ifsmoking")} value="Heavily" className="radio-input" />
                                            Heavily
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Drinking */}
                            <div className="toggle-section">
                                <label className="toggle-label">
                                    <input type="checkbox" onChange={() => setDrinks(!drinks)} className="toggle-checkbox" />
                                    Do you Drink?
                                </label>
                                {drinks && (
                                    <div className="flex gap-4 mt-2">
                                        <label className="radio-label">
                                            <input type="radio" {...register("ifdrinking")} value="Occasionally" className="radio-input" />
                                            Occasionally
                                        </label>
                                        <label className="radio-label">
                                            <input type="radio" {...register("ifdrinking")} value="Regularly" className="radio-input" />
                                            Regularly
                                        </label>
                                        <label className="radio-label">
                                            <input type="radio" {...register("ifdrinking")} value="Heavily" className="radio-input" />
                                            Heavily
                                        </label>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn-primary">Next</button>
                        </motion.form>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit(handleRegister)}
                            className="space-y-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Scrollable Terms & Conditions Section */}
                            <div className="border p-4 h-80 overflow-y-scroll bg-gray-50 rounded-md text-sm">
                                <h3 className="text-lg font-semibold">Terms & Conditions</h3>
                                <p>Welcome to CareLink! By using our platform, you agree to the following terms and conditions. Please read them carefully.</p>

                                <h4 className="font-semibold mt-2">1. Acceptance of Terms</h4>
                                <p>By accessing or using CareLink, you agree to be bound by these Terms and Conditions, along with our Privacy Policy.</p>

                                <h4 className="font-semibold mt-2">2. Services Provided</h4>
                                <p>CareLink is a telemedicine platform connecting patients with verified healthcare professionals. <strong>No emergency services.</strong></p>

                                <h4 className="font-semibold mt-2">3. User Responsibilities</h4>
                                <ul className="list-disc ml-5">
                                    <li>Provide accurate and complete information.</li>
                                    <li>Use CareLink for lawful and ethical purposes.</li>
                                    <li>Must be 18+ years old or have parental consent.</li>
                                </ul>

                                <h4 className="font-semibold mt-2">4. Privacy & Data Protection</h4>
                                <p>We prioritize your privacy. Data is securely stored and encrypted.</p>

                                <h4 className="font-semibold mt-2">5. Limitation of Liability</h4>
                                <p>CareLink is not liable for incorrect medical advice, loss due to reliance on teleconsultations, or service downtime.</p>

                                <h4 className="font-semibold mt-2">6. Changes to Terms</h4>
                                <p>We may update these Terms & Conditions at any time.</p>
                            </div>

                            {/* Checkboxes for Consent */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="acceptTnC"
                                    required
                                />
                                <label htmlFor="acceptTnC" className="text-sm">
                                    I accept the <strong>Terms & Conditions</strong>.
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="consentData"
                                    required
                                />
                                <label htmlFor="consentData" className="text-sm">
                                    I give consent to share my medical data with doctors.
                                </label>
                            </div>

                            {/* Register Button (Disabled until checkboxes are checked) */}
                            <button
                                type="submit"
                                className="btn-primary w-full"
                            >
                                Register
                            </button>
                        </motion.form>

                    ))}
                    <p className="text-center mt-4">Already registered? <Link to="/login" className="text-blue-600">Sign in</Link></p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;