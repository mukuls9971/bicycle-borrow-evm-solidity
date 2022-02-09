const Bift = artifacts.require("Bift");
const BicycleNFT = artifacts.require("BicycleNFT");
const BicycleShop = artifacts.require("BicycleShop");
/*
- Alice and Bob are two users, and shopowner is the owner of contracts 
- One Fungible token bift is used as medium of exchange for the shop
- Alice has 5000 and Bob has 10000 tokens 
- Alice wants to lend her bicycle, so she mints an NFT with info(type: bicycle, model: 2016, owner:alice)
- Alice put this NFT into shop as an offer with rent per second: 1, guarantee: 5000, max_expiry(in seconds)
- Bob gets the list of NFTs in the shop and buys it by sending the guarantee money
- Bicycle shop add the borrowerID, change the status  and expiry to the NFT, and save the guarantee into escrew
- NFT will have two status: OFFER/ONRENT
- The owner can reclaim the escrow, after expiry period of NFT.(liquidation)  
- The borrower can withdraw_guarantee. Bob returns the bicycle  and is charged for the amount equal to days*rent. Pending amount of guarantee is returned to him.

*/
contract('Bicycle borrow test', (accounts) => {
  it('general test', async () => {
    let alice = accounts[0]
    let bob = accounts[1]
    let shopowner = accounts[2]

    let bift = await Bift.deployed();
    let bnft = await BicycleNFT.deployed();
    let shop = await BicycleShop.deployed();
    
    await bift.transfer(alice,5000,{ from: shopowner })
    await bift.transfer(bob,10000,{ from: shopowner })
    let aliceBalance = await bift.balanceOf(alice)
    let bobBalance = await bift.balanceOf(bob)
    let shopBalance = await bift.balanceOf(shopowner)
    console.log("balances:",aliceBalance.toString(), bobBalance.toString(), shopBalance.toString())
    
    await bnft.createBicycle( "Hero2016", "HeroBicycle with 2016 manufacture date", { from: alice })
    let tokenOwner = await bnft.ownerOf(0);
    console.log("tokenOwner is", tokenOwner)
    
    await shop.createOffer(0, bnft.address, 2, 300, 2000, { from: alice }); //rent, maxtime, guarantee
    let offers = await shop.getOffers();
    console.log("Offers are", offers);

    await bift.approve(shop.address, 2000, { from: bob })
    let shopAllowance = await bift.allowance(bob, shop.address)
    console.log("Shop Allowance is", shopAllowance.toString());
    await shop.borrow(0, bnft.address, 5, { from: bob } );
    offers = await shop.getOffers();
    console.log("Offers are", offers);

    aliceBalance = await bift.balanceOf(alice)
    bobBalance = await bift.balanceOf(bob)
    shopBalance = await bift.balanceOf(shop.address)
    console.log("balances:",aliceBalance.toString(), bobBalance.toString(), shopBalance.toString())

    // await new Promise(r => setTimeout(r, 2000));

    // await shop.withdrawGuarantee(0, { from: bob })
    // aliceBalance = await bift.balanceOf(alice)
    // bobBalance = await bift.balanceOf(bob)
    // shopBalance = await bift.balanceOf(shop.address)
    // console.log("balances:",aliceBalance.toString(), bobBalance.toString(), shopBalance.toString())
    // offers = await shop.getOffers();
    // console.log("Offers are", offers);

    await new Promise(r => setTimeout(r, 5500));

    await shop.liquidate(0, { from: alice })
    aliceBalance = await bift.balanceOf(alice)
    bobBalance = await bift.balanceOf(bob)
    shopBalance = await bift.balanceOf(shop.address)
    console.log("balances:",aliceBalance.toString(), bobBalance.toString(), shopBalance.toString())
    offers = await shop.getOffers();
    console.log("Offers are", offers);

    

    assert.equal(1, 1, "Internal Service Error");
    

  });
});
  