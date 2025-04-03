import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import ModelPreview from '../components/ModelPreview';
import TextToModelForm from '../components/TextToModelForm';
import ImageToModelForm from '../components/ImageToModelForm';
import MintNFTForm from '../components/MintNFTForm';

const Create = () => {
  const [creationMethod, setCreationMethod] = useState('text');
  const [modelData, setModelData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState('create'); // 'create', 'customize', 'mint'
  
  const handleModelGeneration = async (prompt, method) => {
    setIsGenerating(true);
    
    try {
      // This would call our AI service in a real implementation
      // For demo purposes, we'll just simulate a delay and return a dummy model
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Dummy model data - in a real implementation, this would be the result from the AI service
      setModelData({
        id: 'model_' + Date.now(),
        name: prompt.split(' ').slice(0, 3).join('_'),
        prompt,
        // In a real app, this would be a URL to the generated model or the model data itself
        modelUrl: 'https://example.com/model.glb', 
        createdAt: new Date().toISOString(),
      });
      
      setCurrentStep('customize');
    } catch (error) {
      console.error('Error generating model:', error);
      alert('Failed to generate model. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleMintNFT = async (nftData) => {
    try {
      // This would interact with blockchain in a real implementation
      console.log('Minting NFT with data:', { ...modelData, ...nftData });
      alert('NFT minted successfully! (This is a demo)');
      // Reset state or redirect to gallery
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Create Your 3D NFT</h1>
        <div className="flex space-x-4 mb-6">
          {/* Step indicators */}
          <div className={`p-3 rounded-lg ${currentStep === 'create' ? 'bg-purple-700' : 'bg-gray-700'}`}>
            1. Create
          </div>
          <div className={`p-3 rounded-lg ${currentStep === 'customize' ? 'bg-purple-700' : 'bg-gray-700'}`}>
            2. Customize
          </div>
          <div className={`p-3 rounded-lg ${currentStep === 'mint' ? 'bg-purple-700' : 'bg-gray-700'}`}>
            3. Mint NFT
          </div>
        </div>
      </div>
      
      {currentStep === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Choose Creation Method</h2>
            <div className="flex mb-6">
              <button 
                className={`btn ${creationMethod === 'text' ? 'btn-primary' : 'bg-gray-700'} mr-4`}
                onClick={() => setCreationMethod('text')}
              >
                Text to 3D
              </button>
              <button 
                className={`btn ${creationMethod === 'image' ? 'btn-primary' : 'bg-gray-700'}`}
                onClick={() => setCreationMethod('image')}
              >
                Image to 3D
              </button>
            </div>
            
            {creationMethod === 'text' ? (
              <TextToModelForm onSubmit={(prompt) => handleModelGeneration(prompt, 'text')} isLoading={isGenerating} />
            ) : (
              <ImageToModelForm onSubmit={(data) => handleModelGeneration(data.prompt, 'image')} isLoading={isGenerating} />
            )}
          </div>
          
          <div className="card flex items-center justify-center h-80">
            {isGenerating ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p>Generating your 3D model... This may take a few minutes.</p>
              </div>
            ) : modelData ? (
              <div className="w-full h-full">
                <Canvas>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                  <OrbitControls />
                  <ModelPreview modelData={modelData} />
                </Canvas>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Your 3D model preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {currentStep === 'customize' && modelData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Customize Your Model</h2>
            {/* Add customization options here */}
            <div className="mb-4">
              <label className="block mb-2">Model Name</label>
              <input 
                type="text" 
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                value={modelData.name}
                onChange={(e) => setModelData({...modelData, name: e.target.value})}
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">Color</label>
              <div className="flex space-x-2">
                {['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'].map(color => (
                  <button 
                    key={color}
                    className="w-10 h-10 rounded-full border-2 border-gray-600"
                    style={{ backgroundColor: color }}
                    onClick={() => setModelData({...modelData, color})}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <button 
                className="btn bg-gray-700 hover:bg-gray-600"
                onClick={() => setCurrentStep('create')}
              >
                Back
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => setCurrentStep('mint')}
              >
                Continue to Mint
              </button>
            </div>
          </div>
          
          <div className="card h-96">
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <OrbitControls />
              <ModelPreview modelData={modelData} />
            </Canvas>
          </div>
        </div>
      )}
      
      {currentStep === 'mint' && modelData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MintNFTForm 
            modelData={modelData} 
            onSubmit={handleMintNFT}
            onBack={() => setCurrentStep('customize')}
          />
          
          <div className="card h-96">
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <OrbitControls />
              <ModelPreview modelData={modelData} />
            </Canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create; 