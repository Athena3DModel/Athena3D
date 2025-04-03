import React, { useState } from 'react';

const TextToModelForm = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt, style);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2">Describe your 3D model</label>
        <textarea
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-32"
          placeholder="Example: A futuristic robot with glowing blue accents and sleek metal armor"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block mb-2">Style</label>
        <div className="grid grid-cols-3 gap-2">
          {['realistic', 'cartoon', 'abstract', 'sci-fi', 'fantasy', 'minimalist'].map(styleOption => (
            <div 
              key={styleOption}
              className={`p-2 border rounded cursor-pointer text-center ${
                style === styleOption ? 'bg-purple-700 border-purple-500' : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
              }`}
              onClick={() => setStyle(styleOption)}
            >
              {styleOption.charAt(0).toUpperCase() + styleOption.slice(1)}
            </div>
          ))}
        </div>
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary w-full py-3"
        disabled={isLoading || !prompt.trim()}
      >
        {isLoading ? 'Generating...' : 'Generate 3D Model'}
      </button>
    </form>
  );
};

export default TextToModelForm; 