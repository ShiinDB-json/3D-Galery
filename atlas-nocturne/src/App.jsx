import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import Gallery from './components/Gallery'
import './App.css'

const ARTWORKS = [
  { id: 1, plate: '01', title: 'Lembah Sunyi', coord: "6°55'S 107°36'E", recorder: 'R. Aditama', year: '2019', img: 'https://picsum.photos/id/1015/900/700' },
  { id: 2, plate: '02', title: 'Tebing Berkabut', coord: "7°02'S 110°24'E", recorder: 'S. Wirawan', year: '2020', img: 'https://picsum.photos/id/1039/900/700' },
  { id: 3, plate: '03', title: 'Muara Malam', coord: "5°08'S 119°26'E", recorder: 'L. Endah', year: '2018', img: 'https://picsum.photos/id/1043/900/700' },
  { id: 4, plate: '04', title: 'Reruntuhan Utara', coord: "3°35'N 98°41'E", recorder: 'B. Prakoso', year: '2021', img: 'https://picsum.photos/id/1050/900/700' },
  { id: 5, plate: '05', title: 'Padang Beku', coord: "8°23'S 115°11'E", recorder: 'R. Aditama', year: '2017', img: 'https://picsum.photos/id/1067/900/700' },
  { id: 6, plate: '06', title: 'Celah Basalt', coord: "1°17'S 116°49'E", recorder: 'S. Wirawan', year: '2022', img: 'https://picsum.photos/id/1074/900/700' },
  { id: 7, plate: '07', title: 'Rawa Berkilau', coord: "0°02'N 109°20'E", recorder: 'L. Endah', year: '2019', img: 'https://picsum.photos/id/1084/900/700' },
  { id: 8, plate: '08', title: 'Puncak Tak Bernama', coord: "2°10'S 111°33'E", recorder: 'B. Prakoso', year: '2023', img: 'https://picsum.photos/id/1062/900/700' },
]

export default function App() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="app">
      <header className="masthead">
        <p className="eyebrow">Arsip Ekspedisi · Jilid II</p>
        <h1>Atlas Nocturne</h1>
      </header>

      <Canvas camera={{ position: [0, 1.2, 13], fov: 50 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Gallery artworks={ARTWORKS} onSelect={setSelected} />
        </Suspense>
      </Canvas>

      <Loader
        containerStyles={{ background: 'rgba(10,11,15,0.92)' }}
        innerStyles={{ background: '#1c1d22', width: '220px', height: '3px' }}
        barStyles={{ background: '#b8874a', height: '3px' }}
        dataStyles={{ color: '#e8e1d0', fontFamily: "'IBM Plex Mono', monospace", fontSize: '0.7rem', marginTop: '0.75rem' }}
      />

      <p className="hint">
        Seret untuk menjelajah &nbsp;·&nbsp; gulir untuk mendekat &nbsp;·&nbsp; klik pelat untuk catatan lapangan
      </p>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image">
              <img src={selected.img} alt={selected.title} />
            </div>
            <div className="modal-info">
              <span className="modal-plate">Pelat No. {selected.plate}</span>
              <h2>{selected.title}</h2>
              <p className="modal-coord">{selected.coord}</p>
              <p className="modal-meta">Dicatat oleh {selected.recorder} · {selected.year}</p>
              <button className="close-btn" onClick={() => setSelected(null)} aria-label="Tutup catatan lapangan">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
