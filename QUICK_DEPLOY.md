# 🚀 Quick Deploy Guide - Akses dari Laptop Lain

## Langkah Cepat (5 Menit)

### 1️⃣ Cek IP Address Server (Laptop yang menjalankan backend)

```powershell
ipconfig
```

Catat IPv4 Address, misal: **192.168.1.100**

---

### 2️⃣ Buka Firewall

**Cara 1: Otomatis (Recommended)**

Right-click `open-firewall.ps1` → **Run with PowerShell** (as Administrator)

**Cara 2: Manual**

Buka PowerShell as Administrator:
```powershell
New-NetFirewallRule -DisplayName "S7S Ports" -Direction Inbound -LocalPort 3000,3001,3002 -Protocol TCP -Action Allow
```

---

### 3️⃣ Update IP di Web Player

Edit file: `web-player\.env.local`

```env
VITE_API_URL=http://192.168.1.100:3001
VITE_CLIENT_ID=PRAMITHA
```

Ganti `192.168.1.100` dengan IP laptop server Anda.

---

### 4️⃣ Jalankan Sistem

**Double-click:** `start-lan.bat`

Atau manual:
```powershell
# Terminal 1
cd backend
npm run start:dev

# Terminal 2
cd frontend-admin
npm run dev -- -H 0.0.0.0

# Terminal 3
cd web-player
npm run dev -- --host 0.0.0.0
```

---

### 5️⃣ Akses dari Laptop Lain

Ganti `192.168.1.100` dengan IP server Anda:

```
🖥️ Admin Panel:  http://192.168.1.100:3000/admin
👨‍💼 Operator:     http://192.168.1.100:3000/operator
📺 Player:        http://192.168.1.100:3002
```

---

## ✅ Checklist

- [ ] IP address sudah dicatat
- [ ] Firewall sudah dibuka (port 3000, 3001, 3002)
- [ ] File `.env.local` sudah diupdate dengan IP server
- [ ] Sistem sudah running dengan `start-lan.bat`
- [ ] Bisa akses dari laptop lain

---

## 🔧 Troubleshooting

**❌ Tidak bisa akses dari laptop lain**

1. Ping server: `ping 192.168.1.100`
2. Cek firewall: pastikan port 3000-3002 dibuka
3. Cek WiFi: pastikan semua device dalam satu network
4. Restart router/access point

**❌ WebSocket tidak connect**

1. Cek console browser (F12)
2. Pastikan backend sudah running
3. Refresh browser (Ctrl+F5)

**❌ Video/gambar tidak muncul**

1. Cek URL di browser: `http://192.168.1.100:3001/resources/test.txt`
2. Pastikan file sudah di-upload via Admin Panel
3. Cek path di backend `uploads/` folder

---

## 📝 Catatan

- Semua device harus dalam **satu jaringan WiFi/LAN** yang sama
- IP address bisa berubah jika router di-restart (gunakan static IP untuk production)
- Untuk akses dari internet, gunakan cloud deployment (Railway/Vercel)

Selesai! 🎉
