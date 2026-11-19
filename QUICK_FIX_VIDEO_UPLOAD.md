# ✅ Fix: Video/Slideshow Upload

## 🎯 Masalah

Kolom "Video" di Admin Panel hanya terima file video (.mp4), padahal sudah ada mode Slideshow yang butuh gambar.

## ✨ Solusi

**Video area sekarang bisa upload:**
- ✅ Video: .mp4, .webm, .ogg
- ✅ Gambar: .jpg, .png, .gif

## 📝 Yang Diubah

### 1. Admin Panel (frontend-admin/app/admin/page.tsx)

**Sebelum:**
```tsx
{/* Video */}
<input type="file" accept="video/*" />
```

**Sesudah:**
```tsx
{/* Video / Slideshow Area */}
<input type="file" accept="video/*,image/*" />
💡 Tips: Upload video untuk mode Video, atau gambar untuk mode Slideshow
```

**Bonus:** Preview otomatis detect image vs video

### 2. Backend (sudah OK!)

Backend sudah support image & video dari awal:
```typescript
fileFilter: allowedTypes = /jpeg|jpg|png|gif|mp4|webm|ogg/
```

## 🎨 Cara Pakai

### Mode 1: Video (Default)

1. Buka `/layout-editor`
2. Pilih mode: **"Video (MP4)"**
3. Save
4. Buka `/admin`
5. Upload file **.mp4** di kolom "Video / Slideshow Area"
6. Publish

### Mode 2: Slideshow (Baru!)

1. Buka `/layout-editor`
2. Pilih mode: **"Slideshow (Gambar berganti-ganti)"**
3. Set durasi: **10 detik** (misal)
4. Save
5. Buka `/admin`
6. Upload file **.jpg atau .png** di kolom "Video / Slideshow Area"
7. Upload beberapa gambar (3-10 gambar)
8. Publish
9. ✨ Gambar akan ganti-ganti otomatis setiap 10 detik!

## 📊 Tabel Fitur

| Upload | Video Mode | Slideshow Mode |
|--------|------------|----------------|
| .mp4   | ✅ Autoplay | ❌ Not supported |
| .jpg   | ❌ Not supported | ✅ Slideshow |
| .png   | ❌ Not supported | ✅ Slideshow |
| .gif   | ❌ Not supported | ✅ Slideshow |

**Note:** 
- Video mode = hanya pakai file video
- Slideshow mode = hanya pakai file gambar
- Jangan mix video + gambar (pilih salah satu)

## ✅ Testing

**Test 1: Upload Video**
```
1. Upload test.mp4 → ✅ Success
2. Preview menampilkan video thumbnail
3. Player autoplay video
```

**Test 2: Upload Gambar untuk Slideshow**
```
1. Set mode Slideshow di Layout Editor
2. Upload image1.jpg → ✅ Success
3. Upload image2.jpg → ✅ Success
4. Upload image3.jpg → ✅ Success
5. Preview menampilkan gambar thumbnail
6. Player slideshow ganti setiap X detik
```

**Test 3: Mix Upload (Not Recommended)**
```
1. Upload video1.mp4
2. Upload image1.jpg
3. Mode Video → Play video1.mp4 (ignore image)
4. Mode Slideshow → Show image1.jpg (ignore video)
```

## 🚀 Deploy

### Cloud (Auto):
```bash
git add .
git commit -m "Fix: Allow image upload for slideshow mode"
git push origin main
```

### Local:
```bash
# Restart frontend admin
cd frontend-admin
npm run dev
```

## 📸 UI Changes

**Before:**
```
┌─────────────────────────┐
│ 🎥 Video                │
│ [Choose File: video/*]  │ ← Hanya video!
└─────────────────────────┘
```

**After:**
```
┌─────────────────────────────────────────────┐
│ 🎥 Video / Slideshow Area                   │
│ 💡 Tips: Upload video (.mp4) untuk mode     │
│    Video, atau gambar (.jpg, .png) untuk    │
│    mode Slideshow. Atur mode di Layout      │
│    Editor.                                   │
│ [Choose File: video/*,image/*]  ← Both OK!  │
└─────────────────────────────────────────────┘
```

## ✨ Summary

**Problem:** ❌ Can't upload images for slideshow
**Solution:** ✅ Accept both video & image
**Files Changed:** 1 file (frontend-admin/app/admin/page.tsx)
**Impact:** Low (only UI change)
**Breaking:** No

Sekarang bisa upload gambar bro! 🎉
