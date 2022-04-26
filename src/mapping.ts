import {
  Minted as MintedEvent,
  NftListStatus as NftListStatusEvent,
  PriceUpdate as PriceUpdateEvent,
  Purchase as PurchaseEvent,
  Transfer as TransferEvent,
} from "../generated/NFT/NFT";
import { NFT, Activity } from "../generated/schema";
import { getOrCreateUser } from "./util";

export function handleNFTCreation(event: MintedEvent): void {
  let nft = new NFT(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  nft.owner = getOrCreateUser(event.params.minter).id;
  nft.creator = getOrCreateUser(event.params.minter).id;
  nft.price = event.params.price;
  nft.tokenID = event.params.nftID;
  nft.tokenUri = event.params.uri;
  nft.txHash = event.transaction.hash;
  nft.save();

  let activity = new Activity(event.transaction.hash.toHex() + "-" + nft.id);
  activity.nft = nft.id;
  activity.type = "MINT";
  activity.to = getOrCreateUser(event.params.minter).id;
  activity.price = nft.price;
  activity.timestamp = event.block.timestamp;
  activity.txHash = event.transaction.hash;
  activity.save();
}
