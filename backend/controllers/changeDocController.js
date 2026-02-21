const doctorModel = require("../database/models/doctorModel");

const docVerifyChange = async (req, res) => {
  try {
    const { verify, id } = req.body;
    console.log(id);
    const status = doctorModel.findByIdAndUpdate(id, { verify });

    if (!status) return res.status(404).json({ error: "Doctor not found" });

    return res.json(status);
  } catch (error) {
    res.status(500).json({ error: "Error updating issue status" });
  }
};

module.exports = docVerifyChange;
