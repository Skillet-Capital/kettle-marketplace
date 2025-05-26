// test/fixture.ts
// This file is used to deploy the Kettle contract and the test currencies and assets
// It is used to create a fixture for the tests

import { 
  ethers, 
  upgrades,
  tracer
} from "hardhat";

import { 
  KettleAssetFactory__factory,
  KettleAsset__factory,
  KettleMarketplace__factory as Kettle__factory,
  TestERC20__factory, 
  TestERC721__factory 
} from "../typechain-types";

import { hexlify, Signer } from "ethers";
import { randomBytes } from "crypto";
import { computeCreate2Address } from "./utils";
import { ModelFactory } from "../src/Factory";

export async function deployKettle() {
  const [
    owner, 
    feeRecipient, 
    redemptionSigner, 
    redemptionWallet, 
    offerManager, 
    ...accounts
  ] = await ethers.getSigners();

  // Deploy Kettle Asset Implementation
  const KettleAsset = await ethers.getContractFactory("KettleAsset");
  const implementation = await KettleAsset.deploy();

  // Deploy KettleAsset
  const KettleAssetFactory = await ethers.getContractFactory("KettleAssetFactory");
  const factory = await upgrades.deployProxy(KettleAssetFactory, [
    await owner.getAddress(),
    await implementation.getAddress()
  ], { initializer: "initialize" });

  const Factory = new ModelFactory(owner as unknown as Signer, await factory.getAddress()); 

  // get beacon address
  const beacon = await Factory.getBeaconAddress();

  const salt = hexlify(randomBytes(32));
  const address = Factory.getModelAddress({
    salt,
    beaconAddress: beacon
  });
  await Factory.deployModel({
    address,
    salt,
    brand: "Test",
    model: "Test",
    reference: "Test"
  }, owner as unknown as Signer);

  const kettleAsset = KettleAsset__factory.connect(address, owner);

  // Deploy Kettle
  const Kettle = await ethers.getContractFactory("KettleMarketplace");
  const _kettle = await upgrades.deployProxy(Kettle, [
    await owner.getAddress(),
    await redemptionSigner.getAddress(),
    await redemptionWallet.getAddress(),
    await offerManager.getAddress()
  ], { initializer: "__Kettle_init" });

  // Deploy test currencies and assets
  const _currency = await ethers.deployContract("TestERC20", [18]);
  const _currency2 = await ethers.deployContract("TestERC20", [18]);
  const _collection2 = await ethers.deployContract("TestERC721");

  // Initialize contracts
  const _factory = KettleAssetFactory__factory.connect(await factory.getAddress(), owner); 
  const kettle = Kettle__factory.connect(await _kettle.getAddress(), owner);
  const currency = TestERC20__factory.connect(await _currency.getAddress(), owner);
  const currency2 = TestERC20__factory.connect(await _currency2.getAddress(), owner);
  const collection = KettleAsset__factory.connect(await kettleAsset.getAddress(), owner);
  const collection2 = TestERC721__factory.connect(await _collection2.getAddress(), owner);

  // Approve operator for KettleAsset
  await factory.approveOperator(await _kettle.getAddress(), true);

  // set tracer
  tracer.nameTags[await _kettle.getAddress()] = "Kettle";
  tracer.nameTags[await _currency.getAddress()] = "Currency";
  tracer.nameTags[await _currency2.getAddress()] = "Currency2";
  tracer.nameTags[await kettleAsset.getAddress()] = "KettleAsset";
  tracer.nameTags[await _collection2.getAddress()] = "Collection2";
  tracer.nameTags[await owner.getAddress()] = "Owner";
  tracer.nameTags[await feeRecipient.getAddress()] = "FeeRecipient";
  tracer.nameTags[await redemptionSigner.getAddress()] = "RedemptionSigner";
  tracer.nameTags[await redemptionWallet.getAddress()] = "RedemptionWallet";
  tracer.nameTags[await offerManager.getAddress()] = "OfferManager";

  return { 
    owner, 
    accounts, 
    feeRecipient, 
    redemptionSigner, 
    redemptionWallet, 
    offerManager, 
    kettle,
    factory: _factory,
    currency, 
    currency2, 
    collection, 
    collection2 
  };
}
