const prescriptionModel = require("../database/models/prescriptionModel");
const appointmentModel = require("../database/models/appointmentModel");
const doctorModel = require("../database/models/doctorModel");

const createPrescription = async (req, res) => {
  try {
    const { userId: doctorId, appointmentId, diagnosis, medicines, notes } = req.body;

    if (!appointmentId || !diagnosis || !medicines || medicines.length === 0) {
      return res.status(400).send({ success: false, message: "Appointment ID, diagnosis, and medicines are required" });
    }

    // Get appointment details
    const appointment = appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).send({ success: false, message: "Appointment not found" });
    }

    // Get doctor name
    const doctor = doctorModel.findById(doctorId);

    const prescription = prescriptionModel.create({
      appointmentId,
      doctorId,
      doctorName: doctor?.name || "Unknown",
      userId: appointment.userId,
      userName: appointment.userName,
      diagnosis,
      medicines,
      notes,
    });

    // Mark appointment as completed
    appointmentModel.update(appointmentId, { status: "Completed" });

    return res.status(201).send({
      success: true,
      message: "Prescription created successfully",
      prescription,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error creating prescription", error: error.message });
  }
};

const getPrescriptionsByPatient = async (req, res) => {
  try {
    const userId = req.body.userId;
    const prescriptions = prescriptionModel.findByPatient(userId);
    return res.status(200).send({ success: true, prescriptions });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error fetching prescriptions" });
  }
};

const getPrescriptionByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const prescription = prescriptionModel.findByAppointment(parseInt(appointmentId));
    return res.status(200).send({ success: true, prescription });
  } catch (error) {
    return res.status(500).send({ success: false, message: "Error fetching prescription" });
  }
};

module.exports = { createPrescription, getPrescriptionsByPatient, getPrescriptionByAppointment };
