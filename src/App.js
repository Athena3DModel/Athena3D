import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Create from './pages/Create';
import Gallery from './pages/Gallery';
import Marketplace from './pages/Marketplace';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container mx-auto py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 