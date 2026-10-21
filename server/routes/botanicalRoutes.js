const express = require("express");
const router = express.Router();
const {
  validateBotanical,
  getBotanicalDictionary,
  getBatchBotanical,
} = require("../controllers/botanicalController");

router.post("/validate", validateBotanical);
router.get("/dictionary", getBotanicalDictionary);
router.get("/:batchId", getBatchBotanical);

module.exports = router;
