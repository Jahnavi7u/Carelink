import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Plus, Trash2, FileText } from "lucide-react";

const WritePrescription = () => {
    const { appointmentId, patientId, patientName } = useParams();
    const navigate = useNavigate();
    const [diagnosis, setDiagnosis] = useState("");
    const [notes, setNotes] = useState("");
    const [medicines, setMedicines] = useState([{ name: "", dosage: "", duration: "", frequency: "" }]);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const addMedicine = () => {
        setMedicines([...medicines, { name: "", dosage: "", duration: "", frequency: "" }]);
    };

    const removeMedicine = (index) => {
        if (medicines.length > 1) {
            setMedicines(medicines.filter((_, i) => i !== index));
        }
    };

    const updateMedicine = (index, field, value) => {
        const updated = [...medicines];
        updated[index][field] = value;
        setMedicines(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!diagnosis.trim()) {
            setMessage("Please enter a diagnosis");
            return;
        }
        if (medicines.some((m) => !m.name.trim())) {
            setMessage("Please fill in all medicine names");
            return;
        }

        setSaving(true);
        setMessage("");

        try {
            const token = localStorage.getItem("userToken");
            const response = await axios.post(
                "http://localhost:8080/v1/prescription",
                {
                    appointmentId: parseInt(appointmentId),
                    diagnosis,
                    medicines,
                    notes,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setMessage("Prescription saved successfully! ✅");
                setTimeout(() => navigate("/appointment-doc"), 2000);
            }
        } catch (err) {
            console.error(err);
            setMessage("Error saving prescription");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-8">
            <motion.div
                className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-indigo-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="w-8 h-8 text-indigo-600" />
                    <div>
                        <h2 className="text-2xl font-bold text-indigo-600">Write Prescription</h2>
                        <p className="text-gray-500 text-sm">Patient: <strong>{decodeURIComponent(patientName)}</strong></p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Diagnosis */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Diagnosis *</label>
                        <input
                            type="text"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="e.g., Viral Fever, Hypertension"
                            className="input-field"
                        />
                    </div>

                    {/* Medicines */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-gray-700 font-medium">Medicines *</label>
                            <button
                                type="button"
                                onClick={addMedicine}
                                className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" /> Add Medicine
                            </button>
                        </div>

                        {medicines.map((med, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-semibold text-gray-600">Medicine #{index + 1}</span>
                                    {medicines.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMedicine(index)}
                                            className="text-red-400 hover:text-red-600 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={med.name}
                                        onChange={(e) => updateMedicine(index, "name", e.target.value)}
                                        placeholder="Medicine name"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        value={med.dosage}
                                        onChange={(e) => updateMedicine(index, "dosage", e.target.value)}
                                        placeholder="Dosage (e.g., 500mg)"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        value={med.frequency}
                                        onChange={(e) => updateMedicine(index, "frequency", e.target.value)}
                                        placeholder="Frequency (e.g., 3 times/day)"
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        value={med.duration}
                                        onChange={(e) => updateMedicine(index, "duration", e.target.value)}
                                        placeholder="Duration (e.g., 5 days)"
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Additional Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Rest, diet advice, follow-up instructions..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                        />
                    </div>

                    {message && (
                        <p className={`text-sm font-medium ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button type="submit" disabled={saving} className="btn-primary flex-1">
                            {saving ? "Saving..." : "Save Prescription"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/appointment-doc")}
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

export default WritePrescription;
