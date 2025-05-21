import { ethers } from "ethers";
import { TestERC721__factory, TestERC20__factory } from "./types";

export const randomSalt = (): string => {
  return `0x${Buffer.from(ethers.randomBytes(16)).toString("hex").padStart(64, "0")}`;
};

export function equalAddresses(a? : string, b?: string): boolean {
  if (!a || !b) return false;
  return a?.toLowerCase() === b?.toLowerCase();
}

export const collateralApprovals = async (
  owner: string,
  collection: string,
  operator: string,
  provider: ethers.Provider,
): Promise<boolean> => {
  const contract = TestERC721__factory.connect(collection, provider);
  return contract.isApprovedForAll(owner, operator);
}

export const currencyAllowance = async (
  owner: string,
  currency: string,
  operator: string,
  provider: ethers.Provider,
): Promise<bigint> => {
  const contract = TestERC20__factory.connect(currency, provider);
  return contract.allowance(owner, operator);
}
