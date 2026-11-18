# Changelog

All notable changes to S7S Digital Signage System will be documented in this file.

## [1.0.0] - 2024-01-01

### ✨ Initial Release

#### Backend (NestJS)
- ✅ REST API dengan NestJS + Prisma ORM
- ✅ WebSocket real-time dengan Socket.io
- ✅ Upload file media (video & gambar)
- ✅ Database SQLite dengan auto-migration
- ✅ Static file serving untuk media resources
- ✅ CORS enabled untuk development
- ✅ Seed data awal untuk testing

#### Web Player (React + Vite)
- ✅ Auto-scale layout ke berbagai resolusi (base: 1920x1080)
- ✅ 5 kotak antrian dengan animasi highlight
- ✅ Video player dengan auto-loop playlist
- ✅ Slideshow gambar otomatis (5 detik per slide)
- ✅ Tabel jadwal dokter/layanan
- ✅ Running text animation
- ✅ Real-time clock & date (format Indonesia)
- ✅ WebSocket integration untuk real-time updates
- ✅ Text-to-Speech panggilan antrian (bahasa Indonesia)
- ✅ LocalStorage cache untuk offline support

#### Frontend Admin (Next.js + Tailwind CSS)
- ✅ Admin CMS untuk kelola konten signage
- ✅ Upload video MP4 untuk playlist
- ✅ Upload gambar untuk slideshow
- ✅ Upload background image
- ✅ Edit running text
- ✅ Kelola tabel jadwal (CRUD)
- ✅ Publish real-time ke layar via WebSocket

#### Operator Panel (Next.js + Tailwind CSS)
- ✅ Kontrol 5 loket antrian independen
- ✅ Tombol "Panggil Berikutnya" (auto-increment)
- ✅ Tombol "Panggil Ulang" nomor terakhir
- ✅ Input nomor manual untuk panggilan custom
- ✅ Real-time broadcast ke Player via WebSocket

#### Database Schema
- ✅ Client (multi-client support)
- ✅ MediaResource (video & image storage)
- ✅ SignageContent (content per client)
- ✅ QueueSlot (5 slot per client)
- ✅ TvChannel (optional TV channel list)

#### Development Tools
- ✅ Automated setup script (setup-all.bat)
- ✅ Automated startup script (start-all.bat)
- ✅ Comprehensive documentation (README, QUICK_START, API_DOCS)
- ✅ Database seeding untuk data awal
- ✅ .gitignore untuk setiap project

### 🎯 Features Highlights

- **Real-time Updates**: WebSocket broadcasting untuk update konten & panggilan antrian
- **Multi-client Support**: Database schema mendukung multiple clients
- **Responsive Layout**: Auto-scale player untuk berbagai resolusi monitor
- **Offline Support**: LocalStorage cache jika koneksi terputus
- **TTS Indonesia**: Suara panggilan antrian otomatis dalam bahasa Indonesia
- **Easy Setup**: One-click installation & startup scripts

### 📝 Known Limitations

- SQLite untuk development (upgrade ke PostgreSQL untuk production)
- No authentication/authorization (tambahkan jika diperlukan)
- File upload max size tidak di-limit (sebaiknya tambahkan validasi)
- TTS tergantung browser support (Chrome/Edge recommended)

### 🔮 Future Plans

- [ ] Authentication & authorization
- [ ] Multi-user management
- [ ] Template layout builder
- [ ] TV channel integration
- [ ] Export/import configuration
- [ ] Scheduled content (time-based display)
- [ ] Multi-language support
- [ ] Cloud deployment guide
- [ ] Docker containerization
- [ ] Production-ready configuration

---

## Version Format

Format: `[Major.Minor.Patch]`

- **Major**: Breaking changes
- **Minor**: New features (backward compatible)
- **Patch**: Bug fixes

---

**Legend:**
- ✅ Completed
- 🚧 In Progress
- 🔮 Planned
- ❌ Cancelled
