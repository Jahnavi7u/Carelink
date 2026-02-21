const express = require("express");
const registerController = require("../controllers/doctorRegisterController");

const router = express.Router();

router.post("/registerdoc", registerController);

module.exports = router;
