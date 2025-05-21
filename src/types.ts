import { Addressable, Signer, JsonRpcSigner, TypedDataField } from "ethers";

import { 
  KettleMarketplace as KettleContract,
  KettleMarketplace__factory,
  TestERC20__factory,
  TestERC721__factory,
} from "../typechain-types";


export type { KettleContract };

export {
  KettleMarketplace__factory as Kettle__factory,
  TestERC20__factory,
  TestERC721__factory
};

export type Numberish = string | number | bigint;

// ==============================================
//                INTERNAL TYPES
// ==============================================

export enum Side { BID, ASK };
export enum Criteria { SIMPLE, PROOF };

export type CollateralTerms = {
  criteria: Criteria;
  collection: string;
  identifier: Numberish;
}

export type FeeTerms = {
  recipient: string;
  rate: Numberish;
}

export type MarketOfferTerms = {
  currency: string;
  amount: Numberish;
}

export type MarketOffer = {
  side: Side;
  maker: string;
  taker: string;
  collateral: CollateralTerms;
  terms: MarketOfferTerms;
  fee: FeeTerms;
  expiration: Numberish;
  salt: Numberish;
  nonce: Numberish;
}

export type OfferWithHash = (MarketOffer) & { hash: string };

// ==============================================
//                INPUT TYPES
// ==============================================

export type CreateMarketOfferInput = {
  side: Side;
  taker?: string | Addressable;
  criteria?: Criteria;
  collection: string | Addressable;
  identifier: Numberish;
  currency: string | Addressable;
  amount: Numberish;
  fee: Numberish;
  recipient: string | Addressable;
  expiration: Numberish;
  salt?: Numberish;
}

export type TakeOfferInput = {
  tokenId?: Numberish;
  taker?: string;
  amount?: Numberish;
  offer: MarketOffer;
  signature: string;
  proof?: string[];
}

export type ValidateTakeOfferInput = {
  softBid?: boolean;
  tokenId: Numberish;
  amount?: Numberish;
  offer: MarketOffer;
}

// ==============================================
//                OUTPUT TYPES
// ==============================================

export type UserOp = {
  to: string;
  data: string;
}

export type OfferWithSignature = {
  offer: MarketOffer;
  signature: string;
}

export type CurrentDebt = {
  debt: Numberish;
  interest: Numberish;
  fee: Numberish;
}

// ==============================================
//                ACTION TYPES
// ==============================================

export type Payload = {
  types: Record<string, TypedDataField[]>,
  domain: {
    readonly name: string | undefined;
    readonly version: string | undefined;
    readonly chainId: number | undefined;
    readonly verifyingContract: string | `0x${string}`;
  };
  primaryType: string;
  message: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export enum StepAction { SEND, SIGN };

export type GenericStep = {
  action: StepAction;
  type: string;
}

export type SendStep = GenericStep & {
  action: StepAction.SEND;
  type: `approve-${string}` | `take-${string}` | `repay-${string}` | `escrow-${string}` | `claim-${string}` | `cancel-${string}` | `redeem${string}` | `${string}-escrow`;
  userOp: UserOp;
  send: (signer: Signer | JsonRpcSigner) => Promise<string>;
}

export type SignStep = GenericStep & {
  action: StepAction.SIGN;
  type: "sign-offer",
  offer: MarketOffer;
  payload: Payload;
  sign: (signer: Signer | JsonRpcSigner) => Promise<OfferWithSignature>;
}

// ==============================================
//               VALIDATION TYPES
// ==============================================

export type Validation = {
  check?: 
    | "validation"
    | "cancelled" 
    | "nonce" 
    | "balance" 
    | "allowance" 
    | "ownership" 
    | "approval" 
    | "debt-covers-ask" 
    | "loan-max-amount"
    | "whitelisted-ask-maker"
    | "whitelisted-bid-taker"
    | "escrow-exists"
  valid: boolean;
  reason?: string;
}

export type MulticallValidation = {
  [salt: string]: Validation;
}

// ==============================================
//            REDEMPTION MANAGER TYPES
// ==============================================

export type Asset = {
  collection: Addressable;
  tokenId: Numberish;
}

export type RedemptionCharge = {
  redeemer: string,
  collection: string,
  tokenId: Numberish,
  currency: string,
  amount: Numberish,
  expiration: Numberish,
  salt: Numberish,
  nonce: Numberish,
}

export type ChargeWithSignature = {
  charge: RedemptionCharge;
  signature: string;
}

export type RedemptionSignStep = GenericStep & {
  action: StepAction.SIGN;
  type: "sign-redemption-charge",
  charge: RedemptionCharge;
  payload: Payload;
  sign: (signer: Signer | JsonRpcSigner) => Promise<ChargeWithSignature>;
}
