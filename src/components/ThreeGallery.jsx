import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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
  const [photoIndex, setPhotoIndex] = useState(0)

  const selectPhoto = useCallback((idx) => {
    const id = `miku-${idx + 1}`
    setSelectedId(id)
    setPhotoIndex(idx)
    if (sceneRef.current) {
      const found = sceneRef.current.photoGroups.find(p => p.data.id === id)
      if (found) {
        selectedRef.current = found
        if (onSelectPhoto) onSelectPhoto(found.data)
      }
    }
  }, [onSelectPhoto])

  const goNext = useCallback(() => {
    const next = (photoIndex + 1) % MIKU_PHOTOS.length
    selectPhoto(next)
  }, [photoIndex, selectPhoto])

  const goPrev = useCallback(() => {
    const prev = (photoIndex - 1 + MIKU_PHOTOS.length) % MIKU_PHOTOS.length
    selectPhoto(prev)
  }, [photoIndex, selectPhoto])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'Escape') {
        selectedRef.current = null
        setSelectedId(null)
        if (onSelectPhoto) onSelectPhoto(null)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, onSelectPhoto])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const w = container.clientWidth
    const h = container.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060f13)
    scene.fog = new THREE.FogExp2(0x060f13, 0.018)

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 80)
    camera.position.set(0, 1.5, 16)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.minDistance = 6
    controls.maxDistance = 22
    controls.maxPolarAngle = Math.PI / 2.1
    controls.minPolarAngle = Math.PI / 5
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3
    controls.dampingFactor = 0.06
    controls.enableDamping = true
    controls.target.set(0, 0.6, 0)

    // Lights
    const ambient = new THREE.AmbientLight(0x0a2025, 0.35)
    scene.add(ambient)

    const mainLight = new THREE.DirectionalLight(0x2ec4b6, 1.8)
    mainLight.position.set(0, 10, 4)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 1024
    mainLight.shadow.mapSize.height = 1024
    const d = 15
    mainLight.shadow.camera.left = -d
    mainLight.shadow.camera.right = d
    mainLight.shadow.camera.top = d
    mainLight.shadow.camera.bottom = -d
    mainLight.shadow.camera.near = 1
    mainLight.shadow.camera.far = 25
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x3de2d1, 0.5)
    fillLight.position.set(-4, 3, -5)
    scene.add(fillLight)

    const warmLight = new THREE.DirectionalLight(0xf0c27f, 0.3)
    warmLight.position.set(3, 1, -6)
    scene.add(warmLight)

    const accentLight = new THREE.PointLight(0xff6b8a, 0.3, 15)
    accentLight.position.set(-3, 2, 5)
    scene.add(accentLight)

    const rimLight = new THREE.PointLight(0x6a9a9a, 0.15, 10)
    rimLight.position.set(0, -3, 2)
    scene.add(rimLight)

    // Floor
    const floorGeo = new THREE.CircleGeometry(22, 64)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050d11,
      roughness: 0.35,
      metalness: 0.45,
      envMapIntensity: 0.6,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -2.3
    floor.receiveShadow = true
    scene.add(floor)

    // Crystal
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x2ec4b6,
      transparent: true,
      opacity: 0.2,
      wireframe: true,
      emissive: 0x2ec4b6,
      emissiveIntensity: 0.1,
    })
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.35, 0), crystalMat)
    crystal.position.set(0, 1, 0)
    scene.add(crystal)

    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x3de2d1,
      transparent: true,
      opacity: 0.08,
    })
    const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), innerMat)
    innerSphere.position.set(0, 1, 0)
    scene.add(innerSphere)

    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x3de2d1,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.008, 8, 80), ringMat)
    ring.position.set(0, 1, 0)
    scene.add(ring)

    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa8f0e8,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    })
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.005, 8, 80), ring2Mat)
    ring2.position.set(0, 1, 0)
    scene.add(ring2)

    // Petals
    const petalColors = [0x2ec4b6, 0x3de2d1, 0xa8f0e8, 0x7edcd3, 0x5ee8db, 0x6fd8c5]
    const petals = []
    const petalGeo = new THREE.PlaneGeometry(0.1, 0.14)

    for (let i = 0; i < 25; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        transparent: true,
        opacity: 0.3 + Math.random() * 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(petalGeo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 24,
        Math.random() * 14 - 2,
        (Math.random() - 0.5) * 18
      )
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      mesh.scale.setScalar(0.3 + Math.random() * 0.5)
      scene.add(mesh)
      petals.push({
        mesh,
        speed: 0.06 + Math.random() * 0.1,
        delay: Math.random() * 8,
        windOffset: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.005,
      })
    }

    // Particles
    const particleCount = 300
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      particlePos[i] = (Math.random() - 0.5) * 40
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x2ec4b6,
      size: 0.04,
      transparent: true,
      opacity: 0.3,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    particles.position.y = 2
    scene.add(particles)

    // Gallery
    const radius = 9.5
    const count = MIKU_PHOTOS.length
    const photoGroups = []
    const textureLoader = new THREE.TextureLoader()

    const FRAME_W = 2.4
    const FRAME_H = 1.8
    const PADDING_B = 0.4
    const IMG_W = FRAME_W - 0.2
    const IMG_H = FRAME_H - 0.2

    const frameGeo = new THREE.PlaneGeometry(FRAME_W + 0.05, FRAME_H + PADDING_B + 0.05)
    const imgGeo = new THREE.PlaneGeometry(IMG_W, IMG_H)
    const rivetGeo = new THREE.BoxGeometry(0.06, 0.06, 0.025)
    const rivetMat = new THREE.MeshStandardMaterial({
      color: 0x2ec4b6,
      metalness: 0.75,
      roughness: 0.3,
    })
    const rivetPositions = [
      [-FRAME_W / 2 + 0.1, FRAME_H / 2 - 0.1],
      [FRAME_W / 2 - 0.1, FRAME_H / 2 - 0.1],
      [-FRAME_W / 2 + 0.1, -FRAME_H / 2 + 0.1],
      [FRAME_W / 2 - 0.1, -FRAME_H / 2 + 0.1],
    ]

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
      group.userData = { angle, idx }

      const frameMesh = new THREE.Mesh(frameGeo, new THREE.MeshStandardMaterial({
        color: 0xe8f0ee,
        roughness: 0.8,
        metalness: 0.02,
      }))
      frameMesh.position.set(0, -PADDING_B / 2, -0.04)
      frameMesh.castShadow = true
      group.add(frameMesh)

      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x2ec0b5,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(FRAME_W + 0.6, FRAME_H + PADDING_B + 0.6),
        glowMat
      )
      glow.position.set(0, 0, -0.08)
      group.add(glow)

      const imgMat = new THREE.MeshBasicMaterial({
        map: fallbackTex,
        toneMapped: false,
      })
      const imgMesh = new THREE.Mesh(imgGeo, imgMat)
      imgMesh.position.set(0, 0, 0.01)
      group.add(imgMesh)

      textureLoader.load(
        imgPath,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace
          imgMat.map = tex
          imgMat.needsUpdate = true
        },
        undefined,
        () => {}
      )

      rivetPositions.forEach(([cx, cy]) => {
        const r = new THREE.Mesh(rivetGeo, rivetMat.clone())
        r.position.set(cx, cy, -0.02)
        r.rotation.z = Math.PI / 4
        group.add(r)
      })

      scene.add(group)

      const ringGlow = new THREE.Mesh(
        new THREE.RingGeometry(1.4, 1.45, 48),
        new THREE.MeshBasicMaterial({
          color: 0x2ec0b5,
          transparent: true,
          opacity: 0.06,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      )
      ringGlow.rotation.x = -Math.PI / 2
      ringGlow.position.set(x, -2.25, z)
      scene.add(ringGlow)

      photoGroups.push({
        group,
        imgMesh,
        imgMat,
        glow,
        ringGlow,
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

    // Raycaster
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(-999, -999)
    let hoveredGroup = null

    const clickThreshold = 0.15
    let downTime = 0
    let downX = 0
    let downY = 0

    const onPointerDown = (e) => {
      downTime = performance.now()
      downX = e.clientX
      downY = e.clientY
    }

    const onPointerUp = (e) => {
      const elapsed = (performance.now() - downTime) / 1000
      const dist = Math.sqrt((e.clientX - downX) ** 2 + (e.clientY - downY) ** 2)
      if (elapsed > clickThreshold || dist > 8) return

      pointer.x = (e.clientX / w) * 2 - 1
      pointer.y = -(e.clientY / h) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const meshes = photoGroups.map(p => p.imgMesh)
      const intersects = raycaster.intersectObjects(meshes)

      if (intersects.length > 0) {
        const hit = intersects[0].object
        const found = photoGroups.find(p => p.imgMesh === hit)
        if (found) {
          const idx = found.data.id.replace('miku-', '') - 1
          selectPhoto(idx)
        }
      } else {
        selectedRef.current = null
        setSelectedId(null)
        if (onSelectPhoto) onSelectPhoto(null)
      }
    }

    const onPointerMove = (e) => {
      pointer.x = (e.clientX / w) * 2 - 1
      pointer.y = -(e.clientY / h) * 2 + 1
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointerup', onPointerUp)
    renderer.domElement.addEventListener('pointermove', onPointerMove)

    // Resize
    const onResize = () => {
      const cw = container.clientWidth
      const ch = container.clientHeight
      camera.aspect = cw / ch
      camera.updateProjectionMatrix()
      renderer.setSize(cw, ch)
    }
    window.addEventListener('resize', onResize)

    // Animation
    const clock = new THREE.Clock()
    const initialRotations = photoGroups.map(() => Math.random() * Math.PI * 2)

    function animate() {
      requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      crystal.rotation.y = t * 0.4
      crystal.rotation.x = Math.sin(t * 0.3) * 0.15
      crystal.position.y = Math.sin(t * 0.8) * 0.12 + 1
      innerSphere.position.y = crystal.position.y
      ring.rotation.x = Math.PI / 3 + Math.sin(t * 0.4) * 0.1
      ring.rotation.z = t * 0.2
      ring2.rotation.x = Math.PI / 1.5 + Math.sin(t * 0.3 + 1) * 0.1
      ring2.rotation.y = t * 0.15

      particles.rotation.y = t * 0.008

      petals.forEach((p) => {
        const wind = Math.sin(t * 0.5 + p.windOffset)
        p.mesh.position.y -= p.speed * 0.016
        p.mesh.position.x += wind * 0.003 + p.drift
        p.mesh.rotation.z += 0.005 + wind * 0.003
        p.mesh.rotation.x += 0.002
        if (p.mesh.position.y < -4) {
          p.mesh.position.set(
            (Math.random() - 0.5) * 24,
            8 + Math.random() * 6,
            (Math.random() - 0.5) * 18
          )
          p.windOffset = Math.random() * Math.PI * 2
        }
      })

      raycaster.setFromCamera(pointer, camera)
      const allMeshes = photoGroups.map(p => p.imgMesh)
      const intersects = raycaster.intersectObjects(allMeshes)

      photoGroups.forEach((p, i) => {
        const rot = initialRotations[i]
        const floatY = Math.sin(t * 0.6 + rot) * 0.08
        p.group.position.y = floatY

        p.ringGlow.material.opacity = 0.04 + Math.sin(t * 1.5 + i * 0.5) * 0.03
        p.ringGlow.scale.setScalar(1 + Math.sin(t * 1.2 + i * 0.3) * 0.03)

        p.glow.material.opacity = 0.08 + Math.sin(t * 2 + i * 0.4) * 0.04

        const targetScale = (hoveredGroup === p || selectedRef.current === p) ? 1.08 : 1
        p.group.scale.setScalar(THREE.MathUtils.lerp(p.group.scale.x, targetScale, 0.08))
      })

      if (intersects.length > 0) {
        const hit = intersects[0].object
        const found = photoGroups.find(p => p.imgMesh === hit)
        if (found && found !== selectedRef.current) {
          hoveredGroup = found
          found.glow.material.opacity = 0.3
          found.glow.material.color.setHex(0x3de2d1)
        }
      } else {
        hoveredGroup = null
      }

      if (selectedRef.current) {
        const s = selectedRef.current
        s.glow.material.opacity = 0.15 + Math.sin(t * 3) * 0.05
        s.glow.material.color.setHex(0x5ee8db)
        s.group.position.y = 0.12 + Math.sin(t * 1.2) * 0.06
      }

      controls.update()
      renderer.render(scene, camera)
    }

    sceneRef.current = { scene, camera, renderer, controls, photoGroups, petals }

    animate()

    return () => {
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [selectPhoto])

  return (
    <div className="three-gallery-container" ref={containerRef}>
      <nav className="nav-dots-three">
        {MIKU_PHOTOS.map((_, idx) => (
          <button
            key={idx}
            className={`nav-dot-three ${selectedId === `miku-${idx + 1}` ? 'active' : ''}`}
            onClick={() => selectPhoto(idx)}
            aria-label={`Foto ${idx + 1}`}
          />
        ))}
      </nav>

      {selectedId && (
        <div className="floating-nav">
          <button className="float-btn prev" onClick={goPrev} aria-label="Previous">&#10094;</button>
          <button className="float-btn next" onClick={goNext} aria-label="Next">&#10095;</button>
        </div>
      )}
    </div>
  )
}