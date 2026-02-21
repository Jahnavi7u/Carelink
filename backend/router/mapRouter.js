const express = require("express");
const mapsIntegrate = require("../controllers/mapController");

const router = express.Router();
router.post("/maps", mapsIntegrate);

module.exports = router;
