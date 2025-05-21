import { time, loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { parseUnits, Signer, ZeroAddress } from "ethers";

import { KettleAsset, TestERC20, TestERC721 } from "../typechain-types"; 

import { KettleMarketplace } from "../typechain-types";

import { deployKettle } from "./fixture";
import { Kettle, randomSalt, Side, Criteria } from "../src";
import { executeCreateSteps, executeTakeSteps } from "./utils";

describe("Fulfill Ask", function () {
  let _kettle: KettleMarketplace;
  let kettle: Kettle;

  let buyer: Signer;
  let seller: Signer;
  let redemptionAdmin: Signer;
  let redemptionWallet: Signer;
  let recipient: Signer;

  let collection: KettleAsset;
  let currency: TestERC20;

  beforeEach(async () => {
    const fixture = await loadFixture(deployKettle);
    _kettle = fixture.kettle;
    redemptionAdmin = fixture.redemptionSigner as unknown as Signer;
    redemptionWallet = fixture.redemptionWallet as unknown as Signer;
    buyer = fixture.accounts[0] as unknown as Signer;
    seller = fixture.accounts[1] as unknown as Signer;
    recipient = fixture.feeRecipient as unknown as Signer;
    collection = fixture.collection;
    currency = fixture.currency;

    kettle = new Kettle(seller, await _kettle.getAddress());
  });

  describe("should take an ask", () => {
    let tokenId: number;
    let amount: bigint;
    let fee: bigint;

    beforeEach(async () => {
      tokenId = 1;
      amount = parseUnits("100", 18);
      fee = 100n;

      await collection.mint(seller, tokenId);
      await currency.mint(buyer, amount);
    });

    it("should take an ask", async () => {
      const _seller = await kettle.connect(seller);
      const { offer, signature } = await _seller.createMarketOffer({
        side: Side.ASK,
        identifier: tokenId,
        collection,
        currency,
        amount,
        fee,
        recipient,
        expiration: await time.latest() + 1000,
        salt: randomSalt()
      }, seller).then((steps) => executeCreateSteps(seller, steps));

      const _buyer = await kettle.connect(buyer);
      const steps = await _buyer.takeMarketOffer({
        offer,
        signature
      }, buyer);

      await executeTakeSteps(buyer, steps);

      expect(await collection.ownerOf(tokenId)).to.equal(buyer);

      const feeAmount = kettle.mulFee(offer.terms.amount, offer.fee.rate);
      expect(await currency.balanceOf(recipient)).to.equal(feeAmount);
      expect(await currency.balanceOf(seller)).to.equal(amount - feeAmount);
  
      expect(await _kettle.cancelledOrFulfilled(offer.maker, offer.salt)).to.equal(1);
    });
  });

  describe("should take a bid", () => {
    let tokenId: number;
    let amount: bigint;
    let fee: bigint;

    beforeEach(async () => {
      tokenId = 1;
      amount = parseUnits("100", 18);
      fee = 100n;

      await collection.mint(seller, tokenId);
      await currency.mint(buyer, amount); 
    });

    it("should take a bid", async () => {
      const _buyer = await kettle.connect(buyer);
      const { offer, signature } = await _buyer.createMarketOffer({
        side: Side.BID,
        identifier: tokenId,
        collection,
        currency,
        amount,
        fee,
        recipient,
        expiration: await time.latest() + 1000,
        salt: randomSalt()
      }, buyer).then((steps) => executeCreateSteps(buyer, steps));

      const _seller = await kettle.connect(seller);
      const steps = await _seller.takeMarketOffer({
        tokenId,
        offer,
        signature
      }, seller);

      await executeTakeSteps(seller, steps);

      expect(await collection.ownerOf(tokenId)).to.equal(buyer);

      const feeAmount = kettle.mulFee(offer.terms.amount, offer.fee.rate);
      expect(await currency.balanceOf(recipient)).to.equal(feeAmount);
      expect(await currency.balanceOf(seller)).to.equal(amount - feeAmount);

      expect(await _kettle.cancelledOrFulfilled(offer.maker, offer.salt)).to.equal(1);
    });
  });

  describe("should redeem a charge", () => {
    let tokenId: number;
    let amount: bigint;

    beforeEach(async () => {
      tokenId = 1;
      amount = parseUnits("100", 18);

      await collection.mint(seller, tokenId);
      await currency.mint(seller, amount);
    });

    it("should redeem a token", async () => {
      const admin = await kettle.connect(redemptionAdmin);
      const signStep = await admin.createRedemptionCharge(
        {
          redeemer: seller,
          collection,
          tokenId,
          currency,
          amount,
          expiration: await time.latest() + 1000,
        }
      );

      const { charge, signature } = await signStep.sign(redemptionAdmin);

      const _seller = await kettle.connect(seller);
      const steps = await _seller.redeem(charge, signature);

      await executeTakeSteps(seller, steps);

      expect(await collection.ownerOf(tokenId)).to.equal(redemptionWallet);
      expect(await currency.balanceOf(redemptionWallet)).to.equal(amount);  
    });

    it("should redeem a token (no charge)", async () => {
      const admin = await kettle.connect(redemptionAdmin);
      const signStep = await admin.createRedemptionCharge(
        {
          redeemer: seller,
          collection,
          tokenId,
          currency,
          amount: 0n,
          expiration: await time.latest() + 1000,
        }
      );

      const { charge, signature } = await signStep.sign(redemptionAdmin);

      const _seller = await kettle.connect(seller);
      const steps = await _seller.redeem(charge, signature);

      await executeTakeSteps(seller, steps);

      expect(await collection.ownerOf(tokenId)).to.equal(redemptionWallet);
      expect(await currency.balanceOf(redemptionWallet)).to.equal(0n);  
    });
  });
});
