// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// Import OpenZeppelin contracts
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/interfaces/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";

contract NftMarketResell is IERC721Receiver, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    uint256 private _listingFees = 0.0025 ether;

    IERC721 public nft;

    struct List {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        address owner;
        address payable seller;
        bool sold;
    }

    mapping(uint256 => List) public vaultItems;

    event NFTListCreated(
        uint256 indexed itemId,
        uint256 indexed tokenId,
        uint256 price,
        address owner,
        address seller,
        bool sold
    );

    modifier validSender() {
        require(msg.sender != address(0));
        _;
    }

    constructor(IERC721 _nft) {
        nft = _nft;
    }

    function itemIds() external view returns (uint256) {
        return _itemIds.current();
    }

    function itemsSold() external view returns (uint256) {
        return _itemsSold.current();
    }

    function listingFees() external view returns (uint256) {
        return _listingFees;
    }

    function listNFT(uint256 tokenId, uint256 worth)
        external
        payable
        validSender
        nonReentrant
    {
        require(
            nft.ownerOf(tokenId) == msg.sender,
            "NftMarketResell: not the owner"
        );
        require(
            vaultItems[tokenId].tokenId == 0,
            "NftMarketResell: already on sale"
        );
        require(worth > 0, "NftMarketResell: price < 0");
        require(msg.value == _listingFees, "msg.value < listingFees");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        vaultItems[itemId] = List(
            itemId,
            tokenId,
            worth,
            address(this),
            payable(msg.sender),
            false
        );

        nft.transferFrom(msg.sender, address(this), tokenId);

        emit NFTListCreated(
            itemId,
            tokenId,
            worth,
            address(this),
            msg.sender,
            false
        );
    }

    function buyNFT(uint256 tokenId) external payable validSender nonReentrant {
        require(
            vaultItems[tokenId].tokenId != 0,
            "NftMarketResell: not listed"
        );
        require(msg.value == vaultItems[tokenId].price);

        _itemsSold.increment();

        vaultItems[tokenId].owner = msg.sender;
        vaultItems[tokenId].seller.transfer(msg.value);
        vaultItems[tokenId].sold = true;
        nft.transferFrom(address(this), msg.sender, tokenId);

        delete vaultItems[tokenId];
    }

    function cancelSale(uint tokenId) external validSender {
        require(
            vaultItems[tokenId].tokenId != 0,
            "NFTMarketResell: not listed"
        );
        delete vaultItems[tokenId];
    }

    function price(uint tokenId) external view validSender returns (uint256) {
        require(
            vaultItems[tokenId].tokenId != 0,
            "NFTMarketResell: not listed"
        );
        return vaultItems[tokenId].price;
    }

    function nftListing() external view returns (List[] memory) {
        uint256 totalItemsCount = _itemIds.current();
        uint256 unsoldItemsCount = _itemIds.current() - _itemsSold.current();

        List[] memory list = new List[](unsoldItemsCount);
        uint currentIndex = 0;

        for (uint i = 1; i <= totalItemsCount; i++) {
            if (vaultItems[i].owner == address(this)) {
                List memory currentItem = vaultItems[i];
                list[currentIndex] = currentItem;
                currentIndex++;
            }
        }
        return list;
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from == address(0x0));
        return IERC721Receiver.onERC721Received.selector;
    }
}
