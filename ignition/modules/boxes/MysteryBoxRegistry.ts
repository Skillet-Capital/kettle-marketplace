import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";

const MysteryBoxRegistryModule = buildModule(formatId("MysteryBoxRegistry"), (m) => {
  const registry = m.contract("MysteryBoxRegistry", [], { id: "registry" });

  return { registry };
});

export default MysteryBoxRegistryModule;
