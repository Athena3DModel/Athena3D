import { ethers } from 'ethers';

// ABI (Application Binary Interface) for the Athena3DNFT smart contract
// This would be generated when compiling the smart contract
const ATHENA3D_NFT_ABI = [
  // ERC721 standard functions
  "function balanceOf(address owner) view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function transferFrom(address from, address to, uint256 tokenId)",
  "function safeTransferFrom(address from, address to, uint256 tokenId)",
  "function approve(address to, uint256 tokenId)",
  "function getApproved(uint256 tokenId) view returns (address)",
  "function setApprovalForAll(address operator, bool approved)",
  "function isApprovedForAll(address owner, address operator) view returns (bool)",
  
  // Custom contract functions
  "function mintToken(address recipient, string memory tokenURI, uint256 royaltyPercentage) returns (uint256)",
  "function listToken(uint256 tokenId, uint256 price)",
  "function unlistToken(uint256 tokenId)",
  "function purchaseToken(uint256 tokenId) payable",
  "function getTokenListing(uint256 tokenId) view returns (bool, uint256)",
  "function getTokenRoyaltyInfo(uint256 tokenId) view returns (address, uint256)",
  "function setPlatformFeePercentage(uint256 newFeePercentage)",
  
  // Events
  "event TokenMinted(address indexed creator, uint256 indexed tokenId, string tokenURI)",
  "event TokenListed(uint256 indexed tokenId, uint256 price)",
  "event TokenUnlisted(uint256 indexed tokenId)",
  "event TokenSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price)",
  "event RoyaltyPaid(uint256 indexed tokenId, address indexed creator, uint256 amount)"
];

// Mock contract address - in a real implementation, this would be the deployed contract address
const ATHENA3D_NFT_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

/**
 * Get a contract instance connected to a signer
 * @returns {Promise<ethers.Contract>} - Contract instance
 */
const getContractInstance = async (withSigner = true) => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("No ethereum provider found. Please install MetaMask.");
    }
    
    // Get provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Get contract with or without signer
    if (withSigner) {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      return new ethers.Contract(ATHENA3D_NFT_CONTRACT_ADDRESS, ATHENA3D_NFT_ABI, signer);
    } else {
      return new ethers.Contract(ATHENA3D_NFT_CONTRACT_ADDRESS, ATHENA3D_NFT_ABI, provider);
    }
  } catch (error) {
    console.error("Error getting contract instance:", error);
    throw error;
  }
};

/**
 * Mint a new NFT
 * @param {string} tokenURI - URI for token metadata (typically IPFS URL)
 * @param {number} royaltyPercentage - Royalty percentage in basis points (e.g., 1000 = 10%)
 * @returns {Promise<Object>} - Transaction result
 */
export const mintNFT = async (tokenURI, royaltyPercentage) => {
  try {
    const contract = await getContractInstance();
    const signer = contract.signer;
    const address = await signer.getAddress();
    
    // Convert royalty percentage to basis points (1% = 100 basis points)
    const royaltyBasisPoints = Math.floor(royaltyPercentage * 100);
    
    // Call mintToken function
    const tx = await contract.mintToken(address, tokenURI, royaltyBasisPoints);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Find the TokenMinted event in the logs
    const event = receipt.events.find(event => event.event === 'TokenMinted');
    const tokenId = event.args.tokenId.toString();
    
    return {
      success: true,
      tokenId,
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Error minting NFT:", error);
    throw error;
  }
};

/**
 * List an NFT for sale
 * @param {string} tokenId - Token ID
 * @param {string} price - Price in ETH
 * @returns {Promise<Object>} - Transaction result
 */
export const listNFTForSale = async (tokenId, price) => {
  try {
    const contract = await getContractInstance();
    
    // Convert price from ETH to wei
    const priceInWei = ethers.utils.parseEther(price);
    
    // Call listToken function
    const tx = await contract.listToken(tokenId, priceInWei);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Error listing NFT for sale:", error);
    throw error;
  }
};

/**
 * Unlist an NFT from sale
 * @param {string} tokenId - Token ID
 * @returns {Promise<Object>} - Transaction result
 */
export const unlistNFT = async (tokenId) => {
  try {
    const contract = await getContractInstance();
    
    // Call unlistToken function
    const tx = await contract.unlistToken(tokenId);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    return {
      success: true,
      transactionHash: receipt.transactionHash
    };
  } catch (error) {
    console.error("Error unlisting NFT:", error);
    throw error;
  }
};

/**
 * Purchase an NFT
 * @param {string} tokenId - Token ID
 * @param {string} price - Price in ETH
 * @returns {Promise<Object>} - Transaction result
 */
export const purchaseNFT = async (tokenId, price) => {
  try {
    const contract = await getContractInstance();
    
    // Convert price from ETH to wei
    const priceInWei = ethers.utils.parseEther(price);
    
    // Call purchaseToken function with the price as value
    const tx = await contract.purchaseToken(tokenId, { value: priceInWei });
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    
    // Find the TokenSold event in the logs
    const event = receipt.events.find(event => event.event === 'TokenSold');
    
    return {
      success: true,
      transactionHash: receipt.transactionHash,
      seller: event.args.seller,
      buyer: event.args.buyer,
      price: ethers.utils.formatEther(event.args.price)
    };
  } catch (error) {
    console.error("Error purchasing NFT:", error);
    throw error;
  }
};

/**
 * Get NFT details
 * @param {string} tokenId - Token ID
 * @returns {Promise<Object>} - NFT details
 */
export const getNFTDetails = async (tokenId) => {
  try {
    const contract = await getContractInstance(false);
    
    // Get token URI
    const tokenURI = await contract.tokenURI(tokenId);
    
    // Get token owner
    const owner = await contract.ownerOf(tokenId);
    
    // Get token listing info (if listed and price)
    const [isListed, priceInWei] = await contract.getTokenListing(tokenId);
    
    // Get token royalty info (creator and royalty percentage)
    const [creator, royaltyBasisPoints] = await contract.getTokenRoyaltyInfo(tokenId);
    
    // Fetch metadata from token URI
    // In a real implementation, this would fetch from IPFS or other storage
    // For this mock, we'll just return placeholder data
    const metadata = {
      name: `NFT #${tokenId}`,
      description: 'A 3D NFT created with Athena3D',
      image: `https://via.placeholder.com/300x300?text=NFT+${tokenId}`
    };
    
    return {
      tokenId,
      tokenURI,
      owner,
      creator,
      isListed,
      price: isListed ? ethers.utils.formatEther(priceInWei) : '0',
      royaltyPercentage: royaltyBasisPoints.toNumber() / 100, // Convert basis points to percentage
      metadata
    };
  } catch (error) {
    console.error("Error getting NFT details:", error);
    throw error;
  }
};

/**
 * Get all NFTs owned by the current user
 * @returns {Promise<Array>} - Array of NFTs
 */
export const getUserNFTs = async () => {
  try {
    // This would normally query the contract for tokens owned by the user
    // For this mock implementation, we'll return placeholder data
    
    // Get user address
    if (!window.ethereum) {
      throw new Error("No ethereum provider found. Please install MetaMask.");
    }
    
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];
    
    // Mock data
    return [
      {
        id: 'user_nft1',
        name: 'My Awesome Robot',
        creator: userAddress,
        owner: userAddress,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        description: 'A robot I created with Athena3D',
        modelUrl: 'https://example.com/my_model1.glb',
        price: '1.0 ETH',
        priceInWei: ethers.utils.parseEther('1.0').toString(),
        image: 'https://via.placeholder.com/300x300?text=My+Robot+NFT',
        tokenId: '123457',
        isListed: false,
      },
      {
        id: 'user_nft2',
        name: 'Fantasy Castle',
        creator: userAddress,
        owner: userAddress,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        description: 'A mystical castle with floating towers',
        modelUrl: 'https://example.com/my_model2.glb',
        price: '2.5 ETH',
        priceInWei: ethers.utils.parseEther('2.5').toString(),
        image: 'https://via.placeholder.com/300x300?text=My+Castle+NFT',
        tokenId: '123458',
        isListed: true,
      }
    ];
  } catch (error) {
    console.error("Error getting user NFTs:", error);
    throw error;
  }
};

/**
 * Upload metadata to IPFS
 * @param {Object} metadata - NFT metadata
 * @param {File} modelFile - 3D model file
 * @returns {Promise<string>} - IPFS URI
 */
export const uploadMetadataToIPFS = async (metadata, modelFile) => {
  // In a real implementation, this would upload to IPFS
  // For this mock, we'll just return a placeholder IPFS URI
  await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload delay
  
  return `ipfs://QmXyZ...${Math.random().toString(36).substring(2, 10)}`;
}; 