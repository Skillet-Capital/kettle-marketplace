import {
  ADDRESS_ZERO,
  BASIS_POINTS_DIVISOR,
  KETTLE_CONTRACT_NAME,
  KETTLE_CONTRACT_VERSION,
  MARKET_OFFER_TYPE,
  REDEMPTION_CHARGE_TYPE
} from "./constants";

import {
  Provider,
  Signer,
  JsonRpcProvider,
  JsonRpcSigner,
  TypedDataEncoder,
  Addressable,
  MaxUint256
} from "ethers";

import type {
  KettleContract,
  CreateMarketOfferInput,
  MarketOffer,
  OfferWithSignature,
  Numberish,
  CurrentDebt,
  TakeOfferInput,
  Validation,
  SendStep,
  SignStep,
  UserOp,
  Payload,
  ValidateTakeOfferInput,
  RedemptionCharge,
  ChargeWithSignature,
} from "./types";

import {
  Criteria,
  Side,
  Kettle__factory,
  TestERC20__factory,
  TestERC721__factory,
  StepAction
} from "./types";

import {
  randomSalt,
  collateralApprovals,
  currencyAllowance,
  equalAddresses
} from "./utils";

import {
  verifyMessage
} from "@ambire/signature-validator";

export class Kettle {

  public contract: KettleContract;
  public contractAddress: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public kettleInterface: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public lendingIface: any;

  private provider: Provider;

  public constructor(
    _providerOrSigner: JsonRpcProvider | Signer | JsonRpcSigner,
    _contractAddress: string
  ) {

    const provider =
      "provider" in _providerOrSigner
        ? _providerOrSigner.provider
        : _providerOrSigner;

    if (!provider) {
      throw new Error(
        "Either a provider or custom signer with provider must be provided",
      );
    }

    this.provider = provider;

    this.contractAddress = _contractAddress;
    this.contract = Kettle__factory.connect(
      _contractAddress,
      this.provider
    );

    this.kettleInterface = Kettle__factory.createInterface();
  }

  public connect(_providerOrSigner: JsonRpcProvider | Signer | JsonRpcSigner) {
    return new Kettle(_providerOrSigner, this.contractAddress);
  }

  public async createRedemptionCharge({
    redeemer,
    collection,
    tokenId,
    currency,
    amount,
    expiration,
  }: {
    redeemer: Addressable | string;
    collection: Addressable | string;
    tokenId: Numberish;
    currency: Addressable | string;
    amount: Numberish;
    expiration: Numberish;
  }) {
    const admin = await this.contract.redemptionSigner();
    const nonce = await this.contract.nonces(admin);

    const redemptionCharge: RedemptionCharge = {
      redeemer: await this._resolveAddress(redeemer),
      collection: await this._resolveAddress(collection),
      tokenId,
      currency: await this._resolveAddress(currency),
      amount,
      expiration,
      salt: randomSalt(),
      nonce,
    };

    return {
      action: StepAction.SIGN,
      type: "sign-redemption-charge",
      charge: redemptionCharge,
      payload: await this._redemptionChargePayload(redemptionCharge),
      sign: async (signer: Signer): Promise<ChargeWithSignature> => {
        const signerAddress = await signer.getAddress();
        if (!equalAddresses(signerAddress, admin)) {
          throw new Error("Signer is not redemption admin");
        }

        const signature = await this._signRedemptionCharge(redemptionCharge, signer);
        return { charge: redemptionCharge, signature };
      }
    } as const;
  }

  public async redeem(
    charge: RedemptionCharge,
    signature: string,
  ): Promise<SendStep[]> {

    const approvalActions: SendStep[] = await this._erc20Approvals(
      charge.redeemer,
      charge.currency,
      charge.amount
    );

    const allowanceActions: SendStep[] = await this._erc721Approvals(
      charge.redeemer,
      charge.collection
    );

    const redeemAction: SendStep = {
      action: StepAction.SEND,
      type: "redeem",
      userOp: {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("redeem"),
          [charge, signature]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).redeem(charge, signature);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, ...allowanceActions, redeemAction];
  }

  public async createMarketOffer(
    input: CreateMarketOfferInput,
    maker: string | Addressable,
  ): Promise<(SendStep | SignStep)[]> {
    const _maker = await this._resolveAddress(maker);
    const offer = await this._formatMarketOffer(_maker, input);

    let approvalActions: SendStep[] = [];
    if (input.side === Side.ASK) {
      approvalActions = await this._erc721Approvals(_maker, await this._resolveAddress(input.collection));
    } else {
      approvalActions = await this._erc20Approvals(_maker, await this._resolveAddress(input.currency), MaxUint256);
    }

    let cancelSteps: SendStep[] = [];
    if (input.salt) {
      cancelSteps = await this.cancelOffers([input.salt]);
    }

    // get sign step
    const createOfferAction: SignStep = {
      action: StepAction.SIGN,
      type: "sign-offer",
      offer: offer,
      payload: await this._marketOfferPayload(offer),
      sign: async (signer: Signer): Promise<OfferWithSignature> => {
        const signature = await this._signMarketOffer(offer, signer);

        return {
          offer,
          signature
        }
      }
    } as const;

    return [...cancelSteps, ...approvalActions, createOfferAction];
  }

  public async takeMarketOffer(
    input: TakeOfferInput,
    taker: string | Addressable
  ): Promise<SendStep[]> {
    const _taker = await this._resolveAddress(taker);

    let approvalActions: SendStep[] = [];
    if (input.offer.side === Side.ASK) {
      approvalActions = await this._erc20Approvals(_taker, input.offer.terms.currency, input.offer.terms.amount);
    } else {
      approvalActions = await this._erc721Approvals(_taker, input.offer.collateral.collection);
    }

    const takeOfferAction: SendStep = {
      action: StepAction.SEND,
      type: "take-market-offer",
      userOp: (input.offer.side === Side.BID) ? {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("takeBid"),
          [
            input.tokenId,
            input.offer,
            input.signature,
            input.proof ?? []
          ]
        )
      } : {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("takeAsk"),
          [
            _taker,
            input.offer,
            input.signature
          ]
        )
      },
      send: async (signer: Signer | JsonRpcSigner) => {
        let txn;

        if (input.offer.side === Side.BID) {
          txn = await this.contract.connect(signer).takeBid(
            input.tokenId!,
            input.offer as MarketOffer,
            input.signature,
            input.proof ?? []
          );
        } else {
          txn = await this.contract.connect(signer).takeAsk(
            _taker,
            input.offer as MarketOffer,
            input.signature,
          );
        }

        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...approvalActions, takeOfferAction];
  }

  public async encodeTakeAsk(
    input: TakeOfferInput,
    taker: string | Addressable
  ) {
    const _taker = await this._resolveAddress(taker);

    return {
      to: this.contractAddress,
      data: this.kettleInterface.encodeFunctionData(
        this.kettleInterface.getFunction("takeAsk"),
        [
          _taker,
          input.offer,
          input.signature
        ]
      )
    };
  }

  public async encodeRedeem(
    charge: ChargeWithSignature
  ) {
    return {
      to: this.contractAddress,
      data: this.kettleInterface.encodeFunctionData(
        this.kettleInterface.getFunction("redeem"),
        [charge.charge, charge.signature]
      )
    }
  }

  public async cancelOffers(salts: Numberish[]): Promise<SendStep[]> {
    const cancelAction: SendStep = {
      action: StepAction.SEND,
      type: "cancel-offers",
      userOp: {
        to: this.contractAddress,
        data: this.kettleInterface.encodeFunctionData(
          this.kettleInterface.getFunction("cancelOffers"),
          [salts]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).cancelOffers(salts);
        return this._confirmTransaction(txn.hash);
      }
    };

    return [cancelAction];
  }

  public hashMarketOffer(offer: MarketOffer): string {
    return TypedDataEncoder.hashStruct("MarketOffer", MARKET_OFFER_TYPE, offer);
  }

  public async hashRedemptionCharge(charge: RedemptionCharge): Promise<string> {
    const signer = await this.contract.redemptionSigner();
    return this.contract.hashRedemptionCharge(signer, charge)
  }

  public async _formatMarketOffer(
    maker: string,
    input: CreateMarketOfferInput
  ): Promise<MarketOffer> {

    return {
      side: input.side,
      maker,
      taker: input.taker ? (await this._resolveAddress(input.taker)) : ADDRESS_ZERO,
      collateral: {
        criteria: input.criteria ?? Criteria.SIMPLE,
        collection: await this._resolveAddress(input.collection),
        identifier: input.identifier,
      },
      terms: {
        currency: await this._resolveAddress(input.currency),
        amount: input.amount,
      },
      fee: {
        recipient: await this._resolveAddress(input.recipient),
        rate: input.fee,
      },
      expiration: input.expiration,
      salt: randomSalt(),
      nonce: await this.contract.nonces(maker).then((_n) => _n.toString())
    }
  }

  private async _erc721Approvals(
    user: string,
    collection: string,
  ): Promise<SendStep[]> {
    const operator = this.contractAddress;

    const approvalActions: SendStep[] = [];

    const approved = await collateralApprovals(user, collection, operator, this.provider);

    if (!approved) {
      approvalActions.push({
        action: StepAction.SEND,
        type: "approve-erc721",
        userOp: {
          to: collection,
          data: TestERC721__factory.createInterface().encodeFunctionData("setApprovalForAll", [operator, true])
        },
        send: async (signer: Signer) => {
          const contract = TestERC721__factory.connect(collection, signer);
          const txn = await contract.setApprovalForAll(operator, true);
          return this._confirmTransaction(txn.hash);
        }
      })
    }

    return approvalActions;
  }

  private async _erc20Approvals(
    user: string,
    currency: string,
    amount: Numberish,
    useMax?: boolean
  ): Promise<SendStep[]> {
    const operator = this.contractAddress;

    const approvalActions: SendStep[] = [];

    const allowance = await currencyAllowance(user, currency, operator, this.provider);

    if (allowance < BigInt(amount)) {
      approvalActions.push({
        action: StepAction.SEND,
        type: "approve-erc20",
        userOp: {
          to: currency,
          data: TestERC20__factory.createInterface().encodeFunctionData(
            "approve",
            [operator, useMax ? MaxUint256 : BigInt(amount)]
          )
        },
        send: async (signer: Signer) => {
          const contract = TestERC20__factory.connect(currency, signer);

          const wad = useMax ? MaxUint256 : BigInt(amount);
          const txn = await contract.approve(operator, wad);
          return this._confirmTransaction(txn.hash);
        }
      })
    }

    return approvalActions;
  }

  private async _getDomainData() {
    const { chainId } = await this.provider.getNetwork();

    return {
      name: KETTLE_CONTRACT_NAME,
      version: KETTLE_CONTRACT_VERSION,
      chainId,
      verifyingContract: await this.contract.getAddress()
    }
  }

  public async signMarketOffer(offer: MarketOffer, signer: Signer): Promise<string> {
    return this._signMarketOffer(offer, signer);
  }

  private async _signMarketOffer(offer: MarketOffer, signer: Signer): Promise<string> {
    const domain = await this._getDomainData();
    return signer.signTypedData(domain, MARKET_OFFER_TYPE, offer);
  }

  public async signRedemptionCharge(charge: RedemptionCharge, signer: Signer): Promise<string> {
    return this._signRedemptionCharge(charge, signer);
  }

  private async _signRedemptionCharge(
    charge: RedemptionCharge,
    signer: Signer
  ): Promise<string> {
    const domain = await this._getDomainData();
    return signer.signTypedData(domain, REDEMPTION_CHARGE_TYPE, charge);
  };

  private async _marketOfferPayload(offer: MarketOffer): Promise<Payload> {
    const domain = await this._getDomainData();

    return TypedDataEncoder.getPayload(
      domain,
      MARKET_OFFER_TYPE,
      offer
    );
  }

  private async _redemptionChargePayload(charge: RedemptionCharge): Promise<Payload> {
    const domain = await this._getDomainData();

    return TypedDataEncoder.getPayload(
      domain,
      REDEMPTION_CHARGE_TYPE,
      charge
    );
  }

  public mulFee(amount: bigint | string | number, rate: bigint | string | number) {
    return BigInt(amount) * BigInt(rate) / BASIS_POINTS_DIVISOR;
  }

  private async _resolveAddress(input: string | Addressable): Promise<string> {
    if (typeof input === "string") {
      return input;
    } else if (typeof input.getAddress === "function") {
      return await input.getAddress();
    }

    throw new Error("Invalid input: must be string or Addressable");
  }

  private async _confirmTransaction(
    hash: string,
    confirmations?: number,
    timeout?: number
  ) {
    try {
      await this.provider.waitForTransaction(hash, confirmations, timeout);
      return hash;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message.includes("HardhatEthersProvider.waitForTransaction")) return hash;
      throw new Error("Unable to confirm transaction, please check block explorer and try again");
    }
  }

  public bundleUserOps(
    steps: (SendStep)[]
  ): UserOp[] {
    const ops: UserOp[] = [];

    for (const step of steps) {
      if (step.action === StepAction.SEND) {
        ops.push(step.userOp);
      }
    }

    return ops;
  }
}
