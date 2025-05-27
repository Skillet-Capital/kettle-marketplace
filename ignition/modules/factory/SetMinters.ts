import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleAssetFactoryModule from "./KettleAssetFactory";
import { toUtf8Bytes, keccak256 } from "ethers";
import { config } from "../config.ts";
import { formatId } from "../formatId.ts";

const SetMintersModule = buildModule(formatId("SetMinters"), (m) => {
  const { factory } = m.useModule(KettleAssetFactoryModule)

  const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE")); 

  m.call(factory, "setRole", [MINTER_ROLE, config.MINTER, true], { id: "factory_set_minter_1" });
  m.call(factory, "setRole", [MINTER_ROLE, "0x0991b98108D60CD2199e8A8882d765B8508c4F05", true], { id: "factory_set_minter_2" });

  return { factory };
});

export default SetMintersModule;
