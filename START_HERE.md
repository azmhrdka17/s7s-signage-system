# 🚀 START HERE - Langkah Cepat Menjalankan Sistem

## ⚡ Instalasi & Jalankan (5 Menit)

### Cara Termudah:

1. **Buka Command Prompt** (CMD) sebagai Administrator
2. **Masuk ke folder proyek:**
   ```cmd
   cd c:\s7s-signage-system
   ```

3. **Jalankan setup (SEKALI SAJA):**
   ```cmd
   setup-all.bat
   ```
   *Tunggu hingga selesai (5-10 menit untuk download dependencies)*

4. **Jalankan sistem:**
   ```cmd
   start-all.bat
   ```
   *Akan membuka 3 jendela terminal untuk Backend, Admin, dan Player*

5. **Buka browser:**
   - Admin CMS: http://localhost:3000/admin
   - Operator: http://localhost:3000/operator  
   - Player: http://localhost:3002

---

## 📝 Jika Script Batch Tidak Berfungsi:

### Opsi 1: PowerShell (Recommended)

Buka **3 jendela PowerShell terpisah**:

**Jendela 1 - Backend:**
```powershell
cd c:\s7s-signage-system\backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

**Jendela 2 - Admin Frontend:**
```powershell
cd c:\s7s-signage-system\frontend-admin
npm install
npm run dev
```

**Jendela 3 - Web Player:**
```powershell
cd c:\s7s-signage-system\web-player
npm install
npm run dev
```

---

### Opsi 2: Command Prompt (CMD)

Buka **3 jendela CMD terpisah**:

**Jendela 1 - Backend:**
```cmd
cd c:\s7s-signage-system\backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run start:dev
```

**Jendela 2 - Admin:**
```cmd
cd c:\s7s-signage-system\frontend-admin
npm install
npm run dev
```

**Jendela 3 - Player:**
```cmd
cd c:\s7s-signage-system\web-player
npm install
npm run dev
```

---

## ✅ Verifikasi Sistem Berjalan

Setelah semua service running, cek:

### Backend (Jendela 1):
```
✅ Database connected
🚀 Backend server running on http://localhost:3001
```

### Admin (Jendela 2):
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
✓ Ready in 2.5s
```

### Player (Jendela 3):
```
VITE v5.0.8 ready in 1234 ms
➜ Local: http://localhost:3002/
```

---

## 🌐 Akses Aplikasi

Setelah semua service running, buka di browser:

| URL | Fungsi |
|-----|--------|
| http://localhost:3000 | Home page |
| http://localhost:3000/admin | **Admin CMS** - Upload konten |
| http://localhost:3000/operator | **Operator** - Panggil antrian |
| http://localhost:3002 | **Player** - Tampilan layar TV (Tekan F11) |

---

## 🎯 Test Cepat

### 1. Test Admin CMS
- Buka http://localhost:3000/admin
- Ketik "TEST" di Running Text
- Klik "Publish ke Layar"
- Buka http://localhost:3002 di tab lain
- **Hasil:** Running text di Player berubah jadi "TEST"

### 2. Test Operator
- Buka http://localhost:3000/operator
- Klik "Panggil Berikutnya" di Loket 1
- Lihat Player: Kotak Loket 1 berkedip & suara TTS berbunyi

---

## 🐛 Troubleshooting Cepat

### Error: Port sudah digunakan
```
Error: listen EADDRINUSE :::3001
```
**Solusi:**
- Close aplikasi yang menggunakan port tersebut
- Atau restart komputer

### Error: Cannot find module
```
Error: Cannot find module '@nestjs/core'
```
**Solusi:**
- Pastikan `npm install` sudah selesai
- Jalankan ulang `npm install`

### Database error
```
PrismaClientInitializationError
```
**Solusi:**
```cmd
cd backend
npx prisma migrate reset
npx prisma generate
npm run prisma:seed
```

### npm install terlalu lama
**Tips:**
- Pastikan internet stabil
- Gunakan koneksi yang cepat
- npm install backend paling lama (3-5 menit)

---

## 📚 Dokumentasi Lengkap

Setelah sistem berjalan, baca dokumentasi lengkap:
- [QUICK_START.md](QUICK_START.md) - Panduan lengkap
- [README.md](README.md) - Overview sistem
- [DOCS_INDEX.md](DOCS_INDEX.md) - Indeks semua dokumentasi

---

## 🎉 SELAMAT!

Jika semua berjalan, Anda sudah berhasil menjalankan **S7S Digital Signage System**!

**Next Steps:**
1. ✅ Upload video & gambar di Admin CMS
2. ✅ Set running text & jadwal dokter
3. ✅ Publish ke layar
4. ✅ Test panggilan antrian dari Operator
5. ✅ Lihat hasilnya di Player (fullscreen F11)

---

**Butuh bantuan?** Baca [INSTALLATION_CHECKLIST.md](INSTALLATION_CHECKLIST.md) untuk troubleshooting lengkap.

**Created:** 2024  
**Version:** 1.0.0  
**Status:** ✅ READY TO USE
