const QualityInspection = require("../models/QualityInspection");
const HerbBatch = require("../models/HerbBatch");
const BlockchainService = require("../services/blockchainService");
const AuditService = require("../services/auditService");

/**
 * Get pending batches awaiting quality inspection
 */
const getPendingBatches = async (req, res, next) => {
  try {
    const batches = await HerbBatch.find({
      status: { $in: ["SUBMITTED", "QUALITY_PENDING"] },
    })
      .populate("collectorId", "name email phone district state collectorType")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: batches.length,
      batches,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Quality Inspector Approves a batch
 */
const approveBatch = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const {
      remarks = "Batch passed all Ayurvedic Pharmacopoeia identity, purity, and assay standards.",
      parameters = {},
    } = req.body;

    const batch = await HerbBatch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ success: false, message: `Batch ${batchId} not found` });
    }

    if (batch.status === "REJECTED") {
      return res.status(400).json({ success: false, message: "Cannot approve a rejected batch without re-testing authorization" });
    }

    const inspectionId = `INSP-APP-${Date.now().toString().slice(-6)}`;

    // 1. Record on Blockchain
    const blockchainRes = await BlockchainService.approveBatch({
      batchId,
      inspectorId: req.user._id,
      remarks,
      qualityParameters: parameters,
    });

    // 2. Create QualityInspection Document
    const inspection = await QualityInspection.create({
      inspectionId,
      batchId,
      inspectorId: req.user._id,
      status: "QUALITY APPROVED",
      parameters: {
        moistureContentPercent: parameters.moistureContentPercent || 8.2,
        foreignMatterPercent: parameters.foreignMatterPercent || 0.6,
        totalAshPercent: parameters.totalAshPercent || 4.9,
        acidInsolubleAshPercent: parameters.acidInsolubleAshPercent || 0.4,
        activePhytochemicalAssay: parameters.activePhytochemicalAssay || "Meets Pharmacopoeial standard",
        pesticideResidueCompliant: parameters.pesticideResidueCompliant !== undefined ? parameters.pesticideResidueCompliant : true,
        microbialContaminationCompliant: parameters.microbialContaminationCompliant !== undefined ? parameters.microbialContaminationCompliant : true,
        heavyMetalsCompliant: parameters.heavyMetalsCompliant !== undefined ? parameters.heavyMetalsCompliant : true,
      },
      remarks,
      inspectionDate: new Date(),
      blockchainTxHash: blockchainRes.txHash,
      parametersHash: blockchainRes.record.dataPayload.qualityHash,
    });

    // 3. Update Batch Status
    batch.status = "APPROVED";
    batch.blockchainRecord.transactionHash = blockchainRes.txHash;
    await batch.save();

    // 4. Audit Log
    await AuditService.log({
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: "QUALITY_APPROVED",
      entityType: "HerbBatch",
      entityId: batchId,
      description: `Quality Inspector approved batch ${batchId}. On-chain Tx: ${blockchainRes.txHash.slice(0, 10)}...`,
    });

    res.json({
      success: true,
      message: `Batch ${batchId} has been successfully Quality Approved and verified on the blockchain!`,
      inspection,
      batch,
      blockchain: blockchainRes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Quality Inspector Rejects a batch
 */
const rejectBatch = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const { rejectionReason, remarks, parameters = {} } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ success: false, message: "Rejection reason is strictly required" });
    }

    const batch = await HerbBatch.findOne({ batchId });
    if (!batch) {
      return res.status(404).json({ success: false, message: `Batch ${batchId} not found` });
    }

    const inspectionId = `INSP-REJ-${Date.now().toString().slice(-6)}`;

    // 1. Record on Blockchain
    const blockchainRes = await BlockchainService.rejectBatch({
      batchId,
      rejectionReason,
    });

    // 2. Create QualityInspection Document
    const inspection = await QualityInspection.create({
      inspectionId,
      batchId,
      inspectorId: req.user._id,
      status: "QUALITY REJECTED",
      parameters: {
        moistureContentPercent: parameters.moistureContentPercent || 15.2,
        foreignMatterPercent: parameters.foreignMatterPercent || 4.5,
        totalAshPercent: parameters.totalAshPercent || 9.8,
        acidInsolubleAshPercent: parameters.acidInsolubleAshPercent || 2.1,
        activePhytochemicalAssay: parameters.activePhytochemicalAssay || "Failed assay threshold",
        pesticideResidueCompliant: false,
        microbialContaminationCompliant: true,
        heavyMetalsCompliant: true,
      },
      rejectionReason,
      remarks: remarks || rejectionReason,
      inspectionDate: new Date(),
      blockchainTxHash: blockchainRes.txHash,
    });

    // 3. Update Batch Status
    batch.status = "REJECTED";
    await batch.save();

    // 4. Audit Log
    await AuditService.log({
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: "QUALITY_REJECTED",
      entityType: "HerbBatch",
      entityId: batchId,
      description: `Quality Inspector rejected batch ${batchId}. Reason: ${rejectionReason}`,
      status: "WARNING",
    });

    res.json({
      success: true,
      message: `Batch ${batchId} marked as QUALITY REJECTED. It cannot proceed to processing or formulation.`,
      inspection,
      batch,
      blockchain: blockchainRes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Quality Inspection History
 */
const getInspectionHistory = async (req, res, next) => {
  try {
    const inspections = await QualityInspection.find()
      .populate("inspectorId", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inspections.length,
      inspections,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPendingBatches,
  approveBatch,
  rejectBatch,
  getInspectionHistory,
};
