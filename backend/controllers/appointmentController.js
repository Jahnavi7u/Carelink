const userModel = require("../database/models/userModel");
const appointmentModel = require("../database/models/appointmentModel");
const doctorModel = require("../database/models/doctorModel");
const { sendEmail } = require("../utils/emailService");

// Book an appointment & Notify Doctor
const appointmentController = async (req, res) => {
  const { doctorId, userId, appointmentDate, timeSlot } = req.body;

  try {
    const doctor = doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    const doctorName = doctor.name;
    const user = userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create appointment
    const appointment = appointmentModel.create({
      doctorId,
      userId,
      userName: user.name,
      userEmail: user.email,
      doctorName,
      docEmail: doctor.email,
      appointmentDate,
      timeSlot,
    });

    // Send email notification to doctor
    const emailSubject = "New Appointment Booked";
    const emailText = `Hello Dr. ${doctor.name},

        A new appointment has been booked:

        - Patient: ${user.name}
        - Email: ${user.email}
        - Date: ${new Date(appointmentDate).toLocaleDateString()}
        - Time Slot: ${timeSlot}

        Please confirm the appointment.

        Regards,
        Your Appointment System`;

    console.log("Before sending email...");
    await sendEmail(doctor.email, emailSubject, emailText);
    console.log("After sending email...");

    const patientEmailSubject = "Appointment Booked Successfully";
    const patientEmailText = `Hello ${user.name},

Your appointment has been successfully booked:

- Doctor: Dr. ${doctor.name}
- Date: ${new Date(appointmentDate).toLocaleDateString()}
- Time Slot: ${timeSlot}

We will notify you once the doctor confirms the appointment.

Thank you for using our service!

Regards,
Your Appointment System`;

    console.log("Before sending email to patient...");
    await sendEmail(user.email, patientEmailSubject, patientEmailText);
    console.log("After sending email to patient...");

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully, doctor notified via email",
      appointment,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};

module.exports = appointmentController;
