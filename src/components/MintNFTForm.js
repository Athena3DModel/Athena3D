import React, { useState } from 'react';

const MintNFTForm = ({ modelData, onSubmit, onBack }) => {
  const [nftData, setNftData] = useState({
    name: modelData?.name || '',
    description: '',
    price: '0.1',
    royalty: '10',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNftData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit(nftData);
    } catch (error) {
      console.error('Error minting NFT:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Mint Your 3D Creation as NFT</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">NFT Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            value={nftData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-24"
            placeholder="Describe your 3D NFT. This will be visible on marketplaces."
            value={nftData.description}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block mb-2">Price (ETH)</label>
            <input
              type="number"
              name="price"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              min="0.01"
              step="0.01"
              value={nftData.price}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block mb-2">Royalty (%)</label>
            <input
              type="number"
              name="royalty"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
              min="0"
              max="50"
              value={nftData.royalty}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="block mb-2">Blockchain Settings</h3>
          <div className="bg-gray-800 border border-gray-700 rounded p-4">
            <div className="flex items-center mb-2">
              <div className="w-1/3 text-gray-400">Network</div>
              <div>Ethereum Mainnet</div>
            </div>
            <div className="flex items-center mb-2">
              <div className="w-1/3 text-gray-400">Standard</div>
              <div>ERC-721</div>
            </div>
            <div className="flex items-center">
              <div className="w-1/3 text-gray-400">Gas Fee (est.)</div>
              <div>0.005 ETH</div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <button 
            type="button" 
            className="btn bg-gray-700 hover:bg-gray-600"
            onClick={onBack}
          >
            Back
          </button>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
          >
            {isLoading ? 'Minting...' : 'Mint NFT'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MintNFTForm; 