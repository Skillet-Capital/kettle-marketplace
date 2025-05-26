import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { formatId } from "../formatId.ts";

const KettleVolumeTrackerModule = buildModule(formatId("KettleVolumeTracker"), (m) => {
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

  const tracker = m.contractAt(
    "KettleVolumeTracker", 
    proxy,
    { id: "tracker_contract" }
  );

  m.call(tracker, "initialize", 
    [owner, "KettleVolumeTracker", "KVOL"], 
    { id: "tracker_initialize" }
  );

  return { proxy, proxyAdmin, tracker };
});

export default KettleVolumeTrackerModule;
