import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#00E599" />
    </mesh>
  );
}

export default function NodeUniverseTest() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [3, 3, 3] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box />
        <OrbitControls />
      </Canvas>
      <div className="absolute top-4 left-4 bg-white p-4 border-4 border-[#0A0A0F] rounded-xl">
        <p className="font-bold">3D Test - You should see a green cube</p>
      </div>
    </div>
  );
}
