const mongoose = require("mongoose");

const processingEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    batchId: {
      type: String,
      required: true,
      index: true,
    },
    stage: {
      type: String,
      enum: [
        "Cleaning",
        "Sorting",
        "Drying",
        "Grinding",
        "Extraction",
        "Storage",
        "Packaging preparation",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: "Traditional Ayush SOP compliant",
    },
    quantityBefore: {
      type: Number,
      required: true,
    },
    quantityAfter: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: "kg",
    },
    location: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    evidenceUrl: {
      type: String,
      default: "",
    },
    evidenceHash: {
      type: String,
      default: "",
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
    previousEventHash: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProcessingEvent", processingEventSchema);
