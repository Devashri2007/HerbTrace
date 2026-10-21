const BotanicalValidatorService = require("../services/botanicalValidatorService");
const { BOTANICAL_DICTIONARY } = require("../utils/botanicalDictionary");
const HerbBatch = require("../models/HerbBatch");

/**
 * Run real-time botanical consistency check
 */
const validateBotanical = async (req, res) => {
  const { botanicalName, commonName, plantFamily, plantPart, variety } = req.body;
  const result = BotanicalValidatorService.validate({
    botanicalName,
    commonName,
    plantFamily,
    plantPart,
    variety,
  });

  res.json({
    success: true,
    result,
  });
};

/**
 * Get full botanical reference dictionary for autocomplete and reference
 */
const getBotanicalDictionary = (req, res) => {
  res.json({
    success: true,
    count: BOTANICAL_DICTIONARY.length,
    dictionary: BOTANICAL_DICTIONARY,
  });
};

/**
 * Get botanical validation record for a batch
 */
const getBatchBotanical = async (req, res, next) => {
  try {
    const { batchId } = req.params;
    const batch = await HerbBatch.findOne({ batchId });

    if (!batch) {
      return res.status(404).json({ success: false, message: "Batch not found" });
    }

    res.json({
      success: true,
      batchId,
      botanicalName: batch.botanicalName,
      commonName: batch.commonName,
      plantFamily: batch.plantFamily,
      plantPart: batch.plantPart,
      consistencyValidation: batch.consistencyValidation,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  validateBotanical,
  getBotanicalDictionary,
  getBatchBotanical,
};
