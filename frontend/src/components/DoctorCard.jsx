import axios from "axios";
import React, { useState, useEffect } from "react";
import { MapPinned, Star } from 'lucide-react';

const DoctorCard = ({ doctor, ratings }) => {
    const [appointmentDate, setAppointmentDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const today = new Date();
    const [mapURL, setMapURL] = useState('');

    // Review state
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewHover, setReviewHover] = useState(0);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");

    const doctorRating = ratings?.[doctor._id];

    const formatDate = (date) => {
        return date.toLocaleDateString('en-CA');
    };

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const res = await axios.post("http://localhost:8080/v1/maps", { address: doctor.clinicname + " " + doctor.clinicloc });
                setMapURL(res.data.mapsUrl);
            } catch (err) {
                // Maps API might not be configured, ignore
            }
        };
        if (doctor.clinicname && doctor.clinicloc) fetchMap();
    }, [doctor.clinicname, doctor.clinicloc]);

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
                    timeSlot: doctor.availability?.[0] || "TBD"
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

    const handleSubmitReview = async () => {
        if (reviewRating === 0) {
            setReviewMessage("Please select a rating");
            return;
        }

        setReviewSubmitting(true);
        try {
            const token = localStorage.getItem("userToken");
            const userRes = await axios.get("http://localhost:8080/v1/current-user", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const user = userRes.data.user;
            await axios.post(
                "http://localhost:8080/v1/review",
                {
                    doctorId: doctor._id,
                    userName: user.name,
                    rating: reviewRating,
                    comment: reviewComment,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setReviewMessage("Review submitted! ✅");
            setShowReviewForm(false);
            setReviewRating(0);
            setReviewComment("");
        } catch (err) {
            console.error(err);
            setReviewMessage("Error submitting review");
        } finally {
            setReviewSubmitting(false);
        }
    };

    const renderStars = (rating, size = "w-4 h-4") => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-lg transition flex flex-col md:flex-row gap-6">
            {/* Left Section */}
            <div className="flex-1">
                <a href={mapURL || "#"} target={mapURL ? "_blank" : undefined} className="hover:cursor-pointer" rel="noopener noreferrer">
                    <h3 className="text-2xl font-bold text-indigo-700 mb-2 flex gap-2 items-center">
                        <MapPinned />
                        {doctor.name}
                    </h3>
                </a>

                {/* Rating Display */}
                {doctorRating && doctorRating.count > 0 && (
                    <div className="flex items-center gap-2 mb-2">
                        {renderStars(Math.round(doctorRating.average))}
                        <span className="text-sm text-gray-600">
                            {doctorRating.average} ({doctorRating.count} review{doctorRating.count !== 1 ? "s" : ""})
                        </span>
                    </div>
                )}

                <p className="text-gray-600 mb-1"><strong>Specialization:</strong> {doctor.specialization}</p>
                <p className="text-gray-600 mb-1"><strong>Degree:</strong> {doctor.degree}</p>
                <p className="text-gray-600 mb-1"><strong>Experience:</strong> {doctor.yoe} years</p>
                <p className="text-gray-600 mb-1"><strong>Clinic:</strong> {doctor.clinicname} ({doctor.clinicloc})</p>
                <p className="text-gray-600 mb-1"><strong>Availability:</strong> {Array.isArray(doctor.availability) ? doctor.availability.join(", ") : doctor.availability}</p>
            </div>

            {/* Right Section */}
            <div className="flex-1">
                <p className="text-gray-600 mb-1"><strong>Fee:</strong> ₹{doctor.fee}</p>
                <p className="text-gray-600 mb-1"><strong>Languages:</strong> {Array.isArray(doctor.language) ? doctor.language.join(", ") : doctor.language}</p>

                {/* Date Picker */}
                <label className="block text-gray-700 font-semibold mb-2 mt-3" htmlFor={`date-${doctor._id}`}>
                    Select Appointment Date:
                </label>
                <input
                    type="date"
                    id={`date-${doctor._id}`}
                    className="border border-gray-300 rounded-md p-2 mb-4 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    min={formatDate(today)}
                />

                {error && <p className="text-red-600 mb-2">{error}</p>}

                <button
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out cursor-pointer"
                    onClick={handleAppointment}
                    disabled={loading}
                >
                    {loading ? "Booking..." : "Book Appointment"}
                </button>

                {/* Rate Doctor Button */}
                <button
                    className="w-full mt-2 border border-indigo-600 text-indigo-600 font-semibold py-2 px-4 rounded-md hover:bg-indigo-50 transition cursor-pointer"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                >
                    ⭐ Rate this Doctor
                </button>

                {reviewMessage && (
                    <p className="text-sm mt-1 text-center text-green-600">{reviewMessage}</p>
                )}

                {/* Review Form */}
                {showReviewForm && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Your Rating:</p>
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-7 h-7 cursor-pointer transition ${star <= (reviewHover || reviewRating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                    onMouseEnter={() => setReviewHover(star)}
                                    onMouseLeave={() => setReviewHover(0)}
                                    onClick={() => setReviewRating(star)}
                                />
                            ))}
                        </div>
                        <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Write a review (optional)"
                            className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleSubmitReview}
                            disabled={reviewSubmitting}
                            className="w-full mt-2 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition cursor-pointer text-sm"
                        >
                            {reviewSubmitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorCard;
