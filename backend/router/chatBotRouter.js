const express = require("express");
const chatBotController = require("../controllers/medpal");

const router = express.Router();

router.post("/chatbot", chatBotController);

module.exports = router;
