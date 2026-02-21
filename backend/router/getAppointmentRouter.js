const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getPastAppointments,
  getUpcommingAppointments,
  getDocUpcommingAppointments,
  getDocPastAppointments,
} = require("../controllers/getAppointmentController");

const router = express.Router();
router.get("/past-appointments", authMiddleware, getPastAppointments);
router.get("/upcomming-appointments", authMiddleware, getUpcommingAppointments);
router.get(
  "/upcomming-doc-appointments",
  authMiddleware,
  getDocUpcommingAppointments
);
router.get("/past-doc-appointments", authMiddleware, getDocPastAppointments);

module.exports = router;
