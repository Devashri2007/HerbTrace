const mongoose = require("mongoose");

const evidenceSchema = new mongoose.Schema(
  {
    evidenceId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    batchId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Collection Evidence",
    },
    category: {
      type: String,
      enum: ["Botanical Photo", "Geo Location Stamp", "Lab Certificate", "Harvest Manifest", "Processing Log"],
      default: "Botanical Photo",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: "image/jpeg",
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileHash: {
      type: String,
      required: true, // SHA-256 Hash
    },
    capturedAt: {
      type: Date,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    locked: {
      type: Boolean,
      default: true,
    },
    lockedAt: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Evidence", evidenceSchema);
