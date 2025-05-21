import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

interface Config {
  REDEMPTION_SIGNER: string;
  REDEMPTION_WALLET: string;
  OFFER_MANAGER: string;
}

const config: Record<string, Config> = {
  PROD: {
    REDEMPTION_SIGNER: "0x5b090b3c859a475644353c3596c2b92ae98c6006",
    REDEMPTION_WALLET: "0x630aa3ff3f3d5b9ebea9bef30016778a7d3f6436",
    OFFER_MANAGER: "0x4f0b4fab88f7864dc200f43b11303b99bdda4f78"
  },
  DEV: {
    REDEMPTION_SIGNER: "0x00BDaaDb9DdF3800703725A71c97069495915191",
    REDEMPTION_WALLET: "0x0cFe2D2beEe2fA2D653d1Dd253231648794dD2a8",
    OFFER_MANAGER: "0xf2A3d3a6aE80059B517B2735786cF86b46725C56"
  }
}

const KettleMarketplaceModule = buildModule("KettleMarketplace", (m) => {
  const owner = m.getAccount(0);

  const implementation = m.contract("KettleMarketplace", [], { id: "KettleImplementation" });
  
  const results: Record<string, any> = {}
  for (const [env, params] of Object.entries(config)) {
    const proxy = m.contract("TransparentUpgradeableProxy", [
      implementation,
      owner,
      "0x",
    ], { id: `${env}_kettle_proxy` });

    const proxyAdminAddress = m.readEventArgument(
      proxy,
      "AdminChanged",
      "newAdmin",
      { id: `${env}_proxy_admin_changed` }
    );

    const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress, { id: `${env}_proxy_admin` });

    const kettle = m.contractAt("KettleMarketplace", proxy, { id: `${env}_kettle` });

    m.call(kettle, "__Kettle_init", [
      owner,
      params.REDEMPTION_SIGNER,
      params.REDEMPTION_WALLET,
      params.OFFER_MANAGER
    ], { id: `${env}_kettle_init` });

    results[env] = {
      marketplace: kettle,
      proxy,
      proxyAdmin
    }
  }

  return results;
});

export default KettleMarketplaceModule;
