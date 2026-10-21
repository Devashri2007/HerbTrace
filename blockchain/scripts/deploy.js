const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying HerbTrace Smart Contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const HerbTrace = await hre.ethers.getContractFactory("HerbTrace");
  const herbTrace = await HerbTrace.deploy();
  await herbTrace.waitForDeployment();

  const contractAddress = await herbTrace.getAddress();
  console.log("HerbTrace deployed successfully to:", contractAddress);

  // Save deployed address and ABI to server config
  const contractArtifact = await hre.artifacts.readArtifact("HerbTrace");
  const deploymentData = {
    address: contractAddress,
    network: hre.network.name,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    abi: contractArtifact.abi,
  };

  const outputDir = path.join(__dirname, "../../server/config");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "contractDeployment.json");
  fs.writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2));
  console.log("Saved deployment configuration to:", outputPath);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
