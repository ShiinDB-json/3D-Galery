import { useState, Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Gallery from './components/Gallery'
import './App.css'

// Nakano Miku theme — all 23 photos as Nakano Miku
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

const MIKU_ICONS = ['🎵', '🎶', '♪', '♩', '♬']

export default function App() {
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  const kanji = () => '三玖'

  return (
    <div className="app">
      {/* Floating Music Notes Background */}
      <div className="music-notes">
        {MIKU_ICONS.map((icon, i) => (
          <span
            key={i}
            className={`music-note note-${i}`}
            style={{ '--delay': `${i * 0.7}s`, '--dur': `${6 + i * 1.5}s`, '--x': `${10 + i * 18}%` }}
          >
            {icon}
          </span>
        ))}
      </div>

      {/* Loading Screen */}
      {!loaded && (
        <div className="loading-screen">
          <div className="logo">
            <span className="logo-icon">🎵</span>
            <span className="logo-text">
              Nakano <em>Miku</em>
            </span>
          </div>
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
          <p className="loading-sub">中野三玖 · Album Foto 3D</p>
        </div>
      )}

      {/* Header */}
      <header className="masthead">
        <p className="eyebrow">
          <span className="eyebrow-icon">♪</span>
          Nakano Miku · Gotoubun no Hanayome
        </p>
        <h1>
          Nakano <em>Miku</em>
        </h1>
        <p className="subtitle">
          <span>♪</span> Album Foto 3D Interaktif <span>♪</span>
        </p>
      </header>

      {/* 3D Canvas */}
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 1.2, 13], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
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
        <span className="hint-icon">♪</span>
        seret untuk menjelajah &nbsp;&nbsp;gulir untuk mendekat &nbsp;&nbsp;klik bingkai
      </p>

      {/* Side Navigation Dots */}
      <nav className="nav-dots" aria-label="Quick navigation">
        {ALL_ITEMS.map((q, idx) => (
          <div
            key={q.id}
            className={`nav-dot ${selected?.id === q.id ? 'active' : ''}`}
            style={{ borderColor: selected?.id === q.id ? q.color : undefined }}
            onClick={() => setSelected(q)}
            aria-label={`Lihat foto ${idx + 1}`}
          />
        ))}
      </nav>

      {/* Music note indicator on active dot */}
      {selected && (
        <div className="active-indicator" style={{ color: selected.color }}>
          {MIKU_ICONS[0]}
        </div>
      )}

      {/* Modal — Album Page */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-deco-bar">
              <span className="deco-symbol">{selected.symbol}</span>
              <span className="deco-line" />
              <span className="deco-note">♪</span>
            </div>
            <div className="modal-image">
              <img src={selected.img} alt={selected.title} />
              <div
                className="modal-image-overlay"
                style={{ background: `radial-gradient(ellipse at 30% 20%, ${selected.color}15, transparent 70%)` }}
              />
            </div>
            <div className="modal-info">
              <button className="close-btn" onClick={() => setSelected(null)} aria-label="Tutup">
                ✕
              </button>
              <span className="modal-plate" style={{ color: selected.color }}>
                {selected.symbol} Nakano {kanji()}
              </span>
              <h2 style={{ color: selected.color }}>{selected.title}</h2>
              <p className="modal-detail">{selected.detail}</p>
              <blockquote className="modal-quote" style={{ borderColor: selected.color, background: `linear-gradient(135deg, ${selected.color}08, transparent)` }}>
                {selected.quote}
              </blockquote>
              <div className="modal-footer">
                <span className="footer-note">🎵 Nakano Miku · 中野三玖</span>
                <span className="footer-miku">初音ミク風</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
