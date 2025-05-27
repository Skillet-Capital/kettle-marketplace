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
  MysteryBoxV1,
} from "./types";

import {
  Criteria,
  Side,
  Kettle__factory,
  TestERC20__factory,
  TestERC721__factory,
  StepAction,
  MysteryBoxV1__factory
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

export class MysteryBox {

  public contract: MysteryBoxV1;
  public contractAddress: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public mysteryBoxInterface: any;

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
    this.contract = MysteryBoxV1__factory.connect(
      _contractAddress,
      this.provider
    );

    this.mysteryBoxInterface = MysteryBoxV1__factory.createInterface();
  }

  public connect(_providerOrSigner: JsonRpcProvider | Signer | JsonRpcSigner) {
    return new MysteryBox(_providerOrSigner, this.contractAddress);
  }

  public async whitelisted(minter: string | Addressable): Promise<boolean> {
    const _minter = await this._resolveAddress(minter);
    return await this.contract.whitelist(_minter);
  }

  public async canMint(minter: string | Addressable): Promise<boolean> {
    const _minter = await this._resolveAddress(minter);
    return await this.contract.canMint(_minter);
  }

  public async mint(minter: string | Addressable): Promise<SendStep[]> {
    const _minter = await this._resolveAddress(minter);

    const allowanceActions: SendStep[] = await this._erc20Approvals(
      _minter,
      await this.contract.currency(),
      await this.contract.price()
    );

    const mintAction: SendStep = {
      action: StepAction.SEND,
      type: "mint-box",
      userOp: {
        to: this.contractAddress,
        data: this.mysteryBoxInterface.encodeFunctionData(
          this.mysteryBoxInterface.getFunction("mint"),
          [_minter]
        )
      },
      send: async (signer: Signer) => {
        const txn = await this.contract.connect(signer).mint(_minter);
        return this._confirmTransaction(txn.hash);
      }
    } as const;

    return [...allowanceActions, mintAction];
  }

  public encodeMint(minter: string) {
    return {
      to: this.contractAddress,
      data: this.mysteryBoxInterface.encodeFunctionData(
        this.mysteryBoxInterface.getFunction("mint"),
        [minter]
      )
    }
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
