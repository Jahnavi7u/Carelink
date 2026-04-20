const userModel = require("../database/models/userModel");
const appointmentModel = require("../database/models/appointmentModel");
const prescriptionModel = require("../database/models/prescriptionModel");

const patientHistoryController = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get patient details
    const patient = userModel.findById(parseInt(patientId));
    if (!patient) {
      return res.status(404).send({ success: false, message: "Patient not found" });
    }

    // Remove sensitive fields
    delete patient.password;

    // Get all appointments for this patient
    const appointments = appointmentModel.find(
      { userId: parseInt(patientId) },
      { sort: { appointmentDate: -1 } }
    );

    // Get all prescriptions for this patient
    const prescriptions = prescriptionModel.findByPatient(parseInt(patientId));

    return res.status(200).send({
      success: true,
      patient,
      appointments,
      prescriptions,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Error fetching patient history", error: error.message });
  }
};

module.exports = patientHistoryController;
