import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import GalleryItem from './GalleryItem'
import { DoubleSide } from 'three'

// Wave equalizer bars
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
    mesh.current.material.opacity = 0.08 + wave * 0.12
  })
  return (
    <mesh ref={mesh} position={position}>
      <boxGeometry args={[0.04, baseH, 0.04]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}

// Sound wave rings
function SoundWaveRing({ color, position, maxRadius }) {
  const ring = useRef()
  const startTime = useRef(Math.random() * 10)
  useFrame((state) => {
    if (!ring.current) return
    const elapsed = state.clock.getElapsedTime() - startTime.current
    const progress = (elapsed % 4) / 4
    ring.current.scale.setScalar(progress * maxRadius)
    ring.current.material.opacity = (1 - progress) * 0.12
    if (progress > 0.99) startTime.current = elapsed
  })
  return (
    <mesh ref={ring} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.1, 0.12, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}

// Floating petal
function Petal({ position, rotation, scale, color, speed, delay }) {
  const mesh = useRef()
  const windOffset = useRef(Math.random() * Math.PI * 2)
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.getElapsedTime() + delay
    const wind = Math.sin(t * 0.5 + windOffset.current)
    mesh.current.position.y -= speed * 0.016
    mesh.current.position.x += wind * 0.003
    mesh.current.rotation.z += 0.008 + wind * 0.005
    mesh.current.rotation.x += 0.004
    if (mesh.current.position.y < -4) {
      mesh.current.position.set(
        (Math.random() - 0.5) * 20,
        8 + Math.random() * 4,
        (Math.random() - 0.5) * 16
      )
      windOffset.current = Math.random() * Math.PI * 2
    }
  })
  return (
    <mesh ref={mesh} position={position} rotation={rotation} scale={scale}>
      <planeGeometry args={[0.14, 0.18]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}

// Glowing ring
function GlowRing({ color, position }) {
  const ring = useRef()
  useFrame((state) => {
    if (!ring.current) return
    const t = state.clock.getElapsedTime()
    ring.current.scale.setScalar(1 + Math.sin(t * 1.5) * 0.06)
    ring.current.material.opacity = 0.15 + Math.sin(t * 2) * 0.08
  })
  return (
    <mesh ref={ring} position={[position[0], position[1] + 0.15, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.6, 1.65, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.2} side={DoubleSide} depthWrite={false} />
    </mesh>
  )
}

// Ambient orb
function AmbientOrb({ position, color, size }) {
  const orb = useRef()
  useFrame((state) => {
    if (!orb.current) return
    const t = state.clock.getElapsedTime()
    orb.current.position.y = position[1] + Math.sin(t * 0.6 + position[0]) * 0.5
    orb.current.position.x = position[0] + Math.cos(t * 0.4 + position[2]) * 0.3
  })
  return (
    <mesh ref={orb} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
    </mesh>
  )
}

// Central Miku crystal with orbiting ring
function CenterCrystal() {
  const crystal = useRef()
  const ring = useRef()
  useFrame((state) => {
    if (!crystal.current || !ring.current) return
    const t = state.clock.getElapsedTime()
    crystal.current.rotation.y = t * 0.4
    crystal.current.rotation.x = Math.sin(t * 0.3) * 0.2
    crystal.current.position.y = Math.sin(t * 0.8) * 0.15
    ring.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.1
    ring.current.rotation.z = t * 0.2
  })
  return (
    <group>
      <mesh ref={crystal} position={[0, 1, 0]}>
        <octahedronGeometry args={[0.3, 0]} />
        <meshBasicMaterial color="#2EC4B6" transparent opacity={0.3} wireframe />
      </mesh>
      <mesh ref={ring} position={[0, 1, 0]}>
        <torusGeometry args={[0.5, 0.01, 8, 64]} />
        <meshBasicMaterial color="#3DE2D1" transparent opacity={0.2} side={DoubleSide} />
      </mesh>
    </group>
  )
}

// Particle field
function ParticleField({ count, color }) {
  const points = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return arr
  }, [count])
  useFrame((state) => {
    if (!points.current) return
    points.current.rotation.y = state.clock.getElapsedTime() * 0.01
  })
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.04} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  )
}

export default function Gallery({ quintuplets, onSelect }) {
  const radius = 7.5
  const count = quintuplets.length

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const petalColors = ['#2EC4B6', '#3DE2D1', '#a8f0e8', '#7EDCD3', '#5EE8DB', '#6FD8C5']

  const waveRings = Array.from({ length: 6 }).map((_, i) => ({
    color: quintuplets[i % 5].color,
    position: [0, -2.2, 0],
  }))

  return (
    <>
      <color attach="background" args={['#050f14']} />
      <fog attach="fog" args={['#050f14', 10, 35]} />

      {/* Miku-themed lighting */}
      <ambientLight intensity={0.2} color="#0c2e30" />
      <pointLight position={[0, 8, 3]} intensity={1.8} color="#2EC4B6" distance={28} decay={2} />
      <pointLight position={[-6, 2, -4]} intensity={0.5} color="#0c7b77" distance={22} decay={2} />
      <pointLight position={[6, 1, -2]} intensity={0.3} color="#f0c27f" distance={15} decay={2} />
      <pointLight position={[0, -3, 0]} intensity={0.25} color="#6a9a9a" distance={12} decay={2} />
      <pointLight position={[-3, 5, 5]} intensity={0.3} color="#ff6b8a" distance={18} decay={2} />
      <Environment preset="night" />

      <ParticleField count={150} color="#2EC4B6" />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]}>
        <circleGeometry args={[radius + 10, 128]} />
        <meshStandardMaterial
          color="#050f12"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {!reducedMotion && <CenterCrystal />}

      {!reducedMotion && (
        <group>
          {waveRings.map((w, i) => (
            <SoundWaveRing key={i} {...w} maxRadius={8 + i * 2} />
          ))}
        </group>
      )}

      {!reducedMotion && (
        <group>
          {Array.from({ length: 24 }).map((_, i) => (
            <WaveParticle
              key={`wave-${i}`}
              position={[(i - 12) * 0.35, -2.25, -5]}
              height={0.3 + Math.random() * 0.7}
              color={petalColors[i % petalColors.length]}
              speed={1.5 + Math.random() * 2}
              phase={i * 0.4}
            />
          ))}
        </group>
      )}

      {!reducedMotion && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Petal
              key={i}
              position={[(Math.random() - 0.5) * 20, Math.random() * 14 - 2, (Math.random() - 0.5) * 16]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              scale={0.4 + Math.random() * 0.7}
              color={petalColors[Math.floor(Math.random() * petalColors.length)]}
              speed={0.1 + Math.random() * 0.18}
              delay={Math.random() * 10}
            />
          ))}
        </group>
      )}

      {!reducedMotion && (
        <group>
          <AmbientOrb position={[-3, 2, -2]} color="#2EC4B6" size={0.15} />
          <AmbientOrb position={[3, 3, -3]} color="#3DE2D1" size={0.12} />
          <AmbientOrb position={[0, 4, 2]} color="#f0c27f" size={0.1} />
          <AmbientOrb position={[5, 0, -1]} color="#ff6b8a" size={0.12} />
          <AmbientOrb position={[-2, 3, 3]} color="#a8f0e8" size={0.1} />
          <AmbientOrb position={[4, -1, -3]} color="#5EE8DB" size={0.09} />
        </group>
      )}

      {quintuplets.map((q, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        return (
          <>
            <GlowRing key={`ring-${q.id}`} color={q.color} position={[x, -2.3, z]} />
            <GalleryItem
              key={q.id}
              quintuplet={q}
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
        minDistance={4}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.85}
        minPolarAngle={Math.PI / 4.5}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.25}
        dampingFactor={0.06}
        makeDefault
      />
    </>
  )
}
