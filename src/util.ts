import { Bytes } from "@graphprotocol/graph-ts";
import { User } from "../generated/schema";

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
