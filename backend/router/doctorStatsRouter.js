const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const doctorStatsController = require("../controllers/doctorStatsController");

const router = express.Router();

router.get("/doctor-stats", authMiddleware, doctorStatsController);

module.exports = router;
