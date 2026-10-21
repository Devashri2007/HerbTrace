const { BOTANICAL_DICTIONARY } = require("../utils/botanicalDictionary");

/**
 * 🌱 Botanical Consistency Validator Engine
 * Validates whether entered botanical name, family, common name, and plant part
 * form a coherent and legitimate combination according to Ayurvedic Pharmacopoeia records.
 *
 * NOTE: This is a software-based consistency and integrity validation system,
 * not a laboratory chemical identification.
 */
class BotanicalValidatorService {
  static validate({ botanicalName, commonName, plantFamily, plantPart, variety = "" }) {
    const flags = [];
    let confidenceScore = 100;
    let validatorStatus = "Consistent";
    let validationMessage = "";

    const cleanBot = (botanicalName || "").trim().toLowerCase();
    const cleanFam = (plantFamily || "").trim().toLowerCase();
    const cleanPart = (plantPart || "").trim().toLowerCase();
    const cleanCommon = (commonName || "").trim().toLowerCase();

    // 1. Search botanical dictionary for exact or fuzzy match
    const matchedEntry = BOTANICAL_DICTIONARY.find((item) => {
      const matchName = item.botanicalName.toLowerCase() === cleanBot;
      const matchCommon = item.commonNames.some((c) => c.toLowerCase() === cleanCommon);
      return matchName || matchCommon;
    });

    if (!matchedEntry) {
      // Herb is not in known Ayurvedic pharmacopoeia dictionary
      validatorStatus = "Requires Verification";
      confidenceScore = 40;
      validationMessage = `Botanical name "${botanicalName}" and common name "${commonName}" were not identified in the AYUSH reference library. Manual quality verifier inspection is required.`;
      flags.push("HERB_NOT_IN_STANDARDIZED_DB");
      flags.push("MANUAL_PHARMACOGNOSY_REQUIRED");

      return {
        validatorStatus,
        validationMessage,
        confidenceScore,
        flags,
        matchedHerb: null,
        validatedAt: new Date(),
        validatedBy: "HerbTrace Botanical AI Rules Engine",
        validationRulesVersion: "v2.4-AYUSH-AYUR",
      };
    }

    // 2. Validate Family Consistency
    const expectedFamily = matchedEntry.family.toLowerCase();
    const familyMatches = cleanFam.includes(expectedFamily) || expectedFamily.includes(cleanFam);

    if (!familyMatches && cleanFam.length > 0) {
      flags.push(`FAMILY_MISMATCH: Entered family "${plantFamily}" differs from standard family "${matchedEntry.family}".`);
      confidenceScore -= 30;
      validatorStatus = "Warning";
    }

    // 3. Validate Common Name Consistency
    const commonMatches = matchedEntry.commonNames.some(
      (c) => c.toLowerCase() === cleanCommon || cleanCommon.includes(c.toLowerCase())
    );
    if (!commonMatches && cleanCommon.length > 0) {
      flags.push(`VERNACULAR_MISMATCH: Common name "${commonName}" is not among recognized Ayurvedic synonyms: ${matchedEntry.commonNames.join(", ")}.`);
      confidenceScore -= 15;
    }

    // 4. Validate Plant Part Consistency
    const partMatchesAccepted = matchedEntry.acceptedParts.some((p) =>
      cleanPart.includes(p.toLowerCase()) || p.toLowerCase().includes(cleanPart)
    );
    const partMatchesUnacceptable = (matchedEntry.unacceptableParts || []).some((p) =>
      cleanPart.includes(p.toLowerCase()) || p.toLowerCase().includes(cleanPart)
    );

    if (partMatchesUnacceptable) {
      flags.push(`SUSPICIOUS_PLANT_PART: "${plantPart}" is rarely or never used as the officinal therapeutic part for ${matchedEntry.botanicalName}. Standard Ayurvedic parts are: ${matchedEntry.acceptedParts.join(", ")}.`);
      confidenceScore -= 45;
      validatorStatus = "Warning";
    } else if (!partMatchesAccepted) {
      flags.push(`NON_STANDARD_PART: "${plantPart}" is not in the primary Ayurvedic Pharmacopoeia list (${matchedEntry.acceptedParts.join(", ")}).`);
      confidenceScore -= 25;
      if (validatorStatus !== "Requires Verification") {
        validatorStatus = "Warning";
      }
    }

    // 5. Final status synthesis
    if (confidenceScore >= 80 && validatorStatus !== "Warning") {
      validatorStatus = "Consistent";
      validationMessage = `✓ Botanical taxonomy and plant part (${plantPart}) are completely consistent with Ayurvedic Pharmacopoeia of India (API) standards for ${matchedEntry.botanicalName} (${matchedEntry.family}). Active marker expected: ${matchedEntry.activePhytochemicalMarker}.`;
    } else if (confidenceScore >= 50) {
      validatorStatus = "Warning";
      validationMessage = `⚠ Botanical Consistency Warning: Discrepancies detected in plant part or taxonomy (${flags.join("; ")}). Quality Inspector attention required before processing.`;
    } else {
      validatorStatus = "Requires Verification";
      validationMessage = `⚠ High Botanical Risk: Multiple significant inconsistencies found between botanical identity and submitted part (${flags.join("; ")}). Batch flagged for mandatory laboratory review.`;
    }

    return {
      validatorStatus,
      validationMessage,
      confidenceScore: Math.max(confidenceScore, 10),
      flags,
      matchedHerb: {
        botanicalName: matchedEntry.botanicalName,
        commonNames: matchedEntry.commonNames,
        family: matchedEntry.family,
        acceptedParts: matchedEntry.acceptedParts,
        activePhytochemicalMarker: matchedEntry.activePhytochemicalMarker,
        standardHarvestSeason: matchedEntry.standardHarvestSeason,
        typicalRegions: matchedEntry.typicalRegions,
      },
      validatedAt: new Date(),
      validatedBy: "HerbTrace Botanical AI Rules Engine",
      validationRulesVersion: "v2.4-AYUSH-AYUR",
    };
  }
}

module.exports = BotanicalValidatorService;
