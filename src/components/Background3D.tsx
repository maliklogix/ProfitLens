import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

const Aura = ({ position, color, speed, distort }: { position: [number, number, number], color: string, speed: number, distort: number }) => (
  <Float speed={speed} rotationIntensity={0.5} floatIntensity={2}>
    <Sphere args={[1, 32, 32]} position={position} scale={1.5}>
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

interface Background3DProps {
  isDark: boolean;
}

const Background3D: React.FC<Background3DProps> = ({ isDark }) => {
  return (
    <div
      className={`fixed inset-0 -z-10 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-slate-950' : 'bg-slate-50'
      }`}
    >
      <Canvas camera={{ position: [0, 0, 8] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          {isDark ? (
            <>
              <Aura position={[-5, 3, -5]} color="#f9fafb" speed={2} distort={0.4} />
              <Aura position={[5, -3, -5]} color="#e5e7eb" speed={1.5} distort={0.5} />
              <Aura position={[0, 0, -10]} color="#9ca3af" speed={1} distort={0.3} />
            </>
          ) : (
            <>
              <Aura position={[-5, 3, -5]} color="#0f172a" speed={2} distort={0.4} />
              <Aura position={[5, -3, -5]} color="#4b5563" speed={1.5} distort={0.5} />
              <Aura position={[0, 0, -10]} color="#9ca3af" speed={1} distort={0.3} />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Background3D;
