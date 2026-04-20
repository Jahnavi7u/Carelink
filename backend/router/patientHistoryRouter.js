const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const patientHistoryController = require("../controllers/patientHistoryController");

const router = express.Router();

router.get("/patient-history/:patientId", authMiddleware, patientHistoryController);

module.exports = router;
