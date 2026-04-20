const { getDb } = require("../database/db");
const reviewModel = require("../database/models/reviewModel");

const doctorStatsController = async (req, res) => {
  try {
    const doctorId = req.body.userId;
    const db = getDb();

    // Total unique patients
    const totalPatients = db.prepare(
      "SELECT COUNT(DISTINCT userId) as count FROM appointments WHERE doctorId = ?"
    ).get(doctorId);

    // Total appointments
    const totalAppointments = db.prepare(
      "SELECT COUNT(*) as count FROM appointments WHERE doctorId = ?"
    ).get(doctorId);

    // This week's appointments (Sunday to Saturday)
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const weeklyAppointments = db.prepare(
      "SELECT COUNT(*) as count FROM appointments WHERE doctorId = ? AND appointmentDate >= ? AND appointmentDate < ?"
    ).get(doctorId, startOfWeek.toISOString(), endOfWeek.toISOString());

    // This month's appointments
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthlyAppointments = db.prepare(
      "SELECT COUNT(*) as count FROM appointments WHERE doctorId = ? AND appointmentDate >= ? AND appointmentDate < ?"
    ).get(doctorId, startOfMonth.toISOString(), endOfMonth.toISOString());

    // Get doctor's fee for revenue calculation
    const doctor = db.prepare("SELECT fee FROM doctors WHERE id = ?").get(doctorId);
    const fee = doctor?.fee || 0;

    // Monthly revenue = monthly confirmed appointments * fee
    const monthlyConfirmed = db.prepare(
      "SELECT COUNT(*) as count FROM appointments WHERE doctorId = ? AND appointmentDate >= ? AND appointmentDate < ? AND status != 'Cancelled'"
    ).get(doctorId, startOfMonth.toISOString(), endOfMonth.toISOString());

    const monthlyRevenue = (monthlyConfirmed?.count || 0) * fee;

    // Pending appointments
    const pendingAppointments = db.prepare(
      "SELECT COUNT(*) as count FROM appointments WHERE doctorId = ? AND status = 'Pending'"
    ).get(doctorId);

    // Rating stats
    const ratingStats = reviewModel.getAverageRating(doctorId);

    return res.status(200).send({
      success: true,
      stats: {
        totalPatients: totalPatients?.count || 0,
        totalAppointments: totalAppointments?.count || 0,
        weeklyAppointments: weeklyAppointments?.count || 0,
        monthlyAppointments: monthlyAppointments?.count || 0,
        monthlyRevenue,
        pendingAppointments: pendingAppointments?.count || 0,
        averageRating: ratingStats.average,
        totalReviews: ratingStats.count,
        consultationFee: fee,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching doctor stats",
      error: error.message,
    });
  }
};

module.exports = doctorStatsController;
