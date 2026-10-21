const User = require("../models/User");
const HerbBatch = require("../models/HerbBatch");
const Formulation = require("../models/Formulation");
const Product = require("../models/Product");
const BlockchainRecord = require("../models/BlockchainRecord");
const AuditLog = require("../models/AuditLog");
const QualityInspection = require("../models/QualityInspection");
const AuditService = require("../services/auditService");

/**
 * Get comprehensive Admin Dashboard Statistics
 */
const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      pendingUsers,
      farmers,
      inspectors,
      processors,
      manufacturers,
      totalBatches,
      approvedBatches,
      rejectedBatches,
      processingBatches,
      totalFormulations,
      totalProducts,
      blockchainRecordsCount,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ role: { $in: ["farmer", "collector"] } }),
      User.countDocuments({ role: "inspector" }),
      User.countDocuments({ role: "processor" }),
      User.countDocuments({ role: "manufacturer" }),
      HerbBatch.countDocuments(),
      HerbBatch.countDocuments({ status: { $in: ["APPROVED", "PROCESSING", "FORMULATION_USED", "TRACEABLE"] } }),
      HerbBatch.countDocuments({ status: "REJECTED" }),
      HerbBatch.countDocuments({ status: "PROCESSING" }),
      Formulation.countDocuments(),
      Product.countDocuments(),
      BlockchainRecord.countDocuments(),
    ]);

    // Status breakdown
    const batchStatusCounts = await HerbBatch.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Recent activities from audit logs
    const recentActivities = await AuditLog.find().sort({ timestamp: -1 }).limit(10);

    // Recent blockchain records
    const recentBlockchainRecords = await BlockchainRecord.find().sort({ createdAt: -1 }).limit(8);

    res.json({
      success: true,
      stats: {
        totalUsers,
        pendingApprovals: pendingUsers,
        farmers,
        inspectors,
        processors,
        manufacturers,
        totalBatches,
        approvedBatches,
        rejectedBatches,
        processingBatches,
        totalFormulations,
        totalProducts,
        blockchainRecordsCount,
      },
      batchStatusCounts,
      recentActivities,
      recentBlockchainRecords,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get users with filtering
 */
const getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { district: new RegExp(search, "i") },
      ];
    }

    const users = await User.find(filter).select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update user status (approve / reject / suspend)
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "suspended", "pending"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await AuditService.log({
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: `USER_STATUS_${status.toUpperCase()}`,
      entityType: "User",
      entityId: user._id.toString(),
      description: `Admin changed status of ${user.email} (${user.role}) to '${status}'`,
    });

    res.json({
      success: true,
      message: `User ${user.name} has been ${status}.`,
      user,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Audit Logs
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const { action, limit = 50 } = req.query;
    const filter = {};
    if (action) filter.action = action;

    const logs = await AuditLog.find(filter).sort({ timestamp: -1 }).limit(Number(limit));

    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all Blockchain Records
 */
const getBlockchainRecords = async (req, res, next) => {
  try {
    const records = await BlockchainRecord.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: records.length,
      records,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminStats,
  getUsers,
  updateUserStatus,
  getAuditLogs,
  getBlockchainRecords,
};
