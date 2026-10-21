const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  updateUserStatus,
  getAuditLogs,
  getBlockchainRecords,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getAdminStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.get("/audit-logs", getAuditLogs);
router.get("/blockchain-records", getBlockchainRecords);

module.exports = router;
