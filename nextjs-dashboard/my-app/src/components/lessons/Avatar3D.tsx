"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function ProfessorModel() {
  const { scene } = useGLTF('/professor.glb')
  return <primitive object={scene} scale={2} />
}

export default function Avatar3D() {
  return (
    <div className="h-80">
      <Canvas>
        <ambientLight intensity={0.5} />
        <ProfessorModel />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
