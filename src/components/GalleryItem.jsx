import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Text, useCursor } from '@react-three/drei'
import { MathUtils, DoubleSide } from 'three'

const FRAME_W = 2.5
const FRAME_H = 2.0
const PADDING_B = 0.45
const CORNERS = [
  [-FRAME_W / 2 + 0.12, FRAME_H / 2 - 0.12],
  [FRAME_W / 2 - 0.12, FRAME_H / 2 - 0.12],
  [-FRAME_W / 2 + 0.12, -FRAME_H / 2 + 0.12],
  [FRAME_W / 2 - 0.12, -FRAME_H / 2 + 0.12],
]

export default function GalleryItem({ quintuplet, position, rotationY, onSelect, reducedMotion }) {
  const group = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const texture = useTexture(quintuplet.img)
  useCursor(hovered ? 'pointer' : 'grab')

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()

    group.current.position.y = reducedMotion
      ? 0
      : Math.sin(t * 0.8 + position[0] * 0.5) * 0.12

    const targetScale = clicked ? 1.2 : hovered ? 1.15 : 1
    const s = MathUtils.lerp(group.current.scale.x, targetScale, 0.12)
    group.current.scale.setScalar(s)

    if (hovered && !reducedMotion) {
      group.current.rotation.z = Math.sin(t * 1.5) * 0.02
    } else {
      group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, 0, 0.1)
    }
  })

  const kanji = quintuplet.id === 1 ? '一花' : quintuplet.id === 2 ? '二乃' : quintuplet.id === 3 ? '三玖' : quintuplet.id === 4 ? '四葉' : '五珠'

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group
        ref={group}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true) }}
        onPointerOut={() => setHovered(false)}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
        onClick={(e) => { e.stopPropagation(); onSelect(quintuplet) }}
      >
        {/* Outer glow on hover */}
        {hovered && (
          <>
            <pointLight position={[0, 0, 1.5]} intensity={2} color={quintuplet.color} distance={6} decay={2} />
            <mesh position={[0, 0, -0.1]}>
              <planeGeometry args={[FRAME_W + 0.6, FRAME_H + PADDING_B + 0.6]} />
              <meshBasicMaterial color={quintuplet.color} transparent opacity={0.08} side={DoubleSide} depthWrite={false} />
            </mesh>
          </>
        )}

        {/* Polaroid frame backing — Miku white */}
        <mesh position={[0, -PADDING_B / 2, -0.05]}>
          <planeGeometry args={[FRAME_W + 0.06, FRAME_H + PADDING_B + 0.06]} />
          <meshStandardMaterial color={hovered ? '#e8f5f3' : '#e8f0ee'} roughness={0.75} metalness={0.03} />
        </mesh>

        {/* Inner shadow frame */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[FRAME_W - 0.2, FRAME_H - 0.2]} />
          <meshStandardMaterial color={hovered ? '#e0f2f0' : '#e5ede9'} roughness={0.9} metalness={0} />
        </mesh>

        {/* Image */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[FRAME_W - 0.25, FRAME_H - 0.25]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {/* Specular highlight on hover */}
        {hovered && (
          <mesh position={[0, FRAME_H / 4, 0.05]}>
            <planeGeometry args={[FRAME_W - 0.4, FRAME_H / 3]} />
            <meshBasicMaterial color="white" transparent opacity={0.06} side={DoubleSide} depthWrite={false} />
          </mesh>
        )}

        {/* Corner rivets — teal themed */}
        {CORNERS.map(([cx, cy], idx) => (
          <mesh key={idx} position={[cx, cy, -0.025]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.07, 0.07, 0.03]} />
            <meshStandardMaterial color={hovered ? quintuplet.accent : '#2EC4B6'} metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Name label */}
        <Text
          position={[0, -FRAME_H / 2 - 0.22, 0]}
          fontSize={0.11}
          color={hovered ? quintuplet.color : '#6a9a9a'}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
          letterSpacing={0.12}
          maxWidth={FRAME_W - 0.3}
          outlineWidth={0}
          outlineShadow={false}
        >
          {quintuplet.name} {kanji}
        </Text>

        {/* Subtitle on hover */}
        {hovered && !reducedMotion && (
          <Text
            position={[0, -FRAME_H / 2 - 0.4, 0]}
            fontSize={0.06}
            color="#8ec4c4"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
            letterSpacing={0.15}
            maxWidth={FRAME_W - 0.5}
          >
            {quintuplet.detail}
          </Text>
        )}

        {/* Miku music note on hover */}
        {hovered && !reducedMotion && (
          <Text
            position={[FRAME_W / 2 - 0.3, FRAME_H / 2 + 0.2, 0]}
            fontSize={0.12}
            color={quintuplet.color}
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
            outlineWidth={0}
            outlineShadow={false}
          >
            ♪
          </Text>
        )}
      </group>
    </group>
  )
}
