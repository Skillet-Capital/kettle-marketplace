import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import KettleAssetFactoryModule from "./KettleAssetFactory";
import KettleMarketplaceModule from "../marketplace/KettleMarketplace";
import { formatId } from "../formatId.ts";

const SetOperatorsModule = buildModule(formatId("SetOperators"), (m) => {
  const { factory } = m.useModule(KettleAssetFactoryModule)
  const { kettle } = m.useModule(KettleMarketplaceModule)

  m.call(factory, "approveOperator", [kettle, true], { id: "factory_set_operator_1" });

  return { factory };
});

export default SetOperatorsModule;
