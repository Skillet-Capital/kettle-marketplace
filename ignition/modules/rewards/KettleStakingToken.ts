import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";
import { parseUnits } from "ethers";

const KettleStakingTokenModule = buildModule(formatId("KettleStakingToken"), (m) => {
  const owner = m.getAccount(0);

  const trackerImplementation = m.contract(
    "KettleVolumeTracker", 
    [], 
    { id: "tracker_implementation" }
  );

  const proxy = m.contract("TransparentUpgradeableProxy", [
    trackerImplementation,
    owner,
    "0x"
  ], { id: "tracker_proxy" });

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin",
    { id: "tracker_proxy_admin_changed" }
  );

  const proxyAdmin = m.contractAt(
    "ProxyAdmin", 
    proxyAdminAddress, 
    { id: "tracker_proxy_admin" }
  );

  const stakingToken = m.contractAt(
    "KettleStakingToken", 
    proxy,
    { id: "staking_token_contract" }
  );

  m.call(stakingToken, "initialize", 
    [owner, "KettleStakingToken", "KSTAK"], 
    { id: "staking_token_initialize" }
  );

  return { proxy, proxyAdmin, stakingToken };
});

const KettleStakingTokenInitializeModule = buildModule(formatId("KettleStakingTokenInitialize"), (m) => {
  const { stakingToken } = m.useModule(KettleStakingTokenModule);

  m.call(stakingToken, "mint", ["0xE3a7e4aD7bD8F34AE7E478814B51d0bA4A8Cbc3C", parseUnits("1", 18)], { id: "mint_staking_token" });

  return { stakingToken };
});

export default KettleStakingTokenInitializeModule;
