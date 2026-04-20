const express = require("express");
const symptomCheckerController = require("../controllers/symptomCheckerController");

const router = express.Router();

router.post("/symptom-check", symptomCheckerController);

module.exports = router;
