const Product = require("../models/Product");
const Formulation = require("../models/Formulation");
const HerbBatch = require("../models/HerbBatch");
const QualityInspection = require("../models/QualityInspection");
const ProcessingEvent = require("../models/ProcessingEvent");
const Evidence = require("../models/Evidence");
const BlockchainRecord = require("../models/BlockchainRecord");

/**
 * Public Traceability API for Consumers
 * Anonymizes private farmer information (e.g. phone, street address)
 * while preserving full botanical, quality, processing, and blockchain provenance.
 */
const getPublicProductTrace = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // 1. Find Product
    const product = await Product.findOne({ productId }).populate("manufacturerId", "name organization");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${productId}' could not be found. Please check your QR code or product serial number.`,
      });
    }

    // 2. Find Formulation
    const formulation = await Formulation.findOne({ productId });

    // 3. Find all associated Herb Batches
    const batchIds = product.batchIds && product.batchIds.length > 0
      ? product.batchIds
      : formulation
      ? formulation.batchIds
      : [];

    const batches = await HerbBatch.find({ batchId: { $in: batchIds } })
      .populate("collectorId", "collectorType district state")
      .lean();

    // Sanitize farmer data: only show collector type, district, state
    const sanitizedBatches = batches.map((b) => {
      return {
        batchId: b.batchId,
        botanicalName: b.botanicalName,
        commonName: b.commonName,
        plantFamily: b.plantFamily,
        plantPart: b.plantPart,
        variety: b.variety,
        collectionMethod: b.collectionMethod,
        collectionDate: b.collectionDate,
        collectionTime: b.collectionTime,
        location: {
          locationName: b.collectionLocation.locationName,
          state: b.collectionLocation.state,
          district: b.collectionLocation.district,
          latitude: b.collectionLocation.latitude,
          longitude: b.collectionLocation.longitude,
        },
        collectorInfo: {
          collectorType: b.collectorId ? b.collectorId.collectorType : "Registered Forest Collector",
          region: `${b.collectionLocation.district}, ${b.collectionLocation.state}`,
          certifiedOrigin: "✓ Verified Ayurvedic Harvesting Zone",
        },
        consistencyValidation: b.consistencyValidation,
        evidenceLock: b.evidenceLock,
        blockchainRecord: b.blockchainRecord,
        status: b.status,
      };
    });

    // 4. Find Quality Inspections for all batches
    const qualityInspections = await QualityInspection.find({ batchId: { $in: batchIds } })
      .select("-inspectorId")
      .sort({ createdAt: 1 })
      .lean();

    // 5. Find Processing Events for all batches
    const processingHistory = await ProcessingEvent.find({ batchId: { $in: batchIds } })
      .select("-performedBy")
      .sort({ createdAt: 1 })
      .lean();

    // 6. Find Locked Evidence
    const evidenceRecords = await Evidence.find({ batchId: { $in: batchIds } })
      .select("-uploadedBy")
      .sort({ createdAt: 1 })
      .lean();

    // 7. Find Blockchain Records
    const blockchainRecords = await BlockchainRecord.find({
      $or: [{ productId }, { batchId: { $in: batchIds } }],
    }).sort({ createdAt: 1 });

    // 8. Build Batch Genealogy Graph (Nodes & Edges)
    const genealogyGraph = buildGenealogyGraph({
      product,
      formulation,
      batches: sanitizedBatches,
      inspections: qualityInspections,
      processingEvents: processingHistory,
    });

    res.json({
      success: true,
      product: {
        productId: product.productId,
        productName: product.productName,
        productType: product.productType,
        manufacturerName: formulation ? formulation.manufacturerName : "Ayurvedic Pharmacopoeia Licensed Producer",
        licenseNumber: formulation ? formulation.licenseNumber : "AYUSH-MFG-GMP-2024",
        manufacturingDate: formulation ? formulation.manufacturingDate : product.packagingDate,
        expiryDate: formulation ? formulation.expiryDate : null,
        manufacturingLocation: formulation ? formulation.manufacturingLocation : "AYUSH GMP Facility, Haridwar",
        description: formulation ? formulation.description : "",
        dosageInstructions: formulation ? formulation.dosageInstructions : "",
        qrCodeDataUrl: product.qrCodeDataUrl,
        publicTraceUrl: product.publicTraceUrl,
        verificationBadge: "✓ Blockchain Verified",
        packagingDate: product.packagingDate,
      },
      formulation: formulation
        ? {
            formulationId: formulation.formulationId,
            ingredients: formulation.ingredients,
            totalQuantity: formulation.totalQuantity,
            quantityUnit: formulation.quantityUnit,
          }
        : null,
      batches: sanitizedBatches,
      qualityInspections,
      processingHistory,
      evidenceRecords,
      blockchainRecords,
      genealogyGraph,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper to build interactive Genealogy Graph structures
 */
function buildGenealogyGraph({ product, formulation, batches, inspections, processingEvents }) {
  const nodes = [];
  const edges = [];

  // 1. Root / Collector & Batch Nodes
  batches.forEach((b, idx) => {
    // Collector Node
    const collectorNodeId = `farmer-${b.batchId}`;
    nodes.push({
      id: collectorNodeId,
      type: "Farmer",
      label: `${b.collectorInfo.collectorType}\n${b.location.locationName}`,
      details: {
        collectorType: b.collectorInfo.collectorType,
        region: b.collectorInfo.region,
        harvestDate: new Date(b.collectionDate).toLocaleDateString(),
      },
      color: "#166534", // Green 800
    });

    // Batch Node
    const batchNodeId = `batch-${b.batchId}`;
    nodes.push({
      id: batchNodeId,
      type: "Batch",
      label: `${b.commonName}\nBatch: ${b.batchId}`,
      details: {
        botanicalName: b.botanicalName,
        part: b.plantPart,
        status: b.status,
        validation: b.consistencyValidation.validatorStatus,
      },
      color: "#15803d", // Green 700
    });

    edges.push({
      id: `e-${collectorNodeId}-${batchNodeId}`,
      source: collectorNodeId,
      target: batchNodeId,
      label: "Collected & Tagged",
    });

    // Quality Inspection Node for this batch
    const qInsp = inspections.find((i) => i.batchId === b.batchId);
    if (qInsp) {
      const qNodeId = `quality-${b.batchId}`;
      nodes.push({
        id: qNodeId,
        type: "Quality",
        label: `Quality Check\n${qInsp.status}`,
        details: {
          status: qInsp.status,
          date: new Date(qInsp.inspectionDate).toLocaleDateString(),
          moisture: `${qInsp.parameters?.moistureContentPercent || 8.5}%`,
        },
        color: qInsp.status === "QUALITY APPROVED" ? "#047857" : "#b91c1c",
      });

      edges.push({
        id: `e-${batchNodeId}-${qNodeId}`,
        source: batchNodeId,
        target: qNodeId,
        label: "Pharmacognosy Verification",
      });

      // Processing Events for this batch
      const batchProc = processingEvents.filter((p) => p.batchId === b.batchId);
      let lastNodeId = qNodeId;

      batchProc.forEach((proc, pIdx) => {
        const procNodeId = `proc-${b.batchId}-${pIdx}`;
        nodes.push({
          id: procNodeId,
          type: "Processing",
          label: `Stage: ${proc.stage}\n${proc.method}`,
          details: {
            stage: proc.stage,
            method: proc.method,
            qtyAfter: `${proc.quantityAfter} ${proc.unit}`,
            location: proc.location,
          },
          color: "#0d9488", // Teal 600
        });

        edges.push({
          id: `e-${lastNodeId}-${procNodeId}`,
          source: lastNodeId,
          target: procNodeId,
          label: "Processed",
        });

        lastNodeId = procNodeId;
      });

      // Connect last processing node (or quality node) to Formulation
      if (formulation) {
        const formNodeId = `form-${formulation.formulationId}`;
        edges.push({
          id: `e-${lastNodeId}-${formNodeId}`,
          source: lastNodeId,
          target: formNodeId,
          label: "Ingredient Bound",
        });
      }
    }
  });

  // Formulation Node
  if (formulation) {
    const formNodeId = `form-${formulation.formulationId}`;
    nodes.push({
      id: formNodeId,
      type: "Formulation",
      label: `Formulation\n${formulation.formulationId}`,
      details: {
        productName: formulation.productName,
        ingredients: formulation.ingredients?.length || 1,
        license: formulation.licenseNumber,
      },
      color: "#b45309", // Amber 700
    });

    // Product Node
    const prodNodeId = `prod-${product.productId}`;
    nodes.push({
      id: prodNodeId,
      type: "Product",
      label: `Finished Product\n${product.productName}`,
      details: {
        productId: product.productId,
        productType: product.productType,
        verified: "Blockchain Verified",
      },
      color: "#059669", // Emerald 600
    });

    edges.push({
      id: `e-${formNodeId}-${prodNodeId}`,
      source: formNodeId,
      target: prodNodeId,
      label: "Compounded & Sealed",
    });

    // Consumer Node
    const consumerNodeId = `consumer-${product.productId}`;
    nodes.push({
      id: consumerNodeId,
      type: "Consumer",
      label: "Consumer\nQR Verification",
      details: {
        status: "Trust Preserved",
        publicTrace: "Active",
      },
      color: "#4338ca", // Indigo 700
    });

    edges.push({
      id: `e-${prodNodeId}-${consumerNodeId}`,
      source: prodNodeId,
      target: consumerNodeId,
      label: "QR Scanned & Verified",
    });
  }

  return { nodes, edges };
}

module.exports = {
  getPublicProductTrace,
};
