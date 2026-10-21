const Formulation = require("../models/Formulation");
const Product = require("../models/Product");
const HerbBatch = require("../models/HerbBatch");
const BlockchainService = require("../services/blockchainService");
const AuditService = require("../services/auditService");
const crypto = require("crypto");

/**
 * Create Ayurvedic formulation and bind herb batches
 */
const createFormulation = async (req, res, next) => {
  try {
    const {
      productName,
      productType,
      manufacturerName,
      licenseNumber,
      ingredients, // Array: [{ herbName, batchId, percentage, partUsed }]
      batchIds,
      totalQuantity,
      quantityUnit = "bottles (60 capsules)",
      manufacturingDate,
      expiryDate,
      manufacturingLocation,
      description,
      dosageInstructions,
    } = req.body;

    if (!productName || !ingredients || ingredients.length === 0 || !licenseNumber) {
      return res.status(400).json({
        success: false,
        message: "Product name, manufacturing license, and at least one ingredient batch are required",
      });
    }

    const allBatchIds = batchIds || ingredients.map((i) => i.batchId);

    // Verify all ingredient batches exist
    const batches = await HerbBatch.find({ batchId: { $in: allBatchIds } });
    if (batches.length !== allBatchIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more ingredient batch IDs do not exist in the platform",
      });
    }

    const formCount = await Formulation.countDocuments();
    const formulationId = `FORM-${String(formCount + 1).padStart(4, "0")}`;
    const productId = `PROD-${Date.now().toString().slice(-6)}`;

    // Create metadata hash for blockchain
    const metadataRaw = JSON.stringify({
      productName,
      productType,
      ingredients,
      licenseNumber,
      mfgDate: manufacturingDate,
    });
    const metadataHash = "0x" + crypto.createHash("sha256").update(metadataRaw).digest("hex");

    // 1. Record on Blockchain
    const blockchainRes = await BlockchainService.createFormulation({
      productId,
      formulationId,
      batchIds: allBatchIds,
      metadataHash,
    });

    // 2. Save Formulation
    const formulation = await Formulation.create({
      formulationId,
      productId,
      manufacturerId: req.user._id,
      productName,
      productType: productType || "Capsules (Standardized Extract)",
      manufacturerName: manufacturerName || req.user.organization || req.user.name,
      licenseNumber,
      ingredients,
      batchIds: allBatchIds,
      totalQuantity: Number(totalQuantity || 500),
      quantityUnit,
      manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000), // 2 yrs
      manufacturingLocation: manufacturingLocation || "AYUSH Certified GMP Facility, Haridwar",
      description: description || `Standardized Ayurvedic formulation prepared under classical Ayurvedic text references with full botanical batch tracing.`,
      dosageInstructions: dosageInstructions || "1-2 capsules twice daily with lukewarm water.",
      blockchainTxHash: blockchainRes.txHash,
      metadataHash,
    });

    // 3. Mark ingredient batches as FORMULATION_USED and TRACEABLE
    await HerbBatch.updateMany(
      { batchId: { $in: allBatchIds } },
      { $set: { status: "FORMULATION_USED" } }
    );

    // 4. Create Product with public trace URL
    const publicTraceUrl = `/trace/${productId}`;
    const product = await Product.create({
      productId,
      formulationId,
      manufacturerId: req.user._id,
      productName,
      productType: formulation.productType,
      publicTraceUrl,
      batchIds: allBatchIds,
      status: "PUBLISHED",
      blockchainTxHash: blockchainRes.txHash,
      packagingDate: new Date(),
    });

    // 5. Audit Log
    await AuditService.log({
      actorId: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.role,
      action: "FORMULATION_CREATED",
      entityType: "Formulation",
      entityId: formulationId,
      description: `Formulation ${formulationId} created for product ${productName} (${productId}), bound batches: [${allBatchIds.join(", ")}]`,
    });

    res.status(201).json({
      success: true,
      message: "Ayurvedic formulation created and published successfully!",
      formulation,
      product,
      blockchain: blockchainRes,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all formulations
 */
const getFormulations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "manufacturer") {
      filter.manufacturerId = req.user._id;
    }

    const formulations = await Formulation.find(filter)
      .populate("manufacturerId", "name email organization")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: formulations.length,
      formulations,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get formulation by ID
 */
const getFormulationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const formulation = await Formulation.findOne({
      $or: [{ formulationId: id }, { productId: id }],
    }).populate("manufacturerId", "name email organization");

    if (!formulation) {
      return res.status(404).json({ success: false, message: "Formulation not found" });
    }

    res.json({ success: true, formulation });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFormulation,
  getFormulations,
  getFormulationById,
};
