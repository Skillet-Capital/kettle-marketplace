import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const KettleAssetModule = buildModule("KettleAsset", (m) => {
  const owner = m.getAccount(0);

  const implementation = m.contract("KettleAsset", [], { id: "KettleAssetImplementation" });
  
  const results: Record<string, any> = {}
  for (const env of ["DEV", "PROD"]) {
    const proxy = m.contract("TransparentUpgradeableProxy", [
      implementation,
      owner,
      "0x",
    ], { id: `${env}_kettle_asset_proxy` });

    const proxyAdminAddress = m.readEventArgument(
      proxy,
      "AdminChanged",
      "newAdmin",
      { id: `${env}_kettle_asset_proxy_admin_changed` }
    );

    const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress, { id: `${env}_kettle_asset_proxy_admin` });

    const asset = m.contractAt("KettleAsset", proxy, { id: `${env}_kettle_asset` });

    m.call(asset, "initialize", [
      owner,
    ], { id: `${env}_kettle_asset_init` });

    results[env] = {
      asset: asset,
      proxy,
      proxyAdmin
    }
  }

  return results;
});

export default KettleAssetModule;
