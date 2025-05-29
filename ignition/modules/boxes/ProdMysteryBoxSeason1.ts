import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";

import MysteryBoxRegistryModule from "./MysteryBoxRegistry.ts";
import KettleAssetFactoryModule from "../factory/KettleAssetFactory.ts";
import { keccak256 } from "ethers/crypto";
import { parseUnits, toUtf8Bytes } from "ethers";

const ENTROPY_ADDRESS = "0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320";
const PAYMENT_CURRENCY = "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce";
const PAYMENT_RECIPIENT = "0xe3a7e4ad7bd8f34ae7e478814b51d0ba4a8cbc3c";

const ProdMysteryBoxSeason1 = buildModule(formatId("ProdMysteryBoxSeason1"), (m) => {
  const { registry } = m.useModule(MysteryBoxRegistryModule);
  const { factory } = m.useModule(KettleAssetFactoryModule);

  const mysteryBox = m.contract("MysteryBoxV2", [
    registry,
    factory,
    ENTROPY_ADDRESS,
    "Mystery Box Season 1",
    "MBS1"
  ], { id: "mystery_box_season_1" });

  const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));  
  m.call(factory, "setRole", [MINTER_ROLE, mysteryBox, true], { id: "set_minter_role_mystery_box_season_1" });

  m.call(registry, "registerMysteryBox", [mysteryBox], { id: "register_mystery_box_season_1" });

  return { mysteryBox };
});

const ProdMysteryBoxSeason1Initialize = buildModule(formatId("ProdMysteryBoxSeason1Initialize"), (m) => {

  const { mysteryBox } = m.useModule(ProdMysteryBoxSeason1);

  m.call(mysteryBox, "initialize", [
    25,
    parseUnits("10000", 18),
    PAYMENT_CURRENCY,
    PAYMENT_RECIPIENT,
    1748534400,
    1748620800,
  ], { id: "initialize_mystery_box_season_1" });

  // m.call(mysteryBox, "setWhitelistStatusBatch", [["0x106637f4df98522dd8b6791ca3ecc4cff5fc9961", "0x3ebabb4da024d3346e0b42fc16c6e64fc5212870"], true], { id: "set_whitelist_status_mystery_box_season_1" });

  return { mysteryBox };
});

export default ProdMysteryBoxSeason1Initialize;
