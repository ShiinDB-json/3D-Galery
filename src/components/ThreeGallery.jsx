import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GalleryItem from './GalleryItem'
import './ThreeGallery.css'

const MIKU_PHOTOS = [
  'image/072203d90f1f0a8035295d89b807b661.jpg',
  'image/09ed7487d4247be8c312d028b745bc6e.jpg',
  'image/1455aba60c3fbe322a26ccd13653321d.jpg',
  'image/283cd79c4765ca0e852ec2ab18a97dc9.jpg',
  'image/3916a80792867881f94656601edb52f6.jpg',
  'image/6994e653d7c31dc235581f3d0f28be54.jpg',
  'image/808171f23595cd880d0ccbf88b50e6ca.jpg',
  'image/8969dbb28abdfc2fe216561a10201d3c.jpg',
  'image/98acccda21a1b1c5d555976a526218ab.jpg',
  'image/9f2cc7b5111e1f983b8b250b93bd384d.jpg',
  'image/a5006c18002f529b29e7fb532415a653.jpg',
  'image/acaf1af64ed5bc85448b13eea07f4836.jpg',
  'image/d01daf9c9d9dac1823a19d1511dd94a3.jpg',
  'image/d42f9706150b5c03f9773563f71aef35.jpg',
  'image/e136dab9901bedb2f7517b3832c2651b.jpg',
  'image/fe30f7efe021262b3dd4aba28e8edb23.jpg',
  'image/illust_145515972_20260713_032203.jpg',
  'image/illust_145971603_20260713_032155.png',
  'image/illust_73805280_20260713_032120.jpg',
  'image/illust_81117837_20260713_031921.png',
  'image/illust_83829282_20260713_032022.png',
  'image/illust_84036162_20260713_032008.png',
  'image/illust_99666092_20260713_032032.jpg',
]

export default function ThreeGallery({ onSelectPhoto }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const [selectedId, setSelectedId] = useState(null)
  const selectedRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // ===== Setup =====
    const container = containerRef.current
    const w = container.clientWidth
    const h = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060f13)
    scene.fog = new THREE.Fog(0x060f13, 18, 40)

    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 1.2, 14)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ===== Controls =====
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.minDistance = 5
    controls.maxDistance = 20
    controls.maxPolarAngle = Math.PI / 1.9
    controls.minPolarAngle = Math.PI / 4.5
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.25
    controls.dampingFactor = 0.05
    controls.enableDamping = true
    controls.target.set(0, 0.5, 0)

    // ===== Lights =====
    const ambient = new THREE.AmbientLight(0x0a2025, 0.4)
    scene.add(ambient)

    const mainLight = new THREE.PointLight(0x2ec4b6, 1.5, 30)
    mainLight.position.set(0, 6, 4)
    scene.add(mainLight)

    const fillLight = new THREE.PointLight(0x0c7b77, 0.5, 20)
    fillLight.position.set(-5, 2, -3)
    scene.add(fillLight)

    const warmLight = new THREE.PointLight(0xf0c27f, 0.3, 15)
    warmLight.position.set(5, 1, -2)
    scene.add(warmLight)

    const rimLight = new THREE.PointLight(0x6a9a9a, 0.25, 12)
    rimLight.position.set(0, -2, 3)
    scene.add(rimLight)

    const accentLight = new THREE.PointLight(0xff6b8a, 0.2, 18)
    accentLight.position.set(-2, 4, 5)
    scene.add(accentLight)

    // ===== Floor =====
    const floorGeo = new THREE.CircleGeometry(20, 64)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050d11,
      roughness: 0.5,
      metalness: 0.25,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -2.3
    scene.add(floor)

    // ===== Crystal =====
    const crystalMat = new THREE.MeshBasicMaterial({
      color: 0x2ec4b6,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    })
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), crystalMat)
    crystal.position.set(0, 1, 0)
    scene.add(crystal)

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3de2d1,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.01, 8, 64), ringMat)
    ring.position.set(0, 1, 0)
    scene.add(ring)

    // ===== Petal system =====
    const petalColors = [0x2ec4b6, 0x3de2d1, 0xa8f0e8, 0x7edcd3, 0x5ee8db, 0x6fd8c5]
    const petals = []
    const petalGeo = new THREE.PlaneGeometry(0.12, 0.16)

    for (let i = 0; i < 20; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(petalGeo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 22,
        Math.random() * 12 - 2,
        (Math.random() - 0.5) * 16
      )
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      mesh.scale.setScalar(0.35 + Math.random() * 0.5)
      scene.add(mesh)
      petals.push({
        mesh,
        speed: 0.08 + Math.random() * 0.12,
        delay: Math.random() * 10,
        windOffset: Math.random() * Math.PI * 2,
      })
    }

    // ===== Photo gallery =====
    const radius = 9
    const count = MIKU_PHOTOS.length
    const photoGroups = []
    const textureLoader = new THREE.TextureLoader()

    // Shared frame materials
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xe8f0ee,
      roughness: 0.8,
      metalness: 0.02,
    })
    const frameMatHover = new THREE.MeshStandardMaterial({
      color: 0xf0f7f5,
      roughness: 0.8,
      metalness: 0.02,
    })

    const FRAME_W = 2.4
    const FRAME_H = 1.8
    const PADDING_B = 0.4
    const IMG_W = FRAME_W - 0.2
    const IMG_H = FRAME_H - 0.2

    // Shared geometries
    const frameGeo = new THREE.PlaneGeometry(FRAME_W + 0.05, FRAME_H + PADDING_B + 0.05)
    const imgGeo = new THREE.PlaneGeometry(IMG_W, IMG_H)
    const rivetGeo = new THREE.BoxGeometry(0.06, 0.06, 0.025)

    const rivetPositions = [
      [-FRAME_W / 2 + 0.1, FRAME_H / 2 - 0.1],
      [FRAME_W / 2 - 0.1, FRAME_H / 2 - 0.1],
      [-FRAME_W / 2 + 0.1, -FRAME_H / 2 + 0.1],
      [FRAME_W / 2 - 0.1, -FRAME_H / 2 + 0.1],
    ]

    const rivetMat = new THREE.MeshStandardMaterial({
      color: 0x2ec4b6,
      metalness: 0.7,
      roughness: 0.35,
    })
    const rivetMatHover = new THREE.MeshStandardMaterial({
      color: 0x5ee8db,
      metalness: 0.7,
      roughness: 0.35,
    })

    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x2ec0b5,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    })

    // Fallback canvas texture
    function createFallbackTexture() {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 256
      const ctx = canvas.getContext('2d')
      const grad = ctx.createLinearGradient(0, 0, 256, 256)
      grad.addColorStop(0, '#2ec0b5')
      grad.addColorStop(1, '#5ee8db')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 256, 256)
      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      ctx.font = '700 80px serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('M', 128, 128)
      return new THREE.CanvasTexture(canvas)
    }
    const fallbackTex = createFallbackTexture()

    MIKU_PHOTOS.forEach((imgPath, idx) => {
      const angle = (idx / count) * Math.PI * 2
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius

      const group = new THREE.Group()
      group.position.set(x, 0, z)
      group.rotation.y = angle + Math.PI

      // Frame backing
      const frameMesh = new THREE.Mesh(frameGeo, frameMat.clone())
      frameMesh.position.set(0, -PADDING_B / 2, -0.04)
      group.add(frameMesh)

      // Glow halo
      const glowGeo = new THREE.PlaneGeometry(FRAME_W + 0.5, FRAME_H + PADDING_B + 0.5)
      const glow = new THREE.Mesh(glowGeo, glowMat.clone())
      glow.position.set(0, 0, -0.08)
      group.add(glow)

      // Image
      const imgMat = new THREE.MeshBasicMaterial({ map: fallbackTex, toneMapped: false })
      const imgMesh = new THREE.Mesh(imgGeo, imgMat)
      imgMesh.position.set(0, 0, 0.01)
      group.add(imgMesh)

      // Load actual texture
      textureLoader.load(
        imgPath,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          imgMat.map = tex
          imgMat.needsUpdate = true
        },
        undefined,
        () => {} // fallback stays
      )

      // Rivets
      const rivets = rivetPositions.map(([cx, cy]) => {
        const r = new THREE.Mesh(rivetGeo, rivetMat.clone())
        r.position.set(cx, cy, -0.02)
        r.rotation.z = Math.PI / 4
        group.add(r)
        return r
      })

      scene.add(group)

      photoGroups.push({
        group,
        frameMesh,
        imgMesh,
        imgMat,
        glow,
        rivets,
        data: {
          id: `miku-${idx + 1}`,
          name: 'Nakano Miku',
          title: 'Nakano Miku 中野三玖',
          color: '#2EC0B5',
          detail: 'Yang ketiga · Tulus & Penuh Perasaan',
          quote: '"Di balik catatan tua, ada harapan yang tak pernah padam."',
          img: imgPath,
        },
      })
    })

    // ===== Raycaster for interaction =====
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let hoveredGroup = null
    const clickThreshold = 0.15
    let downTime = 0

    renderer.domElement.addEventListener('pointerdown', (e) => {
      downTime = performance.now()
      pointer.x = (e.clientX / w) * 2 - 1
      pointer.y = -(e.clientY / h) * 2 + 1
    })

    renderer.domElement.addEventListener('pointerup', (e) => {
      const elapsed = (performance.now() - downTime) / 1000
      if (elapsed > clickThreshold) return

      pointer.x = (e.clientX / w) * 2 - 1
      pointer.y = -(e.clientY / h) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const meshes = photoGroups.map(p => p.imgMesh)
      meshes.push(crystal)
      const intersects = raycaster.intersectObjects(meshes)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        const found = photoGroups.find(p => p.imgMesh === hit)
        if (found) {
          selectedRef.current = found
          setSelectedId(found.data.id)
          if (onSelectPhoto) onSelectPhoto(found.data)
        }
      }
    })

    renderer.domElement.addEventListener('pointermove', (e) => {
      pointer.x = (e.clientX / w) * 2 - 1
      pointer.y = -(e.clientY / h) * 2 + 1
    })

    // ===== Resize =====
    const onResize = () => {
      const cw = container.clientWidth
      const ch = container.clientHeight
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
      renderer.setSize(cw, ch)
    }
    window.addEventListener('resize', onResize)

    // ===== Animation loop =====
    const clock = new THREE.Clock()

    function animate() {
      requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Crystal
      crystal.rotation.y = t * 0.35
      crystal.rotation.x = Math.sin(t * 0.25) * 0.15
      crystal.position.y = Math.sin(t * 0.7) * 0.12
      ring.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.08
      ring.rotation.z = t * 0.15

      // Petals
      petals.forEach((p) => {
        const wind = Math.sin(t * 0.5 + p.windOffset)
        p.mesh.position.y -= p.speed * 0.016
        p.mesh.position.x += wind * 0.003
        p.mesh.rotation.z += 0.006 + wind * 0.004
        p.mesh.rotation.x += 0.003
        if (p.mesh.position.y < -4) {
          p.mesh.position.set(
            (Math.random() - 0.5) * 22,
            8 + Math.random() * 4,
            (Math.random() - 0.5) * 16
          )
          p.windOffset = Math.random() * Math.PI * 2
        }
      })

      // Hover detection
      raycaster.setFromCamera(pointer, camera)
      const allMeshes = photoGroups.map(p => p.imgMesh)
      const intersects = raycaster.intersectObjects(allMeshes)

      // Reset all
      photoGroups.forEach((p) => {
        p.glow.material.opacity = 0.12 + Math.sin(t * 2) * 0.06
        p.group.position.y = Math.sin(t * 0.7 + p.group.position.x * 0.5) * 0.1
        p.group.scale.setScalar(
          THREE.MathUtils.lerp(p.group.scale.x, 1, 0.08)
        )
      })

      // Apply hover to the one under pointer
      if (intersects.length > 0) {
        const hit = intersects[0].object
        const found = photoGroups.find(p => p.imgMesh === hit)
        if (found && found !== selectedRef.current) {
          hoveredGroup = found
          found.glow.material.opacity = 0.25
          found.group.scale.setScalar(
            THREE.MathUtils.lerp(found.group.scale.x, 1.08, 0.1)
          )
        }
      } else {
        hoveredGroup = null
      }

      // Highlight selected
      if (selectedRef.current) {
        const s = selectedRef.current
        s.group.scale.setScalar(
          THREE.MathUtils.lerp(s.group.scale.x, 1.12, 0.1)
        )
      }

      controls.update()
      renderer.render(scene, camera)
    }

    sceneRef.current = { scene, camera, renderer, controls, photoGroups, petals }

    animate()

    // ===== Cleanup =====
    return () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Handle selection from outside (nav dots)
  useEffect(() => {
    if (selectedId && sceneRef.current) {
      const found = sceneRef.current.photoGroups.find(p => p.data.id === selectedId)
      if (found) {
        selectedRef.current = found
        if (onSelectPhoto) onSelectPhoto(found.data)
      }
    }
  }, [selectedId])

  return (
    <div className="three-gallery-container" ref={containerRef}>
      <nav className="nav-dots-three">
        {MIKU_PHOTOS.map((_, idx) => (
          <button
            key={idx}
            className={`nav-dot-three ${selectedId === `miku-${idx + 1}` ? 'active' : ''}`}
            onClick={() => setSelectedId(`miku-${idx + 1}`)}
            aria-label={`Foto ${idx + 1}`}
          />
        ))}
      </nav>
    </div>
  )
}