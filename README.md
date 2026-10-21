# 🌿 HerbTrace: Blockchain-Based Botanical Traceability System for Ayurvedic Herbs

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.22-yellow.svg)](https://hardhat.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![AYUSH Compliant](https://img.shields.io/badge/AYUSH-API%20Pharmacopoeia-success.svg)](#)

A full-stack **MERN + Blockchain Web Application** engineered to provide immutable, cryptographic supply chain traceability for Ayurvedic botanical herbs—from tribal forest collectors and cultivators to finished formulations and consumer QR verification.

---

## 📋 Table of Contents
1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [Key Architectural Pillars & 3 New Core Features](#-key-architectural-pillars--3-new-core-features)
3. [User Roles & RBAC System](#-user-roles--rbac-system)
4. [Technology Stack](#-technology-stack)
5. [End-to-End Traceability Workflow](#-end-to-end-traceability-workflow)
6. [Smart Contract (HerbTrace.sol)](#-smart-contract-herbtracesol)
7. [Project Structure](#-project-structure)
8. [Installation & Setup Guide](#-installation--setup-guide)
9. [Pre-Seeded Demo Credentials](#-pre-seeded-demo-credentials)
10. [REST API Documentation](#-rest-api-documentation)
11. [Verification Checklist](#-verification-checklist)

---

## 🎯 Project Overview & Problem Statement

### The Problem in Herbal Supply Chains
Traditional Ayurvedic herbal sourcing faces critical integrity vulnerabilities:
- **Species Adulteration & Substitution:** Counterfeit or misidentified wild weeds blended into commercial raw materials (e.g., wild solanaceous roots sold as *Withania somnifera*).
- **Non-Therapeutic Plant Parts:** Submitting foliage or stem waste when the Ayurvedic Pharmacopoeia of India (API) stipulates rhizomes or roots.
- **Evidence Backdating & Tampering:** Paper certificates and harvest manifests vulnerable to forgery.
- **Batch Blending Opacity:** High-volume manufacturers blend dozens of harvest lots without maintaining consumer-verifiable multi-batch lineage.

### The HerbTrace Solution
HerbTrace preserves an immutable, decentralized audit trail for every herb batch:
```
Wild Collector / Farmer
        ↓
Field Harvest & Geo-tagging
        ↓
🌱 Botanical Consistency Validator
        ↓
🔐 Evidence-Time Lock (SHA-256)
        ↓
⛓ Solidity Smart Contract Record
        ↓
🧪 Quality Verification (Pharmacognosy Assay)
        ↓
⚙ Chronological Processing Pipeline
        ↓
🏭 Ayurvedic Formulation Compounding
        ↓
📱 Finished Product QR Generation
        ↓
🔗 Consumer Traceability & Batch Genealogy Graph
```

---

## 🌟 Key Architectural Pillars & 3 New Core Features

### 1. 🌱 Botanical Consistency Validator
A rules-based software validation engine aligned with the **Ayurvedic Pharmacopoeia of India (API)**:
- Evaluates submitted **Botanical Name**, **Common Name**, **Plant Family**, and **Plant Part** in real time.
- Categorizes submissions into:
  - `Consistent`: Fully coherent taxonomic and pharmacopoeial match (e.g., *Withania somnifera* + *Root*).
  - `Warning`: Suspicious or non-standard parts (e.g., *Azadirachta indica* + *Root Tuber* instead of leaves/bark/seeds).
  - `Requires Verification`: Unrecognized combinations triggering mandatory laboratory pharmacognosy review.
- Persists validation results on-chain and in MongoDB with confidence scores (0–100%) and rule versions (`v2.4-AYUSH-AYUR`).

### 2. 🔐 Evidence-Time Lock
- Field harvest photos, soil certifications, and laboratory chromatography sheets are sealed immediately upon capture.
- Generates a sequential Evidence ID (e.g., `EV-HT-00001`), timestamp, and **SHA-256 cryptographic digest**.
- Preserves original capture time and prevents silent tampering.
- Employs non-destructive versioning (`v1.0`, `v2.0`) if supporting records are amended, referencing previous hashes.

### 3. 🔗 Batch Genealogy Graph
- Interactive **Directed Acyclic Graph (DAG)** visualization built in React.
- Illustrates how multiple independent farm harvest batches merge into complex compounded formulations:
  ```
  Farmer 1 ──> Batch HT-001 (Ashwagandha) ──┐
                                            ├──> Formulation F-001 ──> Product P-001 ──> Consumer QR
  Farmer 2 ──> Batch HT-002 (Turmeric)   ──┘
  ```
- Features:
  - Smooth pan and zoom controls (40% to 220%).
  - Color-coded node classifications (`Farmer`, `Batch`, `Quality`, `Processing`, `Formulation`, `Product`, `Consumer`).
  - Interactive click-to-inspect floating drawer revealing active marker assay, moisture %, and transaction hashes.

---

## 👥 User Roles & RBAC System

| Role | Responsibilities | Key Capabilities |
| :--- | :--- | :--- |
| **Admin** | System Governance | User approval/rejection desk, global audit logs, blockchain ledger monitoring, all batch records. |
| **Farmer / Wild Collector** | Primary Harvesting | Batch registration, real-time botanical validator preview, GPS coordinate capture, evidence upload. |
| **Quality Inspector** | Pharmacognosy Verification | Review submitted lots, enter pharmacopoeia parameters (moisture, foreign matter, ash, assay), approve/reject on blockchain. |
| **Processor** | Primary Processing | Record chronological stages (*Cleaning*, *Sorting*, *Drying*, *Grinding*, *Extraction*, *Storage*), record net weight before/after. |
| **Manufacturer** | Compounding & Packaging | Select verified batches, create formulation, specify ingredient ratios, generate product ID & printable QR codes. |
| **Consumer** | Public Verification | **No login required**. Scan product QR code to access `/trace/:productId` with public-safe provenance and DAG genealogy graph. |

---

## 🛠 Technology Stack

- **Frontend:** React.js, Tailwind CSS, Vite, Lucide Icons, Leaflet / React-Leaflet, QRCode.react.
- **Backend:** Node.js, Express.js, Mongoose, Multer, Bcrypt.js, JsonWebToken, Crypto.
- **Database:** MongoDB (Local or Atlas).
- **Blockchain:** Solidity `0.8.20`, Hardhat Development Environment, ethers.js `v6`.
- **Maps:** Leaflet + OpenStreetMap (100% free, no paid API keys required).

---

## 📜 Smart Contract (`HerbTrace.sol`)

The smart contract is written in Solidity `0.8.20` and deployed via Hardhat:
- **Contract Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Core Functions:**
  - `registerBatch(string batchId, string botanicalHash, uint256 timestamp, string locationHash, string evidenceHash)`
  - `approveBatch(string batchId, string inspectorNotes, string qualityHash)`
  - `rejectBatch(string batchId, string rejectionReason)`
  - `addProcessingEvent(string batchId, string stage, string method, uint256 quantityAfter, string evidenceHash)`
  - `createFormulation(string productId, string formulationId, string[] ingredientBatchIds, string metadataHash)`
  - `addEvidenceHash(string batchId, string evidenceId, string sha256Hash)`
  - `verifyBatch(string batchId)`
  - `getProductFormulation(string productId)`
- **Events Emitted:** `BatchRegistered`, `BatchApproved`, `BatchRejected`, `ProcessingAdded`, `EvidenceLocked`, `FormulationCreated`.

---

## 📁 Project Structure

```
HerbTrace/
├── blockchain/
│   ├── contracts/
│   │   └── HerbTrace.sol            # Solidity Smart Contract
│   ├── scripts/
│   │   └── deploy.js                # Hardhat deployment script (exports ABI to server)
│   ├── test/
│   │   └── HerbTrace.test.js        # Hardhat unit tests (6 passing tests)
│   ├── hardhat.config.js            # Hardhat configuration (Solidity 0.8.20)
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── contractDeployment.json  # Deployed contract ABI & address
│   ├── controllers/
│   │   ├── authController.js        # JWT register, login, profile
│   │   ├── batchController.js       # Herb batch creation & retrieval
│   │   ├── qualityController.js     # Pharmacopoeia approval & rejection
│   │   ├── processingController.js  # Processing timeline stages
│   │   ├── formulationController.js # Multi-batch formulation compounding
│   │   ├── productController.js     # Finished product & QR data
│   │   ├── evidenceController.js    # Evidence upload & time-locking
│   │   ├── botanicalController.js   # Botanical validator API
│   │   ├── adminController.js       # Admin stats, user approvals, audit logs
│   │   └── publicController.js      # Consumer traceability & genealogy graph
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification & approval guard
│   │   ├── roleMiddleware.js        # Role-based access control (RBAC)
│   │   ├── uploadMiddleware.js      # Multer file storage
│   │   └── errorHandler.js          # Centralized error handler
│   ├── models/
│   │   ├── User.js, HerbBatch.js, Evidence.js, QualityInspection.js
│   │   ├── ProcessingEvent.js, Formulation.js, Product.js, BlockchainRecord.js, AuditLog.js
│   ├── services/
│   │   ├── blockchainService.js     # Ethers.js bridge with live node & dev ledger fallback
│   │   ├── botanicalValidatorService.js # Botanical consistency validator rules engine
│   │   ├── evidenceLockService.js   # SHA-256 time-locking & integrity verifier
│   │   └── auditService.js          # Centralized audit trail logger
│   ├── utils/
│   │   ├── botanicalDictionary.js   # Ayurvedic Pharmacopoeia database
│   │   └── seedData.js              # Complete database seeder script
│   ├── server.js                    # Express app entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx, Footer.jsx, Sidebar.jsx
│   │   │   ├── BotanicalValidatorWidget.jsx # Botanical Consistency UI
│   │   │   ├── EvidenceTimeLockCard.jsx     # Evidence-Time Lock UI
│   │   │   ├── BatchGenealogyGraph.jsx      # Interactive DAG Genealogy Graph
│   │   │   ├── TraceTimeline.jsx            # Chronological Vertical Timeline
│   │   │   ├── BlockchainBadge.jsx          # Blockchain Verification Badge & Modal
│   │   │   ├── MapViewer.jsx                # Leaflet OpenStreetMap Harvest Marker
│   │   │   ├── LocationPicker.jsx           # Geolocation API GPS Capture + Presets
│   │   │   └── QrModal.jsx                  # Downloadable & Printable QR Modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx              # Auth state & 1-click demo switcher
│   │   ├── layouts/
│   │   │   ├── PublicLayout.jsx, DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx              # Hero, 7-step journey, innovation cards
│   │   │   ├── AboutPage.jsx                # Ayurvedic standards & architecture
│   │   │   ├── TraceabilityPage.jsx         # Consumer public trace & certificate
│   │   │   ├── QrScannerPage.jsx            # QR scanner & code verification
│   │   │   ├── LoginPage.jsx                # Login with 1-click demo accounts
│   │   │   ├── RegisterPage.jsx             # Farmer & wild collector signup
│   │   │   ├── UnauthorizedPage.jsx         # RBAC access boundary page
│   │   │   ├── admin/AdminDashboard.jsx     # Admin governance console
│   │   │   ├── farmer/FarmerDashboard.jsx   # Farmer harvest desk
│   │   │   ├── inspector/InspectorDashboard.jsx # Quality inspector desk
│   │   │   ├── processor/ProcessorDashboard.jsx # Processing pipeline desk
│   │   │   └── manufacturer/ManufacturerDashboard.jsx # Formulation & QR desk
│   │   ├── services/api.js                  # Axios instance with JWT interceptor
│   │   ├── App.jsx, main.jsx, index.css
│   ├── package.json, vite.config.js, index.html
│
├── .env.example
├── .env
├── package.json
└── README.md
```

---

## 🚀 Installation & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 2. Environment Variables Setup
Copy the template `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Default configuration:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/herbtrace
JWT_SECRET=herbtrace_ayurvedic_botanical_secure_jwt_token_2026_xyz
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
AUTO_APPROVE_USERS=false
```

### 3. Install Dependencies
```bash
# Root
npm install

# Server dependencies
cd server && npm install

# Client dependencies
cd ../client && npm install

# Blockchain dependencies
cd ../blockchain && npm install
cd ..
```

### 4. Smart Contract Compilation & Testing
```bash
cd blockchain
npx hardhat compile
npx hardhat test
cd ..
```
*(All 6 unit tests verify batch registration, quality approval, rejection, processing stages, and formulation linking.)*

### 5. Seed Database
Populates the database with realistic demo users, 5 Ayurvedic herb batches, locked evidence, quality inspections, processing pipelines, formulations, finished products, and on-chain records:
```bash
npm run seed
```

### 6. Start the Servers
You can launch backend and frontend concurrently or in separate terminals:

**Terminal 1 — Backend API Server:**
```bash
npm run server
# Runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 — React Client:**
```bash
npm run client
# Runs on http://localhost:5173
```

**Optional: Terminal 3 — Local Hardhat Blockchain Node:**
```bash
npm run blockchain
# Local EVM running on http://127.0.0.1:8545
```
*(If the Hardhat node is not started, the application automatically uses its Development Blockchain Ledger with genuine SHA-256 state anchors without crashing.)*

---

## 🔑 Pre-Seeded Demo Credentials

On the login page (`/login`) or landing page, click any role button for **1-click instant login**:

| Role | Email | Password | Pre-Seeded Context |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@herbtrace.com` | `admin123` | National Regulatory Council Director |
| **Farmer** | `farmer@herbtrace.com` | `farmer123` | Organic Cultivator (Neemuch, MP) |
| **Wild Collector** | `collector@herbtrace.com` | `collector123` | Forest Harvester (Mandsaur, MP) |
| **Quality Inspector** | `inspector@herbtrace.com` | `inspector123` | Pharmacognosist (NMPB Haridwar) |
| **Processor** | `processor@herbtrace.com` | `processor123` | Processing Facility Lead (Haridwar) |
| **Manufacturer** | `manufacturer@herbtrace.com` | `manufacturer123` | AyurVeda Botanicals GMP Facility |

---

## 🧪 REST API Documentation

### Authentication
- `POST /api/auth/register` — Register a new farmer/collector account (defaults to `pending`).
- `POST /api/auth/login` — Login user with email & password, returns JWT token.
- `GET /api/auth/me` — Retrieve profile of authenticated user.

### Batches
- `POST /api/batches` — Create new herb batch, execute botanical validator, lock evidence, and record on blockchain.
- `GET /api/batches` — Retrieve batches (role-filtered: farmers see only their batches; inspectors/admins see all).
- `GET /api/batches/:batchId` — Retrieve single batch with geo-coordinates and evidence locks.

### Quality Inspection
- `GET /api/quality/pending` — Get batches awaiting inspection.
- `POST /api/quality/:batchId/approve` — Approve batch with pharmacopoeial assay parameters and seal on blockchain.
- `POST /api/quality/:batchId/reject` — Reject batch with mandatory reason and seal on blockchain.
- `GET /api/quality/history` — Get inspection logs.

### Processing Pipeline
- `GET /api/processing/ready` — Retrieve batches eligible for processing (`APPROVED` or `PROCESSING`).
- `POST /api/processing` — Record chronological stage (`Cleaning`, `Drying`, `Grinding`, `Extraction`, etc.) with net quantity updates.
- `GET /api/processing/:batchId` — Get processing history for a specific batch.

### Formulations & Products
- `POST /api/formulations` — Compounding multiple ingredient batches into finished formulation and product.
- `GET /api/formulations` — List formulations.
- `GET /api/products` — List finished products.
- `GET /api/products/:id` — Get product details and QR payload.

### Public Consumer Traceability
- `GET /api/public/trace/:productId` — Public consumer endpoint returning safe botanical origins, vertical timeline, evidence hashes, blockchain proof, and interactive genealogy DAG graph.

---

## ✅ Final Acceptance Checklist

- [x] Admin Login & Governance Dashboard
- [x] Farmer & Wild Collector Registration & Login
- [x] Quality Inspector Desk & Pharmacognosy Verification
- [x] Processing Unit Workspace & Multi-Stage Chronological Logging
- [x] Manufacturer Formulation Desk & Multi-Batch Binding
- [x] Consumer Public Traceability Page (`/trace/:productId`)
- [x] **🌱 Core Feature 1: Botanical Consistency Validator**
- [x] **🔐 Core Feature 2: Evidence-Time Lock (SHA-256)**
- [x] **🔗 Core Feature 3: Interactive Batch Genealogy Graph**
- [x] Leaflet OpenStreetMap Geotagging & Browser GPS Capture
- [x] Solidity Smart Contract (`HerbTrace.sol`) with Hardhat & Ethers.js
- [x] Downloadable & Printable QR Code Generation
- [x] Audit Trail Logging & System Metrics
- [x] Realistic Sample Database Seeder (5 Batches, Formulations, Products)
