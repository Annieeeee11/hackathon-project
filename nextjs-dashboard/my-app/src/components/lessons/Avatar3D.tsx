"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Environment } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh } from 'three'

function ProfessorModel({ isSpeaking }: { isSpeaking: boolean }) {
  const { scene } = useGLTF('/professor.glb')
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
      
      // Speaking animation - slight head movement
      if (isSpeaking) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
      {isSpeaking && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="#3b82f6"
          anchorX="center"
          anchorY="middle"
        >
          🎤 Speaking...
        </Text>
      )}
    </group>
  )
}

function FallbackProfessor() {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <group>
      {/* Simple professor representation */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color="#8b5cf6" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      {/* Eyes */}
      <mesh position={[-0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh position={[0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000" />
      </mesh>
    </group>
  )
}

export default function Avatar3D({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Environment preset="studio" />
        
        <FallbackProfessor />
        
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
      
      {/* Professor Info */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg p-3 border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-foreground">AI Professor</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isSpeaking ? "Teaching lesson..." : "Ready to help"}
        </p>
      </div>
    </div>
  )
}
