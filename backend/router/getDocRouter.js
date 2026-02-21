const express = require("express");
const {
  getUnderReview,
  getVerify,
} = require("../controllers/getDocController");

const router = express.Router();
router.get("/getunder", getUnderReview);
router.get("/getverified", getVerify);

module.exports = router;
