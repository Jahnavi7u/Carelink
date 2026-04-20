const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createPrescription, getPrescriptionsByPatient, getPrescriptionByAppointment } = require("../controllers/prescriptionController");

const router = express.Router();

router.post("/prescription", authMiddleware, createPrescription);
router.get("/my-prescriptions", authMiddleware, getPrescriptionsByPatient);
router.get("/prescription/:appointmentId", getPrescriptionByAppointment);

module.exports = router;
