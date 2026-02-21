const express = require("express");
const appointmentController = require("../controllers/appointmentController");
const setAppointmentStatus = require("../controllers/appointmentStatusChangeController");

const router = express.Router();
router.post("/book-appointment", appointmentController);
router.patch("/update-appointment-status", setAppointmentStatus);

module.exports = router;
