const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  updateProductQR,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.get("/", protect, getProducts);
router.get("/:id", getProductById);
router.put("/:id/qr", protect, authorize("manufacturer", "admin"), updateProductQR);

module.exports = router;
