import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center max-w-4xl mb-12">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Athena3D: Create Your Own 3D NFTs
        </h1>
        <p className="text-xl mb-8">
          Transform your ideas into stunning 3D NFTs with our AI-powered platform. No technical skills required!
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/create" className="btn btn-primary px-8 py-3 text-lg">
            Start Creating
          </Link>
          <Link to="/marketplace" className="btn bg-gray-700 text-white px-8 py-3 text-lg hover:bg-gray-600">
            Explore Marketplace
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
        <div className="card">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">AI-Powered Generation</h3>
          <p>Create complex 3D models from simple text descriptions or 2D images using our advanced AI technology.</p>
        </div>
        <div className="card">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">Web3 Integration</h3>
          <p>Mint your creations as NFTs directly on the platform and trade them in our marketplace.</p>
        </div>
        <div className="card">
          <h3 className="text-2xl font-bold mb-4 text-purple-400">Creator Royalties</h3>
          <p>Earn royalties every time your NFT is resold in the marketplace, providing ongoing revenue.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 