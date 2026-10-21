const mongoose = require("mongoose");

const formulationSchema = new mongoose.Schema(
  {
    formulationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    productId: {
      type: String,
      required: true,
      unique: true,
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
      enum: [
        "Churna (Fine Herbal Powder)",
        "Vati / Gutika (Ayurvedic Tablet)",
        "Capsules (Standardized Extract)",
        "Kwath / Kashayam (Decoction)",
        "Asava / Arishta (Fermented Liquid)",
        "Taila (Medicated Herbal Oil)",
        "Avaleha (Herbal Paste/Jam)",
        "Syrup (Liquid Formulation)",
      ],
      default: "Capsules (Standardized Extract)",
    },
    manufacturerName: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    // Multi-batch ingredient relations for the genealogy graph
    ingredients: [
      {
        herbName: { type: String, required: true },
        batchId: { type: String, required: true },
        percentage: { type: Number, default: 100 },
        partUsed: { type: String, default: "Root" },
      },
    ],
    batchIds: [{ type: String, required: true }],
    totalQuantity: {
      type: Number,
      required: true,
    },
    quantityUnit: {
      type: String,
      default: "units / bottles",
    },
    manufacturingDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    manufacturingLocation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    dosageInstructions: {
      type: String,
      default: "1-2 capsules twice daily with lukewarm milk or water, or as directed by an Ayurvedic physician.",
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
    metadataHash: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Formulation", formulationSchema);
