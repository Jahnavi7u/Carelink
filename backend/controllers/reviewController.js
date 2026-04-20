const reviewModel = require("../database/models/reviewModel");

const addReviewController = async (req, res) => {
    try {
        const { userId, doctorId, userName, rating, comment } = req.body;

        if (!doctorId || !rating) {
            return res.status(400).send({ success: false, message: "Doctor ID and rating are required" });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ success: false, message: "Rating must be between 1 and 5" });
        }

        const review = reviewModel.create({ doctorId, userId, userName, rating, comment });

        return res.status(201).send({
            success: true,
            message: "Review submitted successfully",
            review,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error submitting review",
            error: error.message,
        });
    }
};

const getReviewsController = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const reviews = reviewModel.findByDoctor(doctorId);
        const stats = reviewModel.getAverageRating(doctorId);

        return res.status(200).send({
            success: true,
            reviews,
            average: stats.average,
            count: stats.count,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error fetching reviews",
            error: error.message,
        });
    }
};

const getAllRatingsController = async (req, res) => {
    try {
        const ratings = reviewModel.getAllAverages();
        return res.status(200).send({ success: true, ratings });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ success: false, message: "Error fetching ratings" });
    }
};

module.exports = { addReviewController, getReviewsController, getAllRatingsController };
