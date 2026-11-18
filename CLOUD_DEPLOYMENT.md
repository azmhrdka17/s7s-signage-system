# ☁️ Cloud Deployment Guide - Akses dari Mana Saja

Panduan lengkap untuk deploy S7S Digital Signage System ke cloud agar bisa diakses dari internet.

---

## 🎯 Arsitektur Cloud

```
[Backend API] ─────────► Railway.app (atau Render.com)
[Frontend Admin] ──────► Vercel
[Web Player] ──────────► Vercel
[Database] ────────────► PostgreSQL (Railway/Supabase)
[File Storage] ────────► Cloudinary (atau AWS S3)
```

---

## 📋 Prerequisites

- [ ] Akun GitHub (untuk version control)
- [ ] Akun Railway.app atau Render.com (backend)
- [ ] Akun Vercel (frontend)
- [ ] Akun Cloudinary (file storage - gratis 25GB)

---

## 🚀 OPSI 1: Railway.app (Recommended - Paling Mudah)

### **Kelebihan Railway:**
- ✅ Setup mudah & cepat
- ✅ Free tier $5/bulan (cukup untuk 1-2 client)
- ✅ Auto-deploy dari GitHub
- ✅ PostgreSQL included
- ✅ Custom domain gratis

---

## 📦 Persiapan: Push ke GitHub

### 1. Inisialisasi Git (jika belum)

```powershell
cd c:\s7s-signage-system

# Init git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - S7S Digital Signage System"
```

### 2. Buat Repository di GitHub

1. Buka https://github.com/new
2. Repository name: `s7s-signage-system`
3. Private/Public: **Private** (recommended)
4. Klik **Create repository**

### 3. Push ke GitHub

```powershell
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/s7s-signage-system.git

# Push
git branch -M main
git push -u origin main
```

---

## 🛠️ Step 1: Deploy Backend ke Railway

### 1.1 Buat Akun Railway

1. Buka https://railway.app
2. Klik **Login with GitHub**
3. Authorize Railway

### 1.2 Create New Project

1. Dashboard Railway → **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih repository `s7s-signage-system`

### 1.3 Setup Backend Service

1. Klik **Add Service** → **GitHub Repo**
2. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** Leave empty (Railway auto-detect)
   - **Start Command:** Leave empty (akan pakai package.json)

### 1.4 Add PostgreSQL Database

1. Klik **New** → **Database** → **Add PostgreSQL**
2. Railway akan auto-create database
3. Database URL akan otomatis tersedia sebagai `DATABASE_URL`

### 1.5 Update Prisma Schema untuk PostgreSQL

Edit: `backend/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"  // Ganti dari sqlite
  url      = env("DATABASE_URL")
}
```

### 1.6 Setup Environment Variables

Di Railway Dashboard → Backend Service → **Variables**, tambahkan:

```env
DATABASE_URL=postgresql://... (auto-generated dari Railway)
NODE_ENV=production
PORT=3001
```

### 1.7 Update package.json Build Scripts

Edit: `backend/package.json`

```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "node dist/main",
    "postinstall": "prisma generate",
    "prisma:migrate": "prisma migrate deploy",
    "railway:build": "npm install && npx prisma generate && npx prisma migrate deploy && npm run build"
  }
}
```

### 1.8 Setup Railway Build Command

Di Railway Dashboard → Backend → **Settings**:

- **Build Command:** `npm run railway:build`
- **Start Command:** `npm run start:prod`

### 1.9 Deploy

1. Klik **Deploy**
2. Tunggu build selesai (3-5 menit)
3. Catat URL backend: `https://s7s-backend-production.up.railway.app`

---

## 🎨 Step 2: Deploy Frontend Admin ke Vercel

### 2.1 Buat Akun Vercel

1. Buka https://vercel.com
2. Klik **Sign Up** → **Continue with GitHub**

### 2.2 Import Project

1. Dashboard Vercel → **Add New** → **Project**
2. Import `s7s-signage-system` repository
3. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend-admin`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### 2.3 Environment Variables

Tambahkan di Vercel:

```env
NEXT_PUBLIC_API_URL=https://s7s-backend-production.up.railway.app
```

### 2.4 Update API Calls di Frontend

Edit: `frontend-admin/app/admin/page.tsx` dan `frontend-admin/app/operator/page.tsx`

Ganti semua `http://localhost:3001` dengan:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

### 2.5 Deploy

1. Klik **Deploy**
2. Tunggu build selesai (2-3 menit)
3. URL: `https://s7s-admin.vercel.app`

---

## 📺 Step 3: Deploy Web Player ke Vercel

### 3.1 Import Project

1. Dashboard Vercel → **Add New** → **Project**
2. Import `s7s-signage-system` repository (lagi)
3. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `web-player`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 3.2 Environment Variables

```env
VITE_API_URL=https://s7s-backend-production.up.railway.app
VITE_CLIENT_ID=PRAMITHA
```

### 3.3 Deploy

1. Klik **Deploy**
2. URL: `https://s7s-player.vercel.app`

---

## 📁 Step 4: Setup File Storage (Cloudinary)

### 4.1 Buat Akun Cloudinary

1. Buka https://cloudinary.com/users/register/free
2. Sign up (gratis 25GB)
3. Catat credentials:
   - Cloud Name
   - API Key
   - API Secret

### 4.2 Install Cloudinary SDK

```powershell
cd backend
npm install cloudinary multer-storage-cloudinary
```

### 4.3 Update Media Service

Edit: `backend/src/media/media.controller.ts`

```typescript
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 's7s-signage',
    allowed_formats: ['jpg', 'png', 'mp4', 'webm'],
  } as any,
});

@Controller('api/media')
export class MediaController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File uploaded successfully',
      data: {
        filename: file.filename,
        url: file.path, // Cloudinary URL
        type: file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE',
      },
    };
  }
}
```

### 4.4 Add Environment Variables di Railway

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4.5 Remove ServeStaticModule

Edit: `backend/src/app.module.ts`

Hapus/comment ServeStaticModule karena file sudah di Cloudinary:

```typescript
@Module({
  imports: [
    // ServeStaticModule.forRoot(...), // Tidak perlu lagi
    PrismaModule,
    MediaModule,
    // ...
  ],
})
```

---

## 🔒 Step 5: Setup Domain & SSL (Optional)

### 5.1 Custom Domain untuk Backend

Railway:
1. Settings → **Domains**
2. Klik **Generate Domain** atau **Custom Domain**
3. Contoh: `api.yourdomain.com`

### 5.2 Custom Domain untuk Frontend

Vercel:
1. Project Settings → **Domains**
2. Add domain: `admin.yourdomain.com`, `player.yourdomain.com`
3. Update DNS records di domain provider

---

## 🗄️ Step 6: Migrate Database

### 6.1 Jalankan Migrations di Railway

Railway akan auto-run migrations saat deploy, tapi bisa manual juga:

1. Railway Dashboard → Backend → **Terminal**
2. Jalankan:

```bash
npx prisma migrate deploy
```

### 6.2 Seed Initial Data

```bash
npx ts-node prisma/seed.ts
```

Atau buat seed untuk production:

Edit: `backend/prisma/seed.ts`

```typescript
async function main() {
  // Create default client
  await prisma.client.create({
    data: {
      id: 'PRAMITHA',
      description: 'SIGNAGE ANTRIAN PRAMITHA',
      signageContent: {
        create: {
          videoUrls: '[]',
          slideUrls: '[]',
          runningText: 'Selamat Datang',
          scheduleTable: '[]',
          backgroundUrl: '',
        },
      },
      queueSlots: {
        create: [
          { slotNumber: 1, loketName: 'Loket 1', currentNumber: '' },
          { slotNumber: 2, loketName: 'Loket 2', currentNumber: '' },
          { slotNumber: 3, loketName: 'Loket 3', currentNumber: '' },
          { slotNumber: 4, loketName: 'Loket 4', currentNumber: '' },
          { slotNumber: 5, loketName: 'Loket 5', currentNumber: '' },
        ],
      },
    },
  });
}
```

---

## ✅ Step 7: Testing

### 7.1 Test Backend

```powershell
# Test API health
curl https://s7s-backend-production.up.railway.app/api/signage/PRAMITHA

# Should return JSON with config
```

### 7.2 Test Admin Panel

1. Buka: `https://s7s-admin.vercel.app/admin`
2. Upload gambar/video
3. Publish content

### 7.3 Test Web Player

1. Buka: `https://s7s-player.vercel.app`
2. Pastikan konten muncul
3. Test panggil antrian dari operator

### 7.4 Test Real-time Update

1. Buka Player di 1 browser
2. Buka Operator di browser lain
3. Panggil nomor antrian
4. Pastikan Player update langsung

---

## 📊 Monitoring & Logs

### Railway Logs

1. Dashboard → Backend Service → **Logs**
2. Monitor error dan performance

### Vercel Logs

1. Project → **Deployments** → klik deployment → **View Logs**

### Setup Alerts (Optional)

Railway:
- Settings → **Integrations** → Add notification (Discord, Slack, Email)

---

## 💰 Pricing Estimate

### Free Tier (Gratis selamanya):

| Service | Free Tier | Limit |
|---------|-----------|-------|
| Railway | $5 credit/month | 500 jam server |
| Vercel | Unlimited | 100GB bandwidth |
| Cloudinary | Free | 25GB storage |
| **Total** | **Gratis** | **Cukup untuk 1-3 client** |

### Paid Tier (Jika scale up):

| Service | Paid Plan | Price |
|---------|-----------|-------|
| Railway Pro | Unlimited | $20/month |
| Vercel Pro | 1TB bandwidth | $20/month |
| Cloudinary Plus | 100GB | $99/month |

---

## 🔄 Auto Deploy Setup

### GitHub Actions (CI/CD)

Buat file: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Railway & Vercel

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          curl -X POST ${{ secrets.RAILWAY_WEBHOOK_URL }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🛡️ Security Best Practices

### 1. Environment Variables

**Jangan commit secrets ke Git!**

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

### 2. Enable CORS dengan Whitelist

Edit: `backend/src/main.ts`

```typescript
app.enableCors({
  origin: [
    'https://s7s-admin.vercel.app',
    'https://s7s-player.vercel.app',
  ],
  credentials: true,
});
```

### 3. Add Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// app.module.ts
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    // ...
  ],
})
```

### 4. Add Authentication (Optional)

Untuk admin panel:

```bash
npm install @nestjs/passport passport passport-local bcrypt
```

---

## 🔧 Troubleshooting

### ❌ Railway Build Failed

**Error:** `prisma generate failed`

**Solution:**
```json
// package.json
"scripts": {
  "postinstall": "prisma generate"
}
```

### ❌ Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
- Pastikan `DATABASE_URL` sudah di set di Railway
- Format: `postgresql://user:password@host:port/database`

### ❌ CORS Error di Browser

**Error:** `Access to fetch at ... from origin ... has been blocked by CORS`

**Solution:**
```typescript
// backend/src/main.ts
app.enableCors({
  origin: '*', // atau list domain spesifik
  credentials: true,
});
```

### ❌ WebSocket Not Connecting

**Error:** `WebSocket connection failed`

**Solution:**

Railway supports WebSocket, tapi pastikan:

```typescript
// backend/src/websocket/signage.gateway.ts
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket', 'polling'], // Penting!
})
```

### ❌ File Upload Error (Cloudinary)

**Error:** `Invalid signature`

**Solution:**
- Cek CLOUDINARY_API_SECRET sudah benar
- Pastikan tidak ada trailing space di environment variable

---

## 📱 Access URLs (After Deployment)

### Public URLs:

```
🌐 Backend API:    https://s7s-backend-production.up.railway.app
🖥️  Admin Panel:    https://s7s-admin.vercel.app/admin
👨‍💼 Operator Panel: https://s7s-admin.vercel.app/operator
📺 Web Player:     https://s7s-player.vercel.app
```

### API Endpoints:

```
GET  /api/signage/:clientId          - Get signage config
POST /api/signage/:clientId/content  - Update content
POST /api/signage/:clientId/queue/call - Call queue number
POST /api/media/upload               - Upload media file
```

---

## 🚀 Next Steps After Deployment

### 1. Custom Domain
- Beli domain (Namecheap, Niagahoster, dll)
- Setup DNS di Railway & Vercel
- Enable SSL (auto by Railway & Vercel)

### 2. Setup Multiple Clients
- Tambah client baru via database
- Deploy player dengan CLIENT_ID berbeda
- Setiap klinik/cabang punya display sendiri

### 3. Add Authentication
- Implement login untuk admin/operator
- JWT tokens
- Role-based access control

### 4. Monitoring
- Setup Sentry untuk error tracking
- Google Analytics untuk usage stats
- Uptime monitoring (UptimeRobot)

### 5. Backup Database
- Railway auto-backup included
- Export manual: `pg_dump DATABASE_URL > backup.sql`

---

## 📋 Checklist Deployment

- [ ] Code pushed to GitHub
- [ ] Backend deployed to Railway
- [ ] PostgreSQL database created
- [ ] Prisma migrations ran
- [ ] Seed data created
- [ ] Admin deployed to Vercel
- [ ] Player deployed to Vercel
- [ ] Cloudinary configured
- [ ] Environment variables set
- [ ] CORS configured properly
- [ ] WebSocket tested
- [ ] File upload tested
- [ ] Real-time update tested
- [ ] Custom domain setup (optional)
- [ ] SSL enabled
- [ ] Monitoring setup

---

## 💡 Tips & Best Practices

### Performance Optimization

1. **Enable Caching:**
```typescript
// backend cache
import { CacheModule } from '@nestjs/cache-manager';
```

2. **Image Optimization:**
- Cloudinary auto-optimize images
- Use responsive images di frontend

3. **Database Indexing:**
```prisma
model QueueSlot {
  @@index([clientId, slotNumber])
}
```

### Cost Optimization

1. Use Railway sleep mode (auto-sleep after 5 min idle)
2. Optimize Cloudinary transforms
3. Enable Vercel edge caching

### Scaling

Railway dapat auto-scale berdasarkan traffic. Untuk load tinggi:
- Upgrade Railway plan
- Add Redis untuk caching
- Use CDN (Cloudflare)

---

## 🎉 Selesai!

Sistem Anda sekarang sudah live di cloud dan bisa diakses dari mana saja!

**URLs:**
- Admin: https://s7s-admin.vercel.app/admin
- Operator: https://s7s-admin.vercel.app/operator
- Player: https://s7s-player.vercel.app

**Share URL player ke:**
- TV display di klinik
- Tablet/iPad di ruang tunggu
- PC di berbagai cabang

Semua akan sync real-time! 🚀
