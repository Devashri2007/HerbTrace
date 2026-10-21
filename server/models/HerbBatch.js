const mongoose = require("mongoose");

const herbBatchSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    collectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    botanicalName: {
      type: String,
      required: true,
      trim: true,
    },
    commonName: {
      type: String,
      required: true,
      trim: true,
    },
    plantFamily: {
      type: String,
      required: true,
      trim: true,
    },
    plantPart: {
      type: String,
      required: true,
      trim: true,
    },
    variety: {
      type: String,
      default: "Native wild / Cultivated standard",
      trim: true,
    },
    collectionMethod: {
      type: String,
      enum: ["Wild Hand-Picked", "Certified Organic Harvest", "Regulated Forestry Collection", "Cooperative Farm Harvest"],
      default: "Wild Hand-Picked",
    },
    description: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["kg", "g", "quintal", "ton"],
      default: "kg",
    },
    collectionDate: {
      type: Date,
      required: true,
    },
    collectionTime: {
      type: String,
      default: "08:30 AM",
    },
    collectionLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      accuracy: { type: Number, default: 5 },
      locationName: { type: String, required: true },
      state: { type: String, default: "" },
      district: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: [
        "REGISTERED",
        "SUBMITTED",
        "QUALITY_PENDING",
        "APPROVED",
        "PROCESSING",
        "FORMULATION_USED",
        "TRACEABLE",
        "REJECTED",
      ],
      default: "REGISTERED",
      index: true,
    },
    // 🌱 Botanical Consistency Validator snapshot
    consistencyValidation: {
      validatorStatus: {
        type: String,
        enum: ["Consistent", "Warning", "Requires Verification"],
        default: "Consistent",
      },
      validationMessage: { type: String, default: "" },
      confidenceScore: { type: Number, default: 95 },
      flags: [{ type: String }],
      validatedAt: { type: Date, default: Date.now },
      validatedBy: { type: String, default: "HerbTrace Botanical AI Rules Engine" },
      validationRulesVersion: { type: String, default: "v2.4-AYUSH-AYUR" },
    },
    // 🔐 Primary Evidence Lock reference
    evidenceLock: {
      evidenceId: { type: String, default: "" },
      sha256Hash: { type: String, default: "" },
      locked: { type: Boolean, default: false },
      lockedAt: { type: Date },
    },
    // On-Chain Anchor
    blockchainRecord: {
      transactionHash: { type: String, default: "" },
      contractAddress: { type: String, default: "" },
      blockNumber: { type: Number, default: 0 },
      isVerified: { type: Boolean, default: false },
      verifiedAt: { type: Date },
      network: { type: String, default: "Hardhat Localhost (Chain ID 31337)" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HerbBatch", herbBatchSchema);
