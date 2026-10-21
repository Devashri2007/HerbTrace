const express = require("express");
const router = express.Router();
const {
  createFormulation,
  getFormulations,
  getFormulationById,
} = require("../controllers/formulationController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.use(protect);

router.post("/", authorize("manufacturer", "admin"), createFormulation);
router.get("/", getFormulations);
router.get("/:id", getFormulationById);

module.exports = router;
