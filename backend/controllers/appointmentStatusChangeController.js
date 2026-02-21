const appointmentModel = require("../database/models/appointmentModel");
const { sendEmail } = require("../utils/emailService");

const setAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;

  try {
    // Find the appointment by ID
    const appointment = appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Update the status
    const updated = appointmentModel.update(appointment._id, { status });

    // Send confirmation email to customer if appointment is confirmed
    if (status === "Confirmed") {
      const emailSubject = "Your Appointment is Confirmed";
      const emailText = `Hello ${updated.userName},

Good news! Your appointment has been confirmed:

- Doctor: Dr. ${updated.doctorName}
- Date: ${new Date(updated.appointmentDate).toLocaleDateString()}
- Time Slot: ${updated.timeSlot}

Please make sure to arrive 10 minutes before your scheduled time.

Thank you for choosing our service!

Best Regards,
Your Appointment System`;

      console.log("Sending confirmation email to user...");
      await sendEmail(updated.userEmail, emailSubject, emailText);
      console.log("Confirmation email sent to user.");
    }

    return res.status(200).json({
      message: `Appointment status updated to ${status}`,
      appointment: updated,
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message, success: false });
  }
};

module.exports = setAppointmentStatus;
