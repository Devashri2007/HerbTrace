const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(morgan("dev"));

// Static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "HerbTrace API Engine",
    time: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Mount Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/batches", require("./routes/batchRoutes"));
app.use("/api/quality", require("./routes/qualityRoutes"));
app.use("/api/processing", require("./routes/processingRoutes"));
app.use("/api/formulations", require("./routes/formulationRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/evidence", require("./routes/evidenceRoutes"));
app.use("/api/botanical", require("./routes/botanicalRoutes"));
app.use("/api/blockchain", require("./routes/blockchainRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/public", require("./routes/publicRoutes"));

// Error Handling Middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌿 HerbTrace Backend Server Running on Port: ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});

module.exports = app;
