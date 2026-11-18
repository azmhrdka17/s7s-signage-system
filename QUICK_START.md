# 🚀 Panduan Cepat S7S Digital Signage System

## Instalasi & Setup (Hanya Sekali)

### Cara Otomatis (Recommended)
1. Double-click file **`setup-all.bat`**
2. Tunggu hingga instalasi selesai (5-10 menit)
3. Tekan tombol apapun untuk menutup

### Cara Manual
```bash
# 1. Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# 2. Frontend Admin
cd ../frontend-admin
npm install

# 3. Web Player
cd ../web-player
npm install
```

---

## Menjalankan Aplikasi

### Cara Otomatis (Recommended)
- Double-click file **`start-all.bat`**
- Tunggu hingga semua service aktif (akan muncul 3 jendela terminal baru)

### Cara Manual
Buka 3 terminal terpisah:

**Terminal 1 - Backend:**
```bash
cd backend
npm run start:dev
```

**Terminal 2 - Admin:**
```bash
cd frontend-admin
npm run dev
```

**Terminal 3 - Player:**
```bash
cd web-player
npm run dev
```

---

## 🌐 URL Akses

| Service | URL | Fungsi |
|---------|-----|--------|
| **Backend API** | http://localhost:3001 | API & WebSocket |
| **Admin CMS** | http://localhost:3000/admin | Kelola konten signage |
| **Operator Antrian** | http://localhost:3000/operator | Panggil nomor antrian |
| **Web Player** | http://localhost:3002 | Tampilan layar TV |

---

## 📋 Alur Kerja

### 1️⃣ Setup Konten (Admin CMS)
1. Buka http://localhost:3000/admin
2. Upload video untuk playlist
3. Upload gambar untuk slideshow
4. Upload gambar background
5. Isi running text
6. Tambah jadwal dokter/layanan
7. Klik **"Publish ke Layar"**

### 2️⃣ Tampilkan di Layar (Web Player)
1. Buka http://localhost:3002 di browser komputer yang terhubung ke TV
2. Tekan **F11** untuk fullscreen
3. Player akan otomatis menampilkan konten yang sudah dipublish

### 3️⃣ Panggil Antrian (Operator)
1. Buka http://localhost:3000/operator
2. Pilih loket yang ingin digunakan
3. Klik **"Panggil Berikutnya"** untuk auto-increment nomor
4. Atau masukkan nomor manual (contoh: A010) lalu klik **"Panggil"**
5. Layar TV akan otomatis menampilkan panggilan + suara TTS

---

## 🎯 Tips & Trik

### Player
- Pastikan browser mendukung autoplay video (Chrome/Edge recommended)
- Jika video tidak muncul, refresh halaman (Ctrl+R)
- Cache tersimpan di localStorage, player tetap berjalan walau koneksi terputus

### Operator
- Format nomor: **Huruf + 3 angka** (A001, B025, C100)
- "Panggil Berikutnya" otomatis menambah 1 (A001→A002)
- "Panggil Ulang" untuk mengulang nomor terakhir

### Admin CMS
- Upload video format: MP4, WebM, OGG
- Upload gambar format: JPG, PNG, GIF
- Klik "Publish ke Layar" setiap kali ada perubahan

### Suara TTS
- Pastikan volume speaker/monitor tidak mute
- TTS menggunakan Web Speech API bawaan browser
- Format pembacaan: "Nomor antrian A kosong kosong satu, silakan menuju ke Loket 1"

---

## ❓ Troubleshooting

### Port sudah digunakan
Edit port di:
- Backend: `backend/src/main.ts` → `app.listen(3001)`
- Admin: `frontend-admin/package.json` → `"dev": "next dev -p 3000"`
- Player: `web-player/vite.config.ts` → `server: { port: 3002 }`

### Database error
```bash
cd backend
npx prisma migrate reset
npx prisma generate
```

### Video tidak autoplay
- Klik di area player terlebih dahulu (browser policy)
- Atau refresh halaman

### WebSocket tidak connect
- Pastikan backend sudah running
- Check console browser untuk error
- Restart backend

### Upload file gagal
```bash
# Pastikan folder uploads ada
cd backend
mkdir uploads
```

---

## 🎨 Customization

### Ganti Client ID
Edit di 3 file:
1. `frontend-admin/app/admin/page.tsx` → `CLIENT_ID`
2. `frontend-admin/app/operator/page.tsx` → `CLIENT_ID`
3. `web-player/src/App.tsx` → `CLIENT_ID`

### Ubah Layout Player
Edit koordinat di `web-player/src/components/SignagePlayer.tsx`:
```typescript
const LAYOUT = {
  Antrian1: { x: 5, y: 9, w: 597, h: 190 },
  // ... dst
}
```

### Tambah Client Baru
```bash
# Via API atau database
POST http://localhost:3001/api/signage/CLIENT_BARU
```

---

## 📞 Support

Jika ada masalah:
1. Check terminal untuk error log
2. Buka browser DevTools (F12) → Console
3. Pastikan semua service running
4. Restart dengan `start-all.bat`

---

**🎉 Selamat mencoba! Sistem siap digunakan.**
