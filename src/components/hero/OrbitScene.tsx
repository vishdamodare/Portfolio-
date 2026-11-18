"use client";
// Lazy chunk: the only WebGL on the page. A slow ring of curved glass and photo panels.
import { useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";

const TEX = ["/media/reel-1.webp", "/media/photo-stage.webp", "/media/reel-3.webp", "/media/reel-6.webp"];
const COUNT = 8;
const R = 2.5;

function Ring() {
  const g = useRef<THREE.Group>(null);
  const tex = useTexture(TEX);
  tex.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));

  useFrame((state, dt) => {
    const grp = g.current;
    if (!grp) return;
    grp.rotation.y += dt * 0.12;
    grp.rotation.x = THREE.MathUtils.lerp(grp.rotation.x, 0.16 + state.pointer.y * 0.08, 0.05);
    grp.rotation.z = THREE.MathUtils.lerp(grp.rotation.z, -0.1 + state.pointer.x * 0.06, 0.05);
  });

  return (
    <group ref={g}>
      {Array.from({ length: COUNT }, (_, i) => {
        const img = i % 2 === 0 ? tex[(i / 2) % tex.length] : null;
        const theta = img ? 0.36 : 0.5; // 9:16 photo panels, wider glass panels
        const h = img ? R * theta * (16 / 9) : 0.75;
        return (
          <mesh key={i} rotation={[0, (i / COUNT) * Math.PI * 2, 0]} position={[0, ((i % 3) - 1) * 0.22, 0]}>
            <cylinderGeometry args={[R, R, h, 20, 1, true, -theta / 2, theta]} />
            {img ? (
              <meshBasicMaterial map={img} side={THREE.DoubleSide} toneMapped={false} />
            ) : (
              <meshStandardMaterial color="#ffffff" transparent opacity={0.5} roughness={0.2} metalness={0.1} side={THREE.DoubleSide} />
            )}
          </mesh>
        );
      })}
    </group>
  );
}

export default function OrbitScene({ active }: { active: boolean }) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.4, 7.2], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} />
      <Suspense fallback={null}>
        <Ring />
      </Suspense>
    </Canvas>
  );
}
