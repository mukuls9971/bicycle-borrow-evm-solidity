// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BicycleShop {
    uint public offercount;
    struct offerDetail {
        uint256 tokenId;
        address nft;
        address owner;
        string state;

        uint256 rent; 
        uint256 maxexpiry;
        uint256 guarantee;
        
        uint256 starttime;
        uint256 expiry;
        address borrower;    
    }

    mapping (uint256 => offerDetail) private _offerDetails;
    mapping (uint256 => uint256) private _offerTokenMap;

    address public owner;
    IERC20 public token;
   
    event logit(
        uint256 _number,
        address _sender
    );
    constructor(
        address _token
    ) {
        owner = msg.sender;
        token = IERC20(_token);
    }
    function createOffer(
        uint256 nftTokenId, 
        address nft,
        uint256 rent, 
        uint256 maxexpiry,
        uint256 guarantee) public {

        _offerDetails[offercount] = offerDetail(nftTokenId, nft, msg.sender, "ONOFFER",rent,maxexpiry,guarantee,0,0,address(0));
        _offerTokenMap[nftTokenId] = offercount;
        emit logit(offercount, nft);
        emit logit(offercount, address(this));
        offercount++;

    }
    function borrow(
        uint256 nftTokenId, 
        address nft,
        uint256 expiry
        ) public {
        
        uint256 offerno = _offerTokenMap[nftTokenId];
        offerDetail memory offer = _offerDetails[offerno];
        require(
            token.allowance(msg.sender, address(this)) >= offer.guarantee,
             string(abi.encodePacked("Token allowance low", Strings.toString(token.allowance(msg.sender, address(this))) ))
        );
        
        bool sent = token.transferFrom(msg.sender, address(this), offer.guarantee);
        require(sent, "Token transfer failed");

        offer.state = "ONRENT";
        offer.starttime = block.timestamp;
        offer.expiry = expiry;
        offer.borrower = msg.sender;
        _offerDetails[offerno] = offer;
        emit logit(offerno, address(this));
    }
    
    function withdrawGuarantee(uint256 nftTokenId) public {
        uint256 offerno = _offerTokenMap[nftTokenId];
        offerDetail memory offer = _offerDetails[offerno];
        require(offer.borrower == msg.sender, "Withdraw Guarantee can be called by only borrower");
        require(keccak256(bytes(offer.state)) == keccak256("ONRENT"), "Offer not on rent");
        require(offer.starttime+offer.expiry > block.timestamp, "Offer has expired" );

        uint256 borrowerPay = offer.rent * offer.expiry;
        uint256 ownerPay = offer.guarantee - borrowerPay;
        
        bool sentBorrower = token.transfer(offer.borrower, borrowerPay);
        bool sentOwner = token.transfer(offer.owner, ownerPay);
        require(sentBorrower, "Not able to sent to Borrower");
        require(sentOwner, "Not able to sent to Owner");

        offer.state = "ONOFFER";
        offer.starttime = 0 ;
        offer.expiry=0;
        offer.borrower = address(0); 
        _offerDetails[offerno] = offer;
    }
    function liquidate(uint256 nftTokenId) public {
        
        uint256 offerno = _offerTokenMap[nftTokenId];
        offerDetail memory offer = _offerDetails[offerno];
        require(offer.owner == msg.sender, "Liquidation can be called by only Owner");
        require(keccak256(bytes(offer.state)) == keccak256("ONRENT"), "Offer not on rent");
        require(offer.starttime+offer.expiry < block.timestamp, "Offer is not expired yet" );

        
        bool sent = token.transfer(offer.owner, offer.guarantee);
        require(sent, "Not able to sent the guarantee to Owner");

        offer.state = "ONOFFER";
        offer.starttime = 0 ;
        offer.expiry=0;
        offer.borrower = address(0); 
        _offerDetails[offerno] = offer;
    }

    function getOffers() public view returns (offerDetail[] memory){
        uint size = offercount;
        offerDetail[] memory offers = new offerDetail[](size);
        for (uint i = 0; i < size; i++) {
          offerDetail storage offer = _offerDetails[i];
          offers[i] = offer;
        }
        return offers;

    }
    
}