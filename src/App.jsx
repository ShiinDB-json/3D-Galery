import { useState, Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Gallery from './components/Gallery'
import './App.css'

const QUINTUPLETS = [
  {
    id: 1,
    name: 'Ichika',
    title: 'Nakano Ichika 中野一花',
    color: '#3DB2A8',
    accent: '#7EDCD3',
    detail: 'Yang tertua · Elegan & Berkelas',
    quote: '"Keindahan ada di dalam ketenangan."',
    symbol: '♔',
  },
  {
    id: 2,
    name: 'Nino',
    title: 'Nakano Nino 中野二乃',
    color: '#36B5A0',
    accent: '#6FD8C5',
    detail: 'Yang kedua · Pemberani & Penuh Semangat',
    quote: '"Masakan terbaik untuk orang yang paling berharga."',
    symbol: '♕',
  },
  {
    id: 3,
    name: 'Miko',
    title: 'Nakano Miko 中野三玖',
    color: '#2EC0B5',
    accent: '#5EE8DB',
    detail: 'Yang ketiga · Tulus & Penuh Perasaan',
    quote: '"Di balik catatan tua, ada harapan yang tak pernah padam."',
    symbol: '♖',
  },
  {
    id: 4,
    name: 'Yotsuba',
    title: 'Nakano Yotsuba 中野四葉',
    color: '#30C7B8',
    accent: '#62ECD6',
    detail: 'Yang keempat · Ceria & Menyanyi Untukmu',
    quote: '"Nyanyian bisa menyatukan semua hati!"',
    symbol: '♗',
  },
  {
    id: 5,
    name: 'Itsuki',
    title: 'Nakano Itsuki 中野五珠',
    color: '#2AB8AC',
    accent: '#4FD8CE',
    detail: 'Yang termuda · Cerdas & Teliti',
    quote: '"Setiap nada punya arti, setiap kata punya makna."',
    symbol: '♘',
  },
]

const MIKU_ICONS = ['🎵', '🎶', '♪', '♩', '♬']

export default function App() {
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  const kanji = (id) =>
    id === 1 ? '一花' : id === 2 ? '二乃' : id === 3 ? '三玖' : id === 4 ? '四葉' : '五珠'

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
              Nakano × <em>Miku</em>
            </span>
          </div>
          <div className="loading-bar">
            <div className="loading-bar-fill" />
          </div>
          <p className="loading-sub">五等分の花嫁 × 初音ミク</p>
        </div>
      )}

      {/* Header */}
      <header className="masthead">
        <p className="eyebrow">
          <span className="eyebrow-icon">♪</span>
          Gotoubun no Hanayome × Hatsune Miku
        </p>
        <h1>
          Nakano <em>Quintuplets</em>
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
          <Gallery quintuplets={QUINTUPLETS} onSelect={setSelected} />
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
        {QUINTUPLETS.map((q) => (
          <div
            key={q.id}
            className={`nav-dot ${selected?.id === q.id ? 'active' : ''}`}
            style={{ borderColor: selected?.id === q.id ? q.color : undefined }}
            onClick={() => setSelected(q)}
            aria-label={`Lihat ${q.name}`}
          />
        ))}
      </nav>

      {/* Music note indicator on active dot */}
      {selected && (
        <div className="active-indicator" style={{ color: selected.color }}>
          {MIKU_ICONS[selected.id - 1]}
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
              <div
                className="modal-placeholder"
                style={{
                  background: `linear-gradient(135deg, ${selected.color}40, ${selected.color}10, ${selected.color}30)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  width: '100%',
                  height: '100%',
                }}
              >
                <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.2))' }}>
                  {selected.symbol}
                </span>
                <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontFamily: 'serif' }}>
                  {kanji(selected.id)}
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>
                  {selected.name}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginTop: '1rem' }}>
                  ♪ Nakano × Miku
                </span>
              </div>
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
                {selected.symbol} Nakano {kanji(selected.id)}
              </span>
              <h2 style={{ color: selected.color }}>{selected.title}</h2>
              <p className="modal-detail">{selected.detail}</p>
              <blockquote className="modal-quote" style={{ borderColor: selected.color, background: `linear-gradient(135deg, ${selected.color}08, transparent)` }}>
                {selected.quote}
              </blockquote>
              <div className="modal-footer">
                <span className="footer-note">🎵 Hatsune Miku × {selected.name}</span>
                <span className="footer-miku">初音ミク</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
