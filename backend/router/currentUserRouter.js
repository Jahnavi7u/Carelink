const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const currentUserController = require("../controllers/currentUserController");

const router = express.Router();
router.get("/current-user", authMiddleware, currentUserController);

module.exports = router;
