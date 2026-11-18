# 🧪 Testing Guide - S7S Digital Signage System

Panduan lengkap untuk testing sistem secara manual dan otomatis.

---

## 📋 Manual Testing Checklist

### 🎯 Backend API Testing

#### 1. Health Check
```bash
# Server running check
curl http://localhost:3001

# Expected: Backend should respond (even with 404 for root)
```

#### 2. Upload Media
**Video Upload:**
```bash
curl -X POST http://localhost:3001/api/media/upload \
  -F "file=@C:/path/to/video.mp4"

# Expected Response:
{
  "message": "File uploaded successfully",
  "data": {
    "id": "...",
    "filename": "video.mp4",
    "url": "/resources/file-xyz.mp4",
    "type": "VIDEO"
  }
}
```

**Image Upload:**
```bash
curl -X POST http://localhost:3001/api/media/upload \
  -F "file=@C:/path/to/image.jpg"

# Expected: Similar response with type: "IMAGE"
```

#### 3. Get All Media
```bash
curl http://localhost:3001/api/media

# Expected: Array of uploaded media
```

#### 4. Get Signage Config
```bash
curl http://localhost:3001/api/signage/PRAMITHA

# Expected: Full configuration with client, content, queueSlots
```

#### 5. Update Content
```bash
curl -X POST http://localhost:3001/api/signage/PRAMITHA/content \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrls": ["/resources/video1.mp4"],
    "slideUrls": ["/resources/slide1.jpg"],
    "runningText": "Test Running Text",
    "scheduleTable": [{"poli":"Test","dokter":"Dr. Test","jam":"08:00"}],
    "backgroundUrl": "/resources/bg.jpg"
  }'

# Expected: Success message
# Side Effect: WebSocket event refresh:PRAMITHA emitted
```

#### 6. Call Queue
```bash
curl -X POST http://localhost:3001/api/signage/PRAMITHA/queue/call \
  -H "Content-Type: application/json" \
  -d '{
    "slotNumber": 1,
    "loketName": "Loket 1",
    "currentNumber": "A001"
  }'

# Expected: Success message
# Side Effect: WebSocket event queue:PRAMITHA emitted
```

---

### 🌐 Frontend Admin Testing

#### Test Plan: Admin CMS (http://localhost:3000/admin)

**Test Case 1: Upload Background**
1. Buka http://localhost:3000/admin
2. Klik input file "Background"
3. Pilih gambar JPG/PNG
4. ✅ Gambar preview muncul
5. ✅ Tidak ada error di console

**Test Case 2: Upload Video**
1. Klik input file "Video"
2. Pilih file MP4
3. ✅ Thumbnail video muncul di grid
4. ✅ File terupload ke backend

**Test Case 3: Upload Slides**
1. Klik input file "Slides"
2. Pilih gambar
3. ✅ Gambar muncul di grid
4. Upload beberapa gambar
5. ✅ Semua muncul

**Test Case 4: Delete Media**
1. Klik tombol ✕ pada video/slide
2. ✅ Item terhapus dari list

**Test Case 5: Edit Running Text**
1. Ketik di input "Running Text"
2. ✅ Teks tersimpan di state

**Test Case 6: Manage Schedule Table**
1. Klik "Tambah Baris"
2. ✅ Baris baru muncul
3. Isi Poli, Dokter, Jam
4. ✅ Data tersimpan
5. Klik "Hapus" pada baris
6. ✅ Baris terhapus

**Test Case 7: Publish to Screen**
1. Isi semua field (video, slide, text, schedule)
2. Klik "Publish ke Layar"
3. ✅ Alert "Konten berhasil dipublikasi"
4. ✅ WebSocket event terkirim
5. ✅ Player menerima update (cek di Player)

---

#### Test Plan: Operator Queue (http://localhost:3000/operator)

**Test Case 1: Initial State**
1. Buka http://localhost:3000/operator
2. ✅ 5 kotak loket muncul
3. ✅ Nomor terakhir kosong atau sesuai database

**Test Case 2: Panggil Berikutnya (Auto-increment)**
1. Klik "Panggil Berikutnya" di Loket 1
2. ✅ Nomor berubah ke A001 (jika kosong)
3. Klik lagi
4. ✅ Nomor increment ke A002
5. ✅ Player menerima event (cek di Player)
6. ✅ Suara TTS berbunyi di Player

**Test Case 3: Panggil Ulang**
1. Setelah memanggil A002
2. Klik "Panggil Ulang"
3. ✅ Nomor tetap A002
4. ✅ Player memutar TTS lagi

**Test Case 4: Panggil Manual**
1. Input "B025" di field manual
2. Klik "Panggil"
3. ✅ Nomor berubah ke B025
4. ✅ Player update dengan nomor baru
5. ✅ TTS memanggil "B dua lima"

**Test Case 5: Multiple Lokets**
1. Panggil nomor di Loket 1: A001
2. Panggil nomor di Loket 2: B015
3. Panggil nomor di Loket 3: C030
4. ✅ Semua loket independent
5. ✅ Player menampilkan nomor berbeda di setiap kotak

**Test Case 6: Format Validation**
1. Input format salah: "12345" (tanpa huruf)
2. Klik "Panggil"
3. ⚠️ Tetap terkirim (no validation)
4. Input format benar: "A001"
5. ✅ Terkirim dengan format benar

---

### 🎮 Web Player Testing

#### Test Plan: Player Display (http://localhost:3002)

**Test Case 1: Initial Load**
1. Buka http://localhost:3002
2. ✅ Loading screen muncul
3. ✅ Config ter-load dari API
4. ✅ Player tampil fullscreen (after F11)

**Test Case 2: Background**
1. ✅ Background image muncul jika sudah diset
2. ✅ Ukuran fit screen 1920x1080

**Test Case 3: Queue Boxes (5 Slot)**
1. ✅ 5 kotak antrian muncul di posisi benar
2. ✅ Nama loket sesuai database
3. ✅ Nomor antrian sesuai (jika ada)
4. ✅ Warna: biru gelap (#1a365d)

**Test Case 4: Video Player**
1. ✅ Video autoplay jika ada
2. ✅ Video loop otomatis
3. ✅ Playlist berganti saat video selesai
4. ✅ Jika tidak ada video, tampil "No Video"

**Test Case 5: Slideshow**
1. ✅ Gambar pertama tampil
2. Tunggu 5 detik
3. ✅ Gambar berganti ke slide berikutnya
4. ✅ Transisi smooth
5. ✅ Loop kembali ke slide pertama

**Test Case 6: Schedule Table**
1. ✅ Tabel muncul dengan header (Poli, Dokter, Jam)
2. ✅ Data sesuai yang diinput di Admin
3. ✅ Styling zebra (row ganjil/genap beda warna)

**Test Case 7: Running Text**
1. ✅ Teks berjalan dari kanan ke kiri
2. ✅ Animasi smooth
3. ✅ Loop otomatis

**Test Case 8: Date & Time**
1. ✅ Jam update setiap detik
2. ✅ Format: HH:MM:SS
3. ✅ Tanggal format Indonesia
4. ✅ Hari dalam bahasa Indonesia

**Test Case 9: Auto-scale Layout**
1. Resize browser window
2. ✅ Layout tetap proportional
3. ✅ Tidak ada distorsi
4. Test di berbagai resolusi:
   - 1920x1080 ✅
   - 1366x768 ✅
   - 1280x720 ✅

**Test Case 10: WebSocket - Content Update**
1. Player sudah buka
2. Di Admin, update running text lalu Publish
3. ✅ Player otomatis update tanpa reload
4. ✅ Running text berubah real-time
5. Di Admin, tambah video baru lalu Publish
6. ✅ Video playlist ter-update

**Test Case 11: WebSocket - Queue Call**
1. Player sudah buka
2. Di Operator, panggil nomor A001 di Loket 1
3. ✅ Kotak Loket 1 berkedip (highlight yellow)
4. ✅ Nomor update ke A001
5. ✅ Suara TTS berbunyi: "Nomor antrian A kosong kosong satu, silakan menuju ke Loket 1"
6. Tunggu 5 detik
7. ✅ Highlight animation berhenti

**Test Case 12: TTS Testing**
1. Panggil nomor: A001
   - ✅ "A kosong kosong satu"
2. Panggil nomor: B025
   - ✅ "Be kosong dua lima"
3. Panggil nomor: C100
   - ✅ "Ce satu kosong kosong"
4. Panggil nomor: A999
   - ✅ "A sembilan sembilan sembilan"

**Test Case 13: Offline Support**
1. Player buka dan load config
2. Stop backend server
3. ✅ Player tetap menampilkan konten terakhir (dari localStorage)
4. ✅ Tidak error atau crash
5. Start backend lagi
6. ✅ WebSocket reconnect otomatis

---

### 🔄 Integration Testing Scenarios

**Scenario 1: Full Workflow - Setup New Content**
1. Admin upload 2 video
2. Admin upload 3 gambar slide
3. Admin upload 1 background
4. Admin isi running text
5. Admin tambah 3 baris jadwal dokter
6. Admin klik Publish
7. Player otomatis update semua konten
8. ✅ Video playlist berjalan
9. ✅ Slide berganti-ganti
10. ✅ Running text berjalan
11. ✅ Tabel jadwal muncul

**Scenario 2: Queue Calling Workflow**
1. Operator 1 panggil A001 di Loket 1
2. Player highlight Loket 1 + TTS
3. Operator 2 panggil B001 di Loket 2
4. Player highlight Loket 2 + TTS
5. Operator 1 panggil A002 (berikutnya)
6. Player update Loket 1 ke A002 + TTS
7. ✅ Semua panggilan independen
8. ✅ Tidak ada collision

**Scenario 3: Multi-Device Sync**
1. Buka 2 tab Player (simulasi 2 TV)
2. Di Operator, panggil A001
3. ✅ Kedua Player update bersamaan
4. ✅ TTS berbunyi di kedua Player

**Scenario 4: Stress Test - Rapid Calls**
1. Panggil 10 nomor antrian dalam 5 detik
2. ✅ Semua update terkirim
3. ✅ Player tidak crash
4. ✅ TTS mungkin overlap (expected)

---

## 🤖 Automated Testing (Optional)

### Unit Tests Example (Backend)

File: `backend/src/signage/signage.service.spec.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { SignageService } from './signage.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SignageService', () => {
  let service: SignageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignageService, PrismaService],
    }).compile();

    service = module.get<SignageService>(SignageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get signage config', async () => {
    const config = await service.getSignageConfig('PRAMITHA');
    expect(config).toHaveProperty('client');
    expect(config).toHaveProperty('content');
    expect(config).toHaveProperty('queueSlots');
  });
});
```

Run:
```bash
cd backend
npm install --save-dev @nestjs/testing jest @types/jest
npm test
```

---

### E2E Testing with Playwright (Optional)

Install:
```bash
npm install --save-dev @playwright/test
```

File: `tests/e2e/admin.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('Admin CMS - Upload and Publish', async ({ page }) => {
  await page.goto('http://localhost:3000/admin');
  
  // Upload video
  const videoInput = page.locator('input[type="file"]').first();
  await videoInput.setInputFiles('test-video.mp4');
  
  // Wait for upload
  await page.waitForSelector('video');
  
  // Fill running text
  await page.fill('input[placeholder*="teks berjalan"]', 'Test Text');
  
  // Publish
  await page.click('button:has-text("Publish")');
  
  // Check alert
  await expect(page.locator('text=berhasil')).toBeVisible();
});
```

Run:
```bash
npx playwright test
```

---

## 📊 Performance Testing

### Load Testing with Apache Bench

```bash
# Test API endpoint
ab -n 1000 -c 10 http://localhost:3001/api/signage/PRAMITHA

# Expected:
# - Time per request: < 100ms
# - No failed requests
```

### WebSocket Load Test

```bash
npm install -g wscat

# Connect multiple clients
for i in {1..10}; do
  wscat -c ws://localhost:3001/socket.io/?EIO=4&transport=websocket &
done
```

---

## ✅ Testing Checklist Summary

### Backend ✅
- [ ] Health check responds
- [ ] Upload video works
- [ ] Upload image works
- [ ] Get config works
- [ ] Update content works
- [ ] Call queue works
- [ ] WebSocket emits events

### Frontend Admin ✅
- [ ] Page loads
- [ ] Upload background works
- [ ] Upload video works
- [ ] Upload slides works
- [ ] Delete media works
- [ ] Edit running text works
- [ ] Manage schedule table works
- [ ] Publish triggers update

### Operator ✅
- [ ] Page loads
- [ ] Shows all 5 lokets
- [ ] Panggil berikutnya works
- [ ] Panggil ulang works
- [ ] Input manual works
- [ ] Multiple lokets independent

### Web Player ✅
- [ ] Loads configuration
- [ ] Displays background
- [ ] Shows 5 queue boxes
- [ ] Plays video playlist
- [ ] Shows slideshow
- [ ] Displays schedule table
- [ ] Running text animates
- [ ] Clock updates
- [ ] Auto-scales layout
- [ ] WebSocket receives refresh
- [ ] WebSocket receives queue
- [ ] Queue box highlights
- [ ] TTS speaks correctly
- [ ] Offline cache works

---

## 🐛 Known Issues & Limitations

1. **TTS Browser Support**: Hanya berfungsi di Chrome/Edge
2. **Video Autoplay**: Mungkin perlu user interaction pertama kali
3. **No Upload Progress**: Upload besar tidak ada progress bar
4. **No Authentication**: Semua endpoint public
5. **No File Size Limit**: Bisa upload file sangat besar
6. **TTS Overlap**: Jika panggilan cepat, suara overlap

---

**📝 Note:** Untuk production, tambahkan automated testing (Jest, Playwright) dan CI/CD pipeline.
