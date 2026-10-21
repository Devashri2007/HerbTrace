const Product = require("../models/Product");
const Formulation = require("../models/Formulation");

/**
 * Get all products
 */
const getProducts = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user && req.user.role === "manufacturer") {
      filter.manufacturerId = req.user._id;
    }

    const products = await Product.find(filter)
      .populate("manufacturerId", "name email organization")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single product by productId
 */
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ productId: id }).populate(
      "manufacturerId",
      "name email organization"
    );

    if (!product) {
      return res.status(404).json({ success: false, message: `Product ${id} not found` });
    }

    const formulation = await Formulation.findOne({ productId: id });

    res.json({
      success: true,
      product,
      formulation,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Save / Update QR code data URL
 */
const updateProductQR = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { qrCodeDataUrl } = req.body;

    const product = await Product.findOneAndUpdate(
      { productId: id },
      { $set: { qrCodeDataUrl } },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  updateProductQR,
};
