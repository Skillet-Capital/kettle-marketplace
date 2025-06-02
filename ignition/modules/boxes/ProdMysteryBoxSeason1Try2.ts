import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";

import MysteryBoxRegistryModule from "./MysteryBoxRegistry.ts";
import KettleAssetFactoryModule from "../factory/KettleAssetFactory.ts";
import { keccak256 } from "ethers/crypto";
import { parseUnits, toUtf8Bytes } from "ethers";

const ENTROPY_ADDRESS = "0x36825bf3Fbdf5a29E2d5148bfe7Dcf7B5639e320";
const PAYMENT_CURRENCY = "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce";
const PAYMENT_RECIPIENT = "0xe3a7e4ad7bd8f34ae7e478814b51d0ba4a8cbc3c";

const ProdMysteryBoxSeason1Try2 = buildModule(formatId("ProdMysteryBoxSeason1Try2"), (m) => {
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

const ProdMysteryBoxSeason1Try2Initialize = buildModule(formatId("ProdMysteryBoxSeason1Try2Initialize"), (m) => {

  const { mysteryBox } = m.useModule(ProdMysteryBoxSeason1Try2);

  m.call(mysteryBox, "initialize", [
    25,
    parseUnits("10000", 18),
    PAYMENT_CURRENCY,
    PAYMENT_RECIPIENT,
    0,
    1748534400,
  ], { id: "initialize_mystery_box_season_1" });

  const prizes = [{
    "kettleId": "438",
    "identifier": "0x2620398236e22c48e31316e4bd1bb8641b3c2939/1340257412",
    "address": "0x2620398236e22c48e31316e4bd1bb8641b3c2939",
    "tokenId": "1340257412"
  },{
    "kettleId": "439",
    "identifier": "0x3f8207e8912bd5558a0a43328e7134aa8ebc1432/1210357530",
    "address": "0x3f8207e8912bd5558a0a43328e7134aa8ebc1432",
    "tokenId": "1210357530"
  },{
    "kettleId": "440",
    "identifier": "0x6dba63fd3c5bba330ca238380efd6f05c2334fcb/2570095296",
    "address": "0x6dba63fd3c5bba330ca238380efd6f05c2334fcb",
    "tokenId": "2570095296"
  },{
    "kettleId": "441",
    "identifier": "0x6dba63fd3c5bba330ca238380efd6f05c2334fcb/1174662445",
    "address": "0xece379b41f4865a0aa7dc0bfbfb46f73134e72b3",
    "tokenId": "1174662445"
  },{
    "kettleId": "442",
    "identifier": "0x6dba63fd3c5bba330ca238380efd6f05c2334fcb/3958274960",
    "address": "0xece379b41f4865a0aa7dc0bfbfb46f73134e72b3",
    "tokenId": "3958274960"
  },{
    "kettleId": "443",
    "identifier": "0x58c77838c1d95bd039ed236b52bd1327572d5939/3151845272",
    "address": "0x58c77838c1d95bd039ed236b52bd1327572d5939",
    "tokenId": "3151845272"
  },{
    "kettleId": "444",
    "identifier": "0x58c77838c1d95bd039ed236b52bd1327572d5939/3002881358",
    "address": "0x58c77838c1d95bd039ed236b52bd1327572d5939",
    "tokenId": "3002881358"
  },{
    "kettleId": "445",
    "identifier": "0x8906c063e691c3fb2c679d5e7b1088d860b51957/2559622989",
    "address": "0x8906c063e691c3fb2c679d5e7b1088d860b51957",
    "tokenId": "2559622989"
  },{
    "kettleId": "446",
    "identifier": "0x8906c063e691c3fb2c679d5e7b1088d860b51957/2835382231",
    "address": "0x8906c063e691c3fb2c679d5e7b1088d860b51957",
    "tokenId": "2835382231"
  },{
    "kettleId": "447",
    "identifier": "0x6d40d81766cc2aa06410e89868cac46415fe4e94/3984817202",
    "address": "0x6d40d81766cc2aa06410e89868cac46415fe4e94",
    "tokenId": "3984817202"
  },{
    "kettleId": "448",
    "identifier": "0x6d40d81766cc2aa06410e89868cac46415fe4e94/1753845195",
    "address": "0x6d40d81766cc2aa06410e89868cac46415fe4e94",
    "tokenId": "1753845195"
  },{
    "kettleId": "449",
    "identifier": "0xf2db632b66e09d81c463b762bc006f00b7c16463/2177256686",
    "address": "0xf2db632b66e09d81c463b762bc006f00b7c16463",
    "tokenId": "2177256686"
  },{
    "kettleId": "450",
    "identifier": "0xf2db632b66e09d81c463b762bc006f00b7c16463/434262067",
    "address": "0xf2db632b66e09d81c463b762bc006f00b7c16463",
    "tokenId": "434262067"
  },{
    "kettleId": "451",
    "identifier": "0xf2db632b66e09d81c463b762bc006f00b7c16463/935383929",
    "address": "0xf2db632b66e09d81c463b762bc006f00b7c16463",
    "tokenId": "935383929"
  },{
    "kettleId": "452",
    "identifier": "0x09e418edb6f8a101ba77653ffd7c3375c9826cb2/129410018",
    "address": "0x09e418edb6f8a101ba77653ffd7c3375c9826cb2",
    "tokenId": "129410018"
  },{
    "kettleId": "453",
    "identifier": "0x09e418edb6f8a101ba77653ffd7c3375c9826cb2/3648431502",
    "address": "0x09e418edb6f8a101ba77653ffd7c3375c9826cb2",
    "tokenId": "3648431502"
  },{
    "kettleId": "454",
    "identifier": "0x360dc9b04caae2f4c2f28da62b0cbf8170b004d3/856325454",
    "address": "0x360dc9b04caae2f4c2f28da62b0cbf8170b004d3",
    "tokenId": "856325454"
  },{
    "kettleId": "455",
    "identifier": "0x897d20108e3f8080ae28d9d1f70e98f856be162b/1087132157",
    "address": "0x897d20108e3f8080ae28d9d1f70e98f856be162b",
    "tokenId": "1087132157"
  },{
    "kettleId": "456",
    "identifier": "0x897d20108e3f8080ae28d9d1f70e98f856be162b/3502645315",
    "address": "0x897d20108e3f8080ae28d9d1f70e98f856be162b",
    "tokenId": "3502645315"
  },{
    "kettleId": "457",
    "identifier": "0xf2d01bec090c46b099f7326e558bcbbeb0f150d0/3259539407",
    "address": "0xf2d01bec090c46b099f7326e558bcbbeb0f150d0",
    "tokenId": "3259539407"
  },{
    "kettleId": "458",
    "identifier": "0xf2d01bec090c46b099f7326e558bcbbeb0f150d0/504707329",
    "address": "0xf2d01bec090c46b099f7326e558bcbbeb0f150d0",
    "tokenId": "504707329"
  },{
    "kettleId": "459",
    "identifier": "0xf2d01bec090c46b099f7326e558bcbbeb0f150d0/123445656",
    "address": "0xf2d01bec090c46b099f7326e558bcbbeb0f150d0",
    "tokenId": "123445656"
  },{
    "kettleId": "460",
    "identifier": "0x74035498ae011477357b342ab8a28467b8369805/2668714830",
    "address": "0x74035498ae011477357b342ab8a28467b8369805",
    "tokenId": "2668714830"
  },{
    "kettleId": "461",
    "identifier": "0x74035498ae011477357b342ab8a28467b8369805/1521785445",
    "address": "0x74035498ae011477357b342ab8a28467b8369805",
    "tokenId": "1521785445"
  },{
    "kettleId": "462",
    "identifier": "0x74035498ae011477357b342ab8a28467b8369805/4153205883",
    "address": "0x74035498ae011477357b342ab8a28467b8369805",
    "tokenId": "4153205883"
  }]

  m.call(mysteryBox, "setPrizes", [prizes.map(p => ({
    collection: p.address,
    tokenId: p.tokenId
  }))], { id: "set_prizes_mystery_box_season_1" });

  return { mysteryBox };
});

export default ProdMysteryBoxSeason1Try2Initialize;
