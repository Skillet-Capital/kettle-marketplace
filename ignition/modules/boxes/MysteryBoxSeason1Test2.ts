import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";

import MysteryBoxRegistryModule from "./MysteryBoxRegistry.ts";
import KettleAssetFactoryModule from "../factory/KettleAssetFactory.ts";
import { keccak256 } from "ethers/crypto";
import { parseUnits, toUtf8Bytes } from "ethers";

const ENTROPY_ADDRESS = "0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320";
const PAYMENT_CURRENCY = "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce";
const PAYMENT_RECIPIENT = "0xe3a7e4ad7bd8f34ae7e478814b51d0ba4a8cbc3c";

const MysteryBoxSeason1Test2Module = buildModule(formatId("MysteryBoxSeason1Test2"), (m) => {
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

const MysteryBoxSeason1Test2InitializeModule = buildModule(formatId("MysteryBoxSeason1Test2Initialize"), (m) => {

  const { mysteryBox } = m.useModule(MysteryBoxSeason1Test2Module);

  m.call(mysteryBox, "initialize", [
    25,
    parseUnits("5", 18),
    PAYMENT_CURRENCY,
    PAYMENT_RECIPIENT,
    1748451054,
    1748451654,
  ], { id: "initialize_mystery_box_season_1" });

  m.call(mysteryBox, "setWhitelistStatusBatch", [["0x106637f4df98522dd8b6791ca3ecc4cff5fc9961", "0x3ebabb4da024d3346e0b42fc16c6e64fc5212870"], true], { id: "set_whitelist_status_mystery_box_season_1" });

  const prizes = [
    {
      collection: '0x119456a02f5fd28b74835a51c712c6585938b06c',
      tokenId: '588744070'
    },
    {
      collection: '0xf516d43dbe2591e3707b58bb81fc6b5d8c27c574',
      tokenId: '4198721275'
    },
    {
      collection: '0x736d3d9a6e1a0b3883bbbff1af9b3c7846de69ff',
      tokenId: '4121950533'
    },
    {
      collection: '0xdd4adcc77328130a59cd574f6ee2be31d989a839',
      tokenId: '3097991528'
    },
    {
      collection: '0x0166162730d01d081bd2befd0423b8f0fa7382fb',
      tokenId: '1672778875'
    },
    {
      collection: '0x119456a02f5fd28b74835a51c712c6585938b06c',
      tokenId: '3195762411'
    },
    {
      collection: '0xf516d43dbe2591e3707b58bb81fc6b5d8c27c574',
      tokenId: '2166873841'
    },
    {
      collection: '0x736d3d9a6e1a0b3883bbbff1af9b3c7846de69ff',
      tokenId: '2316749743'
    },
    {
      collection: '0xdd4adcc77328130a59cd574f6ee2be31d989a839',
      tokenId: '3931714463'
    },
    {
      collection: '0x0166162730d01d081bd2befd0423b8f0fa7382fb',
      tokenId: '1086088190'
    },
    {
      collection: '0x119456a02f5fd28b74835a51c712c6585938b06c',
      tokenId: '2919551622'
    },
    {
      collection: '0xf516d43dbe2591e3707b58bb81fc6b5d8c27c574',
      tokenId: '2414217575'
    },
    {
      collection: '0x736d3d9a6e1a0b3883bbbff1af9b3c7846de69ff',
      tokenId: '878551211'
    },
    {
      collection: '0xdd4adcc77328130a59cd574f6ee2be31d989a839',
      tokenId: '3779040110'
    },
    {
      collection: '0x0166162730d01d081bd2befd0423b8f0fa7382fb',
      tokenId: '3510388396'
    },
    {
      collection: '0x119456a02f5fd28b74835a51c712c6585938b06c',
      tokenId: '2806874587'
    },
    {
      collection: '0xf516d43dbe2591e3707b58bb81fc6b5d8c27c574',
      tokenId: '264914923'
    },
    {
      collection: '0x736d3d9a6e1a0b3883bbbff1af9b3c7846de69ff',
      tokenId: '1387531216'
    },
    {
      collection: '0xdd4adcc77328130a59cd574f6ee2be31d989a839',
      tokenId: '3941485934'
    },
    {
      collection: '0x0166162730d01d081bd2befd0423b8f0fa7382fb',
      tokenId: '150053745'
    },
    {
      collection: '0x119456a02f5fd28b74835a51c712c6585938b06c',
      tokenId: '199640063'
    },
    {
      collection: '0xf516d43dbe2591e3707b58bb81fc6b5d8c27c574',
      tokenId: '2073852599'
    },
    {
      collection: '0x736d3d9a6e1a0b3883bbbff1af9b3c7846de69ff',
      tokenId: '4119529063'
    },
    {
      collection: '0xdd4adcc77328130a59cd574f6ee2be31d989a839',
      tokenId: '837302818'
    },
    {
      collection: '0x0166162730d01d081bd2befd0423b8f0fa7382fb',
      tokenId: '4005578340'
    }
  ]

  m.call(mysteryBox, "setPrizes", [prizes], { id: "set_prizes_mystery_box_season_1" });

  m.call(mysteryBox, "entropyRequest", [keccak256(toUtf8Bytes("MYSTERY_BOX_TEST"))], { id: "entropy_request_mystery_box_season_1", value: parseUnits("0.1", 18) });

  m.call(mysteryBox, "shuffleBoxes", [], { id: "shuffle_boxes_mystery_box_season_1" });

  return { mysteryBox };
});

export default MysteryBoxSeason1Test2InitializeModule;
