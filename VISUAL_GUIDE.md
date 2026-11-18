# 🎨 Visual Guide - S7S Digital Signage System

Panduan visual untuk memahami sistem dengan cepat.

---

## 🖥️ System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER INTERFACES                             │
├───────────────────────┬─────────────────────┬───────────────────────┤
│   👨‍💼 Admin CMS        │  👨‍💻 Operator Panel  │   📺 Web Player       │
│   (Port 3000)         │   (Port 3000)       │   (Port 3002)         │
│                       │                     │                       │
│ • Upload Video        │ • Loket 1-5 Control │ • 5 Queue Boxes       │
│ • Upload Images       │ • Call Next         │ • Video Playlist      │
│ • Edit Text           │ • Call Repeat       │ • Slideshow           │
│ • Manage Schedule     │ • Manual Input      │ • Schedule Table      │
│ • Publish Button      │ • Real-time Send    │ • Running Text        │
│                       │                     │ • Clock & Date        │
└───────────┬───────────┴──────────┬──────────┴────────────┬──────────┘
            │                      │                       │
            │ HTTP REST            │ HTTP REST             │ HTTP REST
            │ WebSocket            │ WebSocket             │ WebSocket
            │                      │                       │
            └──────────────────────┴───────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │   🔧 Backend API (NestJS)    │
                    │      (Port 3001)             │
                    │                              │
                    │  • REST Endpoints            │
                    │  • WebSocket Gateway         │
                    │  • File Upload (Multer)      │
                    │  • Static File Serving       │
                    │  • Real-time Broadcasting    │
                    └──────────┬───────────────────┘
                               │
                               │ Prisma ORM
                               │
                               ▼
                    ┌──────────────────────────────┐
                    │   💾 Database (SQLite/PG)    │
                    │                              │
                    │  Tables:                     │
                    │  • Client                    │
                    │  • SignageContent            │
                    │  • QueueSlot (1-5)           │
                    │  • MediaResource             │
                    │  • TvChannel                 │
                    └──────────────────────────────┘
                               │
                               │ File System
                               │
                               ▼
                    ┌──────────────────────────────┐
                    │   📁 Static Files (uploads/) │
                    │                              │
                    │  • Videos (MP4, WebM)        │
                    │  • Images (JPG, PNG)         │
                    │  • Backgrounds               │
                    └──────────────────────────────┘
```

---

## 🎬 User Workflow Diagrams

### Workflow 1: Content Management (Admin)

```
┌──────────────┐
│ Admin opens  │
│ /admin page  │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────┐
│ Upload Media Files                 │
│ ├─ Video: video1.mp4, video2.mp4   │
│ ├─ Slides: slide1.jpg, slide2.jpg  │
│ └─ Background: bg.jpg              │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Edit Content                       │
│ ├─ Running Text: "Selamat Datang" │
│ └─ Schedule: Add doctor rows       │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Click "Publish ke Layar" Button   │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Backend saves to database          │
│ + Emits WebSocket "refresh:CLIENT" │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ All connected Players receive      │
│ update and refresh display         │
│ ✅ Content updated instantly!      │
└────────────────────────────────────┘
```

### Workflow 2: Queue Calling (Operator)

```
┌──────────────┐
│ Operator     │
│ opens page   │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────┐
│ See 5 Loket Cards                  │
│ Each with:                         │
│ • Loket Name                       │
│ • Current Number                   │
│ • 3 Buttons                        │
└──────┬─────────────────────────────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       │             │             │             │
       ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Click    │  │ Click    │  │ Input    │  │ Result   │
│ "Panggil │  │ "Panggil │  │ "A010"   │  │          │
│ Berikut" │  │ Ulang"   │  │ + Click  │  │ ✅ A001  │
│          │  │          │  │ "Panggil"│  │ → A002   │
│          │  │          │  │          │  │          │
│ A001     │  │ A001     │  │ A010     │  │ ✅ A001  │
│ → A002   │  │ → A001   │  │ → A010   │  │ → A001   │
│          │  │ (repeat) │  │ (custom) │  │ (repeat) │
└────┬─────┘  └────┬─────┘  └────┬─────┘  │          │
     │             │             │         │ ✅ A010  │
     │             │             │         │ → A010   │
     └─────────────┴─────────────┘         │ (custom) │
                   │                       │          │
                   ▼                       └──────────┘
┌────────────────────────────────────┐
│ Backend updates QueueSlot          │
│ + Emits WebSocket "queue:CLIENT"   │
└──────┬─────────────────────────────┘
       │
       ▼
┌────────────────────────────────────┐
│ Player receives event:             │
│ 1. Highlight queue box (gold)      │
│ 2. Update number display           │
│ 3. Play TTS audio                  │
│ "Nomor antrian A kosong kosong     │
│  satu, silakan menuju ke Loket 1"  │
└────────────────────────────────────┘
```

---

## 📺 Player Layout Diagram (1920x1080)

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Background Image (Full)                     │
│  ┌──────────────┐                                                   │
│  │   Antrian 1  │  ┌──────────────────────────────────────────┐    │
│  │   Loket 1    │  │                                          │    │
│  │    A001      │  │                                          │    │
│  └──────────────┘  │         Video Player                     │    │
│  ┌──────────────┐  │         (Playlist Auto-loop)             │    │
│  │   Antrian 2  │  │                                          │    │
│  │   Loket 2    │  │                                          │    │
│  │    B025      │  │          1274 x 622                      │    │
│  └──────────────┘  │                                          │    │
│  ┌──────────────┐  └──────────────────────────────────────────┘    │
│  │   Antrian 3  │  ┌──────────────────┐ ┌────────────────────┐    │
│  │   Loket 3    │  │                  │ │  Schedule Table    │    │
│  │    C100      │  │   Slideshow      │ │                    │    │
│  └──────────────┘  │   (5s interval)  │ │ Poli | Dokter| Jam│    │
│  ┌──────────────┐  │                  │ │ ────────────────── │    │
│  │   Antrian 4  │  │   640 x 188      │ │ Umum | Ahmad | 8-12│    │
│  │   Loket 4    │  │                  │ │ Gigi | Siti  |13-16│    │
│  │    -         │  └──────────────────┘ └────────────────────┘    │
│  └──────────────┘                                                  │
│  ┌──────────────┐  ┌──────────────────────────────────────────┐   │
│  │   Antrian 5  │  │  Running Text (Scrolling)                │   │
│  │   Loket 5    │  │  "Selamat Datang..."                     │ ┌─┤
│  │    -         │  └──────────────────────────────────────────┘ │D│
│  └──────────────┘                                               │a│
│                                                                  │t│
└──────────────────────────────────────────────────────────────────e┘
                                                                  Time
```

**Coordinates:**
- **Antrian 1-5**: Left side (5, 9) to (597, 974)
- **Video**: Center-right (628, 155) to (1902, 777)
- **Slideshow**: Bottom-left (625, 790) to (1265, 978)
- **Table**: Bottom-right (1272, 790) to (1911, 978)
- **Running Text**: Bottom (0, 1011) to (1551, 1078)
- **Date/Time**: Bottom-right (1562, 994) to (1909, 1073)

---

## 🔄 Real-time Update Flow

```
┌────────────────────────────────────────────────────────────────────┐
│                      WebSocket Event Flow                          │
└────────────────────────────────────────────────────────────────────┘

Event Type 1: Content Update (refresh:CLIENT)
─────────────────────────────────────────────

Admin CMS                Backend               Player(s)
    │                       │                      │
    │ POST /content         │                      │
    ├──────────────────────>│                      │
    │                       │                      │
    │                       │ Save to DB           │
    │                       │                      │
    │                       │ emit("refresh")      │
    │                       ├─────────────────────>│
    │                       │                      │
    │                       │                      │ Update UI
    │                       │                      │ • Videos
    │ ✅ Success            │                      │ • Slides
    │<──────────────────────┤                      │ • Text
    │                       │                      │ • Table
    │                       │                      │ ✅ Done


Event Type 2: Queue Call (queue:CLIENT)
────────────────────────────────────────

Operator                  Backend               Player(s)
    │                       │                      │
    │ POST /queue/call      │                      │
    ├──────────────────────>│                      │
    │                       │                      │
    │                       │ Update QueueSlot     │
    │                       │                      │
    │                       │ emit("queue")        │
    │                       ├─────────────────────>│
    │                       │                      │
    │                       │                      │ 1. Highlight
    │ ✅ Success            │                      │ 2. Update #
    │<──────────────────────┤                      │ 3. Play TTS
    │                       │                      │ ✅ Done
```

---

## 🎯 Component Hierarchy

### Backend Modules
```
AppModule
├── PrismaModule (Global)
│   └── PrismaService
├── WebsocketModule
│   └── SignageGateway (Socket.io)
├── MediaModule
│   ├── MediaController
│   └── MediaService
├── SignageModule
│   ├── SignageController
│   └── SignageService
└── QueueModule
    ├── QueueController
    └── QueueService
```

### Frontend Admin
```
RootLayout
├── Navbar
└── Routes
    ├── / (Home)
    ├── /admin (CMS)
    │   ├── BackgroundUpload
    │   ├── VideoUpload
    │   ├── SlideUpload
    │   ├── RunningTextInput
    │   ├── ScheduleTable
    │   └── PublishButton
    └── /operator (Panel)
        └── LoketCard × 5
            ├── CurrentNumber
            ├── NextButton
            ├── RepeatButton
            └── ManualInput
```

### Web Player
```
App
└── SignagePlayer
    ├── Background
    ├── QueueBox × 5
    ├── VideoPlayer
    ├── SlideShow
    ├── ScheduleTable
    ├── RunningText
    └── DateTime
```

---

## 📊 Database Schema Visual

```
┌─────────────────────┐
│      Client         │
│─────────────────────│
│ id (PK) String      │ ─┐
│ description String  │  │
│ activeTemplateId    │  │
│ activeChannelId     │  │
└─────────────────────┘  │
                         │ 1:1
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐
│  SignageContent     │       │    QueueSlot        │
│─────────────────────│       │─────────────────────│
│ id (PK)             │       │ id (PK)             │
│ clientId (FK) ──────┘       │ clientId (FK) ──────┘
│ videoUrls JSON      │       │ slotNumber (1-5)    │
│ slideUrls JSON      │       │ loketName String    │
│ runningText String  │       │ currentNumber String│
│ scheduleTable JSON  │       │ updatedAt DateTime  │
│ backgroundUrl String│       └─────────────────────┘
└─────────────────────┘       UNIQUE(clientId, slotNumber)


┌─────────────────────┐       ┌─────────────────────┐
│  MediaResource      │       │    TvChannel        │
│─────────────────────│       │─────────────────────│
│ id (PK) UUID        │       │ id (PK)             │
│ filename String     │       │ code Int UNIQUE     │
│ url String          │       │ name String         │
│ type String         │       └─────────────────────┘
│ duration Int?       │       Examples:
│ createdAt DateTime  │       • 195: TransTV
└─────────────────────┘       • 243: Indosiar
Types: VIDEO | IMAGE          • 251: RCTI
```

---

## 🎨 UI Color Scheme

### Admin CMS & Operator
```
Primary (Blue):    #1E40AF (bg-blue-700)
Secondary (Green): #059669 (bg-green-600)
Accent (Yellow):   #F59E0B (bg-yellow-500)
Danger (Red):      #DC2626 (bg-red-600)
Background:        #F9FAFB (bg-gray-50)
Text:              #111827 (text-gray-900)
```

### Web Player
```
Queue Box Normal:    #1a365d (Dark Blue)
Queue Box Highlight: #FFD700 (Gold)
Queue Text Normal:   #FFFFFF (White)
Queue Text Highlight:#000000 (Black)
Queue Number:        #FFD700 (Gold)
Running Text BG:     #1a365d (Dark Blue)
Running Text FG:     #FFD700 (Gold)
DateTime BG:         #1a365d (Dark Blue)
DateTime Time:       #FFD700 (Gold)
DateTime Date:       #FFFFFF (White)
```

---

## 📱 Responsive Breakpoints

### Admin & Operator (Tailwind)
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

### Web Player
- **Base**: 1920x1080 (16:9)
- **Scale**: Auto-scale dengan `transform: scale()`
- **Tested**:
  - 1920x1080 ✅
  - 1366x768 ✅
  - 1280x720 ✅
  - Any resolution (proportional)

---

## 🔊 TTS Pronunciation Map

```
Numbers:
0 → "kosong"
1 → "satu"
2 → "dua"
3 → "tiga"
4 → "empat"
5 → "lima"
6 → "enam"
7 → "tujuh"
8 → "delapan"
9 → "sembilan"

Letters:
A → "A"
B → "Be"
C → "Ce"
D → "De"
E → "E"
F → "Ef"
G → "Ge"
H → "Ha"
...

Examples:
A001 → "A kosong kosong satu"
B025 → "Be kosong dua lima"
C100 → "Ce satu kosong kosong"

Full Message:
"Nomor antrian {number}, silakan menuju ke {loket}"
```

---

## 🔄 State Management

### Backend (NestJS)
```
Database (Prisma) → Service Layer → Controller → HTTP Response
                                               → WebSocket Emit
```

### Frontend Admin & Operator (React useState)
```
API Fetch → useState → Render → User Action → API Call → useState Update
```

### Web Player (React useState + useEffect)
```
Initial Load:
API Fetch → useState → localStorage.setItem → Render

WebSocket Update:
Socket Event → useState → Render

Timers:
useEffect → setInterval → useState → Render (DateTime, Slideshow, RunningText)
```

---

## 🚀 Deployment Visual

### Development
```
[Localhost]
   ├─ Backend:3001
   ├─ Admin:3000
   └─ Player:3002
```

### Production (Recommended)
```
[Nginx Reverse Proxy] (HTTPS)
   │
   ├─ /api → Backend:3001 (PM2 × 2)
   ├─ /admin → Frontend Static
   ├─ /operator → Frontend Static
   └─ /player → Player Static
           │
           └─ Backend connects to PostgreSQL
                     │
                     └─ Backups (pg_dump cron)
```

---

**📌 Tips Visual:**
1. Gunakan browser Developer Tools (F12) untuk inspect WebSocket events
2. Open multiple tabs untuk test multi-device sync
3. Console.log di Player untuk debug TTS & animations
4. Prisma Studio (`npm run prisma:studio`) untuk view database
5. Network tab untuk monitor file uploads & API calls

---

**🎨 Design Philosophy:**
- **Clean**: Minimal, fokus pada konten
- **Bold**: Large fonts, high contrast
- **Responsive**: Works on any screen
- **Intuitive**: Self-explanatory UI
- **Professional**: Modern, trustworthy

