import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Text, useCursor } from '@react-three/drei'
import { MathUtils } from 'three'

const FRAME_W = 2.35
const FRAME_H = 1.75
const CORNERS = [
  [-FRAME_W / 2 + 0.1, FRAME_H / 2 - 0.1],
  [FRAME_W / 2 - 0.1, FRAME_H / 2 - 0.1],
  [-FRAME_W / 2 + 0.1, -FRAME_H / 2 + 0.1],
  [FRAME_W / 2 - 0.1, -FRAME_H / 2 + 0.1],
]

export default function GalleryItem({ artwork, position, rotationY, onSelect, reducedMotion }) {
  const group = useRef()
  const [hovered, setHovered] = useState(false)
  const texture = useTexture(artwork.img)
  useCursor(hovered)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()
    group.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.8 + position[0]) * 0.12
    const targetScale = hovered ? 1.1 : 1
    const s = MathUtils.lerp(group.current.scale.x, targetScale, 0.1)
    group.current.scale.setScalar(s)
  })

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group
        ref={group}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(artwork)
        }}
      >
        {/* Frame backing */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[FRAME_W, FRAME_H]} />
          <meshStandardMaterial color={hovered ? '#3a2c1c' : '#1c1d22'} />
        </mesh>

        {/* Image */}
        <mesh>
          <planeGeometry args={[FRAME_W - 0.2, FRAME_H - 0.2]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {/* Brass corner rivets */}
        {CORNERS.map(([cx, cy], idx) => (
          <mesh key={idx} position={[cx, cy, -0.015]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.09, 0.09, 0.03]} />
            <meshStandardMaterial
              color={hovered ? '#d9a562' : '#b8874a'}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}

        {/* Plate label */}
        <Text
          position={[0, -FRAME_H / 2 - 0.22, 0]}
          fontSize={0.12}
          color="#e8e1d0"
          anchorX="center"
          anchorY="middle"
          maxWidth={FRAME_W}
        >
          {`${artwork.plate} — ${artwork.title}`}
        </Text>
      </group>
    </group>
  )
}
