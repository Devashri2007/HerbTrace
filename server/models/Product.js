const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    formulationId: {
      type: String,
      required: true,
      index: true,
    },
    manufacturerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productType: {
      type: String,
      required: true,
    },
    qrCodeDataUrl: {
      type: String,
      default: "",
    },
    publicTraceUrl: {
      type: String,
      required: true,
    },
    batchIds: [{ type: String }],
    status: {
      type: String,
      enum: ["ACTIVE", "PUBLISHED", "RECALLED"],
      default: "PUBLISHED",
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
    packagingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
