/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  ERC1967Utils,
  ERC1967UtilsInterface,
} from "../../../../../@openzeppelin/contracts/proxy/ERC1967/ERC1967Utils";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    name: "ERC1967InvalidAdmin",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "ERC1967InvalidBeacon",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "ERC1967InvalidImplementation",
    type: "error",
  },
  {
    inputs: [],
    name: "ERC1967NonPayable",
    type: "error",
  },
] as const;

const _bytecode =
  "0x608060405234601a57604051603f6020823930815050603f90f35b600080fdfe6080604052600080fdfea2646970667358221220de9aee02867cd7c24fcdccedfb3d06384324580a009e6694b152e1591f0a7bdd64736f6c634300081c0033";

type ERC1967UtilsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1967UtilsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1967Utils__factory extends ContractFactory {
  constructor(...args: ERC1967UtilsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ERC1967Utils & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ERC1967Utils__factory {
    return super.connect(runner) as ERC1967Utils__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1967UtilsInterface {
    return new Interface(_abi) as ERC1967UtilsInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ERC1967Utils {
    return new Contract(address, _abi, runner) as unknown as ERC1967Utils;
  }
}
