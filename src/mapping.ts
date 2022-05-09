import {
  Minted as MintedEvent,
  PriceUpdate as PriceUpdateEvent,
  NftListStatus as NftListStatusEvent,
  Purchase as PurchaseEvent,
  Transfer as TransferEvent,
} from "../generated/NFT/NFT";
import { NFT, Activity } from "../generated/schema";
import { getOrCreateUser, getNFTByID, saveNewActivity } from "./util";

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

  saveNewActivity(event, nft.id, "MINT", getOrCreateUser(event.params.minter).id, nft.price);
}

/**
 * Handles NFT price update
 * @param { PriceUpdateEvent } event - The emitted event for price update
 */
export function handleNFTPriceUpdate(event: PriceUpdateEvent): void {
  let nft = getNFTByID(event.params.nftID.toString());

  if (!nft) return;

  nft.price = event.params.newPrice;

  saveNewActivity(event, nft.id, "PRICE UPDATE", getOrCreateUser(event.params.owner).id, nft.price);
}
