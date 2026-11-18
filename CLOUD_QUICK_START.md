# ☁️ Cloud Deployment - Quick Start Guide

Panduan singkat deploy ke cloud dalam 30 menit.

---

## 🎯 Tujuan

Deploy sistem S7S Digital Signage ke cloud agar bisa diakses dari mana saja via internet.

**Hasil Akhir:**
```
✅ Backend:  https://s7s-backend.up.railway.app
✅ Admin:    https://s7s-admin.vercel.app/admin
✅ Operator: https://s7s-admin.vercel.app/operator
✅ Player:   https://s7s-player.vercel.app
```

---

## 📋 Yang Dibutuhkan

- ✅ Akun GitHub (gratis)
- ✅ Akun Railway.app (gratis $5 credit)
- ✅ Akun Vercel (gratis unlimited)
- ✅ Akun Cloudinary (gratis 25GB)

**Total Biaya: Rp 0 (100% GRATIS!)** 🎉

---

## 🚀 Step-by-Step (30 Menit)

### Step 1: Push ke GitHub (5 menit)

```powershell
# Di folder project
cd c:\s7s-signage-system

# Init git
git init
git add .
git commit -m "Initial commit"

# Buat repo di GitHub: https://github.com/new
# Nama: s7s-signage-system
# Private

# Push
git remote add origin https://github.com/USERNAME/s7s-signage-system.git
git branch -M main
git push -u origin main
```

✅ **Verifikasi:** Code sudah di GitHub

---

### Step 2: Deploy Backend ke Railway (10 menit)

**2.1 Buat Akun Railway**
1. Buka https://railway.app
2. Login with GitHub
3. Authorize Railway

**2.2 Create Project**
1. Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. Pilih `s7s-signage-system`

**2.3 Add PostgreSQL**
1. Klik **New** → **Database** → **PostgreSQL**
2. Tunggu provisioning (1 menit)
3. DATABASE_URL auto-generated

**2.4 Setup Backend Service**
1. Klik **New** → **GitHub Repo** → pilih repo
2. **Settings:**
   - Root Directory: `backend`
   - Build Command: (kosongkan)
   - Start Command: (kosongkan)

**2.5 Add Environment Variables**

Di Railway → Backend → **Variables**:
```
NODE_ENV=production
PORT=3001
```

**2.6 Deploy**
1. Klik **Deploy**
2. Tunggu build (3-5 menit)
3. Catat URL: `https://xxx.up.railway.app`

**2.7 Test Backend**
```
https://xxx.up.railway.app/api/signage/PRAMITHA
```

Harus return JSON config.

✅ **Verifikasi:** Backend API accessible

---

### Step 3: Setup Cloudinary (5 menit)

**3.1 Buat Akun**
1. Buka https://cloudinary.com/users/register/free
2. Sign up (email + password)
3. Verify email

**3.2 Get Credentials**
1. Dashboard → **Settings**
2. Catat:
   - Cloud Name
   - API Key
   - API Secret

**3.3 Add ke Railway**

Railway → Backend → **Variables**:
```
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

**3.4 Redeploy Backend**

Klik **Deploy** lagi untuk apply changes.

✅ **Verifikasi:** Cloudinary credentials set

---

### Step 4: Deploy Admin ke Vercel (5 menit)

**4.1 Buat Akun Vercel**
1. Buka https://vercel.com
2. **Continue with GitHub**
3. Authorize Vercel

**4.2 Import Project**
1. Dashboard → **Add New** → **Project**
2. Import `s7s-signage-system`
3. Configure:
   - Framework: **Next.js**
   - Root Directory: `frontend-admin`
   - Build Command: `npm run build`

**4.3 Add Environment Variable**
```
NEXT_PUBLIC_API_URL=https://xxx.up.railway.app
```
(Ganti xxx dengan Railway URL Anda)

**4.4 Deploy**
1. Klik **Deploy**
2. Tunggu (2-3 menit)
3. URL: `https://xxx.vercel.app`

**4.5 Test Admin**
```
https://xxx.vercel.app/admin
https://xxx.vercel.app/operator
```

✅ **Verifikasi:** Admin panel bisa dibuka

---

### Step 5: Deploy Player ke Vercel (5 menit)

**5.1 Import Project Lagi**
1. Vercel Dashboard → **Add New** → **Project**
2. Import `s7s-signage-system` (sama)
3. Configure:
   - Framework: **Vite**
   - Root Directory: `web-player`
   - Build Command: `npm run build`
   - Output Directory: `dist`

**5.2 Add Environment Variables**
```
VITE_API_URL=https://xxx.up.railway.app
VITE_CLIENT_ID=PRAMITHA
```

**5.3 Deploy**
1. Klik **Deploy**
2. Tunggu (2-3 menit)
3. URL: `https://xxx.vercel.app`

**5.4 Test Player**

Buka URL player, harus loading dan tampil display.

✅ **Verifikasi:** Player menampilkan konten

---

## ✅ Testing End-to-End

### Test 1: Upload Media

1. Buka Admin: `https://xxx.vercel.app/admin`
2. Upload gambar test
3. Klik **Publish**
4. Cek Player: gambar harus muncul

### Test 2: Panggil Antrian

1. Buka Operator: `https://xxx.vercel.app/operator`
2. Pilih Loket 1
3. Input nomor: `A001`
4. Klik **Panggil Antrian**
5. Cek Player: nomor harus berubah + animasi + TTS

### Test 3: Real-time Update

1. Buka Player di 1 tab
2. Buka Operator di tab lain
3. Panggil nomor baru
4. Player harus update < 1 detik

✅ **Jika semua test passed, deployment BERHASIL!** 🎉

---

## 🔗 URLs Anda

Catat URLs ini untuk akses:

```
Backend API:
https://your-backend.up.railway.app

Admin Panel:
https://your-admin.vercel.app/admin

Operator Panel:
https://your-admin.vercel.app/operator

Web Player (untuk TV/Display):
https://your-player.vercel.app
```

---

## 📱 Cara Pakai Setelah Deploy

### Untuk Admin:
1. Buka admin URL di laptop
2. Upload konten (gambar/video)
3. Edit running text & jadwal
4. Klik Publish

### Untuk Operator:
1. Buka operator URL di laptop/tablet
2. Pilih loket
3. Panggil nomor antrian
4. Semua display auto-update

### Untuk Display:
1. Buka player URL di Chrome
2. Tekan F11 (fullscreen)
3. Biarkan menyala 24/7
4. Auto-update dari operator

---

## 🎯 Multiple Display

Untuk menampilkan di banyak TV/PC:

**Semua display buka URL yang sama:**
```
https://your-player.vercel.app
```

Semua akan sync real-time! Tidak perlu setup berbeda.

---

## 🏢 Multiple Branch/Client

Untuk setup multiple klinik/cabang:

### 1. Tambah Client Baru

Via Railway Terminal:
```sql
INSERT INTO Client (id, description) 
VALUES ('CLINIC_B', 'Klinik B');
```

### 2. Deploy Player dengan CLIENT_ID Berbeda

Di Vercel → Player → **Environment Variables**:
```
VITE_CLIENT_ID=CLINIC_B
```

Redeploy, sekarang player ini untuk Klinik B.

### 3. Repeat untuk Setiap Branch

Setiap klinik punya player sendiri dengan CLIENT_ID unik.

---

## 💰 Biaya & Limits

### Free Tier (Yang Anda Pakai)

| Service | Limit | Cukup untuk |
|---------|-------|-------------|
| Railway | $5 credit/month | 500 jam server |
| Vercel | 100GB bandwidth | 10,000 pageviews |
| Cloudinary | 25GB storage | 1000+ images |

**Estimasi:**
- 1-3 client/branch: **GRATIS selamanya**
- 1-10 display: **GRATIS**
- 100-500 panggilan antrian/hari: **GRATIS**

### Kapan Perlu Upgrade?

Upgrade ke paid ($20-50/month) jika:
- 10+ branches
- 50+ displays
- 10,000+ panggilan/hari
- Custom domain needed

---

## 🔧 Troubleshooting

### ❌ Backend Build Failed

**Cek Railway Logs:**
1. Railway → Backend → **Logs**
2. Cari error message
3. Biasanya: prisma generate failed

**Solution:**
```json
// backend/package.json
"postinstall": "prisma generate"
```
Redeploy.

### ❌ Frontend Build Failed

**Cek Vercel Logs:**
1. Vercel → Project → **Deployments** → Latest → **Logs**
2. Cari error

**Solution:**
- Pastikan environment variables sudah set
- Cek ROOT_DIRECTORY sudah benar

### ❌ CORS Error

**Symptom:** Console error "blocked by CORS"

**Solution:**

Edit `backend/src/main.ts`:
```typescript
app.enableCors({
  origin: [
    'https://your-admin.vercel.app',
    'https://your-player.vercel.app',
  ],
  credentials: true,
});
```

Redeploy backend.

### ❌ WebSocket Not Connecting

**Symptom:** Player tidak update real-time

**Solution:**

Cek `backend/src/websocket/signage.gateway.ts`:
```typescript
@WebSocketGateway({
  cors: { origin: '*' },
  transports: ['websocket', 'polling'],
})
```

Redeploy backend.

---

## 📞 Support

**Dokumentasi Lengkap:**
- `CLOUD_DEPLOYMENT.md` - Panduan detail
- `DEPLOY_CHECKLIST.md` - Checklist lengkap
- `DEPLOYMENT_COMPARISON.md` - LAN vs Cloud

**Platform Docs:**
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Cloudinary: https://cloudinary.com/documentation

---

## 🎉 Selesai!

Sistem Anda sekarang **LIVE** di cloud! 🚀

**Share URLs ke:**
- Team admin
- Operator
- Display di klinik/kantor
- Cabang lain

Semua bisa akses dari mana saja!

**Next Steps:**
1. ✅ Test semua fitur
2. ✅ Train team cara pakai
3. ✅ Monitor usage di Railway/Vercel
4. ✅ Setup custom domain (optional)
5. ✅ Add more features

Enjoy! 🎊
