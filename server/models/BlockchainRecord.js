const mongoose = require("mongoose");

const blockchainRecordSchema = new mongoose.Schema(
  {
    recordType: {
      type: String,
      enum: ["BATCH_REGISTRATION", "QUALITY_VERIFICATION", "PROCESSING_STAGE", "EVIDENCE_LOCK", "FORMULATION_CREATION"],
      required: true,
    },
    batchId: {
      type: String,
      index: true,
    },
    productId: {
      type: String,
      index: true,
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    contractAddress: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    network: {
      type: String,
      default: "Hardhat Localhost (Chain ID 31337)",
    },
    fromAddress: {
      type: String,
      required: true,
    },
    gasUsed: {
      type: String,
      default: "65,420",
    },
    dataPayload: {
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

module.exports = mongoose.model("BlockchainRecord", blockchainRecordSchema);
