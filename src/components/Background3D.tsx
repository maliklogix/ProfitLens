import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Aura = ({ position, color, speed, distort }: { position: [number, number, number], color: string, speed: number, distort: number }) => (
  <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
    <Sphere args={[1, 64, 64]} position={position} scale={1.5}>
      <MeshDistortMaterial
        color={color}
        speed={speed}
        distort={distort}
        radius={1}
        transparent
        opacity={0.3}
      />
    </Sphere>
  </Float>
);

const Background3D: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-slate-950 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Aura position={[-5, 3, -5]} color="#0ea5e9" speed={2} distort={0.4} />
          <Aura position={[5, -3, -5]} color="#38bdf8" speed={1.5} distort={0.5} />
          <Aura position={[0, 0, -10]} color="#0369a1" speed={1} distort={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Background3D;
