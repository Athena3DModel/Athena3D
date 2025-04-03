import React from 'react';

const NftCard = ({ nft, onClick, isOwner = false }) => {
  return (
    <div 
      className="card cursor-pointer transition-transform hover:scale-105"
      onClick={onClick}
    >
      <div className="aspect-square bg-gray-800 mb-4 relative overflow-hidden">
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="w-full h-full object-cover"
        />
        
        {isOwner && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
            {nft.isListed ? 'Listed' : 'Owned'}
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold mb-2 truncate">{nft.name}</h3>
      
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-gray-400">
          Creator: 
          <span className="ml-1">{shortenAddress(nft.creator)}</span>
        </div>
        
        <div className="text-sm text-gray-400">
          ID: #{nft.tokenId.slice(-4)}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        {nft.isListed ? (
          <div className="text-purple-400 font-bold">{nft.price}</div>
        ) : (
          <div className="text-gray-400">Not for sale</div>
        )}
        
        <button 
          className="btn btn-primary btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick(nft);
          }}
        >
          {isOwner 
            ? (nft.isListed ? 'Manage' : 'List') 
            : 'View Details'
          }
        </button>
      </div>
    </div>
  );
};

// Helper function to shorten addresses
const shortenAddress = (address) => {
  if (!address) return '';
  const match = address.match(/^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}...${match[2]}`;
};

export default NftCard; 