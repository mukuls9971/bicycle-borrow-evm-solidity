
# Contracts Involved

1. Create an FT token bift
2. Create an NFT contract bicycleNFT
3. Create a shop contract bicycleShop
4. Setup frontend to show different actions 

## Use Makefile to setup contracts and test the execution

### test scenario: `make test`
	## Creating and setting up ft accounts 
	## Minting token on nft
	## Putting offer on shop
	## Modifying offer 
	## borrowing on shop 
	## Withdraw Guarantee and return on shop 
	## Liquidation on shop 


## Online test
- Use `npm build:web && npm start` to setup basic frontend and try out the same
- Change the Makefile to add appropriate accounts and call `make deploy`
### Actions
- MintAndOffer
  -  Alice mints an NFT token after providing the details and put it on offer
- ViewOffers
  - Bob view the available offers
- BorrowsToken
  - Bob applies for one of the offer providing NFT tokenID
- Liquidation
  - Alice tries to liquidate it providing NFT tokenID
- WithDrawGuarantee
  - Bob withdraws_guarantee by providing NFT tokenID

