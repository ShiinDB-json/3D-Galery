import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture, Text, useCursor } from '@react-three/drei'
import { MathUtils, DoubleSide, SRGBColorSpace } from 'three'

const FRAME_W = 2.4
const FRAME_H = 1.8
const PADDING_B = 0.4
const CORNERS = [
  [-FRAME_W / 2 + 0.1, FRAME_H / 2 - 0.1],
  [FRAME_W / 2 - 0.1, FRAME_H / 2 - 0.1],
  [-FRAME_W / 2 + 0.1, -FRAME_H / 2 + 0.1],
  [FRAME_W / 2 - 0.1, -FRAME_H / 2 + 0.1],
]

function buildFallbackTexture(color, name) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  const grad = ctx.createLinearGradient(0, 0, 512, 512)
  grad.addColorStop(0, `rgb(${r},${g},${b})`)
  grad.addColorStop(1, `rgb(${Math.min(255, r + 50)},${Math.min(255, g + 50)},${Math.min(255, b + 50)})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.font = '700 140px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('M', 256, 220)

  ctx.font = '300 32px sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillText(name, 256, 310)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}

export default function GalleryItem({ quintuplet, position, rotationY, onSelect, reducedMotion }) {
  const group = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [failed, setFailed] = useState(false)

  const fallback = useMemo(() => buildFallbackTexture(quintuplet.color, quintuplet.name), [quintuplet.color, quintuplet.name])
  const texture = useTexture(failed ? fallback : quintuplet.img, (tex) => {
    if (tex) tex.colorSpace = SRGBColorSpace
  }, () => setFailed(true))

  useCursor(hovered ? 'pointer' : 'default')

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.getElapsedTime()

    group.current.position.y = reducedMotion ? 0 : Math.sin(t * 0.7 + position[0] * 0.5) * 0.1

    const targetScale = clicked ? 1.12 : hovered ? 1.08 : 1
    const s = MathUtils.lerp(group.current.scale.x, targetScale, 0.1)
    group.current.scale.setScalar(s)

    if (hovered && !reducedMotion) {
      group.current.rotation.z = Math.sin(t * 1.2) * 0.015
    } else {
      group.current.rotation.z = MathUtils.lerp(group.current.rotation.z, 0, 0.08)
    }
  })

  const kanji = '三玖'

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
        {/* Hover glow */}
        {hovered && (
          <>
            <pointLight position={[0, 0, 1.2]} intensity={1.5} color={quintuplet.color} distance={5} decay={2} />
            <mesh position={[0, 0, -0.08]}>
              <planeGeometry args={[FRAME_W + 0.5, FRAME_H + PADDING_B + 0.5]} />
              <meshBasicMaterial color={quintuplet.color} transparent opacity={0.1} side={DoubleSide} depthWrite={false} />
            </mesh>
          </>
        )}

        {/* Backing */}
        <mesh position={[0, -PADDING_B / 2, -0.04]}>
          <planeGeometry args={[FRAME_W + 0.05, FRAME_H + PADDING_B + 0.05]} />
          <meshStandardMaterial color={hovered ? '#f0f7f5' : '#e8f0ee'} roughness={0.8} metalness={0.02} />
        </mesh>

        {/* Photo */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[FRAME_W - 0.2, FRAME_H - 0.2]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>

        {/* Specular */}
        {hovered && (
          <mesh position={[0, FRAME_H / 4, 0.04]}>
            <planeGeometry args={[FRAME_W - 0.35, FRAME_H / 3]} />
            <meshBasicMaterial color="white" transparent opacity={0.05} side={DoubleSide} depthWrite={false} />
          </mesh>
        )}

        {/* Rivets */}
        {CORNERS.map(([cx, cy], idx) => (
          <mesh key={idx} position={[cx, cy, -0.02]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.06, 0.06, 0.025]} />
            <meshStandardMaterial color={hovered ? quintuplet.accent : '#2EC4B6'} metalness={0.7} roughness={0.35} />
          </mesh>
        ))}

        {/* Label */}
        <Text
          position={[0, -FRAME_H / 2 - 0.2, 0]}
          fontSize={0.1}
          color={hovered ? quintuplet.color : '#5a9a96'}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
          letterSpacing={0.1}
          maxWidth={FRAME_W - 0.2}
          outlineWidth={0}
          outlineShadow={false}
        >
          {quintuplet.name} {kanji}
        </Text>

        {/* Hover note */}
        {hovered && !reducedMotion && (
          <Text
            position={[0, -FRAME_H / 2 - 0.36, 0]}
            fontSize={0.055}
            color="#8ec4c4"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.woff2"
            letterSpacing={0.12}
            maxWidth={FRAME_W - 0.3}
          >
            {quintuplet.detail}
          </Text>
        )}
      </group>
    </group>
  )
}
