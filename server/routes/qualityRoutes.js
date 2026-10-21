const express = require("express");
const router = express.Router();
const {
  getPendingBatches,
  approveBatch,
  rejectBatch,
  getInspectionHistory,
} = require("../controllers/qualityController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.get("/pending", authorize("inspector", "admin"), getPendingBatches);
router.get("/history", getInspectionHistory);
router.post("/:batchId/approve", authorize("inspector", "admin"), approveBatch);
router.post("/:batchId/reject", authorize("inspector", "admin"), rejectBatch);

module.exports = router;
