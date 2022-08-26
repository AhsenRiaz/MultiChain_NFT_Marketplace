// SPDX-License-Identifier: GPL-3.0
// internal one used memory for function's paremeters
// external one uses calldata for functions's parameters
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CreateNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public cost = 0.075 ether;

    modifier validSender() {
        require(msg.sender != address(0), "CreateNFT: invalid sender");
        _;
    }

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function getTokenIds() external view returns (uint256) {
        return _tokenIds.current();
    }

    function createNFT(address marketContract, string memory tokenURI)
        external
        validSender
    {
        require(bytes(tokenURI).length > 0, "CreateNFT: invalid tokenURI");

        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        setApprovalForAll(marketContract, true);
    }

    function mintNFT(string memory tokenURI) external payable validSender {
        require(bytes(tokenURI).length > 0, "CreateNFT: invalid tokenURI");
        require(msg.value == cost, "CreateNFT: msg.value < cost");
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function withdraw() external onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
