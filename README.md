# S7S Digital Signage & Antrian System

Sistem Digital Signage & Antrian lengkap berbasis web untuk menggantikan aplikasi desktop lama (S7S CMS & S7S Player).

## 📁 Struktur Proyek

```
s7s-signage-system/
├── backend/           # NestJS Backend API + WebSocket
├── frontend-admin/    # Next.js Admin CMS & Operator
└── web-player/        # React Web Player (Fullscreen)
```

## 🚀 Cara Menjalankan

### 1. Setup Backend (NestJS)

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Backend akan berjalan di **http://localhost:3001**

### 2. Setup Frontend Admin (Next.js)

```bash
cd frontend-admin
npm install
npm run dev
```

Admin CMS akan berjalan di **http://localhost:3000**

### 3. Setup Web Player (React)

```bash
cd web-player
npm install
npm run dev
```

Web Player akan berjalan di **http://localhost:3002**

## 📺 Cara Menggunakan

### A. Admin CMS (http://localhost:3000/admin)

1. **Upload Background**: Klik input file pada bagian Background
2. **Upload Video**: Upload video MP4 untuk ditampilkan di layar
3. **Upload Slides**: Upload gambar untuk slideshow
4. **Edit Running Text**: Ketik teks yang akan berjalan di bawah layar
5. **Tambah Jadwal**: Klik "Tambah Baris" untuk menambah jadwal dokter
6. **Publish**: Klik "Publish ke Layar" untuk mengirim update ke Player

### B. Operator Antrian (http://localhost:3000/operator)

Setiap loket (Slot 1-5) memiliki 3 tombol kontrol:

- **➕ Panggil Berikutnya**: Otomatis menambah nomor antrian (+1)
- **🔁 Panggil Ulang**: Memanggil ulang nomor terakhir
- **📞 Panggil Manual**: Masukkan nomor spesifik (contoh: A010, B025)

### C. Web Player (http://localhost:3002)

- Buka di browser pada komputer yang terhubung ke TV/Monitor
- Tekan **F11** untuk fullscreen
- Player akan otomatis:
  - Menampilkan 5 kotak antrian
  - Memutar video playlist
  - Menampilkan slideshow gambar
  - Menampilkan tabel jadwal dokter
  - Menampilkan running text
  - Menampilkan jam & tanggal real-time
- Saat ada panggilan antrian:
  - Kotak antrian berkedip (highlight animation)
  - Suara TTS Indonesia memanggil nomor

## 🎨 Template Layout (1920x1080)

```
┌─────────────────────────────────────────────┐
│ [Antrian 1-5]  │  [Video Player]            │
│ (Kotak 5 slot) │  (Playlist video MP4)      │
│                │                             │
│                ├─────────────┬───────────────┤
│                │  Slideshow  │  Tabel Jadwal │
├────────────────┴─────────────┴───────────────┤
│  [Running Text]              │  [Date/Time]  │
└──────────────────────────────┴───────────────┘
```

## 🔌 API Endpoints

### Media Upload
- `POST /api/media/upload` - Upload file video/gambar
- `GET /api/media` - List semua media
- `DELETE /api/media/:id` - Hapus media

### Signage Content
- `GET /api/signage/:clientId` - Ambil konfigurasi lengkap
- `POST /api/signage/:clientId/content` - Update konten (trigger WebSocket)

### Queue Management
- `POST /api/signage/:clientId/queue/call` - Panggil nomor antrian (trigger WebSocket)

### WebSocket Events
- `refresh:{clientId}` - Event update konten
- `queue:{clientId}` - Event panggilan antrian

## 🗄️ Database Schema (SQLite)

- **Client**: Menyimpan data client (contoh: PRAMITHA)
- **MediaResource**: Menyimpan file video dan gambar
- **TvChannel**: Daftar channel TV (opsional)
- **SignageContent**: Konten layar (video, slide, running text, jadwal)
- **QueueSlot**: Status 5 slot antrian per client

## 🎯 Fitur Utama

### Backend
✅ REST API dengan NestJS
✅ WebSocket real-time dengan Socket.io
✅ Upload file dengan Multer
✅ Database Prisma + SQLite
✅ Static file serving untuk media

### Web Player
✅ Auto-scale ke berbagai resolusi monitor
✅ Layout koordinat absolut (1920x1080 base)
✅ Video playlist otomatis berulang
✅ Slideshow gambar otomatis
✅ Animasi highlight panggilan antrian
✅ TTS bahasa Indonesia (Web Speech API)
✅ LocalStorage cache untuk offline
✅ Real-time update via WebSocket

### Admin CMS
✅ Upload video & gambar
✅ Edit running text
✅ Kelola tabel jadwal dokter
✅ Publish real-time ke layar

### Operator Antrian
✅ Kontrol 5 loket independen
✅ Panggil nomor berikutnya otomatis
✅ Panggil ulang nomor terakhir
✅ Input nomor manual
✅ Real-time broadcast ke layar

## 📦 Dependencies

### Backend
- @nestjs/core, @nestjs/platform-express
- @nestjs/websockets, socket.io
- @prisma/client
- multer

### Frontend Admin
- next.js 14
- react 18
- tailwindcss
- socket.io-client

### Web Player
- react 18
- vite
- socket.io-client

## 🔧 Konfigurasi

### Ganti Client ID
Edit di masing-masing file:
- `frontend-admin/app/admin/page.tsx` → `const CLIENT_ID = 'PRAMITHA'`
- `frontend-admin/app/operator/page.tsx` → `const CLIENT_ID = 'PRAMITHA'`
- `web-player/src/App.tsx` → `const CLIENT_ID = 'PRAMITHA'`

### Ganti URL Backend
Jika backend tidak di localhost:3001, edit:
- `frontend-admin/app/admin/page.tsx` → `const API_URL`
- `frontend-admin/app/operator/page.tsx` → `const API_URL`
- `web-player/src/App.tsx` → `const API_URL`

## 🐛 Troubleshooting

### Port sudah digunakan
- Backend: Edit `backend/src/main.ts` → `app.listen(3001)`
- Frontend: Edit `frontend-admin/package.json` → `"dev": "next dev -p 3000"`
- Player: Edit `web-player/vite.config.ts` → `server: { port: 3002 }`

### Database error
```bash
cd backend
npx prisma migrate reset
npx prisma generate
```

### Upload folder tidak ada
```bash
cd backend
mkdir uploads
```

### TTS tidak berbunyi
- Pastikan browser mendukung Web Speech API (Chrome/Edge)
- Cek volume speaker/monitor
- Pastikan bahasa Indonesia tersedia di sistem

## 📝 Catatan

- Sistem ini menggunakan SQLite untuk development. Untuk production, ganti ke PostgreSQL di `prisma/schema.prisma`
- File upload disimpan di folder `backend/uploads` dan diakses via `/resources`
- WebSocket otomatis reconnect jika koneksi terputus
- Player menyimpan cache terakhir di localStorage untuk fallback offline
- Format nomor antrian: Awalan huruf + 3 digit angka (contoh: A001, B025)

## 🎉 Selesai!

Sistem siap digunakan. Akses:
- Admin CMS: http://localhost:3000/admin
- Operator: http://localhost:3000/operator
- Player: http://localhost:3002 (Tekan F11 untuk fullscreen)
