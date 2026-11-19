# 🎨 Layout Editor Guide

Panduan menggunakan Layout Editor untuk mengatur posisi komponen di layar.

---

## ✨ Fitur Baru yang Ditambahkan

### 1. **Layout Editor** 🎨
Admin bisa mengatur posisi dan ukuran setiap komponen di layar:
- Background
- 5 Box Antrian (Loket 1-5)
- Video/Slideshow Area
- Slide Area
- Tabel Jadwal
- Running Text
- Date Time

### 2. **Video Mode - Slideshow** 🖼️
Area video sekarang bisa dipakai untuk:
- **Mode Video:** Play video MP4 seperti biasa
- **Mode Slideshow:** Tampilkan gambar berganti-ganti setiap beberapa detik

---

## 📍 Cara Menggunakan

### Akses Layout Editor

1. Buka Admin Panel: `http://your-domain/admin`
2. Klik tombol **"🎨 Layout Editor"**
3. Atau akses langsung: `http://your-domain/layout-editor`

---

## 🎛️ Mengatur Layout

### 1. Pilih Komponen

Di panel kiri, klik salah satu komponen:
- BackGround
- Antrian1 - Antrian5
- Video
- Slide
- Tabel
- RText (Running Text)
- DateTime

### 2. Edit Posisi & Ukuran

Di panel kanan, atur:
- **X (Left):** Posisi dari kiri (0-1920)
- **Y (Top):** Posisi dari atas (0-1080)
- **Width:** Lebar komponen
- **Height:** Tinggi komponen

Gunakan:
- **Input angka** untuk presisi tinggi
- **Slider** untuk adjust cepat

### 3. Simpan Layout

Klik **"💾 Simpan Layout"**

Layout akan langsung diterapkan ke semua player yang terhubung!

---

## 🖼️ Mengatur Video Mode

### Mode 1: Video (Default)

```
1. Pilih "Video (MP4)"
2. Upload file .mp4 di Admin Panel
3. Video akan autoplay & loop
```

**Cocok untuk:** Video promosi, iklan, konten motion

### Mode 2: Slideshow (Baru!)

```
1. Pilih "Slideshow (Gambar berganti-ganti)"
2. Atur "Durasi per gambar" (1-60 detik)
3. Upload file gambar di Admin Panel (ke bagian Video)
4. Gambar akan berganti otomatis sesuai durasi
```

**Cocok untuk:** Poster, infografis, banner statis

**Contoh Penggunaan:**
- Upload 5 gambar poster
- Set durasi: 10 detik
- Setiap gambar tampil 10 detik, total 50 detik, lalu loop

---

## 📐 Koordinat Base

Sistem menggunakan koordinat base **1920×1080** (Full HD)

```
(0,0) ─────────────────────── (1920,0)
  │                              │
  │         1920 x 1080          │
  │                              │
(0,1080) ────────────────── (1920,1080)
```

**Player akan auto-scale** ke resolusi monitor apapun.

---

## 🎯 Tips & Tricks

### Layout yang Baik

1. **Jangan overlap komponen** (kecuali memang disengaja)
2. **Sisakan margin** antara komponen (minimal 5-10px)
3. **Test di player** setelah edit

### Aspect Ratio

- **16:9** → Bagus untuk monitor landscape
- **9:16** → Bagus untuk monitor portrait/vertikal

### Komponen Penting

**Prioritas tinggi (harus terlihat):**
- Box Antrian (Antrian1-5)
- Video/Slideshow Area
- Running Text

**Prioritas sedang:**
- Tabel Jadwal
- Slide Area

**Bisa disembunyikan (set w=0, h=0):**
- DateTime (jika tidak perlu)

---

## 🔄 Reset ke Default

Jika layout berantakan:
1. Klik **"🔄 Reset ke Default"**
2. Confirm
3. Layout kembali ke default (optimal)

---

## 📋 Default Layout

```javascript
BackGround: { x: 0, y: 0, w: 1920, h: 1080 }
Antrian1:   { x: 5, y: 9, w: 597, h: 190 }
Antrian2:   { x: 5, y: 203, w: 597, h: 190 }
Antrian3:   { x: 5, y: 397, w: 597, h: 190 }
Antrian4:   { x: 5, y: 590, w: 597, h: 190 }
Antrian5:   { x: 5, y: 784, w: 597, h: 190 }
Video:      { x: 628, y: 155, w: 1274, h: 622 }
Slide:      { x: 625, y: 790, w: 640, h: 188 }
Tabel:      { x: 1272, y: 790, w: 639, h: 188 }
RText:      { x: 0, y: 1011, w: 1551, h: 67 }
DateTime:   { x: 1562, y: 994, w: 347, h: 79 }
```

Layout ini sudah optimal untuk 1920×1080.

---

## 🎨 Contoh Use Case

### Use Case 1: Layout 2 Kolom

```
[Antrian 1-5]  [Video Besar]
[Box kiri]     [+ Slide]
               [+ Tabel]
[Running Text di bawah penuh]
```

**Setting:**
- Antrian1-5: x=5, lebar 600
- Video: x=620, lebar 1290
- Video mode: Slideshow, 15 detik

### Use Case 2: Portrait (Monitor Vertikal)

```
[Video Penuh]
[Antrian 1]
[Antrian 2]
[Antrian 3]
[Running Text]
```

**Setting:**
- Rotate koordinat base → 1080×1920
- Video: x=0, y=0, w=1080, h=800
- Antrian1: x=0, y=820, w=1080, h=200
- dst.

### Use Case 3: Focus Video (Minimize Antrian)

```
[A1-5]  [===== VIDEO BESAR =====]
(kecil) [                       ]
        [                       ]
```

**Setting:**
- Antrian1-5: width=400 (lebih kecil)
- Video: x=420, w=1480 (lebih lebar)
- Video mode: Video (promosi produk)

---

## 🐛 Troubleshooting

### ❌ Layout tidak berubah di player

**Solusi:**
1. Pastikan sudah klik "Simpan Layout"
2. Refresh player (F5)
3. Cek console browser (F12) untuk error
4. Cek WebSocket connected

### ❌ Komponen tidak terlihat

**Penyebab:**
- Posisi di luar layar (x/y > 1920/1080)
- Ukuran 0 (w=0 atau h=0)

**Solusi:**
- Reset ke default
- Atau set manual: x=100, y=100, w=500, h=300

### ❌ Slideshow tidak jalan

**Solusi:**
1. Cek Video Mode = "slideshow"
2. Upload gambar (bukan video) di Admin Panel
3. Minimal 2 gambar untuk slideshow
4. Refresh player

### ❌ Gambar slideshow terlalu cepat/lambat

**Solusi:**
- Edit "Durasi per gambar" di Layout Editor
- Recommended: 5-15 detik
- Save & refresh player

---

## 📊 Perbandingan Mode

| Aspek | Video Mode | Slideshow Mode |
|-------|------------|----------------|
| File Type | .mp4, .webm | .jpg, .png |
| Durasi | Sesuai video | Custom (1-60 detik) |
| File Size | Besar (10-100MB) | Kecil (100KB-5MB) |
| Bandwidth | Tinggi | Rendah |
| Edit | Perlu software | Mudah (edit gambar) |
| Cocok untuk | Motion, animasi | Poster, banner |

---

## 🚀 Best Practices

### Upload Gambar untuk Slideshow

1. **Resolusi:** 1920×1080 (Full HD)
2. **Format:** JPG (untuk foto) atau PNG (untuk grafis)
3. **File size:** < 2MB per gambar
4. **Jumlah:** 3-10 gambar optimal
5. **Durasi:** 5-10 detik per gambar

### Layout Design

1. **Test di real monitor** (jangan cuma di browser)
2. **Lihat dari jarak jauh** (3-5 meter)
3. **Pastikan text readable** (font size minimal 24px)
4. **Gunakan kontras tinggi** (background gelap, text terang)
5. **Jangan terlalu ramai** (max 3-4 elemen fokus)

---

## 💡 Ideas & Inspirasi

### Untuk Klinik/Rumah Sakit

```
Mode: Slideshow (10 detik)
Konten:
- Gambar 1: Tips kesehatan
- Gambar 2: Promo vaksin
- Gambar 3: Jadwal dokter
- Gambar 4: Testimoni pasien
- Gambar 5: Info BPJS
```

### Untuk Bank/Kantor

```
Mode: Video
Konten:
- Video promo produk (30 detik)
- Slide info suku bunga
- Slide testimoni customer
```

### Untuk Resto/Cafe

```
Mode: Slideshow (8 detik)
Konten:
- Foto menu best seller
- Promo hari ini
- Info delivery
- Review customer
```

---

## 📞 Support

**Dokumentasi:**
- Baca: CARA_MENJALANKAN.md
- Baca: FEATURES.md

**Troubleshooting:**
- Cek: REALTIME_UPDATE.md
- Cek: CLOUD_DEPLOYMENT.md

---

## ✅ Checklist Setup Layout

- [ ] Akses Layout Editor
- [ ] Pilih Video Mode (video/slideshow)
- [ ] Set durasi slideshow (jika pakai slideshow)
- [ ] Edit posisi komponen sesuai kebutuhan
- [ ] Simpan layout
- [ ] Upload konten di Admin Panel
- [ ] Refresh player untuk test
- [ ] Verify tampilan di monitor real
- [ ] Adjust jika perlu
- [ ] Done! 🎉

---

Selamat mengatur layout! 🎨✨
