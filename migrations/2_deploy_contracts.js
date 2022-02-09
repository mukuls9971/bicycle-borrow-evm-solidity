const Bift = artifacts.require("Bift");
const BicycleNFT = artifacts.require("BicycleNFT");
const BicycleShop = artifacts.require("BicycleShop");


module.exports = function(deployer,network, accounts) {
    let marketOwner = accounts[2]
    deployer.deploy(Bift, "Bift","Bift", {gas: 4612388, from: marketOwner})
    .then(
      function(){
        return deployer.deploy(BicycleNFT, {gas: 4612388, from: marketOwner});
      }
    ).then(
      function(){
        return deployer.deploy(BicycleShop, Bift.address, {gas: 4612388, from: marketOwner})
      }
    );
    
  
};
