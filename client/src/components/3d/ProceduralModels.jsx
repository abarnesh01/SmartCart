import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export const Headphones3D = ({ color = '#3b82f6', accentColor = '#f43f5e', roughness = 0.3, metalness = 0.7 }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Headband curve */}
      <mesh position={[0, 0.8, 0]}>
        <torusGeometry args={[1.1, 0.12, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* Headband cushion */}
      <mesh position={[0, 1.45, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.2, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      {/* Left Ear Cup Outer Shell */}
      <group position={[-1.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.4, 32]} />
          <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
        </mesh>
        {/* Accent Ring */}
        <mesh position={[0, 0.21, 0]}>
          <torusGeometry args={[0.71, 0.04, 16, 32]} />
          <meshStandardMaterial color={accentColor} roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Ear Cushion */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.18, 32]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
      </group>

      {/* Right Ear Cup Outer Shell */}
      <group position={[1.15, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 0.4, 32]} />
          <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
        </mesh>
        {/* Accent Ring */}
        <mesh position={[0, 0.21, 0]}>
          <torusGeometry args={[0.71, 0.04, 16, 32]} />
          <meshStandardMaterial color={accentColor} roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Ear Cushion */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[0.68, 0.68, 0.18, 32]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
};

export const Watch3D = ({ color = '#334155', accentColor = '#06b6d4' }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Watch Case */}
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 0.3, 32]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
      </mesh>
      {/* Screen Dial */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.88, 0.88, 0.02, 32]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Screen Glowing Ring */}
      <mesh position={[0, 0.18, 0]}>
        <ringGeometry args={[0.75, 0.82, 32]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
      {/* Crown Button */}
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 0.2, 16]} />
        <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Top Strap */}
      <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.8, 1.4, 0.15]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
      {/* Bottom Strap */}
      <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.8, 1.4, 0.15]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} />
      </mesh>
    </group>
  );
};

export const Phone3D = ({ color = '#0f172a', accentColor = '#38bdf8' }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Body Chassis */}
      <mesh>
        <boxGeometry args={[1.2, 2.4, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Front Glass */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[1.14, 2.32]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
      </mesh>
      {/* Rear Camera Bump */}
      <mesh position={[-0.32, 0.75, -0.1]}>
        <boxGeometry args={[0.45, 0.7, 0.08]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Camera Lenses */}
      <mesh position={[-0.32, 0.9, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color={accentColor} roughness={0.1} metalness={1.0} />
      </mesh>
      <mesh position={[-0.32, 0.6, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color={accentColor} roughness={0.1} metalness={1.0} />
      </mesh>
    </group>
  );
};

export const Shoe3D = ({ color = '#ef4444', accentColor = '#fcd34d' }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Sole */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.1, 0.35, 2.6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      {/* Upper Mesh */}
      <mesh position={[0, 0.3, 0.1]}>
        <boxGeometry args={[1.02, 0.65, 2.1]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Ankle Collar */}
      <mesh position={[0, 0.6, -0.6]}>
        <cylinderGeometry args={[0.45, 0.5, 0.5, 16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>
      {/* Side Stripe / Carbon Plate Accent */}
      <mesh position={[0.53, 0.15, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.6, 0.2]} />
        <meshStandardMaterial color={accentColor} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
};

export const Chair3D = ({ color = '#1e293b', accentColor = '#0284c7' }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.4, 0.2, 1.4]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
      {/* Mesh Backrest */}
      <mesh position={[0, 1.1, -0.6]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.3, 1.5, 0.12]} />
        <meshStandardMaterial color={accentColor} roughness={0.4} />
      </mesh>
      {/* Center Cylinder Stem */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#64748b" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Base Star Legs */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.1, 5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.8} />
      </mesh>
    </group>
  );
};

export const Controller3D = ({ color = '#0f172a', accentColor = '#a855f7' }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Body */}
      <mesh>
        <boxGeometry args={[1.8, 1.0, 0.4]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Left Grip */}
      <mesh position={[-0.8, -0.5, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.3, 0.25, 1.2, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Right Grip */}
      <mesh position={[0.8, -0.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.3, 0.25, 1.2, 16]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Thumbsticks */}
      <mesh position={[-0.4, 0.1, 0.25]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshStandardMaterial color={accentColor} roughness={0.2} metalness={0.8} />
      </mesh>
      <mesh position={[0.4, -0.1, 0.25]}>
        <cylinderGeometry args={[0.2, 0.2, 0.2, 16]} />
        <meshStandardMaterial color={accentColor} roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
};
