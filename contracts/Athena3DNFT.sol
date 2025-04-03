// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Athena3DNFT
 * @dev ERC721 token for Athena3D platform with royalty support
 */
contract Athena3DNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;
    
    // Mapping from token ID to royalty percentage (in basis points, 1% = 100)
    mapping(uint256 => uint256) private _royaltyPercentages;
    
    // Mapping from token ID to listing price (in wei)
    mapping(uint256 => uint256) private _tokenPrices;
    
    // Mapping tracking if a token is listed for sale
    mapping(uint256 => bool) private _tokenListed;
    
    // Platform fee percentage (in basis points)
    uint256 public platformFeePercentage = 250; // 2.5%
    
    // Events
    event TokenMinted(address indexed creator, uint256 indexed tokenId, string tokenURI);
    event TokenListed(uint256 indexed tokenId, uint256 price);
    event TokenUnlisted(uint256 indexed tokenId);
    event TokenSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event RoyaltyPaid(uint256 indexed tokenId, address indexed creator, uint256 amount);
    
    constructor() ERC721("Athena3D NFT", "ATH3D") {}
    
    /**
     * @dev Mints a new token
     * @param recipient The address that will own the minted token
     * @param tokenURI URI for the token metadata
     * @param royaltyPercentage Royalty percentage in basis points (1% = 100)
     * @return uint256 The ID of the newly minted token
     */
    function mintToken(
        address recipient, 
        string memory tokenURI, 
        uint256 royaltyPercentage
    ) 
        public 
        returns (uint256) 
    {
        require(royaltyPercentage <= 5000, "Royalty cannot exceed 50%");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        _creators[newTokenId] = msg.sender;
        _royaltyPercentages[newTokenId] = royaltyPercentage;
        
        emit TokenMinted(msg.sender, newTokenId, tokenURI);
        
        return newTokenId;
    }
    
    /**
     * @dev Lists a token for sale
     * @param tokenId The ID of the token to list
     * @param price The price at which to list the token (in wei)
     */
    function listToken(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list a token");
        require(price > 0, "Price must be greater than zero");
        
        _tokenPrices[tokenId] = price;
        _tokenListed[tokenId] = true;
        
        emit TokenListed(tokenId, price);
    }
    
    /**
     * @dev Removes a token from sale
     * @param tokenId The ID of the token to unlist
     */
    function unlistToken(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can unlist a token");
        require(_tokenListed[tokenId], "Token is not listed");
        
        _tokenListed[tokenId] = false;
        
        emit TokenUnlisted(tokenId);
    }
    
    /**
     * @dev Purchases a token
     * @param tokenId The ID of the token to purchase
     */
    function purchaseToken(uint256 tokenId) public payable nonReentrant {
        address seller = ownerOf(tokenId);
        require(seller != msg.sender, "Cannot buy your own token");
        require(_tokenListed[tokenId], "Token is not listed for sale");
        require(msg.value >= _tokenPrices[tokenId], "Insufficient funds sent");
        
        uint256 price = _tokenPrices[tokenId];
        uint256 royaltyAmount = 0;
        uint256 platformFee = (price * platformFeePercentage) / 10000;
        
        // Calculate royalty if applicable
        address creator = _creators[tokenId];
        if (creator != seller && _royaltyPercentages[tokenId] > 0) {
            royaltyAmount = (price * _royaltyPercentages[tokenId]) / 10000;
            
            // Pay royalty to creator
            (bool royaltySuccess, ) = payable(creator).call{value: royaltyAmount}("");
            require(royaltySuccess, "Royalty payment failed");
            
            emit RoyaltyPaid(tokenId, creator, royaltyAmount);
        }
        
        // Pay platform fee
        (bool feeSuccess, ) = payable(owner()).call{value: platformFee}("");
        require(feeSuccess, "Platform fee payment failed");
        
        // Pay seller
        (bool sellerSuccess, ) = payable(seller).call{value: price - royaltyAmount - platformFee}("");
        require(sellerSuccess, "Seller payment failed");
        
        // Transfer the token
        _transfer(seller, msg.sender, tokenId);
        
        // Update token status
        _tokenListed[tokenId] = false;
        
        // Refund excess payment if any
        if (msg.value > price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - price}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit TokenSold(tokenId, seller, msg.sender, price);
    }
    
    /**
     * @dev Returns token listing status and price
     * @param tokenId The ID of the token
     * @return (bool, uint256) Whether the token is listed and its price
     */
    function getTokenListing(uint256 tokenId) public view returns (bool, uint256) {
        require(_exists(tokenId), "Token does not exist");
        return (_tokenListed[tokenId], _tokenPrices[tokenId]);
    }
    
    /**
     * @dev Returns token creator and royalty percentage
     * @param tokenId The ID of the token
     * @return (address, uint256) Creator address and royalty percentage in basis points
     */
    function getTokenRoyaltyInfo(uint256 tokenId) public view returns (address, uint256) {
        require(_exists(tokenId), "Token does not exist");
        return (_creators[tokenId], _royaltyPercentages[tokenId]);
    }
    
    /**
     * @dev Sets the platform fee percentage
     * @param newFeePercentage New fee percentage in basis points
     */
    function setPlatformFeePercentage(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 1000, "Platform fee cannot exceed 10%");
        platformFeePercentage = newFeePercentage;
    }
} 