const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    actorName: {
      type: String,
      default: "System",
    },
    actorRole: {
      type: String,
      default: "system",
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED", "WARNING"],
      default: "SUCCESS",
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    },
    metadata: {
      type: Object,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
