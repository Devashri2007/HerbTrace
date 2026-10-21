const HerbBatch = require("../models/HerbBatch");
const BotanicalValidatorService = require("../services/botanicalValidatorService");
const BlockchainService = require("../services/blockchainService");
const EvidenceLockService = require("../services/evidenceLockService");
const AuditService = require("../services/auditService");

/**
 * Generate sequential Batch ID (e.g. HT-2026-000001)
 */
const generateBatchId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await HerbBatch.countDocuments();
  const sequence = String(count + 1).padStart(6, "0");
  return `HT-${currentYear}-${sequence}`;
};

/**
 * Create a new herb batch
 */
const createBatch = async (req, res, next) => {
  try {
    const {
      botanicalName,
      commonName,
      plantFamily,
      plantPart,
      variety,
      collectionMethod,
      description,
      quantity,
      unit = "kg",
      collectionDate,
      collectionTime,
      collectionLocation,
      initialEvidenceUrl,
      initialEvidenceTitle,
    } = req.body;

    // Validate required fields
    if (!botanicalName || !commonName || !plantPart || !quantity || !collectionLocation) {
      return res.status(400).json({
        success: false,
        message: "Botanical name, common name, plant part, quantity, and collection location are required",
      });
    }

    const batchId = await generateBatchId();

    // 1. 🌱 Run Botanical Consistency Validator Engine
    const validationResult = BotanicalValidatorService.validate({
      botanicalName,
      commonName,
      plantFamily,
      plantPart,
      variety,
    });

    // 2. 🔐 Process Evidence Time-Lock if image or evidence URL was provided
    let evidenceRecord = null;
    let evidenceHash = "";
    if (initialEvidenceUrl) {
      evidenceRecord = await EvidenceLockService.lockEvidence({
        batchId,
        title: initialEvidenceTitle || `${commonName} Field Harvest Photo`,
        category: "Botanical Photo",
        fileName: `${batchId}_field_photo.jpg`,
        fileUrl: initialEvidenceUrl,
        capturedAt: collectionDate || new Date(),
        uploadedBy: req.user._id,
      });
      evidenceHash = evidenceRecord.fileHash;
    }

    // 3. ⛓ Register Batch on Blockchain
    const blockchainRes = await BlockchainService.registerBatch({
      batchId,
      botanicalName,
      plantPart,
      location: collectionLocation,
      collectionDate: collectionDate || new Date(),
      evidenceHash,
    });

    // 4. Save Herb Batch to Database
    const newBatch = await HerbBatch.create({
      batchId,
      collectorId: req.user._id,
      botanicalName,
      commonName,
      plantFamily,
      plantPart,
      variety: variety || "Native Wild Standard",
      collectionMethod: collectionMethod || "Wild Hand-Picked",
      description,
      quantity: Number(quantity),
      unit,
      collectionDate: collectionDate ? new Date(collectionDate) : new Date(),
      collectionTime: collectionTime || "08:30 AM",
      collectionLocation: {
        latitude: Number(collectionLocation.latitude),
        longitude: Number(collectionLocation.longitude),
        accuracy: Number(collectionLocation.accuracy || 5),
        locationName: collectionLocation.locationName,
        state: collectionLocation.state || req.user.state || "",
        district: collectionLocation.district || req.user.district || "",
      },
      status: "SUBMITTED",
      consistencyValidation: {
        validatorStatus: validationResult.validatorStatus,
        validationMessage: validationResult.validationMessage,
        confidenceScore: validationResult.confidenceScore,
        flags: validationResult.flags,
        validatedAt: validationResult.validatedAt,
        validatedBy: validationResult.validatedBy,
        validationRulesVersion: validationResult.validationRulesVersion,
      },
      evidenceLock: evidenceRecord
        ? {
            evidenceId: evidenceRecord.evidenceId,
            sha256Hash: evidenceRecord.fileHash,
            locked: true,
            lockedAt: evidenceRecord.lockedAt,
          }
        : undefined,
      blockchainRecord: {
        transactionHash: blockchainRes.txHash,
        contractAddress: blockchainRes.record.contractAddress,
        blockNumber: blockchainRes.blockNumber,
        isVerified: true,
        verifiedAt: new Date(),
        network: blockchainRes.record.network,
      },
    });

    // 5. Audit Log
    await AuditService.log({
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: "BATCH_REGISTERED",
      entityType: "HerbBatch",
      entityId: batchId,
      description: `Registered batch ${batchId} for ${commonName} (${botanicalName}), status: SUBMITTED, Blockchain Tx: ${blockchainRes.txHash.slice(0, 10)}...`,
    });

    res.status(201).json({
      success: true,
      message: "Herb batch created and registered on blockchain successfully!",
      batch: newBatch,
      validation: validationResult,
      blockchain: blockchainRes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all batches (with role-based access filtering)
 */
const getBatches = async (req, res, next) => {
  try {
    const { status, botanicalName } = req.query;
    const filter = {};

    // Farmers only see their own batches unless admin/inspector
    if (req.user.role === "farmer" || req.user.role === "collector") {
      filter.collectorId = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    if (botanicalName) {
      filter.botanicalName = new RegExp(botanicalName, "i");
    }

    const batches = await HerbBatch.find(filter)
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
 * Get single batch by batchId
 */
const getBatchById = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batch = await HerbBatch.findOne({ batchId }).populate(
      "collectorId",
      "name email phone district state collectorType organization"
    );

    if (!batch) {
      return res.status(404).json({ success: false, message: `Batch ${batchId} not found` });
    }

    res.json({
      success: true,
      batch,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Update batch details
 */
const updateBatch = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const updateData = req.body;

    // Prevent changing batchId or tampering with locked records
    delete updateData.batchId;
    delete updateData.blockchainRecord;

    const updated = await HerbBatch.findOneAndUpdate({ batchId }, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({ success: true, batch: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
};
