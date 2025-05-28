import { Address, BigInt } from "@graphprotocol/graph-ts";

import {
  BoxInitialized,
  BoxRevealed,
  BoxTracked
} from "../generated/MysteryBoxRegistry/MysteryBoxRegistry";

import {
  MysteryBox,
  MysteryBoxAccount,
  MysteryBoxAsset
} from "../generated/schema";

function fetchAccount(address: Address): MysteryBoxAccount {
  let account = MysteryBoxAccount.load(address);
  if (!account) {
    account = new MysteryBoxAccount(address);
    account.save();
  }
  return account as MysteryBoxAccount;
}

function fetchToken(address: Address, tokenId: BigInt): MysteryBoxAsset {
  let assetId = [address.toHexString(), tokenId.toString()].join("/");
  let asset = MysteryBoxAsset.load(assetId);
  if (!asset) {
    asset = new MysteryBoxAsset(assetId);
    asset.collection = address;
    asset.identifier = tokenId;
  }
  return asset as MysteryBoxAsset;
}

export function handleBoxInitialized(event: BoxInitialized): void {
  let mysteryBox = MysteryBox.load(event.params.boxContract);

  // update the mystery box
  if (mysteryBox) {
    mysteryBox.publicMintOpenTime = event.params.publicMintOpenTime;
    mysteryBox.privateMintOpenTime = event.params.privateMintOpenTime;
    mysteryBox.save();
    return;
  }

  // Initialize the mystery box
  mysteryBox = new MysteryBox(event.params.boxContract);

  mysteryBox.name = event.params.name;
  mysteryBox.symbol = event.params.symbol;
  mysteryBox.totalSupply = event.params.totalSupply;
  mysteryBox.price = event.params.price;
  mysteryBox.currency = event.params.currency;
  mysteryBox.paymentRecipient = event.params.paymentRecipient;
  mysteryBox.privateMintOpenTime = event.params.privateMintOpenTime;
  mysteryBox.publicMintOpenTime = event.params.publicMintOpenTime;
  mysteryBox.totalMinted = BigInt.fromI32(0);
  mysteryBox.save();
}

export function handleBoxTracked(event: BoxTracked): void {
  let mysteryBox = MysteryBox.load(event.params.boxContract);

  if (!mysteryBox) return;

  // update total minted
  mysteryBox.totalMinted = mysteryBox.totalMinted.plus(BigInt.fromI32(1));
  mysteryBox.save();

  // add mystery box asset to the users account
  let account = fetchAccount(event.params.minter);
  let token = fetchToken(event.params.boxContract, event.params.tokenId);
  token.owner = account.id;
  token.save();
}

export function handleBoxRevealed(event: BoxRevealed): void {
  let token = fetchToken(event.params.boxContract, event.params.tokenId);

  if (!token) return;

  // update the token owner
  token.owner = Address.fromHexString("0x0000000000000000000000000000000000000000");
  token.save();
}
