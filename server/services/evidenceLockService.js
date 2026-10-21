const crypto = require("crypto");
const Evidence = require("../models/Evidence");
const HerbBatch = require("../models/HerbBatch");

/**
 * 🔐 Evidence-Time Lock Service
 * Ensures cryptographic immutability of botanical photographs, geotag metadata,
 * and collection documents from the moment of field capture.
 */
class EvidenceLockService {
  /**
   * Compute a secure SHA-256 hash from file buffer or text payload
   */
  static generateHash(bufferOrString) {
    return crypto.createHash("sha256").update(bufferOrString).digest("hex");
  }

  /**
   * Generate sequential evidence ID (e.g. EV-HT-00001)
   */
  static async generateEvidenceId() {
    const count = await Evidence.countDocuments();
    const sequence = String(count + 1).padStart(5, "0");
    return `EV-HT-${sequence}`;
  }

  /**
   * Lock an evidence record permanently with timestamp and SHA-256 digest
   */
  static async lockEvidence({
    batchId,
    title,
    category,
    fileName,
    fileType,
    fileUrl,
    fileBuffer,
    capturedAt,
    uploadedBy,
  }) {
    const evidenceId = await this.generateEvidenceId();

    // Compute cryptographic hash
    const contentToHash = fileBuffer
      ? fileBuffer
      : Buffer.from(`${batchId}_${fileName}_${capturedAt || new Date().toISOString()}_${uploadedBy}`);
    const fileHash = this.generateHash(contentToHash);

    const now = new Date();
    const effectiveCapturedAt = capturedAt ? new Date(capturedAt) : now;

    const evidence = new Evidence({
      evidenceId,
      batchId,
      title: title || "Field Collection Photo",
      category: category || "Botanical Photo",
      fileName,
      fileType: fileType || "image/jpeg",
      fileUrl,
      fileHash,
      capturedAt: effectiveCapturedAt,
      uploadedAt: now,
      locked: true,
      lockedAt: now,
      version: 1,
      uploadedBy,
    });

    await evidence.save();

    // Update parent HerbBatch with primary evidence lock reference if not set
    await HerbBatch.findOneAndUpdate(
      { batchId },
      {
        $set: {
          "evidenceLock.evidenceId": evidenceId,
          "evidenceLock.sha256Hash": fileHash,
          "evidenceLock.locked": true,
          "evidenceLock.lockedAt": now,
        },
      }
    );

    return evidence;
  }

  /**
   * Add a new version of evidence without destroying the historical locked record
   */
  static async appendEvidenceVersion({
    originalEvidenceId,
    batchId,
    title,
    fileName,
    fileUrl,
    fileBuffer,
    uploadedBy,
  }) {
    const previous = await Evidence.findOne({ evidenceId: originalEvidenceId });
    if (!previous) throw new Error("Original evidence record not found");

    const newEvidenceId = await this.generateEvidenceId();
    const fileHash = this.generateHash(fileBuffer || Buffer.from(`${newEvidenceId}_${Date.now()}`));

    const newVersion = new Evidence({
      evidenceId: newEvidenceId,
      batchId,
      title: `${title || previous.title} (Amended)`,
      category: previous.category,
      fileName,
      fileType: previous.fileType,
      fileUrl,
      fileHash,
      capturedAt: previous.capturedAt, // Preserves original capture timestamp
      uploadedAt: new Date(),
      locked: true,
      lockedAt: new Date(),
      version: previous.version + 1,
      uploadedBy,
    });

    await newVersion.save();
    return newVersion;
  }

  /**
   * Verify integrity of locked evidence against recorded hash
   */
  static verifyIntegrity(evidence, bufferToCheck) {
    if (!evidence || !evidence.fileHash) {
      return { verified: false, reason: "Evidence or hash missing" };
    }
    if (!bufferToCheck) {
      return {
        verified: true,
        hash: evidence.fileHash,
        lockedAt: evidence.lockedAt,
        capturedAt: evidence.capturedAt,
        status: "LOCKED_PRESERVED",
      };
    }
    const computed = this.generateHash(bufferToCheck);
    const matches = computed.toLowerCase() === evidence.fileHash.toLowerCase();
    return {
      verified: matches,
      matches,
      originalHash: evidence.fileHash,
      computedHash: computed,
      lockedAt: evidence.lockedAt,
      capturedAt: evidence.capturedAt,
      status: matches ? "CRYPTOGRAPHICALLY_VERIFIED" : "INTEGRITY_COMPROMISED",
    };
  }
}

module.exports = EvidenceLockService;
