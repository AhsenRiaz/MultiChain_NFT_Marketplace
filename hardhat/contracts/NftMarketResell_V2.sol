// SPDX-License-Identifier: MIT LICENSE

pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NftMarketResell is IERC721Receiver, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public _itemIds;
    Counters.Counter public _itemsSold;

    uint256 public listingFees = 0.0025 ether;

    IERC721 nft;

    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        address payable seller;
        address payable holder;
        uint256 price;
        bool sold;
    }

    mapping(uint => MarketItem) public idToMarketItem;

    event MarketItemCreated(
        uint256 itemId,
        uint256 indexed tokenId,
        address seller,
        address holder,
        uint256 price,
        bool sold
    );

    constructor(IERC721 _nft) {
        nft = _nft;
    }

    function listNft(uint256 tokenId, uint256 price)
        external
        payable
        nonReentrant
    {
        require(
            idToMarketItem[tokenId].tokenId == 0,
            "NftMarketResell: tokenId != 0"
        );
        require(price > 0, "NftMarketResell: price < 0");

        require(
            msg.value == listingFees,
            "NftMarketResell: msg.value < listingFee"
        );

        _itemIds.increment();
        uint256 newItemId = _itemIds.current();

        idToMarketItem[newItemId] = MarketItem({
            itemId: newItemId,
            tokenId: tokenId,
            price: price,
            seller: payable(msg.sender),
            holder: payable(address(this)),
            sold: false
        });

        nft.transferFrom(msg.sender, address(this), tokenId);
        
        emit MarketItemCreated(
            newItemId,
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function buyNFT(uint256 itemId) external payable nonReentrant {
        address owner = owner();
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        uint256 price = idToMarketItem[itemId].price;

        require(tokenId != 0, "NftMarketResell: tokenId == 0");
        require(msg.value == price, "NftMarketResell: msg.value < price");

        address seller = idToMarketItem[itemId].seller;

        payable(seller).transfer(msg.value);
        nft.transferFrom(address(this), msg.sender, tokenId);

        idToMarketItem[itemId].holder = payable(msg.sender);
        idToMarketItem[itemId].sold = true;

        _itemsSold.increment();
        payable(owner).transfer(listingFees);
    }

    function getAvailableNfts() public view returns (MarketItem[] memory) {
        uint256 itemIds = _itemIds.current();
        uint256 itemsSold = _itemsSold.current();

        uint256 totalItems = itemIds - itemsSold;
        MarketItem[] memory marketItems = new MarketItem[](totalItems);

        uint currentIndex = 0;

        for (uint i = 1; i <= itemIds; i++) {
            if (idToMarketItem[i].holder == address(this)) {
                marketItems[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }
        return marketItems;
    }

    function getMyNfts() public view {
        uint256 itemsSold = _itemsSold.current();
        uint itemsCount = 0;
        uint currentIndex = 0;
        for (uint i = 1; i <= itemsSold; i++) {
            if (idToMarketItem[i].holder == msg.sender) {
                itemsCount++;
            }
        }

        MarketItem[] memory mynfts = new MarketItem[](itemsCount);
        for (uint i = 1; i <= itemsSold; i++) {
            if (idToMarketItem[i].holder == msg.sender) {
                mynfts[currentIndex] = idToMarketItem[i];
            }
        }
    }

    function getMyMarketNfts() public view {
        uint256 itemsSold = _itemsSold.current();
        uint itemsCount = 0;
        uint currentIndex = 0;
        for (uint i = 1; i <= itemsSold; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                itemsCount++;
            }
        }

        MarketItem[] memory mynfts = new MarketItem[](itemsCount);
        for (uint i = 1; i <= itemsSold; i++) {
            if (idToMarketItem[i].holder == msg.sender) {
                mynfts[currentIndex] = idToMarketItem[i];
            }
        }
    }

    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        require(from == address(0x0), "Cannot send nfts to Vault directly");
        return IERC721Receiver.onERC721Received.selector;
    }

    function withdraw() public payable onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}
