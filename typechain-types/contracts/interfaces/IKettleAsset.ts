/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface IKettleAssetInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "approveOperator"
      | "approveTransfer"
      | "lockToken"
      | "revokeToken"
      | "setBaseURI"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "OperatorWhitelisted"
      | "TokenLocked"
      | "TokenRevoked"
      | "TransferApproved"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "approveOperator",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "approveTransfer",
    values: [AddressLike, AddressLike, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "lockToken",
    values: [BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeToken",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setBaseURI", values: [string]): string;

  decodeFunctionResult(
    functionFragment: "approveOperator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "approveTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lockToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revokeToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setBaseURI", data: BytesLike): Result;
}

export namespace OperatorWhitelistedEvent {
  export type InputTuple = [operator: AddressLike, approved: boolean];
  export type OutputTuple = [operator: string, approved: boolean];
  export interface OutputObject {
    operator: string;
    approved: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokenLockedEvent {
  export type InputTuple = [tokenId: BigNumberish, locked: boolean];
  export type OutputTuple = [tokenId: bigint, locked: boolean];
  export interface OutputObject {
    tokenId: bigint;
    locked: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TokenRevokedEvent {
  export type InputTuple = [tokenId: BigNumberish];
  export type OutputTuple = [tokenId: bigint];
  export interface OutputObject {
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferApprovedEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    tokenId: BigNumberish,
    approved: boolean
  ];
  export type OutputTuple = [
    from: string,
    to: string,
    tokenId: bigint,
    approved: boolean
  ];
  export interface OutputObject {
    from: string;
    to: string;
    tokenId: bigint;
    approved: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface IKettleAsset extends BaseContract {
  connect(runner?: ContractRunner | null): IKettleAsset;
  waitForDeployment(): Promise<this>;

  interface: IKettleAssetInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  approveOperator: TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;

  approveTransfer: TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      approved: boolean
    ],
    [void],
    "nonpayable"
  >;

  lockToken: TypedContractMethod<
    [tokenId: BigNumberish, locked: boolean],
    [void],
    "nonpayable"
  >;

  revokeToken: TypedContractMethod<
    [tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  setBaseURI: TypedContractMethod<[baseURI: string], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "approveOperator"
  ): TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "approveTransfer"
  ): TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      approved: boolean
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "lockToken"
  ): TypedContractMethod<
    [tokenId: BigNumberish, locked: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeToken"
  ): TypedContractMethod<[tokenId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setBaseURI"
  ): TypedContractMethod<[baseURI: string], [void], "nonpayable">;

  getEvent(
    key: "OperatorWhitelisted"
  ): TypedContractEvent<
    OperatorWhitelistedEvent.InputTuple,
    OperatorWhitelistedEvent.OutputTuple,
    OperatorWhitelistedEvent.OutputObject
  >;
  getEvent(
    key: "TokenLocked"
  ): TypedContractEvent<
    TokenLockedEvent.InputTuple,
    TokenLockedEvent.OutputTuple,
    TokenLockedEvent.OutputObject
  >;
  getEvent(
    key: "TokenRevoked"
  ): TypedContractEvent<
    TokenRevokedEvent.InputTuple,
    TokenRevokedEvent.OutputTuple,
    TokenRevokedEvent.OutputObject
  >;
  getEvent(
    key: "TransferApproved"
  ): TypedContractEvent<
    TransferApprovedEvent.InputTuple,
    TransferApprovedEvent.OutputTuple,
    TransferApprovedEvent.OutputObject
  >;

  filters: {
    "OperatorWhitelisted(address,bool)": TypedContractEvent<
      OperatorWhitelistedEvent.InputTuple,
      OperatorWhitelistedEvent.OutputTuple,
      OperatorWhitelistedEvent.OutputObject
    >;
    OperatorWhitelisted: TypedContractEvent<
      OperatorWhitelistedEvent.InputTuple,
      OperatorWhitelistedEvent.OutputTuple,
      OperatorWhitelistedEvent.OutputObject
    >;

    "TokenLocked(uint256,bool)": TypedContractEvent<
      TokenLockedEvent.InputTuple,
      TokenLockedEvent.OutputTuple,
      TokenLockedEvent.OutputObject
    >;
    TokenLocked: TypedContractEvent<
      TokenLockedEvent.InputTuple,
      TokenLockedEvent.OutputTuple,
      TokenLockedEvent.OutputObject
    >;

    "TokenRevoked(uint256)": TypedContractEvent<
      TokenRevokedEvent.InputTuple,
      TokenRevokedEvent.OutputTuple,
      TokenRevokedEvent.OutputObject
    >;
    TokenRevoked: TypedContractEvent<
      TokenRevokedEvent.InputTuple,
      TokenRevokedEvent.OutputTuple,
      TokenRevokedEvent.OutputObject
    >;

    "TransferApproved(address,address,uint256,bool)": TypedContractEvent<
      TransferApprovedEvent.InputTuple,
      TransferApprovedEvent.OutputTuple,
      TransferApprovedEvent.OutputObject
    >;
    TransferApproved: TypedContractEvent<
      TransferApprovedEvent.InputTuple,
      TransferApprovedEvent.OutputTuple,
      TransferApprovedEvent.OutputObject
    >;
  };
}
