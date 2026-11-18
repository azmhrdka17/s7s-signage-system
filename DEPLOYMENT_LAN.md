# 🌐 Deployment untuk Akses Multi-Laptop (LAN)

Panduan lengkap untuk men-deploy sistem S7S Digital Signage agar bisa diakses dari laptop/PC lain dalam satu jaringan.

---

## 📋 Skenario Deployment

### Setup Umum:
```
[Laptop Server] ← Backend + Database
      ↓ WiFi/LAN
[Laptop Operator] ← Admin Panel untuk panggil antrian
      ↓ WiFi/LAN
[PC/TV Display] ← Web Player untuk tampilan signage
```

---

## 🚀 OPSI 1: Deployment Lokal (LAN) - Paling Mudah

### Langkah 1: Cek IP Address Laptop Server

**Buka PowerShell/CMD dan jalankan:**
```powershell
ipconfig
```

**Cari bagian "IPv4 Address", contoh:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

**Catat IP ini:** `192.168.1.100` (IP Anda mungkin berbeda)

---

### Langkah 2: Buka Firewall untuk Port

**Buka PowerShell sebagai Administrator**, lalu jalankan:

```powershell
# Buka port 3001 untuk Backend API
New-NetFirewallRule -DisplayName "S7S Backend API" -Direction Inbound -LocalPort 3001 -Protocol TCP -Action Allow

# Buka port 3000 untuk Admin Panel
New-NetFirewallRule -DisplayName "S7S Admin Panel" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Buka port 3002 untuk Web Player
New-NetFirewallRule -DisplayName "S7S Web Player" -Direction Inbound -LocalPort 3002 -Protocol TCP -Action Allow
```

**Atau cara manual (jika command gagal):**
1. Buka **Windows Defender Firewall**
2. Klik **Advanced Settings**
3. Klik **Inbound Rules** → **New Rule**
4. Pilih **Port** → Next
5. TCP → Specific local ports: `3000, 3001, 3002`
6. Allow the connection → Next → Next
7. Name: "S7S Signage System" → Finish

---

### Langkah 3: Update Konfigurasi Backend

**Edit file:** `c:\s7s-signage-system\backend\src\main.ts`

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS untuk akses dari laptop lain
  app.enableCors({
    origin: '*', // Izinkan semua origin (untuk development)
    credentials: true,
  });

  // Listen di 0.0.0.0 agar bisa diakses dari luar
  await app.listen(3001, '0.0.0.0');
  console.log('🚀 Backend server running on http://0.0.0.0:3001');
}
```

---

### Langkah 4: Update Konfigurasi Frontend Admin

**Edit file:** `c:\s7s-signage-system\frontend-admin\next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow access from other devices
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

**Jalankan dengan host 0.0.0.0:**
```powershell
cd c:\s7s-signage-system\frontend-admin
npm run dev -- -H 0.0.0.0
```

---

### Langkah 5: Update Konfigurasi Web Player

**Edit file:** `c:\s7s-signage-system\web-player\vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen di semua network interface
    port: 3002,
  },
});
```

**Buat file environment untuk production:**

**File:** `c:\s7s-signage-system\web-player\.env.local`
```env
VITE_API_URL=http://192.168.1.100:3001
VITE_CLIENT_ID=PRAMITHA
```

**Update App.tsx untuk baca dari environment:**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'PRAMITHA';
```

---

### Langkah 6: Jalankan Semua Service

**Di Laptop Server (192.168.1.100):**

```powershell
# Terminal 1 - Backend
cd c:\s7s-signage-system\backend
npm run start:dev

# Terminal 2 - Admin Panel
cd c:\s7s-signage-system\frontend-admin
npm run dev -- -H 0.0.0.0

# Terminal 3 - Web Player
cd c:\s7s-signage-system\web-player
npm run dev -- --host 0.0.0.0
```

---

### Langkah 7: Akses dari Laptop Lain

**Dari Laptop Operator:**
```
http://192.168.1.100:3000/operator
```

**Dari PC/TV Display:**
```
http://192.168.1.100:3002
```

**Admin Panel:**
```
http://192.168.1.100:3000/admin
```

---

## 🔧 OPSI 2: Production Build (Lebih Stabil)

### Build Semua Aplikasi

```powershell
# Build Backend
cd c:\s7s-signage-system\backend
npm run build

# Build Admin Frontend
cd c:\s7s-signage-system\frontend-admin
npm run build

# Build Web Player
cd c:\s7s-signage-system\web-player
npm run build
```

### Jalankan Production Mode

```powershell
# Backend (Production)
cd c:\s7s-signage-system\backend
npm run start:prod

# Admin (dengan serve atau pm2)
cd c:\s7s-signage-system\frontend-admin
npx serve -s .next -l 3000 --host 0.0.0.0

# Player (dengan serve)
cd c:\s7s-signage-system\web-player
npx serve -s dist -l 3002 --host 0.0.0.0
```

---

## 🛠️ Script Otomatis untuk LAN Deployment

**File:** `c:\s7s-signage-system\start-lan.bat`

```batch
@echo off
echo ========================================
echo  S7S Digital Signage System (LAN Mode)
echo ========================================
echo.

REM Dapatkan IP Address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo Server IP: %IP%
echo.
echo Pastikan firewall sudah dibuka untuk port:
echo - 3001 (Backend API)
echo - 3000 (Admin Panel)
echo - 3002 (Web Player)
echo.
echo Akses dari laptop lain:
echo - Admin:    http://%IP%:3000/admin
echo - Operator: http://%IP%:3000/operator
echo - Player:   http://%IP%:3002
echo.
pause

echo Starting services...
start "Backend" cmd /k "cd /d c:\s7s-signage-system\backend && npm run start:dev"
timeout /t 5 /nobreak >nul

start "Admin" cmd /k "cd /d c:\s7s-signage-system\frontend-admin && npm run dev -- -H 0.0.0.0"
timeout /t 5 /nobreak >nul

start "Player" cmd /k "cd /d c:\s7s-signage-system\web-player && npm run dev -- --host 0.0.0.0"

echo.
echo ========================================
echo  Services Started!
echo ========================================
pause
```

---

## 🌍 OPSI 3: Deploy ke Cloud (Akses dari Internet)

### A. Deploy ke Railway.app (Gratis)

1. **Buat akun di:** https://railway.app
2. **Connect GitHub repository**
3. **Deploy Backend:**
   - Service: Backend
   - Root Directory: `/backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
   - Environment: `DATABASE_URL=file:./dev.db`

4. **Deploy Frontend Admin:**
   - Service: Frontend Admin
   - Root Directory: `/frontend-admin`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. **Deploy Web Player:**
   - Service: Web Player
   - Root Directory: `/web-player`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l $PORT`

### B. Deploy ke Vercel (Frontend) + Railway (Backend)

**Frontend (Next.js & Vite):**
- Deploy frontend-admin dan web-player ke Vercel
- Set environment variable: `VITE_API_URL` ke Railway backend URL

**Backend:**
- Deploy ke Railway/Render
- Gunakan PostgreSQL (bukan SQLite untuk production)

---

## 📱 Setup untuk Multiple Client

### Database Schema Support Multiple Client

Schema sudah mendukung multiple client dengan `clientId`:

```prisma
model Client {
  id             String          @id  // "PRAMITHA", "CLINIC_A", dll
  description    String
  signageContent SignageContent?
  queueSlots     QueueSlot[]
}
```

### Setup Client Baru

**1. Tambah client via API atau database:**

```sql
INSERT INTO Client (id, description) VALUES ('CLINIC_A', 'Klinik A');
```

**2. Player untuk client baru:**

Edit `.env.local` di web-player:
```env
VITE_CLIENT_ID=CLINIC_A
```

**3. Deploy multiple player:**

Setiap TV/display bisa menggunakan CLIENT_ID berbeda!

---

## 🔐 Security Tips (Production)

1. **Ganti CORS origin `*` dengan domain spesifik:**
   ```typescript
   app.enableCors({
     origin: ['http://192.168.1.100:3000', 'http://192.168.1.101:3002'],
   });
   ```

2. **Gunakan HTTPS (dengan SSL certificate)**

3. **Gunakan environment variables untuk sensitive data**

4. **Ganti SQLite dengan PostgreSQL untuk production:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

5. **Setup authentication untuk Admin/Operator panel**

---

## 🧪 Testing Koneksi

### Test dari laptop lain (PowerShell/CMD):

```powershell
# Test ping server
ping 192.168.1.100

# Test port backend
Test-NetConnection -ComputerName 192.168.1.100 -Port 3001

# Test akses HTTP
curl http://192.168.1.100:3001/api/signage/PRAMITHA
```

### Troubleshooting:

**❌ Tidak bisa akses dari laptop lain:**
- Cek firewall (port 3000, 3001, 3002 sudah dibuka?)
- Cek IP address (apakah masih sama?)
- Cek WiFi (semua device dalam satu network?)
- Cek antivirus (mungkin block koneksi)

**❌ WebSocket tidak connect:**
- Pastikan WebSocket gateway menggunakan CORS `origin: '*'`
- Cek browser console untuk error WebSocket

**❌ CORS error:**
- Pastikan `app.enableCors()` sudah diset di backend
- Restart backend setelah perubahan

---

## 📊 Rekomendasi Setup Berdasarkan Kebutuhan

| Kebutuhan | Rekomendasi | Kompleksitas |
|-----------|-------------|--------------|
| **1 Ruangan, Same WiFi** | LAN (192.168.x.x) | ⭐ Mudah |
| **Beda Ruangan, Same Building** | LAN + Access Point | ⭐⭐ Sedang |
| **Beda Lokasi/Kota** | Cloud (Railway/Vercel) | ⭐⭐⭐ Advanced |
| **Multiple Clinic/Branch** | Cloud + Database Cloud | ⭐⭐⭐⭐ Expert |

---

## ✅ Checklist Deployment

- [ ] Cek IP address server (`ipconfig`)
- [ ] Buka firewall port 3000, 3001, 3002
- [ ] Update `main.ts` - listen `0.0.0.0`
- [ ] Update `vite.config.ts` - host `0.0.0.0`
- [ ] Update `.env.local` dengan IP server
- [ ] Jalankan semua service dengan host 0.0.0.0
- [ ] Test akses dari laptop lain
- [ ] Test WebSocket connection
- [ ] Test panggil antrian dari operator
- [ ] Test tampilan update di player

---

## 🎯 Quick Start (LAN)

**Paling cepat untuk testing:**

```powershell
# 1. Cek IP
ipconfig

# 2. Buka firewall (as Administrator)
New-NetFirewallRule -DisplayName "S7S Ports" -Direction Inbound -LocalPort 3000,3001,3002 -Protocol TCP -Action Allow

# 3. Update .env.local
# Edit: web-player/.env.local
# VITE_API_URL=http://192.168.1.100:3001

# 4. Jalankan dengan --host
cd backend && npm run start:dev
cd frontend-admin && npm run dev -- -H 0.0.0.0
cd web-player && npm run dev -- --host 0.0.0.0

# 5. Akses dari laptop lain
# http://192.168.1.100:3000/operator
# http://192.168.1.100:3002
```

Selesai! 🚀
