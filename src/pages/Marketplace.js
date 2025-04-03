import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ModelPreview from '../components/ModelPreview';
import NftCard from '../components/NftCard';
import { getUserNFTs } from '../services/blockchainService';

const Marketplace = () => {
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [userNfts, setUserNfts] = useState([]);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore', 'my-nfts', 'my-listings'
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'low-to-high', 'high-to-low'
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch marketplace NFTs
    const fetchNfts = async () => {
      setIsLoading(true);
      
      try {
        // This would normally call a blockchain or backend service
        // For demo purposes, we'll use some mock data
        const mockNfts = [
          {
            id: 'nft1',
            name: 'Futuristic Robot',
            creator: '0x1234...5678',
            owner: '0x8765...4321',
            createdAt: '2025-05-15T14:30:00Z',
            description: 'A sleek futuristic robot with glowing blue accents.',
            modelUrl: 'https://example.com/model1.glb',
            price: '0.5 ETH',
            priceInWei: ethers.utils.parseEther('0.5').toString(),
            image: 'https://via.placeholder.com/300x300?text=Robot+NFT',
            tokenId: '123456',
            isListed: true,
          },
          {
            id: 'nft2',
            name: 'Ancient Dragon',
            creator: '0x8765...4321',
            owner: '0x1234...5678',
            createdAt: '2025-05-14T10:15:00Z',
            description: 'A mythical dragon with intricate scale details and massive wings.',
            modelUrl: 'https://example.com/model2.glb',
            price: '1.2 ETH',
            priceInWei: ethers.utils.parseEther('1.2').toString(),
            image: 'https://via.placeholder.com/300x300?text=Dragon+NFT',
            tokenId: '234567',
            isListed: true,
          },
          {
            id: 'nft3',
            name: 'Cosmic Spaceship',
            creator: '0x2345...6789',
            owner: '0x3456...7890',
            createdAt: '2025-05-13T09:45:00Z',
            description: 'An interstellar spacecraft with advanced propulsion systems.',
            modelUrl: 'https://example.com/model3.glb',
            price: '0.8 ETH',
            priceInWei: ethers.utils.parseEther('0.8').toString(),
            image: 'https://via.placeholder.com/300x300?text=Spaceship+NFT',
            tokenId: '345678',
            isListed: true,
          },
          {
            id: 'nft4',
            name: 'Crystal Castle',
            creator: '0x3456...7890',
            owner: '0x2345...6789',
            createdAt: '2025-05-12T16:20:00Z',
            description: 'A magnificent castle made entirely of translucent crystal.',
            modelUrl: 'https://example.com/model4.glb',
            price: '1.5 ETH',
            priceInWei: ethers.utils.parseEther('1.5').toString(),
            image: 'https://via.placeholder.com/300x300?text=Castle+NFT',
            tokenId: '456789',
            isListed: true,
          },
          {
            id: 'nft5',
            name: 'Mythical Phoenix',
            creator: '0x4567...8901',
            owner: '0x5678...9012',
            createdAt: '2025-05-11T11:30:00Z',
            description: 'A majestic phoenix with fiery wings and golden details.',
            modelUrl: 'https://example.com/model5.glb',
            price: '2.0 ETH',
            priceInWei: ethers.utils.parseEther('2.0').toString(),
            image: 'https://via.placeholder.com/300x300?text=Phoenix+NFT',
            tokenId: '567890',
            isListed: true,
          },
        ];
        
        setNfts(mockNfts);
        
        // Fetch user NFTs if on my-nfts tab
        if (activeTab === 'my-nfts' || activeTab === 'my-listings') {
          const userNftData = await getUserNFTs();
          setUserNfts(userNftData);
        }
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNfts();
  }, [activeTab]);
  
  const handleNftClick = (nft) => {
    setSelectedNft(nft);
  };
  
  const closeModal = () => {
    setSelectedNft(null);
  };
  
  const handlePurchase = async (nft) => {
    try {
      // In a real implementation, this would call the smart contract
      console.log(`Purchasing NFT: ${nft.name} for ${nft.price}`);
      alert(`NFT purchased successfully! (This is a demo)`);
      closeModal();
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      alert('Failed to purchase NFT. Please try again.');
    }
  };
  
  const handleListNft = async (nft, price) => {
    try {
      // In a real implementation, this would call the smart contract
      console.log(`Listing NFT: ${nft.name} for ${price} ETH`);
      alert(`NFT listed successfully! (This is a demo)`);
    } catch (error) {
      console.error('Error listing NFT:', error);
      alert('Failed to list NFT. Please try again.');
    }
  };
  
  const filteredNfts = () => {
    let filtered = activeTab === 'explore' ? nfts : 
                  activeTab === 'my-nfts' ? userNfts : 
                  userNfts.filter(nft => nft.isListed);
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(nft => 
        nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nft.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (filter) {
      case 'recent':
        return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'low-to-high':
        return [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case 'high-to-low':
        return [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      default:
        return filtered;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">NFT Marketplace</h1>
        <p className="text-lg mb-6">Buy, sell, and trade unique 3D NFTs created with Athena3D</p>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button 
              className={`btn ${activeTab === 'explore' ? 'btn-primary' : 'bg-gray-700'}`}
              onClick={() => setActiveTab('explore')}
            >
              Explore
            </button>
            <button 
              className={`btn ${activeTab === 'my-nfts' ? 'btn-primary' : 'bg-gray-700'}`}
              onClick={() => setActiveTab('my-nfts')}
            >
              My NFTs
            </button>
            <button 
              className={`btn ${activeTab === 'my-listings' ? 'btn-primary' : 'bg-gray-700'}`}
              onClick={() => setActiveTab('my-listings')}
            >
              My Listings
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search NFTs..."
                className="w-full p-2 pr-8 bg-gray-800 border border-gray-700 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            
            <select
              className="p-2 bg-gray-800 border border-gray-700 rounded"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="recent">Recently Added</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredNfts().length === 0 ? (
        <div className="text-center p-12 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
          <p className="text-gray-400">
            {activeTab === 'explore' 
              ? "There are no NFTs available in the marketplace yet." 
              : activeTab === 'my-nfts' 
                ? "You don't own any NFTs yet. Create one or purchase from the marketplace." 
                : "You haven't listed any NFTs for sale yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNfts().map(nft => (
            <NftCard 
              key={nft.id} 
              nft={nft} 
              onClick={() => handleNftClick(nft)}
              isOwner={activeTab === 'my-nfts' || activeTab === 'my-listings'}
            />
          ))}
        </div>
      )}

      {selectedNft && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-2xl font-bold">{selectedNft.name}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="h-80 bg-gray-800 rounded-lg">
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <OrbitControls />
                  <ModelPreview modelData={selectedNft} />
                </Canvas>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-300">{selectedNft.description}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Details</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-400">Creator</div>
                    <div>{selectedNft.creator}</div>
                    <div className="text-gray-400">Owner</div>
                    <div>{selectedNft.owner}</div>
                    <div className="text-gray-400">Token ID</div>
                    <div>{selectedNft.tokenId}</div>
                    <div className="text-gray-400">Created</div>
                    <div>{new Date(selectedNft.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-8">
                  <div>
                    <div className="text-gray-400 text-sm">Price</div>
                    <div className="text-2xl font-bold text-purple-400">{selectedNft.price}</div>
                  </div>
                  
                  {activeTab === 'my-nfts' && !selectedNft.isListed ? (
                    <button 
                      className="btn btn-primary px-6 py-3"
                      onClick={() => {
                        const price = prompt("Enter listing price in ETH:", "1.0");
                        if (price !== null && !isNaN(parseFloat(price)) && parseFloat(price) > 0) {
                          handleListNft(selectedNft, price);
                        }
                      }}
                    >
                      List for Sale
                    </button>
                  ) : activeTab === 'my-listings' ? (
                    <button 
                      className="btn bg-red-600 hover:bg-red-700 text-white px-6 py-3"
                      onClick={() => {
                        if (confirm("Are you sure you want to cancel this listing?")) {
                          console.log(`Cancelling listing for NFT: ${selectedNft.name}`);
                          alert(`Listing cancelled successfully! (This is a demo)`);
                          closeModal();
                        }
                      }}
                    >
                      Cancel Listing
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary px-6 py-3"
                      onClick={() => handlePurchase(selectedNft)}
                    >
                      Buy Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 