const appointmentModel = require("../database/models/appointmentModel");

const getPastAppointments = async (req, res) => {
  const userId = req.body.userId;
  const today = new Date().toISOString();

  try {
    const pastAppointments = appointmentModel.find(
      { userId, appointmentDate: { $lt: today } },
      { sort: { appointmentDate: -1 } }
    );

    return res.json({ pastAppointments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getDocPastAppointments = async (req, res) => {
  const doctorId = req.body.userId;
  const today = new Date().toISOString();

  try {
    const pastAppointments = appointmentModel.find(
      { doctorId, appointmentDate: { $lt: today } },
      { sort: { appointmentDate: -1 } }
    );

    return res.json({ pastAppointments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getUpcommingAppointments = async (req, res) => {
  const userId = req.body.userId;
  const today = new Date().toISOString();

  try {
    const UpcommingAppointments = appointmentModel.find(
      { userId, appointmentDate: { $gte: today } },
      { sort: { appointmentDate: 1 } }
    );

    return res.json({ UpcommingAppointments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getDocUpcommingAppointments = async (req, res) => {
  const doctorId = req.body.userId;
  const today = new Date().toISOString();

  try {
    const UpcommingAppointments = appointmentModel.find(
      { doctorId, appointmentDate: { $gte: today } },
      { sort: { appointmentDate: 1 } }
    );

    return res.status(200).json({ UpcommingAppointments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getPastAppointments,
  getUpcommingAppointments,
  getDocUpcommingAppointments,
  getDocPastAppointments,
};
