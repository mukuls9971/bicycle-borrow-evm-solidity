// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract BicycleNFT is ERC721 {
    uint public nftcount;
    struct tokenDetail {
        string title;
        string description;
    }
    mapping (uint256 => tokenDetail) private _tokenDetails;

    constructor() ERC721("bicycle", "bicycle") public {}
    function _setTokenDetail(uint256 tokenId, tokenDetail memory detail) internal virtual {
            require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
            _tokenDetails[tokenId] = detail;
    }

    function createBicycle(string memory title, string memory description) public returns (uint256) {
        
        // tokenDetail memory detail = tokenDetail(title, description);
        _mint(msg.sender, nftcount);
        _setTokenDetail(nftcount, tokenDetail(title, description));
        nftcount++;
        return nftcount-1;
    }
}