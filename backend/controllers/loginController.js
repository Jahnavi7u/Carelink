const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../database/models/userModel");
const doctorModel = require("../database/models/doctorModel");

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = userModel.findOne({ email });

    if (!user) {
      user = doctorModel.findOne({ email }); // Check doctors collection
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.status(200).send({
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Login API",
      error: error.message,
    });
  }
};

module.exports = loginController;
