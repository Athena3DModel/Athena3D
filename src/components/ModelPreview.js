import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';

// This is a placeholder component for 3D model rendering
// In a real implementation, this would use the actual 3D model data
const ModelPreview = ({ modelData }) => {
  const meshRef = useRef();
  
  // Simple rotation animation
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <Box 
      ref={meshRef}
      args={[1, 1, 1]} 
      position={[0, 0, 0]}
    >
      <meshStandardMaterial 
        color={modelData?.color || "#7c3aed"}
        metalness={0.5}
        roughness={0.5}
      />
    </Box>
  );
};

export default ModelPreview; 