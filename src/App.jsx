import { useState, Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Gallery from './components/Gallery'
import './App.css'

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

const ALL_ITEMS = MIKU_PHOTOS.map((img, idx) => ({
  id: `miku-${idx + 1}`,
  name: 'Nakano Miku',
  title: 'Nakano Miku 中野三玖',
  color: '#2EC0B5',
  accent: '#5EE8DB',
  detail: 'Yang ketiga · Tulus & Penuh Perasaan',
  quote: '"Di balik catatan tua, ada harapan yang tak pernah padam."',
  symbol: '♖',
  img,
}))

export default function App() {
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const canvasRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="app">
      {/* Grain texture overlay */}
      <div className="grain" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Loading Screen */}
      {!loaded && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-logo">
              <span className="loading-icon">♖</span>
              <div className="loading-text">
                <span className="loading-title">Nakano Miku</span>
                <span className="loading-subtitle">Album Foto</span>
              </div>
            </div>
            <div className="loading-bar-container">
              <div className="loading-bar">
                <div className="loading-bar-fill" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="masthead">
        <div className="masthead-content">
          <p className="eyebrow">Gotoubun no Hanayome</p>
          <h1>
            Nakano <em>Miku</em>
          </h1>
          <p className="subtitle">Album Foto 3D</p>
        </div>
      </header>

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 1.2, 13], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{
          transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <Suspense fallback={null}>
          <Gallery items={ALL_ITEMS} onSelect={setSelected} />
        </Suspense>
      </Canvas>

      {/* Loader */}
      <Loader
        containerStyles={{ background: 'rgba(5,15,20,0.95)' }}
        innerStyles={{ background: 'rgba(46,199,184,0.15)', width: '220px', height: '2px', borderRadius: '2px' }}
        barStyles={{ background: 'linear-gradient(90deg, #2EC4B6, #3DE2D1, #20B2AA)', height: '2px', borderRadius: '2px' }}
        dataStyles={{ color: '#e0f7f5', fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', marginTop: '0.75rem', fontWeight: 300 }}
      />

      {/* Hint */}
      <p className="hint">
        <span className="hint-dot" />
        seret untuk menjelajah &nbsp;&nbsp;gulir untuk mendekat &nbsp;&nbsp;klik bingkai
      </p>

      {/* Side Navigation */}
      <nav className="nav-dots" aria-label="Quick navigation">
        {ALL_ITEMS.map((q, idx) => (
          <button
            key={q.id}
            className={`nav-dot ${selected?.id === q.id ? 'active' : ''}`}
            onClick={() => setSelected(q)}
            aria-label={`Lihat foto ${idx + 1}`}
            title={`${q.name} — ${idx + 1}`}
          >
            <span className="nav-dot-inner" />
          </button>
        ))}
      </nav>

      {/* Modal — Album Page */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-col">
              <div className="modal-image-wrap">
                <img src={selected.img} alt={selected.title} loading="lazy" />
              </div>
            </div>
            <div className="modal-info-col">
              <button className="close-btn" onClick={() => setSelected(null)} aria-label="Tutup">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>

              <div className="modal-meta">
                <span className="modal-tag">Album</span>
                <span className="modal-sep">·</span>
                <span className="modal-count">{ALL_ITEMS.findIndex(i => i.id === selected.id) + 1} / {ALL_ITEMS.length}</span>
              </div>

              <h2 className="modal-title">{selected.title}</h2>
              <p className="modal-detail">{selected.detail}</p>
              <blockquote className="modal-quote">{selected.quote}</blockquote>

              <div className="modal-actions">
                <button className="modal-btn" onClick={() => setSelected(null)}>Kembali</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
