const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HerbTrace Contract", function () {
  let herbTrace;
  let admin, farmer, inspector, processor, manufacturer;

  beforeEach(async function () {
    [admin, farmer, inspector, processor, manufacturer] = await ethers.getSigners();
    const HerbTrace = await ethers.getContractFactory("HerbTrace");
    herbTrace = await HerbTrace.deploy();
    await herbTrace.waitForDeployment();
  });

  it("Should set the deployer as admin", async function () {
    expect(await herbTrace.admin()).to.equal(admin.address);
  });

  it("Should register a new batch and emit BatchRegistered event", async function () {
    const batchId = "HT-2026-000001";
    const botanicalHash = "0xbotanicalhash123";
    const timestamp = Math.floor(Date.now() / 1000);
    const locationHash = "0xlocationhash456";
    const evidenceHash = "0xevidencehash789";

    await expect(
      herbTrace.connect(farmer).registerBatch(batchId, botanicalHash, timestamp, locationHash, evidenceHash)
    )
      .to.emit(herbTrace, "BatchRegistered")
      .withArgs(batchId, botanicalHash, farmer.address, (val) => val > 0);

    const result = await herbTrace.verifyBatch(batchId);
    expect(result.exists).to.be.true;
    expect(result.botanicalHash).to.equal(botanicalHash);
    expect(result.registeredBy).to.equal(farmer.address);
  });

  it("Should approve a batch during quality inspection", async function () {
    const batchId = "HT-2026-000002";
    await herbTrace.connect(farmer).registerBatch(batchId, "hash1", Math.floor(Date.now() / 1000), "loc1", "evi1");

    await expect(
      herbTrace.connect(inspector).approveBatch(batchId, "Meets pharmacopoeia standard", "0xqualityparamshash")
    )
      .to.emit(herbTrace, "BatchApproved")
      .withArgs(batchId, inspector.address, (val) => val > 0);

    const b = await herbTrace.verifyBatch(batchId);
    expect(b.status).to.equal(3); // APPROVED enum index
  });

  it("Should reject a batch with reason", async function () {
    const batchId = "HT-2026-000003";
    await herbTrace.connect(farmer).registerBatch(batchId, "hash2", Math.floor(Date.now() / 1000), "loc2", "evi2");

    await expect(
      herbTrace.connect(inspector).rejectBatch(batchId, "High moisture content > 14%")
    )
      .to.emit(herbTrace, "BatchRejected")
      .withArgs(batchId, "High moisture content > 14%", inspector.address, (val) => val > 0);

    const b = await herbTrace.verifyBatch(batchId);
    expect(b.status).to.equal(7); // REJECTED enum index
  });

  it("Should add processing stage event", async function () {
    const batchId = "HT-2026-000004";
    await herbTrace.connect(farmer).registerBatch(batchId, "hash3", Math.floor(Date.now() / 1000), "loc3", "evi3");
    await herbTrace.connect(inspector).approveBatch(batchId, "Approved for drying", "paramHash");

    await expect(
      herbTrace.connect(processor).addProcessingEvent(batchId, "Solar Drying", "Controlled greenhouse solar tunnel", 90, "0xdryingevihash")
    )
      .to.emit(herbTrace, "ProcessingAdded")
      .withArgs(batchId, "Solar Drying", processor.address, (val) => val > 0);

    const history = await herbTrace.getProcessingHistory(batchId);
    expect(history.length).to.equal(1);
    expect(history[0].stage).to.equal("Solar Drying");
  });

  it("Should link batches into a manufacturer formulation", async function () {
    const batchId1 = "HT-2026-000005";
    const batchId2 = "HT-2026-000006";

    await herbTrace.connect(farmer).registerBatch(batchId1, "hash4", Math.floor(Date.now() / 1000), "loc4", "evi4");
    await herbTrace.connect(farmer).registerBatch(batchId2, "hash5", Math.floor(Date.now() / 1000), "loc5", "evi5");

    await herbTrace.connect(inspector).approveBatch(batchId1, "OK", "p1");
    await herbTrace.connect(inspector).approveBatch(batchId2, "OK", "p2");

    const productId = "PROD-AYUR-001";
    const formulationId = "FORM-ASHWA-001";

    await expect(
      herbTrace.connect(manufacturer).createFormulation(productId, formulationId, [batchId1, batchId2], "0xmeta")
    )
      .to.emit(herbTrace, "FormulationCreated")
      .withArgs(productId, formulationId, manufacturer.address, (val) => val > 0);

    const form = await herbTrace.getProductFormulation(productId);
    expect(form.formulationId).to.equal(formulationId);
    expect(form.ingredientBatchIds.length).to.equal(2);
  });
});
