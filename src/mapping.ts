import {
  Minted as MintedEvent,
  PriceUpdate as PriceUpdateEvent,
  NftListStatus as NftListStatusEvent,
  Purchase as PurchaseEvent,
  Transfer as TransferEvent,
} from "../generated/NFT/NFT";
import { NFT, Activity } from "../generated/schema";
import { getOrCreateUser, getNFTByID, padWithZeroes } from "./util";

export function handleNFTCreation(event: MintedEvent): void {
  let nft = new NFT(padWithZeroes(event.params.nftID.toString(), 20));
  nft.owner = getOrCreateUser(event.params.minter).id;
  nft.creator = getOrCreateUser(event.params.minter).id;
  nft.price = event.params.price;
  nft.tokenID = event.params.nftID;
  nft.tokenUri = event.params.uri;
  nft.txHash = event.transaction.hash;
  nft.isListed = true;
  nft.save();

  let activity = new Activity(`${event.transaction.hash.toHex()}-${nft.id}`);
  activity.nft = nft.id;
  activity.type = "MINT";
  activity.to = getOrCreateUser(event.params.minter).id;
  activity.price = nft.price;
  activity.timestamp = event.block.timestamp;
  activity.txHash = event.transaction.hash;
  activity.save();
}

/**
 * Handles NFT price update
 * @param { PriceUpdateEvent } event - The emitted event for price update
 */
export function handleNFTPriceUpdate(event: PriceUpdateEvent): void {
  let nft = getNFTByID(event.params.nftID.toString());

  if (!nft) return;

  nft.price = event.params.newPrice;
  nft.save();

  let activity = new Activity(`${event.transaction.hash.toHex()}-${nft.id}`);
  activity.nft = nft.id;
  activity.type = "PRICE_UPDATE";
  activity.to = getOrCreateUser(event.params.owner).id;
  activity.price = nft.price;
  activity.timestamp = event.block.timestamp;
  activity.txHash = event.transaction.hash;
  activity.save();
}


/**
 * Handles NFT list update
 * @param { NftListStatusEvent } event - The emitted event for price update
 */
export function handleNftListStatus(event: NftListStatusEvent): void {
  let nft = getNFTByID(event.params.nftID.toString());
  if (!nft) return;
  nft.isListed = event.params.isListed;
  nft.save();

  let activity = new Activity(`${event.transaction.hash.toHex()}-${nft.id}`);
  activity.nft = nft.id;
  activity.type = "LISTED";
  activity.from = getOrCreateUser(event.params.owner).id;
  activity.to = null;
  activity.price = nft.price;
  activity.timestamp = event.block.timestamp;
  activity.txHash = event.transaction.hash;
  activity.save();
}

