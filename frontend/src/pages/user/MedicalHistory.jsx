import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const MedicalRecords = () => {
  const [newPrescription, setNewPrescription] = useState({ date: "", reason: "", image: "" });
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const userIdRef = useRef(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user ID from localStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Ensure token is available
        const response = await axios.get("http://localhost:8080/v1/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const storedUserId = response.data.user._id; // Ensure user ID is stored

        if (storedUserId) {
          setUserId(storedUserId);
          userIdRef.current = storedUserId; // Update ref
        } else {
          console.error("User ID not found in API response");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);  // Runs once when the component mounts

  // Fetch images from backend
  useEffect(() => {
    if (!userIdRef.current) {
      console.log("User ID is missing");
      return;
    }

    const fetchPrescriptions = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8080/v1/images",
          { userId: userIdRef.current },
          { headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` } }
        );
        setPrescriptions(response.data);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setError("Failed to load prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [userId]);  // Ensure useEffect runs when userId is available

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPrescription({ ...newPrescription, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!userIdRef.current) {
      alert("User ID is missing! Please log in again.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userIdRef.current.toString());
    formData.append("date", newPrescription.date);  // ✅ Added
    formData.append("reason", newPrescription.reason);  // ✅ Added

    try {
      const response = await axios.post("http://localhost:8080/v1/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setNewPrescription({ ...newPrescription, image: response.data.imageUrl });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert("File upload failed: " + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const addPrescription = () => {
    if (!newPrescription.date || !newPrescription.reason || !newPrescription.image) {
      alert("Please fill all fields (Date, Reason, and Image).");
      return;
    }

    const newId = prescriptions.length ? Math.max(...prescriptions.map(p => p.id)) + 1 : 1;
    setPrescriptions([...prescriptions, { ...newPrescription, id: newId }]);
    setNewPrescription({ date: "", reason: "", image: "" });
  };

  const deletePrescription = (id) => {
    setPrescriptions(prescriptions.filter(p => p.id !== id));
  };

  const filterPrescriptions = () => {
    const now = new Date();
    return prescriptions.filter(p => {
      const prescriptionDate = new Date(p.date);
      if (isNaN(prescriptionDate)) return false; // Ignore invalid dates

      if (filter === "week") {
        return (now - prescriptionDate) / (1000 * 60 * 60 * 24) <= 7;
      } else if (filter === "month") {
        return (now - prescriptionDate) / (1000 * 60 * 60 * 24) <= 30;
      } else if (filter === "year") {
        return (now - prescriptionDate) / (1000 * 60 * 60 * 24) <= 365;
      }
      return true;
    });
  };

  const sortedPrescriptions = [...filterPrescriptions()].sort((a, b) =>
    sortOrder === "desc" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-b from-blue-50 to-indigo-50 min-h-screen">
      <motion.h1
        className="text-3xl font-bold text-indigo-600 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Medical Records
      </motion.h1>

      {/* Add New Prescription */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold mb-4 text-indigo-600">Add New Prescription</h2>
        <div className="grid gap-4">
          <input type="date" name="date" value={newPrescription.date} onChange={handleInputChange} className="border p-2 rounded w-full" />
          <input type="text" name="reason" placeholder="Reason" value={newPrescription.reason} onChange={handleInputChange} className="border p-2 rounded w-full" />
          <div>
            <input type="file" onChange={handleFileUpload} />
            {uploading && <p>Uploading...</p>}
          </div>
          <button onClick={addPrescription} className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Add Prescription</button>
        </div>
      </motion.div>

      {/* Prescription List */}
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-semibold text-indigo-600">Previous Prescriptions</h2>
          <div className="flex gap-2">
            <select onChange={(e) => setFilter(e.target.value)} className="border px-3 py-1 rounded">
              <option value="all">All</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="year">Past Year</option>
            </select>
            <button onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")} className="bg-gray-200 px-3 py-1 rounded">Sort {sortOrder === "desc" ? "Oldest" : "Newest"}</button>
          </div>
        </div>
        <div className="overflow-x-auto flex gap-4 p-2">
          {sortedPrescriptions.map(prescription => (
            <motion.div
              key={prescription.id}
              className="border p-4 rounded-lg shadow-md bg-indigo-100 min-w-[200px] cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold">{prescription.date}</p>
              <p className="text-gray-700">{prescription.reason}</p>
              <img src={prescription.imageUrl} alt="Prescription" className="w-32 h-32 mt-2 rounded" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MedicalRecords;