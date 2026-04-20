const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../database/models/doctorModel");
const userModel = require("../database/models/userModel");

const registerController = async (req, res) => {
  try {
    const existingDoctor = await doctorModel.findOne({ email: req.body.email });
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingDoctor || existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const user = await doctorModel.create(req.body);
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(201).send({
      success: true,
      message: "User Registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in register API",
      error: error.message,
    });
  }
};

module.exports = registerController;
