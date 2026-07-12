import { useState, Suspense, useEffect } from 'react'
import ThreeGallery from './components/ThreeGallery'
import './App.css'

export default function App() {
  const [selected, setSelected] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <div className="grain" />
      <div className="vignette" />

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

      <header className="masthead">
        <div className="masthead-content">
          <p className="eyebrow">Gotoubun no Hanayome</p>
          <h1>Nakano <em>Miku</em></h1>
          <p className="subtitle">Album Foto 3D</p>
        </div>
      </header>

      <ThreeGallery onSelectPhoto={setSelected} />

      <p className="hint">
        <span className="hint-dot" />
        seret untuk menjelajah &nbsp;&nbsp;gulir untuk mendekat &nbsp;&nbsp;klik foto
      </p>

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
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <div className="modal-meta">
                <span className="modal-tag">Album</span>
                <span className="modal-sep">·</span>
                <span className="modal-count">1 / 23</span>
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