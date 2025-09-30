import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

interface BikeModelProps {
  modelPath: string;
}

function BikeModel({ modelPath }: BikeModelProps) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);

  useFrame((state) => {
    if (group.current) {
      // Subtle rotation animation
      group.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.2} position={[0, -0.5, 0]} />
    </group>
  );
}

interface BikeViewer3DProps {
  modelPath: string;
  className?: string;
}

const BikeViewer3D = ({ modelPath, className = "" }: BikeViewer3DProps) => {
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [3, 1, 3], fov: 45 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00FFA3" />
          <pointLight position={[10, -10, 10]} intensity={0.5} color="#00E5FF" />
          
          <BikeModel modelPath={modelPath} />
          
          <ContactShadows
            position={[0, -0.8, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={4}
          />
          
          <Environment preset="night" />
          
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            minDistance={2}
            maxDistance={8}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background via-transparent to-transparent opacity-30" />
    </div>
  );
};

export default BikeViewer3D;
