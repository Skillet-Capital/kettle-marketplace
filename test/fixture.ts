// test/fixture.ts
// This file is used to deploy the Kettle contract and the test currencies and assets
// It is used to create a fixture for the tests

import { 
  ethers, 
  upgrades,
  tracer
} from "hardhat";

import { 
  KettleMarketplace__factory as Kettle__factory,
  TestERC20__factory, 
  TestERC721__factory 
} from "../typechain-types";

export async function deployKettle() {
  const [
    owner, 
    feeRecipient, 
    redemptionSigner, 
    redemptionWallet, 
    offerManager, 
    ...accounts
  ] = await ethers.getSigners();

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
  const _collection = await ethers.deployContract("TestERC721");
  const _collection2 = await ethers.deployContract("TestERC721");

  // Initialize contracts
  const kettle = Kettle__factory.connect(await _kettle.getAddress(), owner);
  const currency = TestERC20__factory.connect(await _currency.getAddress(), owner);
  const currency2 = TestERC20__factory.connect(await _currency2.getAddress(), owner);
  const collection = TestERC721__factory.connect(await _collection.getAddress(), owner);
  const collection2 = TestERC721__factory.connect(await _collection2.getAddress(), owner);

  // set tracer
  tracer.nameTags[await _kettle.getAddress()] = "Kettle";
  tracer.nameTags[await _currency.getAddress()] = "Currency";
  tracer.nameTags[await _currency2.getAddress()] = "Currency2";
  tracer.nameTags[await _collection.getAddress()] = "Collection";
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
    currency, 
    currency2, 
    collection, 
    collection2 
  };
}
