const express = require("express");
const router = express.Router();
const {
  addProcessingEvent,
  getProcessingHistory,
  getBatchesForProcessing,
} = require("../controllers/processingController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/ready", authorize("processor", "admin"), getBatchesForProcessing);
router.post("/", authorize("processor", "admin"), addProcessingEvent);
router.get("/:batchId", getProcessingHistory);

module.exports = router;
