const Evidence = require("../models/Evidence");
const EvidenceLockService = require("../services/evidenceLockService");
const BlockchainService = require("../services/blockchainService");
const AuditService = require("../services/auditService");
const fs = require("fs");

/**
 * Upload and Lock new evidence for a batch
 */
const uploadAndLockEvidence = async (req, res, next) => {
  try {
    const { batchId, title, category, capturedAt, fileUrl: providedUrl } = req.body;

    if (!batchId) {
      return res.status(400).json({ success: false, message: "batchId is required" });
    }

    let fileUrl = providedUrl;
    let fileName = "evidence-doc";
    let fileType = "image/jpeg";
    let fileBuffer = null;

    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
      fileBuffer = fs.readFileSync(req.file.path);
    } else if (!providedUrl) {
      return res.status(400).json({ success: false, message: "Either a file or fileUrl must be provided" });
    }

    // 1. Lock Evidence with timestamp + SHA-256
    const evidence = await EvidenceLockService.lockEvidence({
      batchId,
      title: title || "Field Collection Record",
      category: category || "Botanical Photo",
      fileName,
      fileType,
      fileUrl,
      fileBuffer,
      capturedAt: capturedAt ? new Date(capturedAt) : new Date(),
      uploadedBy: req.user._id,
    });

    // 2. Lock on Blockchain
    const blockchainRes = await BlockchainService.recordProcessing({
      batchId,
      stage: "Storage",
      method: "Evidence Locking Event",
      quantityAfter: 0,
      evidenceHash: evidence.fileHash,
    });

    evidence.blockchainTxHash = blockchainRes.txHash;
    await evidence.save();

    // 3. Audit Log
    await AuditService.log({
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: "EVIDENCE_TIME_LOCKED",
      entityType: "Evidence",
      entityId: evidence.evidenceId,
      description: `Evidence ${evidence.evidenceId} time-locked for batch ${batchId}. SHA-256: ${evidence.fileHash}`,
    });

    res.status(201).json({
      success: true,
      message: `Evidence ${evidence.evidenceId} successfully locked with SHA-256 hash and immutable timestamp.`,
      evidence,
      blockchain: blockchainRes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all locked evidence records for a batch
 */
const getEvidenceByBatch = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const evidenceList = await Evidence.find({ batchId })
      .populate("uploadedBy", "name role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: evidenceList.length,
      evidence: evidenceList,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Lock existing evidence manually (e.g. seals and prevents alterations)
 */
const lockEvidenceRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evidence = await Evidence.findOne({ $or: [{ evidenceId: id }, { _id: id }] });

    if (!evidence) {
      return res.status(404).json({ success: false, message: "Evidence record not found" });
    }

    evidence.locked = true;
    evidence.lockedAt = new Date();
    await evidence.save();

    res.json({
      success: true,
      message: `Evidence ${evidence.evidenceId} is locked.`,
      evidence,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify evidence cryptographic hash
 */
const verifyEvidenceIntegrity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const evidence = await Evidence.findOne({ $or: [{ evidenceId: id }, { _id: id }] });

    if (!evidence) {
      return res.status(404).json({ success: false, message: "Evidence record not found" });
    }

    const verification = EvidenceLockService.verifyIntegrity(evidence);

    res.json({
      success: true,
      verification,
      evidence,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  uploadAndLockEvidence,
  getEvidenceByBatch,
  lockEvidenceRecord,
  verifyEvidenceIntegrity,
};
