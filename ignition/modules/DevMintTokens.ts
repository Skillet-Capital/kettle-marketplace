import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleAssetModule from "./KettleAsset";

const DevMintTokensModule = buildModule("DevMintTokens", (m) => {
  // Deploy marketplace first
  const proxy = m.contractAt("KettleAsset", "0x0aEA50e7c8D41023d628b10960BC71d089668Fc6");

  for (let i = 0; i < 25; i++) {
    m.call(proxy, "mint", [
      (i % 2 === 0) ? "0x11d351894506e13587d4e479b6c38e68891f1492" : "0x3ebabb4da024d3346e0b42fc16c6e64fc5212870",
      i + 1
    ], { id: `dev_mint_${i}` });
  }

  return { proxy }
});

export default DevMintTokensModule;
