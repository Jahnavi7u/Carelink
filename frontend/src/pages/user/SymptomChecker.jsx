import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

const SymptomChecker = () => {
    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleCheck = async () => {
        if (!symptoms.trim()) {
            setError("Please describe your symptoms");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await axios.post("http://localhost:8080/v1/symptom-check", { symptoms });
            if (response.data.success) {
                setResult(response.data.result);
            } else {
                setError("Could not analyze symptoms. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Error connecting to the AI service.");
        } finally {
            setLoading(false);
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case "High": return "text-red-600 bg-red-50 border-red-200";
            case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "Low": return "text-green-600 bg-green-50 border-green-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    const getUrgencyIcon = (urgency) => {
        switch (urgency) {
            case "High": return <AlertTriangle className="w-5 h-5" />;
            case "Medium": return <Activity className="w-5 h-5" />;
            case "Low": return <CheckCircle className="w-5 h-5" />;
            default: return null;
        }
    };

    const handleFindDoctor = () => {
        if (result?.specialization) {
            navigate(`/doctorlist?specialization=${encodeURIComponent(result.specialization)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8">
            <motion.div
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white p-8 rounded-2xl shadow-md border border-indigo-300 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity className="w-8 h-8 text-indigo-600" />
                        <h2 className="text-2xl font-bold text-indigo-600">AI Symptom Checker</h2>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Describe your symptoms and our AI will help recommend the right specialist for you.
                    </p>

                    <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Example: I have a persistent headache for 3 days, along with blurred vision and dizziness..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-32 transition"
                    />

                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className="btn-primary w-full mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Analyzing symptoms...
                            </span>
                        ) : "Check Symptoms"}
                    </button>
                </div>

                <AnimatePresence>
                    {result && (
                        <motion.div
                            className="bg-white p-8 rounded-2xl shadow-md border border-indigo-300 space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.4 }}
                        >
                            <h3 className="text-xl font-bold text-gray-800">Assessment Result</h3>

                            {/* Urgency Badge */}
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${getUrgencyColor(result.urgency)}`}>
                                {getUrgencyIcon(result.urgency)}
                                <span className="font-semibold">Urgency: {result.urgency}</span>
                            </div>

                            {/* Assessment */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-gray-700">{result.assessment}</p>
                            </div>

                            {/* Advice */}
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                <p className="text-indigo-700 font-medium">💡 {result.advice}</p>
                            </div>

                            {/* Recommended Specialist */}
                            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                <p className="text-green-800 font-semibold mb-1">Recommended Specialist</p>
                                <p className="text-green-700 text-lg">{result.specialization}</p>
                            </div>

                            {/* Find Doctor Button */}
                            <button
                                onClick={handleFindDoctor}
                                className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition cursor-pointer flex items-center justify-center gap-2"
                            >
                                Find {result.specialization} Doctors <ArrowRight className="w-5 h-5" />
                            </button>

                            <p className="text-xs text-gray-400 text-center">
                                ⚠️ This is an AI-powered assessment and should not replace professional medical advice.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default SymptomChecker;
