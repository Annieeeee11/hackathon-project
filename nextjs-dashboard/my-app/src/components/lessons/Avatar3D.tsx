"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Text, Environment, Html } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh } from 'three'

interface ProfessorModelProps {
  isSpeaking: boolean;
  currentMessage?: string;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'explaining';
}

function ProfessorModel({ isSpeaking, currentMessage, emotion = 'neutral' }: ProfessorModelProps) {
  const { scene } = useGLTF('/professor.glb')
  const groupRef = useRef<Group>(null)
  const [animationPhase, setAnimationPhase] = useState(0)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
      
      // Speaking animation - more natural head movement
      if (isSpeaking) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.08
        groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.03
        
        // Simulate mouth movement
        setAnimationPhase(state.clock.elapsedTime * 4)
      } else {
        // Idle animation
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02
      }
    }
  })

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return '#10b981'
      case 'thinking': return '#f59e0b'
      case 'explaining': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.5} />
      
      {/* Speech bubble */}
      {isSpeaking && currentMessage && (
        <Html position={[0, 2.5, 0]} center>
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border max-w-xs">
            <p className="text-sm text-gray-800">{currentMessage}</p>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-white/90 rotate-45 border-r border-b"></div>
            </div>
          </div>
        </Html>
      )}
      
      {/* Status indicator */}
      <Text
        position={[0, 2, 0]}
        fontSize={0.2}
        color={getEmotionColor()}
        anchorX="center"
        anchorY="middle"
      >
        {isSpeaking ? '🎤' : emotion === 'thinking' ? '🤔' : '👨‍🏫'}
      </Text>
    </group>
  )
}

function FallbackProfessor({ isSpeaking, emotion = 'neutral' }: { isSpeaking: boolean, emotion?: string }) {
  const meshRef = useRef<Mesh>(null)
  const headRef = useRef<Mesh>(null)
  const leftEyeRef = useRef<Mesh>(null)
  const rightEyeRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      // Body animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
    }
    
    if (headRef.current) {
      // Head animation
      if (isSpeaking) {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 3) * 0.1
        headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.05
      } else {
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
      }
    }
    
    // Eye blinking animation
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 0.5)
      if (blinkTime > 0.95) {
        leftEyeRef.current.scale.y = 0.1
        rightEyeRef.current.scale.y = 0.1
      } else {
        leftEyeRef.current.scale.y = 1
        rightEyeRef.current.scale.y = 1
      }
    }
  })

  const getEmotionColor = () => {
    switch (emotion) {
      case 'happy': return '#10b981'
      case 'thinking': return '#f59e0b'
      case 'explaining': return '#3b82f6'
      default: return '#8b5cf6'
    }
  }

  return (
    <group>
      {/* Body */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[1, 2, 0.5]} />
        <meshStandardMaterial color={getEmotionColor()} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.8, 0.5, 0]} rotation={[0, 0, isSpeaking ? Math.PI / 6 : 0]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial color={getEmotionColor()} />
      </mesh>
      <mesh position={[0.8, 0.5, 0]} rotation={[0, 0, isSpeaking ? -Math.PI / 6 : 0]}>
        <boxGeometry args={[0.3, 1.2, 0.3]} />
        <meshStandardMaterial color={getEmotionColor()} />
      </mesh>
      
      {/* Head */}
      <mesh ref={headRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      
      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.15, 1.3, 0.35]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial color="#000" />
      </mesh>
      
      {/* Mouth */}
      <mesh position={[0, 1.1, 0.35]} scale={[1, isSpeaking ? 1.5 : 1, 1]}>
        <sphereGeometry args={[0.03]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      
      {/* Glasses */}
      <mesh position={[0, 1.3, 0.35]}>
        <torusGeometry args={[0.12, 0.02]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.15, 1.3, 0.35]}>
        <torusGeometry args={[0.08, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.15, 1.3, 0.35]}>
        <torusGeometry args={[0.08, 0.01]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}

interface Avatar3DProps {
  isSpeaking?: boolean;
  currentMessage?: string;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'explaining';
  showControls?: boolean;
  className?: string;
}

export default function Avatar3D({ 
  isSpeaking = false, 
  currentMessage = "",
  emotion = 'neutral',
  showControls = true,
  className = ""
}: Avatar3DProps) {
  const [hasGLTF, setHasGLTF] = useState(false)
  
  useEffect(() => {
    // Check if GLTF model exists
    fetch('/professor.glb')
      .then(response => setHasGLTF(response.ok))
      .catch(() => setHasGLTF(false))
  }, [])

  const getStatusMessage = () => {
    if (isSpeaking) return "Teaching lesson..."
    switch (emotion) {
      case 'thinking': return "Processing your question..."
      case 'explaining': return "Explaining concept..."
      case 'happy': return "Great job! Keep learning!"
      default: return "Ready to help"
    }
  }

  const getStatusColor = () => {
    switch (emotion) {
      case 'happy': return 'bg-green-500'
      case 'thinking': return 'bg-yellow-500'
      case 'explaining': return 'bg-blue-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <div className={`h-full w-full relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        
        <Environment preset="studio" />
        
        {hasGLTF ? (
          <ProfessorModel 
            isSpeaking={isSpeaking} 
            currentMessage={currentMessage}
            emotion={emotion}
          />
        ) : (
          <FallbackProfessor 
            isSpeaking={isSpeaking} 
            emotion={emotion}
          />
        )}
        
        {showControls && (
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 3}
            autoRotate={!isSpeaking}
            autoRotateSpeed={0.5}
          />
        )}
      </Canvas>
      
      {/* Professor Info Panel */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 ${getStatusColor()} rounded-full ${isSpeaking ? 'animate-pulse' : ''}`}></div>
          <span className="text-sm font-medium text-foreground">AI Professor</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {getStatusMessage()}
        </p>
        {currentMessage && (
          <p className="text-xs text-primary mt-1 italic">
            "{currentMessage.substring(0, 50)}{currentMessage.length > 50 ? '...' : ''}"
          </p>
        )}
      </div>

      {/* Controls Panel */}
      {showControls && (
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg p-2 border shadow-lg">
          <div className="flex flex-col gap-2">
            <button 
              className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/80"
              onClick={() => window.location.reload()}
            >
              Reset View
            </button>
            <div className="text-xs text-muted-foreground">
              Drag to rotate
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
