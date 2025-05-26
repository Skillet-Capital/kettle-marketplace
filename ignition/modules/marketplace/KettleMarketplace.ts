import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { config } from "../config";
import { formatId } from "../formatId";

const KettleMarketplaceModule = buildModule(formatId("KettleMarketplace"), (m) => {
  const owner = m.getAccount(0);

  const implementation = m.contract(
    "KettleMarketplace", 
    [], 
    { id: "marketplace_implementation" }
  );
  
  const proxy = m.contract("TransparentUpgradeableProxy", [
    implementation,
    owner,
    "0x",
  ], { id: "marketplace_proxy" });

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin",
    { id: "marketplace_proxy_admin_changed" }
  );

  const proxyAdmin = m.contractAt(
    "ProxyAdmin", 
    proxyAdminAddress, 
    { id: "marketplace_proxy_admin" }
  );

  const kettle = m.contractAt(
    "KettleMarketplace", 
    proxy, 
    { id: "marketplace_contract" }
  );

  m.call(kettle, "__Kettle_init", [
    owner,
    config.REDEMPTION_SIGNER,
    config.REDEMPTION_WALLET,
    config.OFFER_MANAGER
  ], { id: "marketplace_init" });

  return { proxy, proxyAdmin, kettle };
});

export default KettleMarketplaceModule;
