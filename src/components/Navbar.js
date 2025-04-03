import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  const connectWallet = async () => {
    // In a real implementation, this would connect to a Web3 wallet
    try {
      console.log('Connecting wallet...');
      // Simulate a successful connection
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };
  
  return (
    <nav className="bg-gray-900 shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Athena3D
        </Link>
        
        <div className="flex items-center">
          <div className="hidden md:flex space-x-6 mr-6">
            <NavLink to="/" isActive={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/create" isActive={location.pathname === '/create'}>
              Create
            </NavLink>
            <NavLink to="/gallery" isActive={location.pathname === '/gallery'}>
              Gallery
            </NavLink>
            <NavLink to="/marketplace" isActive={location.pathname === '/marketplace'}>
              Marketplace
            </NavLink>
          </div>
          
          <button 
            className={`btn ${isWalletConnected ? 'bg-green-600' : 'btn-primary'}`}
            onClick={connectWallet}
          >
            {isWalletConnected 
              ? 'Wallet Connected' 
              : 'Connect Wallet'
            }
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ children, to, isActive }) => {
  return (
    <Link 
      to={to} 
      className={`hover:text-purple-400 transition-colors ${isActive ? 'text-purple-400 font-medium' : 'text-gray-300'}`}
    >
      {children}
    </Link>
  );
};

export default Navbar; 