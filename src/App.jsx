import { useState, Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Gallery from './components/Gallery'
import './App.css'

// Nakano Quintuplets × Hatsune Miku fusion — teal-pink palette
const QUINTUPLETS = [
  {
    id: 1,
    name: 'Ichika',
    title: 'Nakano Ichika 中野一花',
    color: '#3DB2A8',
    accent: '#7EDCD3',
    detail: 'Yang tertua · Elegan & Berkelas',
    quote: '"Keindahan ada di dalam ketenangan."',
    img: 'https://i.pinimg.com/736x/2e/7a/21/2e7a21c0d91bb67d836a23e320f7feb3.jpg',
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
    img: 'https://i.pinimg.com/736x/a3/1e/91/a31e91a79d4ac8e5b80b37e896c4a7e2.jpg',
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
    img: 'https://i.pinimg.com/736x/c8/41/b5/c841b5d39b1d1db5c060fa6e9e0c9f9c.jpg',
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
    img: 'https://i.pinimg.com/736x/51/a2/f0/51a2f0e1f1e5c19b0c3f3c9f1a1c8e9d.jpg',
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
    img: 'https://i.pinimg.com/736x/d4/5e/8a/d45e8a6b0c1e2f3a4b5c6d7e8f9a0b1c.jpg',
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
              <img src={selected.img} alt={selected.title} />
              <div className="modal-image-overlay" style={{ background: `radial-gradient(ellipse at 30% 20%, ${selected.color}15, transparent 70%)` }} />
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
