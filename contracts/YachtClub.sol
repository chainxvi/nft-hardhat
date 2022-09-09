// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract YachtClub is ERC721 {
  string private constant TOKEN_URI = "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";
  uint256 private s_tokenCounter;
  constructor (string memory name, string memory symbol) public ERC721(name, symbol) {
    s_tokenCounter = 0;
  }

  function yachtClubMint() public returns (uint256) {
    _safeMint(msg.sender, s_tokenCounter);
    s_tokenCounter++;
    return s_tokenCounter;
  }

  function tokenURI(uint256 /* tokenId */) public view override returns (string memory){
    return TOKEN_URI;
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}