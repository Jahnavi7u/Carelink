const doctorModel = require("../database/models/doctorModel");

const getUnderReview = async (req, res) => {
  try {
    const doctor = doctorModel.find({ verify: "Under Review" });
    return res.status(200).send({
      success: true,
      doctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to get the doctor",
      error: error.message,
    });
  }
};

const getVerify = async (req, res) => {
  try {
    const doctor = doctorModel.find({ verify: "Verified" });
    return res.status(200).send({
      success: true,
      doctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Unable to get the doctor",
      error: error.message,
    });
  }
};

module.exports = { getUnderReview, getVerify };
