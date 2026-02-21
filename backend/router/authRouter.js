const express = require("express");
const registerController = require("../controllers/userRegisterController");

const router = express.Router();

router.post("/register", registerController);

module.exports = router;
