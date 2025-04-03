import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ModelPreview from '../components/ModelPreview';

const Gallery = () => {
  // In a real application, this would be fetched from a backend or blockchain
  const [nfts, setNfts] = useState([
    {
      id: 'nft1',
      name: 'Futuristic Robot',
      creator: '0x1234...5678',
      createdAt: '2025-05-15T14:30:00Z',
      description: 'A sleek futuristic robot with glowing blue accents.',
      modelUrl: 'https://example.com/model1.glb',
      price: '0.5 ETH',
      owner: '0x1234...5678',
      image: 'https://via.placeholder.com/300x300?text=Robot+NFT'
    },
    {
      id: 'nft2',
      name: 'Ancient Dragon',
      creator: '0x8765...4321',
      createdAt: '2025-05-14T10:15:00Z',
      description: 'A mythical dragon with intricate scale details and massive wings.',
      modelUrl: 'https://example.com/model2.glb',
      price: '1.2 ETH',
      owner: '0x8765...4321',
      image: 'https://via.placeholder.com/300x300?text=Dragon+NFT'
    },
    {
      id: 'nft3',
      name: 'Cosmic Spaceship',
      creator: '0x2345...6789',
      createdAt: '2025-05-13T09:45:00Z',
      description: 'An interstellar spacecraft with advanced propulsion systems.',
      modelUrl: 'https://example.com/model3.glb',
      price: '0.8 ETH',
      owner: '0x2345...6789',
      image: 'https://via.placeholder.com/300x300?text=Spaceship+NFT'
    },
    {
      id: 'nft4',
      name: 'Crystal Castle',
      creator: '0x3456...7890',
      createdAt: '2025-05-12T16:20:00Z',
      description: 'A magnificent castle made entirely of translucent crystal.',
      modelUrl: 'https://example.com/model4.glb',
      price: '1.5 ETH',
      owner: '0x3456...7890',
      image: 'https://via.placeholder.com/300x300?text=Castle+NFT'
    }
  ]);

  const [selectedNft, setSelectedNft] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleNftClick = (nft) => {
    setSelectedNft(nft);
  };

  const closeModal = () => {
    setSelectedNft(null);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">NFT Gallery</h1>
        <p className="text-lg mb-6">Explore and collect unique 3D NFTs created with Athena3D</p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'bg-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            All NFTs
          </button>
          <button 
            className={`btn ${filter === 'newest' ? 'btn-primary' : 'bg-gray-700'}`}
            onClick={() => setFilter('newest')}
          >
            Newest
          </button>
          <button 
            className={`btn ${filter === 'popular' ? 'btn-primary' : 'bg-gray-700'}`}
            onClick={() => setFilter('popular')}
          >
            Popular
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {nfts.map(nft => (
          <div 
            key={nft.id} 
            className="card cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleNftClick(nft)}
          >
            <div className="aspect-square bg-gray-800 mb-4 flex items-center justify-center">
              <img 
                src={nft.image} 
                alt={nft.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">{nft.name}</h3>
            <p className="text-gray-400 mb-2">Creator: {nft.creator}</p>
            <div className="flex justify-between items-center">
              <span className="text-purple-400 font-bold">{nft.price}</span>
              <button className="btn btn-primary btn-sm">Buy Now</button>
            </div>
          </div>
        ))}
      </div>

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
                    <div className="text-gray-400">Created</div>
                    <div>{new Date(selectedNft.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-8">
                  <div>
                    <div className="text-gray-400 text-sm">Current Price</div>
                    <div className="text-2xl font-bold text-purple-400">{selectedNft.price}</div>
                  </div>
                  <button className="btn btn-primary px-6 py-3">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 