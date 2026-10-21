const AuditLog = require("../models/AuditLog");

class AuditService {
  static async log({
    actorId = null,
    actorName = "System",
    actorRole = "system",
    action,
    entityType,
    entityId,
    description = "",
    status = "SUCCESS",
    metadata = {},
    ipAddress = "127.0.0.1",
  }) {
    try {
      return await AuditLog.create({
        actorId,
        actorName,
        actorRole,
        action,
        entityType,
        entityId,
        description,
        status,
        metadata,
        ipAddress,
        timestamp: new Date(),
      });
    } catch (err) {
      console.error("[AuditService] Failed to record log:", err.message);
    }
  }
}

module.exports = AuditService;
