const ProcessingEvent = require("../models/ProcessingEvent");
const HerbBatch = require("../models/HerbBatch");
const BlockchainService = require("../services/blockchainService");
const AuditService = require("../services/auditService");
const crypto = require("crypto");

/**
 * Add processing stage event
 */
const addProcessingEvent = async (req, res, next) => {
  try {
    const {
      batchId,
      stage,
      description,
      method,
      quantityBefore,
      quantityAfter,
      unit = "kg",
      location,
      evidenceUrl,
    } = req.body;

    if (!batchId || !stage || !description || quantityAfter === undefined || !location) {
      return res.status(400).json({
        success: false,
        message: "Batch ID, stage, description, quantity after, and processing facility location are required",
      });
    }

    const batch = await HerbBatch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ success: false, message: `Batch ${batchId} not found` });
    }

    if (batch.status !== "APPROVED" && batch.status !== "PROCESSING") {
      return res.status(400).json({
        success: false,
        message: `Batch ${batchId} is in status '${batch.status}'. Only APPROVED or PROCESSING batches can undergo processing.`,
      });
    }

    // Find previous processing event for chaining hashes
    const lastEvent = await ProcessingEvent.findOne({ batchId }).sort({ createdAt: -1 });
    const previousEventHash = lastEvent
      ? lastEvent.blockchainTxHash || lastEvent.eventId
      : batch.blockchainRecord.transactionHash || "GENESIS";

    const eventId = `PROC-${stage.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const evidenceHash = evidenceUrl
      ? crypto.createHash("sha256").update(evidenceUrl).digest("hex")
      : "";

    // 1. Record on Blockchain
    const blockchainRes = await BlockchainService.recordProcessing({
      batchId,
      stage,
      method: method || "Ayush Standard Operational Procedure",
      quantityAfter: Number(quantityAfter),
      evidenceHash,
    });

    // 2. Save Processing Event
    const processingEvent = await ProcessingEvent.create({
      eventId,
      batchId,
      stage,
      description,
      method: method || "Ayush Standard Operational Procedure",
      quantityBefore: Number(quantityBefore || batch.quantity),
      quantityAfter: Number(quantityAfter),
      unit,
      location,
      performedBy: req.user._id,
      timestamp: new Date(),
      evidenceUrl: evidenceUrl || "",
      evidenceHash,
      blockchainTxHash: blockchainRes.txHash,
      previousEventHash,
    });

    // 3. Update Batch
    batch.status = "PROCESSING";
    batch.quantity = Number(quantityAfter); // Update current net weight
    await batch.save();

    // 4. Audit Log
    await AuditService.log({
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: "PROCESSING_STAGE_ADDED",
      entityType: "ProcessingEvent",
      entityId: eventId,
      description: `Stage '${stage}' completed for batch ${batchId}. Net qty: ${quantityAfter} ${unit}. Tx: ${blockchainRes.txHash.slice(0, 10)}...`,
    });

    res.status(201).json({
      success: true,
      message: `Processing stage '${stage}' recorded and sealed on blockchain.`,
      event: processingEvent,
      batch,
      blockchain: blockchainRes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get processing timeline for a specific batch
 */
const getProcessingHistory = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const history = await ProcessingEvent.find({ batchId })
      .populate("performedBy", "name email role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all batches available for processing
 */
const getBatchesForProcessing = async (req, res, next) => {
  try {
    const batches = await HerbBatch.find({
      status: { $in: ["APPROVED", "PROCESSING"] },
    })
      .populate("collectorId", "name district state")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: batches.length,
      batches,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addProcessingEvent,
  getProcessingHistory,
  getBatchesForProcessing,
};
