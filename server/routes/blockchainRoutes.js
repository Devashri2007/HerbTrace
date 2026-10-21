const express = require("express");
const router = express.Router();
const BlockchainService = require("../services/blockchainService");
const BlockchainRecord = require("../models/BlockchainRecord");
const { protect } = require("../middleware/authMiddleware");

router.get("/status", async (req, res, next) => {
  try {
    const status = await BlockchainService.getNetworkStatus();
    res.json({ success: true, status });
  } catch (err) {
    next(err);
  }
});

router.get("/records", async (req, res, next) => {
  try {
    const records = await BlockchainRecord.find().sort({ createdAt: -1 });
    res.json({ success: true, count: records.length, records });
  } catch (err) {
    next(err);
  }
});

router.get("/:batchId", async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const records = await BlockchainRecord.find({ batchId }).sort({ createdAt: 1 });
    res.json({ success: true, count: records.length, records });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
