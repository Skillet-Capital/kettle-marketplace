import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { ethers, tracer } from "hardhat";
import { keccak256, MaxUint256, parseUnits, Signer, toUtf8Bytes, ZeroAddress } from "ethers";

import { KettleAsset, KettleAsset__factory, KettleAssetFactory, MockEntropy, MockEntropy__factory, MysteryBoxRegistry, MysteryBoxRegistry__factory, MysteryBoxV1, MysteryBoxV1__factory, TestERC20, TestERC721 } from "../typechain-types"; 

import { KettleMarketplace } from "../typechain-types";

import { deployKettle } from "./fixture";
import { Kettle, randomSalt, Side, Criteria } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

describe("Mystery Box", function () {
  let owner: Signer;
  let feeRecipient: Signer;
  let payer: Signer;
  let factory: KettleAssetFactory;
  let currency: TestERC20;
  let accounts: Signer[];

  let mockEntropy: MockEntropy;
  let mysteryBox: MysteryBoxV1;
  let registry: MysteryBoxRegistry;

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    owner = fixture.owner as unknown as Signer;
    feeRecipient = fixture.feeRecipient as unknown as Signer;
    payer = fixture.accounts[0] as unknown as Signer;
    factory = fixture.factory;
    currency = fixture.currency;
    accounts = fixture.accounts.slice(1) as unknown as Signer[];

    // Deploy MockEntropy
    const MockEntropy = await ethers.getContractFactory("MockEntropy");
    const _mockEntropy = await MockEntropy.deploy();
    mockEntropy = MockEntropy__factory.connect(await _mockEntropy.getAddress(), owner);

    // Deploy Mystery Box Registry
    const _registry = await ethers.deployContract("MysteryBoxRegistry", []);
    registry = MysteryBoxRegistry__factory.connect(await _registry.getAddress(), owner);
    
    // Deploy Mystery Box
    const _mysteryBox = await ethers.deployContract("MysteryBoxV2", [
      await _registry.getAddress(),
      await factory.getAddress(),
      await mockEntropy.getAddress(),
      "Mystery Box",
      "MYSTERY"
    ]);
    mysteryBox = MysteryBoxV1__factory.connect(await _mysteryBox.getAddress(), owner);

    // Approve operator for KettleAsset
    await factory.approveOperator(await mysteryBox.getAddress(), true);
    const minterRole = keccak256(toUtf8Bytes("MINTER_ROLE"));
    await factory.setRole(minterRole, mysteryBox, true);

    // Register Mystery Box
    await registry.registerMysteryBox(await mysteryBox.getAddress());

    await currency.mint(payer, parseUnits("10000000", 18));
    await currency.connect(payer).approve(mysteryBox, MaxUint256);
    
  });

  describe("Private Mint", function () {

    let totalSupply: number;
    let price: bigint;

    let privateMintOpenTime: number;
    let publicMintOpenTime: number;
    beforeEach(async () => {

      totalSupply = 25;
      price = parseUnits("100", 18);

      privateMintOpenTime = await time.latest() + 1000;
      publicMintOpenTime = privateMintOpenTime + 1000;

      await mysteryBox.initialize(
        totalSupply, 
        price, 
        currency,
        feeRecipient,
        privateMintOpenTime,
        publicMintOpenTime
      );
    });

    it("should fail to mint before private mint open time", async () => {
      const [minter] = accounts;
      await expect(mysteryBox.connect(payer).mint(minter)).to.be.revertedWith("Minting not open yet");
    });

    it("should fail to mint if minter is not whitelisted", async () => {
      await time.increaseTo(privateMintOpenTime);
      const [minter] = accounts;
      await expect(mysteryBox.connect(payer).mint(minter)).to.be.revertedWith("Minter not whitelisted for private mint");
    });

    it("should allow the minter to mint", async () => {
      await time.increaseTo(privateMintOpenTime);
      const [minter] = accounts;

      await mysteryBox.setWhitelistStatus(minter, true);

      await mysteryBox.connect(payer).mint(minter);
      expect(await mysteryBox.ownerOf(1)).to.equal(minter);
    });

    it("should allow anyone to mint after public mint open time", async () => {
      await time.increaseTo(publicMintOpenTime);
      const [minter] = accounts;
      await mysteryBox.connect(payer).mint(minter);
      expect(await mysteryBox.ownerOf(1)).to.equal(minter);
    });
  });

  describe("Private Mint Only", function () {

    let totalSupply: number;
    let price: bigint;

    let privateMintOpenTime: number;
    let publicMintOpenTime: number;
    beforeEach(async () => {

      totalSupply = 25;
      price = parseUnits("100", 18);

      privateMintOpenTime = 0;
      publicMintOpenTime = await time.latest() + 1000;

      await mysteryBox.initialize(
        totalSupply, 
        price, 
        currency,
        feeRecipient,
        privateMintOpenTime,
        publicMintOpenTime
      );
    });

    it("should fail to mint before public mint open time", async () => {
      const [minter] = accounts;
      await expect(mysteryBox.connect(payer).mint(minter)).to.be.revertedWith("Minting not open yet");
    });

    it("should allow anyone to mint after public mint open time", async () => {
      await time.increaseTo(publicMintOpenTime);
      const [minter] = accounts;
      await mysteryBox.connect(payer).mint(minter);
      expect(await mysteryBox.ownerOf(1)).to.equal(minter);
    });
  });

  describe("Simulation", function () {

    let totalSupply: number;
    let price: bigint;

    let privateMintOpenTime: number;
    let publicMintOpenTime: number;

    let privateMinter: Signer;
    let publicMinter: Signer;

    let prizes: {
      collection: string;
      tokenId: number;
    }[]; 

    beforeEach(async () => {

      totalSupply = 25;
      price = parseUnits("100", 18);

      privateMintOpenTime = await time.latest() + 1000;
      publicMintOpenTime = privateMintOpenTime + 1000;

      await mysteryBox.initialize(
        totalSupply, 
        price, 
        currency,
        feeRecipient,
        privateMintOpenTime,
        publicMintOpenTime
      );

      privateMinter = accounts[0];
      publicMinter = accounts[1];

      // mint 10 private boxes
      await time.increaseTo(privateMintOpenTime);
      await mysteryBox.setWhitelistStatus(privateMinter, true);
      for (let i = 0; i < 10; i++) {
        await mysteryBox.connect(payer).mint(privateMinter);
      }

      // mint 15 public boxes
      await time.increaseTo(publicMintOpenTime);
      for (let i = 0; i < 15; i++) {
        await mysteryBox.connect(payer).mint(publicMinter);
      }
      
      // Deploy test collections
      const s1 = randomSalt();
      const s2 = randomSalt();
      const c1 = await factory.getModelAddress(s1);
      const c2 = await factory.getModelAddress(s2);

      await factory.deployModel(
        s1,
        "Test",
        "Test",
        "Test"
      );

      await factory.deployModel(
        s2,
        "Test",
        "Test",
        "Test"
      );

      tracer.nameTags[c1] = "Collection1";
      tracer.nameTags[c2] = "Collection2";

      const collection1 = await KettleAsset__factory.connect(c1, owner);
      const collection2 = await KettleAsset__factory.connect(c2, owner);

      const collection1Prizes = new Array(10).fill(0).map((_, i) => ({
        collection: c1,
        tokenId: i + 1
      }));

      const collection2Prizes = new Array(15).fill(0).map((_, i) => ({
        collection: c2,
        tokenId: i + 1
      }));

      await mysteryBox.setPrizes([...collection1Prizes, ...collection2Prizes]);
    });

    it("should fail to mint before public mint after sellout", async () => {
      await expect(mysteryBox.connect(payer).mint(publicMinter)).to.be.revertedWith("All boxes have been minted");
    });

    describe("Shuffle", function () {

      beforeEach(async () => {
        await mysteryBox.entropyRequest(randomSalt(), { value: parseUnits("1", 18) });
        await mockEntropy.fulfill(1, ethers.randomBytes(32));
        await mysteryBox.shuffleBoxes();
      });

      it.only("should reveal the boxes", async () => {

        const results: any[] = []
        // for (let i = 0; i < totalSupply; i++) {
        //   const owner = await mysteryBox.ownerOf(i + 1);
        //   const result = await mysteryBox.results(i + 1);
        //   const prize = await mysteryBox.prizes(result);
        //   results.push({
        //     owner,
        //     boxId: i + 1,
        //     result,
        //     collection: prize.collection,
        //     tokenId: prize.tokenId,
        //   })
        // }
        // console.table(results);

        for (let i = 0; i < 10; i++) {
          const owner = await mysteryBox.ownerOf(i + 1);
          const result = await mysteryBox.results(i + 1);
          const prize = await mysteryBox.prizes(result);
          
          await mysteryBox.connect(privateMinter).reveal(i + 1);

          const collection = await KettleAsset__factory.connect(prize.collection, privateMinter);
          expect(await collection.ownerOf(prize.tokenId)).to.equal(owner);

          results.push({
            owner,
            boxId: i + 1,
            result,
            collection: prize.collection,
            tokenId: prize.tokenId,
          })
        }

        for (let i = 10; i < 25; i++) {
          const owner = await mysteryBox.ownerOf(i + 1);
          const result = await mysteryBox.results(i + 1);
          const prize = await mysteryBox.prizes(result);
          
          await mysteryBox.connect(publicMinter).reveal(i + 1);

          const collection = await KettleAsset__factory.connect(prize.collection, publicMinter);
          expect(await collection.ownerOf(prize.tokenId)).to.equal(owner);

          results.push({
            owner,
            boxId: i + 1,
            result,
            collection: prize.collection,
            tokenId: prize.tokenId,
          })
        }

        console.table(results);
      });
    });
  });
});
