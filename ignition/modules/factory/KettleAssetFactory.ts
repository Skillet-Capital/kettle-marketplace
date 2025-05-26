import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";

const KettleAssetFactoryModule = buildModule(formatId("KettleAssetFactory"), (m) => {
  const owner = m.getAccount(0);

  const factoryImplementation = m.contract(
    "KettleAssetFactory", 
    [], 
    { id: "factory_implementation" }
  );

  const proxy = m.contract("TransparentUpgradeableProxy", [
    factoryImplementation,
    owner,
    "0x"
  ], { id: "factory_proxy" });

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin",
    { id: "factory_proxy_admin_changed" }
  );

  const proxyAdmin = m.contractAt(
    "ProxyAdmin", 
    proxyAdminAddress, 
    { id: "factory_proxy_admin" }
  );

  const factory = m.contractAt("KettleAssetFactory", proxy);

  const assetImplementation = m.contract(
    "KettleAsset", 
    [], 
    { id: "asset_implementation" }
  );

  m.call(
    factory, 
    "initialize", 
    [owner, assetImplementation], 
    { id: "factory_initialize" }
  );

  return { proxy, proxyAdmin, factory };
});

export default KettleAssetFactoryModule;
