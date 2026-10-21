const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const User = require("../models/User");
const HerbBatch = require("../models/HerbBatch");
const Evidence = require("../models/Evidence");
const QualityInspection = require("../models/QualityInspection");
const ProcessingEvent = require("../models/ProcessingEvent");
const Formulation = require("../models/Formulation");
const Product = require("../models/Product");
const BlockchainRecord = require("../models/BlockchainRecord");
const AuditLog = require("../models/AuditLog");

const hash = (text) => "0x" + crypto.createHash("sha256").update(text).digest("hex");

async function seed() {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/herbtrace";
  console.log(`[Seed] Connecting to MongoDB: ${mongoURI}...`);
  await mongoose.connect(mongoURI);

  console.log("[Seed] Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    HerbBatch.deleteMany({}),
    Evidence.deleteMany({}),
    QualityInspection.deleteMany({}),
    ProcessingEvent.deleteMany({}),
    Formulation.deleteMany({}),
    Product.deleteMany({}),
    BlockchainRecord.deleteMany({}),
    AuditLog.deleteMany({}),
  ]);

  console.log("[Seed] Creating Demo Users...");
  const admin = await User.create({
    name: "Dr. Rajesh Sharma (Ayush Director)",
    email: "admin@herbtrace.com",
    password: "admin123",
    role: "admin",
    status: "approved",
    phone: "+91 98201 11222",
    address: "Central Ayush Regulatory Council, Delhi",
    state: "Delhi",
    district: "New Delhi",
    organization: "HerbTrace National Botanical Registry",
  });

  const farmer = await User.create({
    name: "Rameshwar Patidar",
    email: "farmer@herbtrace.com",
    password: "farmer123",
    role: "farmer",
    status: "approved",
    phone: "+91 94251 33445",
    address: "Village Rampura, Tehsil Manasa",
    state: "Madhya Pradesh",
    district: "Neemuch",
    collectorType: "Farmer",
    govIdRef: "MP-AGRI-NMCH-2023-8821",
    organization: "Malwa Herbal Cultivators FPO",
  });

  const collector = await User.create({
    name: "Devendra Korwa",
    email: "collector@herbtrace.com",
    password: "collector123",
    role: "collector",
    status: "approved",
    phone: "+91 97554 99881",
    address: "Forest Settlement Sector 4",
    state: "Madhya Pradesh",
    district: "Mandsaur",
    collectorType: "Wild Collector",
    govIdRef: "VAN-DHAN-VSS-4412",
    organization: "Aravalli Van-Dhan Vikas Kendra",
  });

  const inspector = await User.create({
    name: "Dr. Ananya Sen (Pharmacognosist)",
    email: "inspector@herbtrace.com",
    password: "inspector123",
    role: "inspector",
    status: "approved",
    phone: "+91 98310 55667",
    address: "Govt Pharmacopoeia Testing Laboratory",
    state: "Uttarakhand",
    district: "Haridwar",
    organization: "National Medicinal Plants Board (NMPB)",
  });

  const processor = await User.create({
    name: "Vikram Singhania (Processing Lead)",
    email: "processor@herbtrace.com",
    password: "processor123",
    role: "processor",
    status: "approved",
    phone: "+91 98220 77889",
    address: "Industrial Processing Zone, Phase II",
    state: "Uttarakhand",
    district: "Haridwar",
    organization: "Himalayan Herbal Bio-Extracts Ltd.",
  });

  const manufacturer = await User.create({
    name: "Pooja Deshmukh (Production Head)",
    email: "manufacturer@herbtrace.com",
    password: "manufacturer123",
    role: "manufacturer",
    status: "approved",
    phone: "+91 98450 12340",
    address: "GMP Formulations Campus, Sector 9",
    state: "Uttarakhand",
    district: "Haridwar",
    organization: "AyurVeda Botanicals Manufacturing Ltd.",
  });

  console.log("[Seed] Users created successfully.");

  // 1. Create Batches
  console.log("[Seed] Creating Herb Batches...");

  // Batch 1: Ashwagandha (Approved -> Processed -> Used in Formulation)
  const batch1 = await HerbBatch.create({
    batchId: "HT-2026-000001",
    collectorId: farmer._id,
    botanicalName: "Withania somnifera",
    commonName: "Ashwagandha",
    plantFamily: "Solanaceae",
    plantPart: "Root",
    variety: "Nagori Wild-Adapted",
    collectionMethod: "Certified Organic Harvest",
    description: "Winter harvested Nagori variety Ashwagandha roots with high withanolide content, harvested after complete seed maturation.",
    quantity: 120,
    unit: "kg",
    collectionDate: new Date("2026-01-15T08:30:00Z"),
    collectionTime: "08:30 AM",
    collectionLocation: {
      latitude: 24.4682,
      longitude: 74.8698,
      accuracy: 4.2,
      locationName: "Neemuch Herbal Cultivation Belt, MP",
      state: "Madhya Pradesh",
      district: "Neemuch",
    },
    status: "FORMULATION_USED",
    consistencyValidation: {
      validatorStatus: "Consistent",
      validationMessage: "✓ Botanical taxonomy and plant part (Root) are completely consistent with Ayurvedic Pharmacopoeia of India (API) standards for Withania somnifera (Solanaceae). Active marker expected: Withanolide A, Withaferin A (HPLC > 1.5% w/w).",
      confidenceScore: 98,
      flags: ["STANDARD_PHARMACOPOEIA_MATCH", "OFFICINAL_PLANT_PART_VALIDATED"],
      validatedAt: new Date("2026-01-15T09:00:00Z"),
      validatedBy: "HerbTrace Botanical AI Rules Engine",
      validationRulesVersion: "v2.4-AYUSH-AYUR",
    },
    evidenceLock: {
      evidenceId: "EV-HT-00001",
      sha256Hash: "0x8fa37d38249bce37b822eefd0921a415b3941df80cbb0299e900c3b5ec1e4b9f",
      locked: true,
      lockedAt: new Date("2026-01-15T09:15:00Z"),
    },
    blockchainRecord: {
      transactionHash: "0x3a4b91739c9102ef7183eec1287c2b489a3f2b419bcf82e9821ef9a820491823",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1045,
      isVerified: true,
      verifiedAt: new Date("2026-01-15T09:20:00Z"),
      network: "Hardhat Localhost (Chain ID 31337)",
    },
  });

  // Batch 2: Turmeric (Approved -> Processed -> Used in Formulation)
  const batch2 = await HerbBatch.create({
    batchId: "HT-2026-000002",
    collectorId: farmer._id,
    botanicalName: "Curcuma longa",
    commonName: "Turmeric",
    plantFamily: "Zingiberaceae",
    plantPart: "Rhizome",
    variety: "Erode Pure Gold",
    collectionMethod: "Certified Organic Harvest",
    description: "Prime cured golden turmeric fingers with dark yellow core, grown in red loamy soils with organic compost enrichment.",
    quantity: 250,
    unit: "kg",
    collectionDate: new Date("2026-01-22T07:45:00Z"),
    collectionTime: "07:45 AM",
    collectionLocation: {
      latitude: 11.341,
      longitude: 77.7172,
      accuracy: 3.5,
      locationName: "Bhavani River Basin, Erode",
      state: "Tamil Nadu",
      district: "Erode",
    },
    status: "FORMULATION_USED",
    consistencyValidation: {
      validatorStatus: "Consistent",
      validationMessage: "✓ Botanical taxonomy and plant part (Rhizome) are completely consistent with Ayurvedic Pharmacopoeia of India (API) standards for Curcuma longa (Zingiberaceae). Active marker expected: Curcuminoids > 3.0% w/w.",
      confidenceScore: 99,
      flags: ["STANDARD_PHARMACOPOEIA_MATCH"],
      validatedAt: new Date("2026-01-22T08:15:00Z"),
      validatedBy: "HerbTrace Botanical AI Rules Engine",
      validationRulesVersion: "v2.4-AYUSH-AYUR",
    },
    evidenceLock: {
      evidenceId: "EV-HT-00002",
      sha256Hash: "0x7bc21f92e4a8b11c7694f489e248b1d98a00293ebf12948ca298f0293e818b2c",
      locked: true,
      lockedAt: new Date("2026-01-22T08:30:00Z"),
    },
    blockchainRecord: {
      transactionHash: "0x19284cf9830219da8210384750291cb09472619842a8b9e10293847502918237",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1048,
      isVerified: true,
      verifiedAt: new Date("2026-01-22T08:35:00Z"),
      network: "Hardhat Localhost (Chain ID 31337)",
    },
  });

  // Batch 3: Tulsi (Approved -> Currently Processing)
  const batch3 = await HerbBatch.create({
    batchId: "HT-2026-000003",
    collectorId: collector._id,
    botanicalName: "Ocimum sanctum",
    commonName: "Tulsi",
    plantFamily: "Lamiaceae",
    plantPart: "Leaves",
    variety: "Krishna Tulsi (Shyama)",
    collectionMethod: "Wild Hand-Picked",
    description: "Wild mountain foothills Krishna Tulsi harvested during peak aromatic flowering phase with intense clove-like eugenol aroma.",
    quantity: 80,
    unit: "kg",
    collectionDate: new Date("2026-02-05T09:10:00Z"),
    collectionTime: "09:10 AM",
    collectionLocation: {
      latitude: 29.9457,
      longitude: 78.1642,
      accuracy: 5.1,
      locationName: "Shivalik Foothills Conservation Sector",
      state: "Uttarakhand",
      district: "Haridwar",
    },
    status: "PROCESSING",
    consistencyValidation: {
      validatorStatus: "Consistent",
      validationMessage: "✓ Botanical taxonomy and plant part (Leaves) are completely consistent with API standards for Ocimum sanctum (Lamiaceae). Active marker: Eugenol > 0.5% w/w.",
      confidenceScore: 96,
      flags: ["STANDARD_PHARMACOPOEIA_MATCH"],
      validatedAt: new Date("2026-02-05T09:30:00Z"),
      validatedBy: "HerbTrace Botanical AI Rules Engine",
      validationRulesVersion: "v2.4-AYUSH-AYUR",
    },
    evidenceLock: {
      evidenceId: "EV-HT-00003",
      sha256Hash: "0x6198f237894a827bc0192847590219da8210384750291cb09472619842a8b9e1",
      locked: true,
      lockedAt: new Date("2026-02-05T09:40:00Z"),
    },
    blockchainRecord: {
      transactionHash: "0x981029384750291823719284cf9830219da8210384750291cb09472619842a8b",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1052,
      isVerified: true,
      verifiedAt: new Date("2026-02-05T09:45:00Z"),
      network: "Hardhat Localhost (Chain ID 31337)",
    },
  });

  // Batch 4: Amla (Quality Pending)
  const batch4 = await HerbBatch.create({
    batchId: "HT-2026-000004",
    collectorId: farmer._id,
    botanicalName: "Phyllanthus emblica",
    commonName: "Amla",
    plantFamily: "Phyllanthaceae",
    plantPart: "Fruit",
    variety: "Banarasi Desi",
    collectionMethod: "Certified Organic Harvest",
    description: "Freshly harvested succulent wild Banarasi Amla fruits, rich in natural ascorbic acid and tannins.",
    quantity: 300,
    unit: "kg",
    collectionDate: new Date("2026-02-18T10:00:00Z"),
    collectionTime: "10:00 AM",
    collectionLocation: {
      latitude: 25.9234,
      longitude: 81.9983,
      accuracy: 4.0,
      locationName: "Belha Devi Agro Belt, Pratapgarh",
      state: "Uttar Pradesh",
      district: "Pratapgarh",
    },
    status: "QUALITY_PENDING",
    consistencyValidation: {
      validatorStatus: "Consistent",
      validationMessage: "✓ Botanical taxonomy and plant part (Fruit) are completely consistent with API standards for Phyllanthus emblica (Phyllanthaceae).",
      confidenceScore: 97,
      flags: ["STANDARD_PHARMACOPOEIA_MATCH"],
      validatedAt: new Date("2026-02-18T10:15:00Z"),
      validatedBy: "HerbTrace Botanical AI Rules Engine",
      validationRulesVersion: "v2.4-AYUSH-AYUR",
    },
    evidenceLock: {
      evidenceId: "EV-HT-00004",
      sha256Hash: "0x4a827bc0192847590219da8210384750291cb09472619842a8b9e16198f23789",
      locked: true,
      lockedAt: new Date("2026-02-18T10:30:00Z"),
    },
    blockchainRecord: {
      transactionHash: "0x8210384750291cb09472619842a8b9e16198f237894a827bc0192847590219da",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1056,
      isVerified: true,
      verifiedAt: new Date("2026-02-18T10:35:00Z"),
      network: "Hardhat Localhost (Chain ID 31337)",
    },
  });

  // Batch 5: Neem with Inconsistent Part -> REJECTED
  const batch5 = await HerbBatch.create({
    batchId: "HT-2026-000005",
    collectorId: collector._id,
    botanicalName: "Azadirachta indica",
    commonName: "Neem",
    plantFamily: "Meliaceae",
    plantPart: "Root Tuber", // Inconsistent!
    variety: "Wild Dryland",
    collectionMethod: "Wild Hand-Picked",
    description: "Subterranean root parts claimed to be Neem gathered during dry summer clearing.",
    quantity: 45,
    unit: "kg",
    collectionDate: new Date("2026-02-25T11:20:00Z"),
    collectionTime: "11:20 AM",
    collectionLocation: {
      latitude: 26.9124,
      longitude: 75.7873,
      accuracy: 6.8,
      locationName: "Amber Forest Buffer Corridor, Jaipur",
      state: "Rajasthan",
      district: "Jaipur",
    },
    status: "REJECTED",
    consistencyValidation: {
      validatorStatus: "Warning",
      validationMessage: '⚠ Botanical Consistency Warning: Discrepancies detected in plant part or taxonomy (SUSPICIOUS_PLANT_PART: "Root Tuber" is rarely or never used as the officinal therapeutic part for Azadirachta indica. Standard Ayurvedic parts are: Leaves, Stem Bark, Seeds, Oil).',
      confidenceScore: 35,
      flags: ["SUSPICIOUS_PLANT_PART", "NON_OFFICINAL_ORGAN"],
      validatedAt: new Date("2026-02-25T11:40:00Z"),
      validatedBy: "HerbTrace Botanical AI Rules Engine",
      validationRulesVersion: "v2.4-AYUSH-AYUR",
    },
    evidenceLock: {
      evidenceId: "EV-HT-00005",
      sha256Hash: "0x37894a827bc0192847590219da8210384750291cb09472619842a8b9e16198f2",
      locked: true,
      lockedAt: new Date("2026-02-25T11:55:00Z"),
    },
    blockchainRecord: {
      transactionHash: "0xda8210384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1060,
      isVerified: true,
      verifiedAt: new Date("2026-02-25T12:00:00Z"),
      network: "Hardhat Localhost (Chain ID 31337)",
    },
  });

  console.log("[Seed] Herb Batches created.");

  // 2. Create Locked Evidence
  console.log("[Seed] Creating Locked Evidence Records...");
  await Evidence.create([
    {
      evidenceId: "EV-HT-00001",
      batchId: "HT-2026-000001",
      title: "Ashwagandha Field Harvest & Geotag Photo",
      category: "Botanical Photo",
      fileName: "HT-2026-000001_ashwa_roots.jpg",
      fileType: "image/jpeg",
      fileUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      fileHash: "0x8fa37d38249bce37b822eefd0921a415b3941df80cbb0299e900c3b5ec1e4b9f",
      capturedAt: new Date("2026-01-15T08:35:00Z"),
      uploadedAt: new Date("2026-01-15T09:15:00Z"),
      locked: true,
      lockedAt: new Date("2026-01-15T09:15:00Z"),
      version: 1,
      uploadedBy: farmer._id,
      blockchainTxHash: "0x3a4b91739c9102ef7183eec1287c2b489a3f2b419bcf82e9821ef9a820491823",
    },
    {
      evidenceId: "EV-HT-00002",
      batchId: "HT-2026-000002",
      title: "Organic Turmeric Rhizome Harvest Inspection",
      category: "Botanical Photo",
      fileName: "HT-2026-000002_turmeric_rhizome.jpg",
      fileType: "image/jpeg",
      fileUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      fileHash: "0x7bc21f92e4a8b11c7694f489e248b1d98a00293ebf12948ca298f0293e818b2c",
      capturedAt: new Date("2026-01-22T07:50:00Z"),
      uploadedAt: new Date("2026-01-22T08:30:00Z"),
      locked: true,
      lockedAt: new Date("2026-01-22T08:30:00Z"),
      version: 1,
      uploadedBy: farmer._id,
      blockchainTxHash: "0x19284cf9830219da8210384750291cb09472619842a8b9e10293847502918237",
    },
    {
      evidenceId: "EV-HT-00003",
      batchId: "HT-2026-000003",
      title: "Krishna Tulsi Canopy Field Sampling",
      category: "Botanical Photo",
      fileName: "HT-2026-000003_tulsi_leaves.jpg",
      fileType: "image/jpeg",
      fileUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80",
      fileHash: "0x6198f237894a827bc0192847590219da8210384750291cb09472619842a8b9e1",
      capturedAt: new Date("2026-02-05T09:15:00Z"),
      uploadedAt: new Date("2026-02-05T09:40:00Z"),
      locked: true,
      lockedAt: new Date("2026-02-05T09:40:00Z"),
      version: 1,
      uploadedBy: collector._id,
      blockchainTxHash: "0x981029384750291823719284cf9830219da8210384750291cb09472619842a8b",
    },
  ]);

  // 3. Create Quality Inspections
  console.log("[Seed] Creating Quality Inspections...");
  // Batch 1: Approved
  await QualityInspection.create({
    inspectionId: "INSP-APP-001041",
    batchId: "HT-2026-000001",
    inspectorId: inspector._id,
    status: "QUALITY APPROVED",
    parameters: {
      moistureContentPercent: 7.8,
      foreignMatterPercent: 0.4,
      totalAshPercent: 4.8,
      acidInsolubleAshPercent: 0.35,
      activePhytochemicalAssay: "Withanolide A: 1.92% w/w, Withaferin A: 0.85% (HPLC Certified)",
      pesticideResidueCompliant: true,
      microbialContaminationCompliant: true,
      heavyMetalsCompliant: true,
    },
    remarks: "Exceptional botanical quality. Withanolide concentration exceeds AYUSH pharmacopoeia standard by 28%. Approved for advanced extraction and processing.",
    inspectionDate: new Date("2026-01-18T14:30:00Z"),
    blockchainTxHash: "0x4421b9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
    parametersHash: hash("HT-2026-000001_QUALITY_APPROVED_1.92%"),
  });

  // Batch 2: Approved
  await QualityInspection.create({
    inspectionId: "INSP-APP-001042",
    batchId: "HT-2026-000002",
    inspectorId: inspector._id,
    status: "QUALITY APPROVED",
    parameters: {
      moistureContentPercent: 8.5,
      foreignMatterPercent: 0.3,
      totalAshPercent: 5.1,
      acidInsolubleAshPercent: 0.42,
      activePhytochemicalAssay: "Curcuminoids: 4.15% w/w (Spectrophotometric assay)",
      pesticideResidueCompliant: true,
      microbialContaminationCompliant: true,
      heavyMetalsCompliant: true,
    },
    remarks: "Certified non-GMO Erode Turmeric. Zero traces of artificial lead chromate or synthetic color adulteration.",
    inspectionDate: new Date("2026-01-25T11:00:00Z"),
    blockchainTxHash: "0x5532c9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
    parametersHash: hash("HT-2026-000002_QUALITY_APPROVED_4.15%"),
  });

  // Batch 5: Rejected
  await QualityInspection.create({
    inspectionId: "INSP-REJ-001043",
    batchId: "HT-2026-000005",
    inspectorId: inspector._id,
    status: "QUALITY REJECTED",
    parameters: {
      moistureContentPercent: 16.4,
      foreignMatterPercent: 5.8,
      totalAshPercent: 11.2,
      acidInsolubleAshPercent: 3.4,
      activePhytochemicalAssay: "Azadirachtin: Undetectable in submitted root specimen",
      pesticideResidueCompliant: false,
      microbialContaminationCompliant: true,
      heavyMetalsCompliant: true,
    },
    rejectionReason: "Botanical part mismatch (Root Tuber submitted instead of officinal Leaves/Bark/Seeds). Excessive moisture (16.4% > 10% limit) and foreign soil matter. Failed AYUSH pharmacopoeial assay.",
    remarks: "Batch rejected permanently. Cannot enter manufacturing stream.",
    inspectionDate: new Date("2026-02-27T16:00:00Z"),
    blockchainTxHash: "0x6643d9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
    parametersHash: hash("HT-2026-000005_QUALITY_REJECTED"),
  });

  // 4. Create Processing Events
  console.log("[Seed] Creating Chronological Processing Pipeline Events...");
  // Processing for Batch 1 (Ashwagandha: Cleaning -> Drying -> Grinding)
  await ProcessingEvent.create([
    {
      eventId: "PROC-CLE-001",
      batchId: "HT-2026-000001",
      stage: "Cleaning",
      description: "Pressurized de-stoning and cold hydro-wash to eliminate adhering rhizosphere silts.",
      method: "Multi-stage automated herbal washing tank with ultrasonic agitation",
      quantityBefore: 120,
      quantityAfter: 118,
      unit: "kg",
      location: "Haridwar Processing Facility, Unit 1",
      performedBy: processor._id,
      timestamp: new Date("2026-01-20T09:00:00Z"),
      evidenceUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      evidenceHash: hash("PROC_CLE_HT-2026-000001"),
      blockchainTxHash: "0x7754e9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      previousEventHash: "0x3a4b91739c9102ef7183eec1287c2b489a3f2b419bcf82e9821ef9a820491823",
    },
    {
      eventId: "PROC-DRY-002",
      batchId: "HT-2026-000001",
      stage: "Drying",
      description: "Low-temperature indirect solar tunnel dehydration below 42°C to prevent thermal degradation of active withanolides.",
      method: "Controlled greenhouse solar tunnel dehumidifier",
      quantityBefore: 118,
      quantityAfter: 104,
      unit: "kg",
      location: "Haridwar Processing Facility, Solar Tunnel B",
      performedBy: processor._id,
      timestamp: new Date("2026-01-23T14:00:00Z"),
      evidenceUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      evidenceHash: hash("PROC_DRY_HT-2026-000001"),
      blockchainTxHash: "0x8865f9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      previousEventHash: "0x7754e9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
    },
    {
      eventId: "PROC-GRI-003",
      batchId: "HT-2026-000001",
      stage: "Grinding",
      description: "Cryogenic micro-milling under liquid nitrogen shroud to preserve volatile phyto-actives.",
      method: "Cryo-pulverizer (passed through standard 80-mesh stainless steel sieve)",
      quantityBefore: 104,
      quantityAfter: 102,
      unit: "kg",
      location: "Haridwar Milling Complex, Suite 3",
      performedBy: processor._id,
      timestamp: new Date("2026-01-27T11:30:00Z"),
      evidenceUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
      evidenceHash: hash("PROC_GRI_HT-2026-000001"),
      blockchainTxHash: "0x9976a9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      previousEventHash: "0x8865f9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
    },
    // Processing for Batch 2 (Turmeric: Cleaning -> Sorting -> Extraction)
    {
      eventId: "PROC-EXT-004",
      batchId: "HT-2026-000002",
      stage: "Extraction",
      description: "Supercritical Fluid CO2 standardized extraction yield enriched in 95% total curcuminoids.",
      method: "Supercritical CO2 Extraction (300 bar, 45°C)",
      quantityBefore: 250,
      quantityAfter: 22.5,
      unit: "kg",
      location: "Bio-Extracts Pharma Block, Haridwar",
      performedBy: processor._id,
      timestamp: new Date("2026-01-29T16:00:00Z"),
      evidenceUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
      evidenceHash: hash("PROC_EXT_HT-2026-000002"),
      blockchainTxHash: "0xaa87b9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      previousEventHash: "0x19284cf9830219da8210384750291cb09472619842a8b9e10293847502918237",
    },
    // Processing for Batch 3 (Tulsi: Drying)
    {
      eventId: "PROC-DRY-005",
      batchId: "HT-2026-000003",
      stage: "Drying",
      description: "Controlled dehumidification tunnel at 38°C to retain essential volatile oils and vivid green pigment.",
      method: "Solar convective greenhouse drying",
      quantityBefore: 80,
      quantityAfter: 28,
      unit: "kg",
      location: "Haridwar Processing Facility, Solar Tunnel C",
      performedBy: processor._id,
      timestamp: new Date("2026-02-10T15:00:00Z"),
      evidenceUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=800&q=80",
      evidenceHash: hash("PROC_DRY_HT-2026-000003"),
      blockchainTxHash: "0xbb98c9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      previousEventHash: "0x981029384750291823719284cf9830219da8210384750291cb09472619842a8b",
    },
  ]);

  // 5. Create Formulations
  console.log("[Seed] Creating Ayurvedic Formulations...");

  // Formulation 1: Multi-batch synergistic formulation (Ashwagandha Batch 1 + Turmeric Batch 2)
  const formulation1 = await Formulation.create({
    formulationId: "FORM-2026-0001",
    productId: "PROD-AYUR-00101",
    manufacturerId: manufacturer._id,
    productName: "HerbTrace Ashwagandha + Haridra Vitality Capsules",
    productType: "Capsules (Standardized Extract)",
    manufacturerName: "AyurVeda Botanicals Manufacturing Ltd.",
    licenseNumber: "AYUSH-UK-GMP-2022/944",
    ingredients: [
      {
        herbName: "Withania somnifera (Ashwagandha)",
        batchId: "HT-2026-000001",
        percentage: 70,
        partUsed: "Root (Cryo-ground fine powder)",
      },
      {
        herbName: "Curcuma longa (Haridra / Turmeric)",
        batchId: "HT-2026-000002",
        percentage: 30,
        partUsed: "Rhizome (Standardized 95% Curcumin extract)",
      },
    ],
    batchIds: ["HT-2026-000001", "HT-2026-000002"],
    totalQuantity: 1200,
    quantityUnit: "Bottles (60 veg capsules each)",
    manufacturingDate: new Date("2026-02-01T00:00:00Z"),
    expiryDate: new Date("2028-01-31T00:00:00Z"),
    manufacturingLocation: "AyurVeda GMP Facility, Industrial Plot 14, Haridwar, UK",
    description: "Classical Ayurvedic synergistic Rasayana formulation compounding purified Withania somnifera root with bioactive Curcuma longa rhizome extract for stress resilience, immunity, and cellular vitality.",
    dosageInstructions: "Take 1-2 capsules twice daily with warm milk or water after meals, or as directed by an Ayurvedic practitioner.",
    blockchainTxHash: "0xcc09d9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
    metadataHash: hash("FORM_PROD-AYUR-00101_META"),
  });

  // Formulation 2: Pure Ashwagandha Churna
  const formulation2 = await Formulation.create({
    formulationId: "FORM-2026-0002",
    productId: "PROD-AYUR-00102",
    manufacturerId: manufacturer._id,
    productName: "HerbTrace Pure Ashwagandha Rasayana Churna",
    productType: "Churna (Fine Herbal Powder)",
    manufacturerName: "AyurVeda Botanicals Manufacturing Ltd.",
    licenseNumber: "AYUSH-UK-GMP-2022/944",
    ingredients: [
      {
        herbName: "Withania somnifera (Ashwagandha)",
        batchId: "HT-2026-000001",
        percentage: 100,
        partUsed: "Root (Passed 80-mesh sieve)",
      },
    ],
    batchIds: ["HT-2026-000001"],
    totalQuantity: 800,
    quantityUnit: "Jars (100g airtight amber glass)",
    manufacturingDate: new Date("2026-02-04T00:00:00Z"),
    expiryDate: new Date("2028-02-03T00:00:00Z"),
    manufacturingLocation: "AyurVeda GMP Facility, Industrial Plot 14, Haridwar, UK",
    description: "Traditional Shodhita Ashwagandha root churna pulverized under controlled humidity and micro-sieved for optimal bioavailability.",
    dosageInstructions: "3 to 5 grams with warm milk and pure honey at bedtime.",
    blockchainTxHash: "0xdd1ae9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
    metadataHash: hash("FORM_PROD-AYUR-00102_META"),
  });

  // 6. Create Finished Products & Public Trace Links
  console.log("[Seed] Creating Products with Public QR Traceability...");
  await Product.create([
    {
      productId: "PROD-AYUR-00101",
      formulationId: formulation1.formulationId,
      manufacturerId: manufacturer._id,
      productName: formulation1.productName,
      productType: formulation1.productType,
      publicTraceUrl: "/trace/PROD-AYUR-00101",
      batchIds: formulation1.batchIds,
      status: "PUBLISHED",
      blockchainTxHash: formulation1.blockchainTxHash,
      packagingDate: new Date("2026-02-02T12:00:00Z"),
    },
    {
      productId: "PROD-AYUR-00102",
      formulationId: formulation2.formulationId,
      manufacturerId: manufacturer._id,
      productName: formulation2.productName,
      productType: formulation2.productType,
      publicTraceUrl: "/trace/PROD-AYUR-00102",
      batchIds: formulation2.batchIds,
      status: "PUBLISHED",
      blockchainTxHash: formulation2.blockchainTxHash,
      packagingDate: new Date("2026-02-05T12:00:00Z"),
    },
  ]);

  // 7. Seed Blockchain Immutable Ledger Records
  console.log("[Seed] Seeding Blockchain Ledger Records...");
  await BlockchainRecord.create([
    {
      recordType: "BATCH_REGISTRATION",
      batchId: "HT-2026-000001",
      transactionHash: "0x3a4b91739c9102ef7183eec1287c2b489a3f2b419bcf82e9821ef9a820491823",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1045,
      network: "Hardhat Localhost (Chain ID 31337)",
      fromAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      gasUsed: "48,210",
      dataPayload: { batchId: "HT-2026-000001", botanicalHash: hash("Withania somnifera_Root") },
      timestamp: new Date("2026-01-15T09:20:00Z"),
    },
    {
      recordType: "QUALITY_VERIFICATION",
      batchId: "HT-2026-000001",
      transactionHash: "0x4421b9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1047,
      network: "Hardhat Localhost (Chain ID 31337)",
      fromAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      gasUsed: "32,840",
      dataPayload: { batchId: "HT-2026-000001", approved: true },
      timestamp: new Date("2026-01-18T14:35:00Z"),
    },
    {
      recordType: "PROCESSING_STAGE",
      batchId: "HT-2026-000001",
      transactionHash: "0x9976a9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1051,
      network: "Hardhat Localhost (Chain ID 31337)",
      fromAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      gasUsed: "36,500",
      dataPayload: { batchId: "HT-2026-000001", stage: "Grinding", qtyAfter: 102 },
      timestamp: new Date("2026-01-27T11:35:00Z"),
    },
    {
      recordType: "FORMULATION_CREATION",
      productId: "PROD-AYUR-00101",
      transactionHash: "0xcc09d9384750291cb09472619842a8b9e16198f237894a827bc0192847590219",
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      blockNumber: 1054,
      network: "Hardhat Localhost (Chain ID 31337)",
      fromAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
      gasUsed: "78,920",
      dataPayload: {
        productId: "PROD-AYUR-00101",
        formulationId: "FORM-2026-0001",
        batchIds: ["HT-2026-000001", "HT-2026-000002"],
      },
      timestamp: new Date("2026-02-01T10:00:00Z"),
    },
  ]);

  // 8. Create Audit Logs
  console.log("[Seed] Seeding Audit Trails...");
  await AuditLog.create([
    {
      actorId: admin._id,
      actorName: admin.name,
      actorRole: admin.role,
      action: "PLATFORM_INITIALIZED",
      entityType: "System",
      entityId: "SYS-INIT",
      description: "HerbTrace Botanical Traceability Platform node initialized and smart contract anchored.",
      status: "SUCCESS",
    },
    {
      actorId: farmer._id,
      actorName: farmer.name,
      actorRole: farmer.role,
      action: "BATCH_REGISTERED",
      entityType: "HerbBatch",
      entityId: "HT-2026-000001",
      description: "Registered Ashwagandha batch HT-2026-000001 in Neemuch, MP.",
      status: "SUCCESS",
    },
    {
      actorId: inspector._id,
      actorName: inspector.name,
      actorRole: inspector.role,
      action: "QUALITY_APPROVED",
      entityType: "HerbBatch",
      entityId: "HT-2026-000001",
      description: "Passed pharmacognosy and active marker chromatography assay for HT-2026-000001.",
      status: "SUCCESS",
    },
    {
      actorId: manufacturer._id,
      actorName: manufacturer.name,
      actorRole: manufacturer.role,
      action: "FORMULATION_CREATED",
      entityType: "Formulation",
      entityId: "FORM-2026-0001",
      description: "Ayurvedic formulation created combining batches HT-2026-000001 and HT-2026-000002.",
      status: "SUCCESS",
    },
  ]);

  console.log("====================================================");
  console.log("🌿 HERBTRACE DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("   - Users: 6 (Admin, Farmer, Collector, Inspector, Processor, Manufacturer)");
  console.log("   - Batches: 5 (Ashwagandha, Turmeric, Tulsi, Amla, Neem)");
  console.log("   - Locked Evidence: 3");
  console.log("   - Quality Inspections: 3 (2 Approved, 1 Rejected)");
  console.log("   - Processing Events: 5");
  console.log("   - Formulations: 2");
  console.log("   - Products: 2 (PROD-AYUR-00101, PROD-AYUR-00102)");
  console.log("   - Blockchain Records: 4");
  console.log("====================================================");

  process.exit(0);
}

seed().catch((err) => {
  console.error("[Seed] Failed:", err);
  process.exit(1);
});
