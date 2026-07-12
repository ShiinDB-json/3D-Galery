import { useMemo } from 'react'
import { OrbitControls, Stars, MeshReflectorMaterial, Environment } from '@react-three/drei'
import GalleryItem from './GalleryItem'

export default function Gallery({ artworks, onSelect }) {
  const radius = 7
  const count = artworks.length

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  return (
    <>
      <color attach="background" args={['#0a0b0f']} />
      <fog attach="fog" args={['#0a0b0f', 10, 28]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[0, 6, 0]} intensity={1.4} color="#f3caa0" />
      <pointLight position={[0, -1, 2]} intensity={0.3} color="#5a6bb0" />

      <Environment preset="night" />
      <Stars radius={90} depth={50} count={2500} factor={3} fade speed={reducedMotion ? 0 : 0.6} />

      {/* Reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]}>
        <circleGeometry args={[radius + 8, 64]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={35}
          roughness={1}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#08090c"
          metalness={0.4}
        />
      </mesh>

      {artworks.map((art, i) => {
        const angle = (i / count) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        return (
          <GalleryItem
            key={art.id}
            artwork={art}
            position={[x, 0, z]}
            rotationY={angle + Math.PI}
            onSelect={onSelect}
            reducedMotion={reducedMotion}
          />
        )
      })}

      <OrbitControls
        enablePan={false}
        minDistance={3.5}
        maxDistance={19}
        maxPolarAngle={Math.PI / 1.9}
        minPolarAngle={Math.PI / 4}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.35}
        dampingFactor={0.08}
        makeDefault
      />
    </>
  )
}
