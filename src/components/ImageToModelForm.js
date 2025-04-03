import React, { useState } from 'react';

const ImageToModelForm = ({ onSubmit, isLoading }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [prompt, setPrompt] = useState('');
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      onSubmit({
        image,
        prompt: prompt.trim() ? prompt : 'Convert this image to a 3D model'
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-2">Upload an image</label>
        <div 
          className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors"
          onClick={() => document.getElementById('imageUpload').click()}
        >
          {imagePreview ? (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-40 mx-auto"
            />
          ) : (
            <div className="py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2">Click to upload an image or drag and drop</p>
              <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
            </div>
          )}
          <input 
            type="file" 
            id="imageUpload" 
            className="hidden" 
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2">Additional description (optional)</label>
        <textarea
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-20"
          placeholder="Add any additional details about what you want in the 3D model"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary w-full py-3"
        disabled={isLoading || !image}
      >
        {isLoading ? 'Generating...' : 'Generate 3D Model'}
      </button>
    </form>
  );
};

export default ImageToModelForm; 