const doctorModel = require("../database/models/doctorModel");
const userModel = require("../database/models/userModel");

const currentUserController = async (req, res) => {
  try {
    let user = userModel.findById(req.body.userId);
    if (!user) {
      user = doctorModel.findById(req.body.userId);
    }
    return res.status(200).send({
      success: true,
      message: "user fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "unable to get current user",
      error: error.message,
    });
  }
};

module.exports = currentUserController;
