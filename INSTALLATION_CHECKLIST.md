# ✅ Installation & Verification Checklist

Gunakan checklist ini untuk memastikan sistem terinstall dengan benar.

---

## 📋 Pre-Installation Checklist

### System Requirements
- [ ] Windows 10/11 atau Linux/macOS
- [ ] Node.js 18+ terinstall (`node --version`)
- [ ] npm 9+ terinstall (`npm --version`)
- [ ] Git terinstall (optional, untuk version control)
- [ ] 1GB disk space tersedia
- [ ] Browser modern (Chrome/Edge recommended)

### Network Requirements
- [ ] Port 3000 tersedia (Frontend Admin)
- [ ] Port 3001 tersedia (Backend API)
- [ ] Port 3002 tersedia (Web Player)
- [ ] Firewall allow local connections
- [ ] Internet connection untuk download dependencies

---

## 🔧 Installation Steps

### Method 1: Automated (Recommended)

#### Step 1: Run Setup Script
```bash
# Windows
double-click setup-all.bat

# Or via command line
cd c:\s7s-signage-system
setup-all.bat
```

**Expected Output:**
```
========================================
 S7S Digital Signage System
 Installation & Setup
========================================

[1/4] Installing Backend dependencies...
[2/4] Installing Frontend Admin dependencies...
[3/4] Installing Web Player dependencies...
[4/4] Creating uploads folder...

Setup Complete!
```

**Verification:**
- [ ] No error messages during installation
- [ ] All `node_modules` folders created
- [ ] `backend/prisma/dev.db` database file exists
- [ ] `backend/uploads` folder exists

---

### Method 2: Manual Installation

#### Step 1: Backend Setup
```bash
cd backend
npm install
```
- [ ] Dependencies installed successfully
- [ ] No WARN or ERROR messages

```bash
npx prisma generate
```
- [ ] Prisma client generated
- [ ] File `node_modules/.prisma/client` exists

```bash
npx prisma migrate dev --name init
```
- [ ] Database migrations applied
- [ ] File `prisma/dev.db` created

```bash
npm run prisma:seed
```
- [ ] Seed data inserted
- [ ] Output shows: "✅ Created client: PRAMITHA"

#### Step 2: Frontend Admin Setup
```bash
cd ../frontend-admin
npm install
```
- [ ] Dependencies installed successfully
- [ ] No errors

#### Step 3: Web Player Setup
```bash
cd ../web-player
npm install
```
- [ ] Dependencies installed successfully
- [ ] No errors

---

## 🚀 First Run Verification

### Method 1: Automated Start
```bash
# Windows
double-click start-all.bat
```

**Expected:**
- [ ] 3 terminal windows open automatically
- [ ] Backend starts on port 3001
- [ ] Admin starts on port 3000
- [ ] Player starts on port 3002
- [ ] No error messages in any terminal

### Method 2: Manual Start

#### Terminal 1: Backend
```bash
cd backend
npm run start:dev
```

**Expected Output:**
```
[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] PrismaModule dependencies initialized
✅ Database connected
[Nest] LOG [RoutesResolver] MediaController {/api/media}
[Nest] LOG [RoutesResolver] SignageController {/api/signage}
[Nest] LOG [RoutesResolver] QueueController {/api/signage}
[Nest] LOG [NestApplication] Nest application successfully started
🚀 Backend server running on http://localhost:3001
```

**Verification:**
- [ ] Server started successfully
- [ ] No error messages
- [ ] Database connected
- [ ] All controllers loaded

#### Terminal 2: Frontend Admin
```bash
cd frontend-admin
npm run dev
```

**Expected Output:**
```
   ▲ Next.js 14.0.4
   - Local:        http://localhost:3000
   - Environments: .env.local

 ✓ Ready in 2.5s
```

**Verification:**
- [ ] Server started
- [ ] No compilation errors
- [ ] Port 3000 accessible

#### Terminal 3: Web Player
```bash
cd web-player
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:3002/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Verification:**
- [ ] Server started
- [ ] No compilation errors
- [ ] Port 3002 accessible

---

## 🌐 Access Verification

### Backend API (http://localhost:3001)

#### Test 1: Root Endpoint
```bash
curl http://localhost:3001
```
- [ ] Response received (404 is OK, server is running)

#### Test 2: Get Signage Config
```bash
curl http://localhost:3001/api/signage/PRAMITHA
```

**Expected Response:**
```json
{
  "data": {
    "client": {
      "id": "PRAMITHA",
      "description": "SIGNAGE ANTRIAN"
    },
    "content": {
      "videoUrls": [],
      "slideUrls": [],
      "runningText": "Selamat Datang...",
      "scheduleTable": [...]
    },
    "queueSlots": [...]
  }
}
```

**Verification:**
- [ ] JSON response received
- [ ] Client id is "PRAMITHA"
- [ ] queueSlots contains 5 slots
- [ ] scheduleTable has default data

#### Test 3: WebSocket Connection
- [ ] Open browser console
- [ ] Run: `new WebSocket('ws://localhost:3001/socket.io/?EIO=4&transport=websocket')`
- [ ] Connection established (no errors)

---

### Frontend Admin (http://localhost:3000)

#### Test 1: Home Page
- [ ] Navigate to http://localhost:3000
- [ ] Page loads successfully
- [ ] 2 cards visible: "Admin CMS" and "Operator Antrian"
- [ ] No console errors (F12)

#### Test 2: Admin CMS Page
- [ ] Navigate to http://localhost:3000/admin
- [ ] Page loads with form sections
- [ ] Sections visible:
  - [ ] Background upload
  - [ ] Video upload
  - [ ] Slides upload
  - [ ] Running Text input
  - [ ] Schedule Table
  - [ ] Publish button
- [ ] No console errors

#### Test 3: Operator Page
- [ ] Navigate to http://localhost:3000/operator
- [ ] Page loads with 5 loket cards
- [ ] Each card has:
  - [ ] Loket name
  - [ ] Current number display
  - [ ] "Panggil Berikutnya" button
  - [ ] "Panggil Ulang" button
  - [ ] Manual input field + "Panggil" button
- [ ] No console errors

---

### Web Player (http://localhost:3002)

#### Test 1: Initial Load
- [ ] Navigate to http://localhost:3002
- [ ] Player loads successfully
- [ ] Layout visible with all elements
- [ ] No console errors

#### Test 2: Layout Elements
- [ ] 5 queue boxes visible (left side)
- [ ] Video player area visible (center)
- [ ] Slideshow area visible (bottom-left)
- [ ] Schedule table visible (bottom-right)
- [ ] Running text visible (bottom)
- [ ] Clock & date visible (bottom-right)

#### Test 3: Real-time Clock
- [ ] Clock updates every second
- [ ] Time format: HH:MM:SS
- [ ] Date format: Hari, DD Bulan YYYY
- [ ] In Indonesian language

#### Test 4: Running Text Animation
- [ ] Text scrolls from right to left
- [ ] Smooth animation
- [ ] Loops continuously

---

## 🧪 Functional Testing

### Test 1: Upload Media (Admin)

#### Upload Video
1. [ ] Go to http://localhost:3000/admin
2. [ ] Click file input in "Video" section
3. [ ] Select an MP4 file
4. [ ] Wait for upload to complete
5. [ ] Verify thumbnail appears in grid
6. [ ] Check backend terminal: "File uploaded successfully"
7. [ ] Check file exists: `backend/uploads/file-*.mp4`

#### Upload Image
1. [ ] Click file input in "Slides" section
2. [ ] Select a JPG/PNG file
3. [ ] Wait for upload
4. [ ] Verify image appears in grid
5. [ ] Check file exists in `backend/uploads/`

---

### Test 2: Publish Content (Admin → Player)

#### Setup
1. [ ] Open Admin in one tab: http://localhost:3000/admin
2. [ ] Open Player in another tab: http://localhost:3002
3. [ ] Arrange windows side-by-side

#### Test Publish
1. [ ] In Admin, change running text to "TEST TEXT"
2. [ ] Click "Publish ke Layar" button
3. [ ] Alert appears: "Konten berhasil dipublikasi"
4. [ ] **Check Player**: Running text updates to "TEST TEXT" (no reload!)
5. [ ] Check browser console: "📡 Received refresh event"

**Verification:**
- [ ] Update happens instantly (<2 seconds)
- [ ] No page reload required
- [ ] WebSocket event logged in console

---

### Test 3: Queue Calling (Operator → Player)

#### Setup
1. [ ] Open Operator: http://localhost:3000/operator
2. [ ] Open Player: http://localhost:3002 (keep from previous test)
3. [ ] Arrange side-by-side

#### Test Auto-increment
1. [ ] In Operator, click "Panggil Berikutnya" for Loket 1
2. [ ] **Check Player**:
   - [ ] Loket 1 box highlights (gold color)
   - [ ] Number updates to "A001"
   - [ ] Box pulses/animates for ~5 seconds
   - [ ] TTS plays: "Nomor antrian A kosong kosong satu, silakan menuju ke Loket 1"
3. [ ] Click "Panggil Berikutnya" again
4. [ ] **Check Player**:
   - [ ] Number updates to "A002"
   - [ ] TTS plays: "A kosong kosong dua..."

#### Test Manual Input
1. [ ] In Operator Loket 2, input "B025"
2. [ ] Click "Panggil"
3. [ ] **Check Player**:
   - [ ] Loket 2 box highlights
   - [ ] Number updates to "B025"
   - [ ] TTS plays: "B kosong dua lima..."

**Verification:**
- [ ] Highlight animation works
- [ ] TTS audio plays (check speaker volume!)
- [ ] Multiple lokets work independently
- [ ] WebSocket event in console

---

### Test 4: Offline Support

#### Test Cache
1. [ ] Player open and loaded
2. [ ] Stop backend: Close backend terminal (Ctrl+C)
3. [ ] Refresh Player page
4. [ ] **Check**: Player still displays last content (from localStorage)
5. [ ] Check console: "Failed to load config" (but still renders)
6. [ ] Restart backend
7. [ ] **Check**: WebSocket reconnects automatically

**Verification:**
- [ ] Player works offline with cached data
- [ ] No crash or blank screen
- [ ] Reconnects when backend is back

---

## 🎯 Performance Checklist

### Backend Performance
- [ ] API response time < 100ms (check Network tab)
- [ ] WebSocket latency < 50ms
- [ ] File upload successful (up to 50MB)
- [ ] No memory leaks (check Task Manager)

### Frontend Performance
- [ ] Page load time < 2 seconds
- [ ] No layout shift (CLS = 0)
- [ ] Smooth animations (60fps)
- [ ] No lag when typing

### Player Performance
- [ ] Video plays smoothly (1080p @ 30fps)
- [ ] Slideshow transitions smooth
- [ ] Running text animation smooth
- [ ] Clock updates without lag
- [ ] TTS plays without delay

---

## 🔧 Troubleshooting Checklist

### Issue: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
```bash
# Find process using port
netstat -ano | findstr :3001

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change port in code
```

---

### Issue: Database Error

**Symptoms:**
```
PrismaClientInitializationError: Can't reach database server
```

**Solution:**
```bash
cd backend
npx prisma migrate reset
npx prisma generate
npm run prisma:seed
```

---

### Issue: Upload Folder Not Found

**Symptoms:**
```
ENOENT: no such file or directory, open 'uploads/...'
```

**Solution:**
```bash
cd backend
mkdir uploads
```

---

### Issue: WebSocket Not Connecting

**Symptoms:**
- Player doesn't update in real-time
- Console shows: "WebSocket connection failed"

**Solution:**
1. Check backend is running
2. Check CORS settings
3. Check firewall
4. Try different browser (Chrome/Edge)

---

### Issue: TTS Not Working

**Symptoms:**
- No audio when queue is called
- Console shows: "Speech synthesis not supported"

**Solution:**
1. Use Chrome or Edge (not Firefox/Safari)
2. Check speaker volume
3. Check browser permissions (allow audio)
4. Check language support (id-ID)

---

### Issue: Video Not Playing

**Symptoms:**
- Video area shows blank or "No Video"
- Console error: "Failed to load resource"

**Solution:**
1. Check video format (MP4 recommended)
2. Click on player first (browser autoplay policy)
3. Check video codec (H.264)
4. Check video file exists in uploads/

---

## ✅ Final Verification Checklist

### All Services Running
- [ ] Backend terminal: "Backend server running on http://localhost:3001"
- [ ] Admin terminal: "Ready in X ms"
- [ ] Player terminal: "ready in X ms"

### All Features Working
- [ ] Upload media ✅
- [ ] Publish content ✅
- [ ] Real-time update ✅
- [ ] Queue calling ✅
- [ ] TTS audio ✅
- [ ] Offline cache ✅

### No Errors
- [ ] No errors in backend terminal
- [ ] No errors in admin browser console
- [ ] No errors in player browser console
- [ ] No errors in operator browser console

### Documentation Available
- [ ] README.md readable
- [ ] QUICK_START.md helpful
- [ ] API_DOCUMENTATION.md clear
- [ ] All other docs accessible

---

## 🎉 Success Criteria

**System is ready for use when:**
- ✅ All 3 services start without errors
- ✅ All pages load successfully
- ✅ Upload works
- ✅ Publish triggers real-time update
- ✅ Queue calling works with highlight + TTS
- ✅ No console errors
- ✅ All tests pass

---

## 📞 Next Steps

Once all checks pass:
1. ✅ **Development Ready**: Start customizing for your needs
2. 📖 **Read Docs**: Explore FEATURES.md & ARCHITECTURE.md
3. 🧪 **Test More**: Use TESTING.md for comprehensive testing
4. 🚀 **Deploy**: Follow DEPLOYMENT.md for production

---

**🎊 Congratulations! Your S7S Digital Signage System is installed and working!**

**Date Completed:** _____________  
**Installed By:** _____________  
**Notes:** _____________
