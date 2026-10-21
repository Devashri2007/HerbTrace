const mongoose = require("mongoose");

const qualityInspectionSchema = new mongoose.Schema(
  {
    inspectionId: {
      type: String,
      required: true,
      unique: true,
    },
    batchId: {
      type: String,
      required: true,
      index: true,
    },
    inspectorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["QUALITY APPROVED", "QUALITY REJECTED"],
      required: true,
    },
    parameters: {
      moistureContentPercent: { type: Number, default: 8.5 }, // Pharmacopoeia limit < 12%
      foreignMatterPercent: { type: Number, default: 0.8 },   // Pharmacopoeia limit < 2.0%
      totalAshPercent: { type: Number, default: 5.2 },        // Pharmacopoeia limit < 8%
      acidInsolubleAshPercent: { type: Number, default: 0.6 },// Limit < 1%
      activePhytochemicalAssay: { type: String, default: "Withanolides: 1.8% w/w (HPLC)" },
      pesticideResidueCompliant: { type: Boolean, default: true },
      microbialContaminationCompliant: { type: Boolean, default: true },
      heavyMetalsCompliant: { type: Boolean, default: true },
    },
    remarks: {
      type: String,
      default: "",
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    inspectionDate: {
      type: Date,
      default: Date.now,
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
    parametersHash: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QualityInspection", qualityInspectionSchema);
