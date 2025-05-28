import { ethers } from "ethers";
import { BASIS_POINTS_DIVISOR } from "./constants";
import { TestERC721__factory, TestERC20__factory, Numberish } from "./types";

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

export const currencyBalance = async (
  owner: string,
  currency: string,
  provider: ethers.Provider,
): Promise<bigint> => {
  const contract = TestERC20__factory.connect(currency, provider);
  return contract.balanceOf(owner);
}

export const collateralBalance = async (
  owner: string,
  collection: string,
  tokenId: string | number | bigint,
  provider: ethers.Provider,
) => {
  const contract = TestERC721__factory.connect(collection, provider);
  try {
    const _owner = await contract.ownerOf(tokenId);
    return equalAddresses(_owner, owner);
  } catch {
    return false;
  }
}

function mulFee(amount: bigint | string | number, rate: bigint | string | number) {
  return BigInt(amount) * BigInt(rate) / BASIS_POINTS_DIVISOR;
}

export function calculateNetAmount(amount: bigint | string | number, rate: bigint | string | number) {
  return BigInt(amount) - mulFee(amount, rate);
}

export function getEpoch() {
  return Math.floor(Date.now() / 1000);
}

export function offerExpired(expiration: Numberish) {
  return getEpoch() > Number(expiration);
}

