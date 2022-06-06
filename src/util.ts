import { Bytes } from "@graphprotocol/graph-ts";
import { User, NFT } from "../generated/schema";

export function getOrCreateUser(address: Bytes): User {
  return getOrCreateUserFromString(address.toHex());
}

export function getOrCreateUserFromString(address: string): User {
  let user = User.load(address);
  if (!user) {
    user = new User(address);
    user.save();
  }
  return user as User;
}

/**
 * Get NTF by ID
 * @param { string } id - The NTF id
 * @returns { NFT | null } - The NFT found or Null if not found
 */
export function getNFTByID(id: string): NFT | null {
  return NFT.load(id);
}

/* eslint-disable */
export function padWithZeroes(
  str: string,
  length: number = 20,
  prefix: string = ""
): string {
  /* eslint-enable */
  return "0x".concat(prefix).concat(str.padStart(length as i32, "0"));
}
