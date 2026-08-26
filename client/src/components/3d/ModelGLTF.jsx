import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const ModelGLTF = ({ url, scale = 1, autoRotate = true }) => {
  const { scene } = useGLTF(url);
  const modelRef = useRef();

  useFrame((state, delta) => {
    if (autoRotate && modelRef.current) {
      modelRef.current.rotation.y += delta * 0.3;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={scale} position={[0, 0, 0]} />;
};

export default ModelGLTF;
