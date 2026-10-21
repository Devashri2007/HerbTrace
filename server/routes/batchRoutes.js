const express = require("express");
const router = express.Router();
const {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
} = require("../controllers/batchController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.post("/", authorize("farmer", "collector", "admin"), createBatch);
router.get("/", getBatches);
router.get("/:batchId", getBatchById);
router.put("/:batchId", authorize("admin"), updateBatch);

module.exports = router;
