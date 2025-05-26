import { OfferWithSignature, SignStep, SendStep, StepAction } from "../src";
import hre from "hardhat";
import { Signer } from "ethers";
import { keccak256, getAddress } from "ethers";
import { KettleAsset__factory } from "../typechain-types";

export const DAY_SECONDS = 60 * 60 * 24;

export async function executeCreateSteps(signer: Signer, steps: (SignStep | SendStep)[]): Promise<OfferWithSignature> {
  let output: OfferWithSignature | null = null;
  for (const step of steps) {
    if (step.action === StepAction.SEND) {
      await step.send(signer);
    } else if (step.action === StepAction.SIGN) {
      output = await step.sign(signer);
    }
  }

  const { offer, signature } = output || {};

  if (!offer || !signature) {
    throw new Error("Offer not created");
  }

  return { offer, signature };
}

export async function executeTakeSteps(signer: Signer, steps: (SignStep | SendStep)[]): Promise<string> {
  let txnHash: string | null = null;
  for (const step of steps) {
    if (step.action === StepAction.SEND) {
      if (step.type.startsWith("take") || step.type.startsWith("escrow") || step.type.startsWith("redeem") || step.type.endsWith("escrow")) {
        txnHash = await step.send(signer);
      } else {
        await step.send(signer);
      }
    }
  }

  if (!txnHash) {
    throw new Error("Offer not taken");
  }

  return txnHash;
}

export async function computeCreate2Address(factoryAddress: string, beaconAddress: string, salt: string): Promise<string> {

  const deployerAddressFormatted = factoryAddress.toLowerCase().replace(/^0x/, '');
  const saltFormatted = salt.toLowerCase().replace(/^0x/, '').padStart(64, '0');

  const BeaconProxy = await hre.ethers.getContractFactory("BeaconProxy");
  const abiCoder = hre.ethers.AbiCoder.defaultAbiCoder();

  const initializeData = KettleAsset__factory.createInterface().encodeFunctionData("initialize", [factoryAddress]);

  const constructorArgs = abiCoder.encode(
    ["address", "bytes"],
    [beaconAddress, initializeData]
  );

  const bytecode = hre.ethers.solidityPacked(
    ["bytes", "bytes"],
    [BeaconProxy.bytecode, constructorArgs]
  );

  const initCodeHash = keccak256(bytecode);

  const data = `0xff${deployerAddressFormatted}${saltFormatted}${initCodeHash.slice(2)}`;
  const create2Hash = keccak256(data);

  const create2Address = `0x${create2Hash.slice(-40)}`;
  return getAddress(create2Address).toLowerCase();
}
