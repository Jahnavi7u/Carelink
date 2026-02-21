const express = require("express");
const docVerifyChange = require("../controllers/changeDocController");

const router = express.Router();
router.put("/change-verify", docVerifyChange);

module.exports = router;
