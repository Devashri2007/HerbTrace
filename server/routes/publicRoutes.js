const express = require("express");
const router = express.Router();
const { getPublicProductTrace } = require("../controllers/publicController");

// Public route for consumers scanning QR code
router.get("/trace/:productId", getPublicProductTrace);

module.exports = router;
