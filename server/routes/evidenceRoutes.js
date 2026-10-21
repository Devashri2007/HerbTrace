const express = require("express");
const router = express.Router();
const {
  uploadAndLockEvidence,
  getEvidenceByBatch,
  lockEvidenceRecord,
  verifyEvidenceIntegrity,
} = require("../controllers/evidenceController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("file"), uploadAndLockEvidence);
router.get("/:batchId", getEvidenceByBatch);
router.post("/:id/lock", protect, lockEvidenceRecord);
router.get("/:id/verify", verifyEvidenceIntegrity);

module.exports = router;
