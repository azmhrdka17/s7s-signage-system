# 🚀 Cara Menjalankan Sistem S7S Digital Signage

Panduan lengkap untuk menjalankan sistem setiap kali Anda ingin menggunakannya.

---

## ⚡ CARA CEPAT (Recommended)

### Opsi 1: Gunakan Script Otomatis

**Double-click file ini:**
```
start-all.bat
```

Script akan otomatis membuka 3 terminal untuk:
- Backend (port 3001)
- Admin Frontend (port 3000)
- Web Player (port 3002)

**Tunggu 10-15 detik** sampai semua service running, lalu:
- Admin: http://localhost:3000/admin
- Operator: http://localhost:3000/operator
- Player: http://localhost:3002

---

## 📝 CARA MANUAL (Jika Script Tidak Berfungsi)

### Langkah-langkah:

#### 1️⃣ Buka 3 Jendela PowerShell/Terminal Terpisah

**Jendela 1 - Backend (WAJIB):**
```powershell
cd c:\s7s-signage-system\backend
npm run start:dev
```

**Tunggu sampai muncul:**
```
✅ Database connected
🚀 Backend server running on http://localhost:3001
```

---

**Jendela 2 - Admin Frontend:**
```powershell
cd c:\s7s-signage-system\frontend-admin
npm run dev
```

**Tunggu sampai muncul:**
```
▲ Next.js 14.0.4
- Local: http://localhost:3000
✓ Ready in X.Xs
```

---

**Jendela 3 - Web Player:**
```powershell
cd c:\s7s-signage-system\web-player
npm run dev
```

**Tunggu sampai muncul:**
```
VITE v5.0.8 ready in Xms
➜ Local: http://localhost:3002/
```

---

#### 2️⃣ Akses di Browser

**Setelah semua service running:**

| Service | URL | Fungsi |
|---------|-----|--------|
| Admin CMS | http://localhost:3000/admin | Upload konten, edit jadwal |
| Operator | http://localhost:3000/operator | Panggil nomor antrian |
| Player | http://localhost:3002 | Tampilan layar TV (tekan F11) |

---

## ⚠️ TROUBLESHOOTING

### ❌ Error: Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solusi:**

**Opsi A - Restart Komputer** (Termudah)

**Opsi B - Kill Process Manual:**
```powershell
# Cari process yang menggunakan port
netstat -ano | findstr :3001
netstat -ano | findstr :3000
netstat -ano | findstr :3002

# Kill process (ganti <PID> dengan nomor yang muncul)
taskkill /PID <PID> /F
```

---

### ❌ Backend Error "Cannot find module"

```
Error: Cannot find module '@nestjs/core'
```

**Solusi:**
```powershell
cd c:\s7s-signage-system\backend
npm install
```

---

### ❌ Player Stuck di "Loading..."

**Penyebab:** Backend belum running.

**Solusi:**
1. Pastikan Backend running (cek Terminal 1)
2. Tunggu sampai muncul: `🚀 Backend server running`
3. Refresh Player (F5)

---

### ❌ Gambar Tidak Muncul di Player

**Solusi:**
1. Upload gambar dulu di Admin CMS
2. Klik "Publish ke Layar"
3. Refresh Player (F5)
4. Jika masih tidak muncul, check backend terminal ada error atau tidak

---

### ❌ Database Error

```
PrismaClientInitializationError
```

**Solusi:**
```powershell
cd c:\s7s-signage-system\backend
npx prisma migrate reset
npx prisma generate
npm run prisma:seed
```

---

## 🛑 CARA MENGHENTIKAN SISTEM

### Jika Pakai Script (start-all.bat):
- Close semua jendela terminal yang terbuka

### Jika Manual:
- Tekan **Ctrl+C** di setiap terminal
- Atau close window terminal

---

## 📋 CHECKLIST STARTUP

Gunakan checklist ini setiap kali menjalankan:

```
□ Backend running (port 3001) - Terminal 1
□ Admin running (port 3000) - Terminal 2  
□ Player running (port 3002) - Terminal 3
□ Browser: http://localhost:3000/admin terbuka
□ Browser: http://localhost:3002 terbuka (F11 fullscreen)
□ Test upload gambar & publish
□ Test panggil antrian dari Operator
```

---

## 🎯 WORKFLOW HARIAN

### Pagi (Membuka Sistem):
1. Double-click `start-all.bat`
2. Tunggu 15 detik
3. Buka browser:
   - Admin: http://localhost:3000/admin
   - Player di TV: http://localhost:3002 (F11)

### Siang (Menggunakan):
- Upload konten di Admin CMS
- Panggil antrian di Operator
- Monitor Player di TV

### Sore (Menutup):
- Close semua terminal window
- Close browser tabs

---

## 💡 TIPS & TRICKS

### Tip 1: Auto-start di Startup Windows
Buat shortcut `start-all.bat` di folder Startup:
```
C:\Users\<USERNAME>\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

### Tip 2: Dedicated Browser Profile
Gunakan Chrome Kiosk Mode untuk Player:
```
chrome.exe --kiosk --app=http://localhost:3002
```

### Tip 3: Keep Terminal Open
Jangan close terminal window saat sistem running!

### Tip 4: Check Logs
Jika ada masalah, lihat terminal untuk error messages.

---

## 📞 QUICK COMMANDS

**Check if services running:**
```powershell
netstat -an | findstr "3000 3001 3002"
```

**Restart Backend only:**
```powershell
# Di terminal backend, tekan Ctrl+C
# Kemudian:
npm run start:dev
```

**Clear database & reset:**
```powershell
cd c:\s7s-signage-system\backend
npx prisma migrate reset
npm run prisma:seed
```

---

## 🎓 UNTUK PEMULA

### Langkah Paling Mudah:

1. **Buka folder:**
   ```
   c:\s7s-signage-system
   ```

2. **Double-click:**
   ```
   start-all.bat
   ```

3. **Tunggu 15 detik**

4. **Buka browser:**
   - Ketik: `localhost:3000/admin`
   - Ketik: `localhost:3002` (untuk TV)

5. **Selesai!** 🎉

---

## ⚙️ ADVANCED: Background Service (Optional)

Jika ingin running sebagai Windows Service (auto-start):

**Install PM2 Windows:**
```powershell
npm install -g pm2
npm install -g pm2-windows-startup

pm2-startup install
```

**Start services:**
```powershell
cd c:\s7s-signage-system
pm2 start ecosystem.config.js
pm2 save
```

**Note:** Ini opsional, untuk production server.

---

## 📖 DOKUMENTASI LENGKAP

Jika butuh info lebih detail:
- **README.md** - Overview sistem
- **QUICK_START.md** - Panduan lengkap
- **API_DOCUMENTATION.md** - Dokumentasi API
- **TROUBLESHOOTING.md** - Masalah & solusi
- **INSTALLATION_CHECKLIST.md** - Verifikasi instalasi

---

## ✅ SUMMARY

**Yang Wajib Running:**
1. Backend (port 3001) - **WAJIB!**
2. Admin (port 3000) - Jika mau upload/edit konten
3. Player (port 3002) - Jika mau tampilkan di TV

**Minimal Setup:**
- Hanya Backend + Player (tanpa Admin jika tidak edit konten)

**Full Setup:**
- Backend + Admin + Player (recommended)

---

## 🎊 SELAMAT MENGGUNAKAN!

Sistem sudah siap digunakan setiap saat.
Cukup jalankan `start-all.bat` dan tunggu 15 detik.

**Happy Signage! 📺✨**

---

**Created:** 2024  
**Version:** 1.0.0  
**Last Updated:** $(Get-Date -Format "yyyy-MM-dd")
