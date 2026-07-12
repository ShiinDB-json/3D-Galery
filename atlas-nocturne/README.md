# Atlas Nocturne — Galeri 3D

Galeri seni 3D interaktif berkonsep "arsip ekspedisi malam" — dibangun dengan **React 19**, **Three.js**, dan **React Three Fiber**, dijalankan lewat **Vite** di atas **Node.js**.

## Fitur

- 8 "pelat" foto tersusun melingkar dalam ruang 3D, bisa diputar & di-zoom bebas
- Lantai reflektif + starfield untuk suasana malam
- Sudut kuningan (brass) yang menyala saat pelat di-hover
- Klik pelat untuk membuka "catatan lapangan" (judul, koordinat, pencatat, tahun)
- Auto-rotate saat idle — otomatis nonaktif jika perangkat mengaktifkan *reduced motion*
- Layout responsif sampai ke ukuran mobile

## Menjalankan secara lokal

Pastikan **Node.js versi 18.18 atau lebih baru** sudah terpasang di komputermu.

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

## Build untuk produksi

```bash
npm run build
npm run preview
```

Hasil build ada di folder `dist/`, siap di-deploy ke Vercel, Netlify, atau hosting statis lainnya.

## Mengganti isi galeri

Semua data ada di array `ARTWORKS` pada `src/App.jsx`. Ganti `img` dengan URL gambarmu sendiri (atau taruh file di folder `public/` dan pakai path lokal), lalu sesuaikan `title`, `coord`, `recorder`, dan `year`.

Ingin menambah/mengurangi jumlah pelat? Cukup tambah/hapus entri di array — posisinya di ruang 3D otomatis menyesuaikan.

## Deploy ke Vercel

Proyek ini sudah termasuk `vercel.json` sehingga Vercel otomatis mendeteksi framework Vite.

**Lewat dashboard:**
1. Push kode ini ke GitHub
2. Buka [vercel.com/new](https://vercel.com/new), import repo-nya
3. Vercel otomatis mengisi build command (`npm run build`) dan output directory (`dist`) — langsung klik **Deploy**

**Lewat CLI:**
```bash
npm i -g vercel
vercel
```

## Deploy ke Railway

Railway butuh proses yang benar-benar berjalan (bukan cuma file statis), jadi proyek ini menyertakan `Dockerfile` + `Caddyfile` — polanya sama seperti template resmi "Vite + React" dari Railway sendiri. Build Node menghasilkan folder `dist/`, lalu web server Caddy yang ringan melayani hasilnya dan otomatis mengikuti port yang diberikan Railway.

1. Push kode ini ke GitHub (pastikan `Dockerfile`, `Caddyfile`, dan `railway.json` ikut ter-commit)
2. Buka [railway.com/new](https://railway.com/new) → **Deploy from GitHub repo** → pilih repo ini
3. Railway akan mendeteksi `Dockerfile` secara otomatis dan men-deploy-nya — tidak perlu setting tambahan
4. Setelah deploy selesai, buka tab **Settings → Networking** untuk generate domain publik (atau pasang custom domain)

**Lewat CLI:**
```bash
npm i -g @railway/cli
railway login
railway link
railway up
```

> Catatan: karena halaman ini cuma satu route (tidak pakai client-side routing), `Caddyfile` yang disertakan sudah cukup sederhana. Kalau nanti kamu menambah routing (misalnya dengan React Router), tambahkan aturan `try_files {path} /index.html` di `Caddyfile` supaya refresh di URL selain `/` tidak 404.

## Struktur proyek

```
index.html
Dockerfile               build + serve untuk Railway (Node -> Caddy)
Caddyfile                konfigurasi web server Caddy
railway.json             beritahu Railway memakai Dockerfile
vercel.json              konfigurasi build untuk Vercel
src/
  main.jsx                entry point React
  App.jsx                 layout, UI overlay, data galeri
  App.css                 styling & design tokens
  index.css               reset global
  components/
    Gallery.jsx            scene 3D: pencahayaan, lantai, starfield, kontrol kamera
    GalleryItem.jsx         satu "pelat" foto + label + efek hover
```

## Troubleshooting

- **Layar putih / error saat `npm install`** — pastikan versi Node ≥ 18.18 (`node -v`). Kalau masih error dependency, coba `npm install --legacy-peer-deps`.
- **Gambar tidak muncul** — proyek ini memakai gambar placeholder dari picsum.photos, butuh koneksi internet saat pertama kali dimuat.
- **Railway gagal build** — pastikan file `Dockerfile` dan `Caddyfile` ikut ter-commit ke Git (bukan cuma ada di komputer lokal). Cek log build di tab **Deployments** untuk detail errornya.
- **Vercel salah mendeteksi framework** — kalau Vercel tidak otomatis memilih "Vite", set manual di **Project Settings → Build & Development Settings**.
