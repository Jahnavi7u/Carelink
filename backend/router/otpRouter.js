const express = require("express");
const {
  otpGenerateController,
  otpVerifyController,
} = require("../controllers/otpController");

const router = express.Router();
router.post("/get-otp", otpGenerateController);
router.post("/verify-otp", otpVerifyController);

module.exports = router;
