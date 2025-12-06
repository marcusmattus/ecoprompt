import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

/**
 * AI NODE UNIVERSE - 3D VISUALIZATION
 * Shows global AI usage as an interactive 3D network
 */

// --- DATA GENERATION ---

const REGIONS = [
  { name: 'North America', position: [-2, 1, 0], efficiency: 92, color: '#00E599', developers: 15234, tokens: '2.4B' },
  { name: 'Europe', position: [0, 1.5, -1], efficiency: 88, color: '#4FFFB0', developers: 12890, tokens: '1.8B' },
  { name: 'Asia Pacific', position: [2, 0.5, 0], efficiency: 85, color: '#FFD93D', developers: 23456, tokens: '3.2B' },
  { name: 'South America', position: [-1.5, -1, 0.5], efficiency: 78, color: '#B084FF', developers: 5678, tokens: '890M' },
  { name: 'Middle East', position: [1, -0.5, -1], efficiency: 82, color: '#FF6BCB', developers: 8901, tokens: '1.1B' },
  { name: 'Africa', position: [0, -1.5, 1], efficiency: 75, color: '#FF5252', developers: 4567, tokens: '650M' },
];

// Generate nodes for each region
const generateNodes = () => {
  const nodes = [];
  let id = 0;
  
  REGIONS.forEach((region) => {
    const nodeCount = Math.floor(region.developers / 1000);
    
    for (let i = 0; i < nodeCount; i++) {
      const spread = 0.8;
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = Math.random() * spread;
      
      nodes.push({
        id: id++,
        region: region.name,
        position: [
          region.position[0] + Math.cos(angle) * radius,
          region.position[1] + Math.sin(angle * 0.5) * radius,
          region.position[2] + Math.sin(angle) * radius,
        ],
        efficiency: region.efficiency + (Math.random() * 10 - 5),
        color: region.color,
        size: 0.03 + Math.random() * 0.04,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
  });
  
  return nodes;
};

// Generate connections between nearby nodes
const generateConnections = (nodes) => {
  const connections = [];
  const maxDistance = 1.2;
  
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = Math.sqrt(
        Math.pow(nodes[i].position[0] - nodes[j].position[0], 2) +
        Math.pow(nodes[i].position[1] - nodes[j].position[1], 2) +
        Math.pow(nodes[i].position[2] - nodes[j].position[2], 2)
      );
      
      if (distance < maxDistance && Math.random() > 0.7) {
        connections.push({
          start: nodes[i].position,
          end: nodes[j].position,
          opacity: 1 - (distance / maxDistance),
        });
      }
    }
  }
  
  return connections;
};

// --- COMPONENTS ---

// Individual Node Sphere
const Node = ({ node, isHovered, onHover, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      const baseY = node.position[1];
      meshRef.current.position.y = baseY + Math.sin(state.clock.elapsedTime * node.speed + node.phase) * 0.05;
      
      // Pulse on hover
      const targetScale = hovered ? 1.5 : 1;
      meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1;
      meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1;
      meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * 0.1;
    }
  });
  
  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 90) return '#00E599';
    if (efficiency >= 80) return '#FFD93D';
    if (efficiency >= 70) return '#FF6BCB';
    return '#FF5252';
  };
  
  return (
    <mesh
      ref={meshRef}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(node);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(node);
      }}
    >
      <sphereGeometry args={[node.size, 16, 16]} />
      <meshStandardMaterial
        color={getEfficiencyColor(node.efficiency)}
        emissive={getEfficiencyColor(node.efficiency)}
        emissiveIntensity={hovered ? 0.8 : 0.3}
        roughness={0.3}
        metalness={0.7}
      />
      
      {/* Glow effect */}
      {hovered && (
        <mesh scale={1.5}>
          <sphereGeometry args={[node.size, 16, 16]} />
          <meshBasicMaterial
            color={getEfficiencyColor(node.efficiency)}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </mesh>
  );
};

// Connection Lines
const Connection = ({ start, end, opacity }) => {
  const points = useMemo(() => {
    try {
      return [
        new THREE.Vector3(start[0], start[1], start[2]),
        new THREE.Vector3(end[0], end[1], end[2]),
      ];
    } catch (error) {
      console.error('Error creating connection:', error);
      return [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0),
      ];
    }
  }, [start, end]);
  
  return (
    <Line
      points={points}
      color="#0A0A0F"
      lineWidth={0.5}
      transparent
      opacity={opacity * 0.2}
    />
  );
};

// Region Label
const RegionLabel = ({ region }) => {
  return (
    <Html position={region.position} distanceFactor={5} center>
      <div className="
        px-4 py-2
        bg-white
        border-4 border-[#0A0A0F]
        rounded-[20px]
        font-bold text-sm
        whitespace-nowrap
        shadow-[4px_4px_0px_0px_rgba(10,10,15,1)]
        pointer-events-none
      "
      style={{ backgroundColor: region.color }}
      >
        <div className="text-[#0A0A0F]">{region.name}</div>
        <div className="text-xs opacity-70">{region.developers.toLocaleString()} devs</div>
      </div>
    </Html>
  );
};

// Hover Tooltip
const NodeTooltip = ({ node }) => {
  if (!node) return null;
  
  return (
    <Html position={node.position} distanceFactor={3} center>
      <div className="
        px-4 py-3
        bg-white
        border-4 border-[#0A0A0F]
        rounded-[16px]
        font-bold text-xs
        shadow-[6px_6px_0px_0px_rgba(10,10,15,1)]
        whitespace-nowrap
        animate-fadeIn
      ">
        <div className="text-[#0A0A0F] font-black">{node.region}</div>
        <div className="text-[10px] mt-1">
          <span className="text-[#0A0A0F]/60">Efficiency: </span>
          <span style={{ color: node.color }}>{Math.round(node.efficiency)}%</span>
        </div>
      </div>
    </Html>
  );
};

// Central Globe
const CentralGlobe = () => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#0A0A0F"
        opacity={0.1}
        transparent
        wireframe
      />
    </mesh>
  );
};

// Particle Field Background
const ParticleField = () => {
  const particlesRef = useRef();
  
  const particles = useMemo(() => {
    const positions = [];
    for (let i = 0; i < 500; i++) {
      positions.push(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15
      );
    }
    return new Float32Array(positions);
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00E599"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Main Scene
const Scene = ({ showLabels, showConnections }) => {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  
  const nodes = useMemo(() => generateNodes(), []);
  const connections = useMemo(() => generateConnections(nodes), [nodes]);
  
  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />
      
      {/* Directional Light */}
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      
      {/* Point Light */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#00E599" />
      
      {/* Background Particles */}
      <ParticleField />
      
      {/* Central Globe */}
      <CentralGlobe />
      
      {/* Region Labels */}
      {showLabels && REGIONS.map((region, i) => (
        <RegionLabel key={i} region={region} />
      ))}
      
      {/* Connections */}
      {showConnections && connections.map((conn, i) => (
        <Connection key={i} {...conn} />
      ))}
      
      {/* Nodes */}
      {nodes.map((node) => (
        <Node
          key={node.id}
          node={node}
          isHovered={hoveredNode?.id === node.id}
          onHover={setHoveredNode}
          onClick={setSelectedNode}
        />
      ))}
      
      {/* Tooltip */}
      <NodeTooltip node={hoveredNode} />
      
      {/* Camera Controls */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Main Export Component
export default function NodeUniverse() {
  const [showLabels, setShowLabels] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [viewMode, setViewMode] = useState('global'); // global, region, detailed
  const [error, setError] = useState(null);
  
  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#B084FF]/20 to-[#FF6BCB]/20">
        <div className="text-center p-8 bg-white border-4 border-[#0A0A0F] rounded-[32px] shadow-[8px_8px_0px_0px_rgba(10,10,15,1)]">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl font-black mb-2">3D Universe Error</div>
          <div className="text-sm font-medium text-gray-600 mb-4">{error.message}</div>
          <button
            onClick={() => setError(null)}
            className="px-6 py-3 bg-[#00E599] border-4 border-[#0A0A0F] rounded-[24px] font-bold hover:bg-[#FFD93D] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full relative">
      {/* Canvas */}
      <Canvas
        camera={{ position: [5, 3, 5], fov: 60 }}
        className="cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        onError={(error) => {
          console.error('Canvas error:', error);
          setError(error);
        }}
      >
        <React.Suspense fallback={null}>
          <Scene showLabels={showLabels} showConnections={showConnections} />
        </React.Suspense>
      </Canvas>
      
      {/* Controls Overlay - Top Left */}
      <div className="absolute top-6 left-6 space-y-3">
        {/* View Mode Selector */}
        <div className="bg-white border-4 border-[#0A0A0F] rounded-[20px] shadow-[6px_6px_0px_0px_rgba(10,10,15,1)] p-4">
          <div className="text-xs font-black uppercase mb-2">View Mode</div>
          <div className="flex flex-col gap-2">
            {['global', 'region', 'detailed'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`
                  px-3 py-2
                  border-2 border-[#0A0A0F]
                  rounded-[12px]
                  text-xs font-bold
                  uppercase
                  transition-all
                  ${viewMode === mode 
                    ? 'bg-[#00E599] text-[#0A0A0F]' 
                    : 'bg-white text-[#0A0A0F] hover:bg-[#F5F5F5]'
                  }
                `}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        
        {/* Toggle Controls */}
        <div className="bg-white border-4 border-[#0A0A0F] rounded-[20px] shadow-[6px_6px_0px_0px_rgba(10,10,15,1)] p-4">
          <div className="text-xs font-black uppercase mb-2">Display</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
                className="w-4 h-4 accent-[#00E599]"
              />
              <span className="text-xs font-bold">Labels</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showConnections}
                onChange={(e) => setShowConnections(e.target.checked)}
                className="w-4 h-4 accent-[#00E599]"
              />
              <span className="text-xs font-bold">Connections</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Legend - Top Right */}
      <div className="absolute top-6 right-6 bg-white border-4 border-[#0A0A0F] rounded-[20px] shadow-[6px_6px_0px_0px_rgba(10,10,15,1)] p-4">
        <div className="text-xs font-black uppercase mb-3">Efficiency</div>
        <div className="space-y-2">
          {[
            { label: 'Excellent', color: '#00E599', range: '90-100%' },
            { label: 'Good', color: '#FFD93D', range: '80-89%' },
            { label: 'Average', color: '#FF6BCB', range: '70-79%' },
            { label: 'Low', color: '#FF5252', range: '< 70%' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2 border-[#0A0A0F]"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-[10px]">
                <div className="font-bold">{item.label}</div>
                <div className="text-[#0A0A0F]/60">{item.range}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats Panel - Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
        {REGIONS.slice(0, 3).map((region, i) => (
          <div
            key={i}
            className="bg-white border-4 border-[#0A0A0F] rounded-[20px] shadow-[6px_6px_0px_0px_rgba(10,10,15,1)] p-3 min-w-[140px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full border-2 border-[#0A0A0F]"
                style={{ backgroundColor: region.color }}
              />
              <div className="text-xs font-black truncate">{region.name}</div>
            </div>
            <div className="text-[10px] space-y-0.5">
              <div>
                <span className="text-[#0A0A0F]/60">Tokens: </span>
                <span className="font-bold">{region.tokens}</span>
              </div>
              <div>
                <span className="text-[#0A0A0F]/60">Devs: </span>
                <span className="font-bold">{region.developers.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Instructions - Bottom Right */}
      <div className="absolute bottom-6 right-6 bg-[#0A0A0F] border-4 border-[#00E599] rounded-[16px] px-4 py-2 text-white">
        <div className="text-[10px] font-bold">
          🖱️ Drag to rotate • Scroll to zoom • Hover nodes for info
        </div>
      </div>
    </div>
  );
}
