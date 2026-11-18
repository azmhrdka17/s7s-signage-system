# ✅ Cloud Deployment Checklist

Gunakan checklist ini untuk memastikan semua langkah deployment sudah dilakukan dengan benar.

---

## 📦 Pre-Deployment

### Code Preparation
- [ ] Semua fitur sudah berfungsi di lokal
- [ ] Testing sudah dilakukan
- [ ] Environment variables sudah dipisahkan
- [ ] .gitignore sudah mengexclude file sensitive (.env, etc)
- [ ] README.md sudah update dengan instruksi cloud

### GitHub Setup
- [ ] Repository sudah dibuat di GitHub
- [ ] Code sudah di-push ke repository
- [ ] Branch main/master sudah ada
- [ ] .github/workflows/deploy.yml sudah ada (optional - CI/CD)

---

## ☁️ Backend Deployment (Railway)

### Railway Account
- [ ] Akun Railway sudah dibuat
- [ ] Connected dengan GitHub account
- [ ] Credit card added (optional - untuk upgrade)

### Database Setup
- [ ] PostgreSQL database sudah dibuat
- [ ] DATABASE_URL sudah auto-generated
- [ ] Schema Prisma sudah diupdate ke PostgreSQL
- [ ] Migrations sudah siap

### Backend Service
- [ ] Backend service sudah dibuat dari GitHub repo
- [ ] Root directory set ke `/backend`
- [ ] Environment variables sudah diset:
  - [ ] DATABASE_URL (auto dari Railway)
  - [ ] NODE_ENV=production
  - [ ] PORT=3001
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
- [ ] Build command: `npm run railway:build`
- [ ] Start command: `npm run start:prod`
- [ ] Deploy successful (check logs)
- [ ] Backend URL tested: `https://xxx.up.railway.app/api/signage/PRAMITHA`

### Database Migration
- [ ] Prisma migrations deployed
- [ ] Seed data created (client + queueSlots)
- [ ] Database accessible via Railway terminal

---

## 🎨 Frontend Deployment (Vercel)

### Vercel Account
- [ ] Akun Vercel sudah dibuat
- [ ] Connected dengan GitHub account

### Admin Panel
- [ ] Project "frontend-admin" sudah diimport
- [ ] Framework preset: Next.js
- [ ] Root directory: `/frontend-admin`
- [ ] Environment variables:
  - [ ] NEXT_PUBLIC_API_URL=https://xxx.up.railway.app
- [ ] Build successful
- [ ] Admin URL tested: `https://xxx.vercel.app/admin`
- [ ] Operator URL tested: `https://xxx.vercel.app/operator`

### Web Player
- [ ] Project "web-player" sudah diimport
- [ ] Framework preset: Vite
- [ ] Root directory: `/web-player`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables:
  - [ ] VITE_API_URL=https://xxx.up.railway.app
  - [ ] VITE_CLIENT_ID=PRAMITHA
- [ ] Build successful
- [ ] Player URL tested: `https://xxx.vercel.app`

---

## 📁 File Storage (Cloudinary)

### Cloudinary Account
- [ ] Akun Cloudinary sudah dibuat
- [ ] Cloud name sudah dicatat
- [ ] API Key sudah dicatat
- [ ] API Secret sudah dicatat

### Backend Integration
- [ ] cloudinary package sudah installed
- [ ] multer-storage-cloudinary sudah installed
- [ ] MediaController sudah update untuk Cloudinary
- [ ] Environment variables sudah diset di Railway
- [ ] Test upload via Admin panel
- [ ] Test display di Player

---

## 🔧 Configuration & Testing

### CORS Configuration
- [ ] Backend CORS sudah enable untuk Vercel URLs
- [ ] Origin list sudah benar
- [ ] Credentials enabled

### WebSocket Configuration
- [ ] WebSocket gateway CORS sudah enable
- [ ] Transports: ['websocket', 'polling']
- [ ] Test connection dari browser console

### API Testing
- [ ] GET /api/signage/:clientId → ✅
- [ ] POST /api/signage/:clientId/content → ✅
- [ ] POST /api/signage/:clientId/queue/call → ✅
- [ ] POST /api/media/upload → ✅

### Functional Testing
- [ ] Admin panel bisa dibuka
- [ ] Upload gambar berhasil
- [ ] Upload video berhasil
- [ ] Publish content berhasil
- [ ] Operator panel bisa dibuka
- [ ] Panggil antrian berhasil
- [ ] Player menampilkan konten
- [ ] Player update real-time saat panggil antrian
- [ ] TTS berbunyi
- [ ] Animasi highlight berfungsi
- [ ] Running text berjalan
- [ ] Video/slide autoplay & loop

### Performance Testing
- [ ] Page load time < 3 detik
- [ ] API response time < 500ms
- [ ] WebSocket latency < 200ms
- [ ] Image loading optimized

---

## 🔐 Security & Best Practices

### Environment Variables
- [ ] Tidak ada .env file di Git
- [ ] Semua secrets di Railway/Vercel dashboard
- [ ] Production values berbeda dari development

### HTTPS & SSL
- [ ] Semua URL menggunakan HTTPS
- [ ] SSL certificate valid (auto by Railway/Vercel)
- [ ] Mixed content warning tidak ada

### Access Control
- [ ] CORS hanya allow domain yang diperlukan (production)
- [ ] Rate limiting enabled (optional)
- [ ] Authentication untuk admin (optional - future)

---

## 📊 Monitoring & Maintenance

### Logging
- [ ] Backend logs bisa diakses di Railway
- [ ] Frontend logs bisa diakses di Vercel
- [ ] Error monitoring setup (optional - Sentry)

### Backup
- [ ] Database auto-backup enabled (Railway default)
- [ ] Manual backup tested
- [ ] Restore procedure documented

### Updates
- [ ] GitHub webhook connected untuk auto-deploy
- [ ] Deploy notification setup (optional)
- [ ] Rollback procedure tested

---

## 📱 Custom Domain (Optional)

### Domain Purchase
- [ ] Domain sudah dibeli (Namecheap, Niagahoster, dll)
- [ ] DNS management accessible

### Backend Domain
- [ ] Custom domain added di Railway
- [ ] DNS A/CNAME record configured
- [ ] SSL certificate issued
- [ ] Domain tested: `https://api.yourdomain.com`

### Frontend Domains
- [ ] Admin domain added di Vercel: `admin.yourdomain.com`
- [ ] Player domain added di Vercel: `player.yourdomain.com`
- [ ] DNS CNAME records configured
- [ ] SSL certificates issued
- [ ] Domains tested

### Update URLs
- [ ] Environment variables updated dengan custom domains
- [ ] CORS origins updated
- [ ] Redeploy semua services

---

## 🎯 Post-Deployment

### Documentation
- [ ] Deployment process documented
- [ ] URLs documented
- [ ] Credentials saved di password manager
- [ ] Access guide untuk team

### Team Training
- [ ] Admin/operator trained
- [ ] Support contact provided
- [ ] Troubleshooting guide shared

### Monitoring Setup
- [ ] Uptime monitoring (UptimeRobot - optional)
- [ ] Error tracking (Sentry - optional)
- [ ] Usage analytics (Google Analytics - optional)

---

## 🚨 Troubleshooting Checklist

### Backend Not Responding
- [ ] Check Railway logs
- [ ] Check service status
- [ ] Verify DATABASE_URL
- [ ] Verify migrations deployed
- [ ] Check memory/CPU usage

### Frontend Build Failed
- [ ] Check Vercel logs
- [ ] Verify environment variables
- [ ] Check package.json scripts
- [ ] Test build locally

### WebSocket Not Connecting
- [ ] Check browser console
- [ ] Verify CORS configuration
- [ ] Check transports setting
- [ ] Test with polling fallback

### File Upload Failed
- [ ] Check Cloudinary credentials
- [ ] Verify API key/secret
- [ ] Check file size limits
- [ ] Test with small file first

---

## ✨ Success Criteria

Deployment dianggap berhasil jika:

- ✅ Semua URL accessible dari internet
- ✅ Admin bisa upload & publish content
- ✅ Operator bisa panggil antrian
- ✅ Player menampilkan konten dengan benar
- ✅ Real-time update berfungsi (< 1 detik)
- ✅ TTS berbunyi saat panggil antrian
- ✅ Video/gambar loading dengan baik
- ✅ Tidak ada error di console browser
- ✅ SSL/HTTPS enabled
- ✅ Responsive di berbagai device

---

## 📞 Support & Resources

### Documentation
- CLOUD_DEPLOYMENT.md - Panduan lengkap
- DEPLOYMENT_COMPARISON.md - Perbandingan LAN vs Cloud
- API_DOCUMENTATION.md - API reference

### Platform Documentation
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs
- Cloudinary: https://cloudinary.com/documentation

### Community
- GitHub Issues: Report bugs
- Stack Overflow: Technical questions

---

## 🎉 Congratulations!

Jika semua checklist sudah ✅, sistem Anda sudah live di cloud! 🚀

**Next Steps:**
1. Share URL ke team
2. Monitor usage & performance
3. Collect feedback
4. Plan for scaling

**Akses URLs:**
```
Admin:    https://s7s-admin.vercel.app/admin
Operator: https://s7s-admin.vercel.app/operator
Player:   https://s7s-player.vercel.app
API:      https://s7s-backend.up.railway.app
```

Selamat! 🎊
