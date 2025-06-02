import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";

import MysteryBoxRegistryModule from "./MysteryBoxRegistry.ts";
import KettleAssetFactoryModule from "../factory/KettleAssetFactory.ts";
import { keccak256 } from "ethers/crypto";
import { parseUnits, toUtf8Bytes } from "ethers";

const ENTROPY_ADDRESS = "0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320";
const PAYMENT_CURRENCY = "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce";
const PAYMENT_RECIPIENT = "0xe3a7e4ad7bd8f34ae7e478814b51d0ba4a8cbc3c";

const MysteryBoxSeason1TestRevealModule = buildModule(formatId("MysteryBoxSeason1TestReveal"), (m) => {
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

const MysteryBoxSeason1TestRevealInitializeModule = buildModule(formatId("MysteryBoxSeason1TestRevealInitialize"), (m) => {

  const { mysteryBox } = m.useModule(MysteryBoxSeason1TestRevealModule);

  m.call(mysteryBox, "initialize", [
    25,
    parseUnits("1", 18),
    PAYMENT_CURRENCY,
    PAYMENT_RECIPIENT,
    0,
    1748477100,
  ], { id: "initialize_mystery_box_season_1" });

  const prizes = [{
    "identifier": "0x68df9e5ad031760a5c722b6a2545d03ef7e3ac70/3581790904",
    "address": "0x68df9e5ad031760a5c722b6a2545d03ef7e3ac70",
    "tokenId": "3581790904"
  },{
    "identifier": "0x5167b71405b5ddd489eba79a249f258ef9cef514/1623046631",
    "address": "0x5167b71405b5ddd489eba79a249f258ef9cef514",
    "tokenId": "1623046631"
  },{
    "identifier": "0x0e1939fbc437ffc73526de904104e046a8a6a8b6/1596081223",
    "address": "0x0e1939fbc437ffc73526de904104e046a8a6a8b6",
    "tokenId": "1596081223"
  },{
    "identifier": "0xa8751a2ad2abe326295c9f1b20cfa772d78f935a/2060070390",
    "address": "0xa8751a2ad2abe326295c9f1b20cfa772d78f935a",
    "tokenId": "2060070390"
  },{
    "identifier": "0xa8751a2ad2abe326295c9f1b20cfa772d78f935a/3911467322",
    "address": "0xa8751a2ad2abe326295c9f1b20cfa772d78f935a",
    "tokenId": "3911467322"
  },{
    "identifier": "0x7c07553a16c3e960a82740507e884a5f863dc8ab/794306487",
    "address": "0x7c07553a16c3e960a82740507e884a5f863dc8ab",
    "tokenId": "794306487"
  },{
    "identifier": "0x7c07553a16c3e960a82740507e884a5f863dc8ab/1016409823",
    "address": "0x7c07553a16c3e960a82740507e884a5f863dc8ab",
    "tokenId": "1016409823"
  },{
    "identifier": "0xc5230fb3b4140da96f90185e0ba01b971fec11c3/2715135122",
    "address": "0xc5230fb3b4140da96f90185e0ba01b971fec11c3",
    "tokenId": "2715135122"
  },{
    "identifier": "0xc5230fb3b4140da96f90185e0ba01b971fec11c3/2099596338",
    "address": "0xc5230fb3b4140da96f90185e0ba01b971fec11c3",
    "tokenId": "2099596338"
  },{
    "identifier": "0xac15a204d3131dbb8d76c60e18cf9adec35430b7/842477962",
    "address": "0xac15a204d3131dbb8d76c60e18cf9adec35430b7",
    "tokenId": "842477962"
  },{
    "identifier": "0xac15a204d3131dbb8d76c60e18cf9adec35430b7/3036926392",
    "address": "0xac15a204d3131dbb8d76c60e18cf9adec35430b7",
    "tokenId": "3036926392"
  },{
    "identifier": "0xba550835e39092ef38dac4205c93b4b0e15313d9/3957663333",
    "address": "0xba550835e39092ef38dac4205c93b4b0e15313d9",
    "tokenId": "3957663333"
  },{
    "identifier": "0xba550835e39092ef38dac4205c93b4b0e15313d9/4280711995",
    "address": "0xba550835e39092ef38dac4205c93b4b0e15313d9",
    "tokenId": "4280711995"
  },{
    "identifier": "0xba550835e39092ef38dac4205c93b4b0e15313d9/3319366550",
    "address": "0xba550835e39092ef38dac4205c93b4b0e15313d9",
    "tokenId": "3319366550"
  },{
    "identifier": "0x5329071b2e275cc37dbb59f55002e3785bd3d4da/3205053147",
    "address": "0x5329071b2e275cc37dbb59f55002e3785bd3d4da",
    "tokenId": "3205053147"
  },{
    "identifier": "0x5329071b2e275cc37dbb59f55002e3785bd3d4da/4198561928",
    "address": "0x5329071b2e275cc37dbb59f55002e3785bd3d4da",
    "tokenId": "4198561928"
  },{
    "identifier": "0xe9264cb4f1bb8c2f7099d1d1479cd266ec7c8ceb/3984887449",
    "address": "0xe9264cb4f1bb8c2f7099d1d1479cd266ec7c8ceb",
    "tokenId": "3984887449"
  },{
    "identifier": "0x61e3f6786c2de0f18dc3150e2fab9fb110df1e64/3662852802",
    "address": "0x61e3f6786c2de0f18dc3150e2fab9fb110df1e64",
    "tokenId": "3662852802"
  },{
    "identifier": "0x61e3f6786c2de0f18dc3150e2fab9fb110df1e64/933226101",
    "address": "0x61e3f6786c2de0f18dc3150e2fab9fb110df1e64",
    "tokenId": "933226101"
  },{
    "identifier": "0x686cbe0b3c334bb99dadd79850f72e60d9b00d20/3478604430",
    "address": "0x686cbe0b3c334bb99dadd79850f72e60d9b00d20",
    "tokenId": "3478604430"
  },{
    "identifier": "0x686cbe0b3c334bb99dadd79850f72e60d9b00d20/4066481423",
    "address": "0x686cbe0b3c334bb99dadd79850f72e60d9b00d20",
    "tokenId": "4066481423"
  },{
    "identifier": "0x686cbe0b3c334bb99dadd79850f72e60d9b00d20/3406911413",
    "address": "0x686cbe0b3c334bb99dadd79850f72e60d9b00d20",
    "tokenId": "3406911413"
  },{
    "identifier": "0x6be4528af74c6a7646e9fb7ac618051c3ea1d1c3/2883664546",
    "address": "0x6be4528af74c6a7646e9fb7ac618051c3ea1d1c3",
    "tokenId": "2883664546"
  },{
    "identifier": "0x6be4528af74c6a7646e9fb7ac618051c3ea1d1c3/385314910",
    "address": "0x6be4528af74c6a7646e9fb7ac618051c3ea1d1c3",
    "tokenId": "385314910"
  },{
    "identifier": "0x6be4528af74c6a7646e9fb7ac618051c3ea1d1c3/880815326",
    "address": "0x6be4528af74c6a7646e9fb7ac618051c3ea1d1c3",
    "tokenId": "880815326"
  }]

  m.call(mysteryBox, "setPrizes", [prizes.map(p => ({
    collection: p.address,
    tokenId: p.tokenId
  }))], { id: "set_prizes_mystery_box_season_1" });

  m.call(mysteryBox, "entropyRequest", [keccak256(toUtf8Bytes("MYSTERY_BOX_SEASON_1"))], { id: "entropy_request_mystery_box_season_1", value: parseUnits("0.1", 18) });

  m.call(mysteryBox, "shuffleBoxes", [], { id: "shuffle_boxes_mystery_box_season_1" });

  return { mysteryBox };
});

export default MysteryBoxSeason1TestRevealInitializeModule;
