const { otpService } = require("../utils/emailService");

const otpStore = new Map();

const otpVerifyController = async (req, res) => {
  const { otp, email } = req.body;
  const data = otpStore.get(email);

  if (!data)
    return res.status(400).json({ message: "No OTP found for this email" });

  const { otp: storedOtp, expiresAt } = data;

  if (Date.now() > expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (otp.toString() === storedOtp) {
    // 🔥 FIXED here
    otpStore.delete(email); // optional: remove OTP after successful verification
    return res.json({ success: true, message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};

// Book an appointment & Notify Doctor
const otpGenerateController = async (req, res) => {
  const email = req.body.email;

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity
    // Send email notification to doctor

    otpStore.set(email, { otp, expiresAt });

    const emailSubject = "CareLink OTP Verification";
    const emailText = `Hello Costumer,

        Your OTP for verification is ${otp}. It is valid for 5 minutes.
        Please do not share this OTP with anyone.
        Regards,
        - OTP: ${otp}
        - Validity: 5 minutes

        Regards,
        MediPAal Team`;

    await otpService(email, emailSubject, emailText);

    return res.json({
      success: true,
      message: "OTP sent successfully, please check your email",
      otp,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { otpGenerateController, otpVerifyController };
