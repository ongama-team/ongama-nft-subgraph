import { BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { User, NFT, Activity } from "../generated/schema";

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

/**
 * Creates and Saves a new activity
 * @param { ethereum.Event } event - the actual event
 * @param { string } nftID - the NFT ID
 * @param { string } type - the activity type
 * @param { string } to - To whom the activity concerns
 * @param { BigInt} price - The activity price
 */
export function saveNewActivity(event: ethereum.Event, nftID: string, type: string, to: string, price: BigInt): void {
  let activity = new Activity(`${event.transaction.hash.toHex()}-${nftID}`);
  activity.nft = nftID;
  activity.type = type;
  activity.to = to;
  activity.price = price;
  activity.timestamp = event.block.timestamp;
  activity.txHash = event.transaction.hash;
  activity.save();
}
