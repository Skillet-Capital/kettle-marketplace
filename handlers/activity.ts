import { Address, BigInt } from "@graphprotocol/graph-ts";

import {
  MarketOfferTaken,
  Redemption as RedemptionEvent,
  RedemptionSignerUpdated,
  RedemptionWalletUpdated,
  OfferManagerUpdated
} from "../generated/KettleMarketplace/KettleMarketplace";

import {
  Activity,
  RedemptionSignerUpdate,
  RedemptionWalletUpdate,
  OfferManagerUpdate,
  Redemption
} from "../generated/schema";

import {
  Side,
  ActivityType
} from "./types";

export function formatCollateralId(collection: Address, tokenId: BigInt): string {
  return [collection.toHexString(), tokenId.toString()].join("/");
}

export function handleMarketOfferTaken(event: MarketOfferTaken): void {
  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = event.params.offer.side == Side.BID 
    ? ActivityType.BID_TAKEN 
    : ActivityType.ASK_TAKEN;

  activity.buyer = event.params.offer.side == Side.BID
    ? event.params.offer.maker
    : event.params.taker;

  activity.seller = event.params.offer.side == Side.BID
    ? event.params.taker
    : event.params.offer.maker;

  activity.collateralId = formatCollateralId(event.params.offer.collateral.collection, event.params.tokenId);
  activity.collection = event.params.offer.collateral.collection;
  activity.tokenId = event.params.tokenId;
  activity.currency = event.params.offer.terms.currency;
  activity.amount = event.params.offer.terms.amount;
  activity.timestamp = event.block.timestamp;
  activity.txn = event.transaction.hash;
  activity.save();
}

export function handleRedemption(event: RedemptionEvent): void {

  // store redemption
  const redemption = new Redemption(event.params.hash.toHexString());
  redemption.redemptionHash = event.params.hash;
  redemption.redeemer = event.params.charge.redeemer;
  redemption.collection = event.params.charge.collection;
  redemption.tokenId = event.params.charge.tokenId;
  redemption.currency = event.params.charge.currency;
  redemption.amount = event.params.charge.amount;
  redemption.timestamp = event.block.timestamp;
  redemption.collateralId = formatCollateralId(event.params.charge.collection, event.params.charge.tokenId);
  redemption.save();

  // store activity
  const activity = new Activity(event.transaction.hash.concatI32(event.logIndex.toI32()));
  activity.type = ActivityType.REDEMPTION;
  activity.buyer = Address.fromString("0x0000000000000000000000000000000000000000");
  activity.seller = event.params.charge.redeemer;
  activity.collateralId = formatCollateralId(event.params.charge.collection, event.params.charge.tokenId);
  activity.collection = event.params.charge.collection;
  activity.tokenId = event.params.charge.tokenId;
  activity.currency = event.params.charge.currency;
  activity.amount = event.params.charge.amount;
  activity.timestamp = event.block.timestamp;
  activity.txn = event.transaction.hash;
  activity.save();
}

// ====================================
//           Admin Updates
// ====================================

export function handleRedemptionSignerUpdated(event: RedemptionSignerUpdated): void {
  const update = new RedemptionSignerUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.signer;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleRedemptionWalletUpdated(event: RedemptionWalletUpdated): void {
  const update = new RedemptionWalletUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.wallet;
  update.timestamp = event.block.timestamp;
  update.save();
}

export function handleOfferManagerUpdated(event: OfferManagerUpdated): void {
  const update = new OfferManagerUpdate(event.transaction.hash.concatI32(event.logIndex.toI32()));

  update.address = event.params.manager;
  update.timestamp = event.block.timestamp;
  update.save();
}
