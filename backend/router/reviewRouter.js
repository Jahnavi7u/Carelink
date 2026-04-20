const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { addReviewController, getReviewsController, getAllRatingsController } = require("../controllers/reviewController");

const router = express.Router();

router.post("/review", authMiddleware, addReviewController);
router.get("/reviews/:doctorId", getReviewsController);
router.get("/ratings", getAllRatingsController);

module.exports = router;
