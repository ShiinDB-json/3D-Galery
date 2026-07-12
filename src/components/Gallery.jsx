import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import GalleryItem from './GalleryItem'
import { DoubleSide } from 'three'

function WaveParticle({ position, height, color, speed, phase }) {
  const mesh = useRef()
  const baseH = height
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime()
    const wave = Math.sin(t * speed + phase) * 0.5 + 0.5
    const h = baseH * (0.3 + wave * 0.7)
    mesh.current.scale.y = h / baseH
    mesh.current.position.y = position[1] - (baseH - h) * 0.5
    mesh.current.material.opacity = 0.06 + wave * 0.08
  })
  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.03, baseH, 0.03]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function Petal({ position, rotation, scale, color, speed, delay }) {
  const mesh = useRef()
  const windOffset = useRef(Math.random() * Math.PI * 2)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime() + delay
    const wind = Math.sin(t * 0.5 + windOffset.current)
    mesh.current.position.y -= speed * 0.016
    mesh.current.position.x += wind * 0.003
    mesh.current.rotation.z += 0.006 + wind * 0.004
    mesh.current.rotation.x += 0.003
    if (mesh.current.position.y < -4) {
      mesh.current.position.set(
        (Math.random() - 0.5) * 22,
        8 + Math.random() * 4,
        (Math.random() - 0.5) * 16
      )
      windOffset.current = Math.random() * Math.PI * 2
    }
  })
  return (
    <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.12, 0.16]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function GlowRing({ color, position }) {
  const ring = useRef()
  useFrame((state) => {
    if (!ring.current) return
    const t = state.clock.getElapsedTime()
    ring.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.04)
    ring.current.material.opacity = 0.12 + Math.sin(t * 2) * 0.06
  })
  return (
    <mesh ref={ring} position={[position[0], position[1] + 0.12, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 1.54, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.18} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function AmbientOrb({ position, color, size }) {
  const orb = useRef()
  useFrame((state) => {
    if (!orb.current) return
    const t = state.clock.getElapsedTime()
    orb.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.4
    orb.current.position.x = position[0] + Math.cos(t * 0.35 + position[2]) * 0.25
  })
  return (
    <mesh ref={orb} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.1} depthWrite={false} />
    </mesh>
  )
}

function CenterCrystal() {
  const crystal = useRef()
  const ring = useRef()
  useFrame((state) => {
    if (!crystal.current || !ring.current) return
    const t = state.clock.getElapsedTime()
    crystal.current.rotation.y = t * 0.35
    crystal.current.rotation.x = Math.sin(t * 0.25) * 0.15
    crystal.current.position.y = Math.sin(t * 0.7) * 0.12
    ring.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.08
    ring.current.rotation.z = t * 0.15
  })
  return (
    <group>
      <mesh ref={crystal} position={[0, 0.9, 0]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshBasicMaterial color="#2EC4B6" transparent opacity={0.25} wireframe />
      </mesh>
      <mesh ref={ring} position={[0, 0.9, 0]}>
        <torusGeometry args={[0.45, 0.008, 8, 64]} />
        <meshBasicMaterial color="#3DE2D1" transparent opacity={0.15} side={DoubleSide} />
      </mesh>
    </group>
  )
}

export default function Gallery({ items, onSelect }) {
  const radius = 9
  const count = items.length

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const petalColors = ['#2EC4B6', '#3DE2D1', '#a8f0e8', '#7EDCD3', '#5EE8DB', '#6FD8C5']

  return (
    <>
      <color attach="background" args={['#060f13']} />
      <fog attach="fog" args={['#060f13', 12, 40]} />

      {/* Professional lighting setup */}
      <ambientLight intensity={0.15} color="#0a2025" />
      <pointLight position={[0, 6, 4]} intensity={1.2} color="#2EC4B6" distance={30} decay={2} />
      <pointLight position={[-5, 2, -3]} intensity={0.4} color="#0c7b77" distance={20} decay={2} />
      <pointLight position={[5, 1, -2]} intensity={0.25} color="#f0c27f" distance={15} decay={2} />
      <pointLight position={[0, -2, 3]} intensity={0.2} color="#6a9a9a" distance={12} decay={2} />
      <pointLight position={[-2, 4, 5]} intensity={0.2} color="#ff6b8a" distance={18} decay={2} />
      <Environment preset="night" />

      {/* Subtle particles */}
      {!reducedMotion && (
        <group>
          {Array.from({ length: 12 }).map((_, i) => (
            <WaveParticle
              key={`wave-${i}`}
              position={[(i - 6) * 0.5, -2.2, -6]}
              height={0.2 + Math.random() * 0.5}
              color={petalColors[i % petalColors.length]}
              speed={1.2 + Math.random() * 1.5}
              phase={i * 0.3}
            />
          ))}
        </group>
      )}

      {/* Elegant floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]}>
        <circleGeometry args={[radius + 8, 128]} />
        <meshStandardMaterial
          color="#050d11"
          roughness={0.6}
          metalness={0.25}
        />
      </mesh>

      {!reducedMotion && <CenterCrystal />}

      {!reducedMotion && (
        <group>
          {Array.from({ length: 16 }).map((_, i) => (
            <Petal
              key={i}
              position={[(Math.random() - 0.5) * 22, Math.random() * 12 - 2, (Math.random() - 0.5) * 16]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              scale={0.35 + Math.random() * 0.5}
              color={petalColors[Math.floor(Math.random() * petalColors.length)]}
              speed={0.08 + Math.random() * 0.12}
              delay={Math.random() * 8}
            />
          ))}
        </group>
      )}

      {!reducedMotion && (
        <group>
          <AmbientOrb position={[-3, 2, -2]} color="#2EC4B6" size={0.12} />
          <AmbientOrb position={[3, 2.5, -3]} color="#3DE2D1" size={0.1} />
          <AmbientOrb position={[0, 3, 2]} color="#f0c27f" size={0.08} />
          <AmbientOrb position={[4, 0.5, -2]} color="#ff6b8a" size={0.1} />
        </group>
      )}

      {items.map((item, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        return (
          <>
            <GlowRing key={`ring-${item.id}`} color={item.color} position={[x, -2.3, z]} />
            <GalleryItem
              key={item.id}
              quintuplet={item}
              position={[x, 0, z]}
              rotationY={angle + Math.PI}
              onSelect={onSelect}
              reducedMotion={reducedMotion}
            />
          </>
        )
      })}

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={18}
        maxPolarAngle={Math.PI / 1.9}
        minPolarAngle={Math.PI / 4.5}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.2}
        dampingFactor={0.05}
        makeDefault
      />
    </>
  )
}
