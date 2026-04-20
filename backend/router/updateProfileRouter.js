const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const updateProfileController = require("../controllers/updateProfileController");

const router = express.Router();

router.put("/update-profile", authMiddleware, updateProfileController);

module.exports = router;
