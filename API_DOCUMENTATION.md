# 📡 S7S API Documentation

Base URL: `http://localhost:3001`

---

## 📁 Media Management

### Upload File
Upload video atau gambar untuk digunakan di signage.

**Endpoint:** `POST /api/media/upload`

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData dengan field `file`

**Allowed Types:**
- Video: mp4, webm, ogg
- Image: jpg, jpeg, png, gif

**Response:**
```json
{
  "message": "File uploaded successfully",
  "data": {
    "id": "uuid-here",
    "filename": "original-name.mp4",
    "url": "/resources/file-timestamp-123.mp4",
    "type": "VIDEO",
    "duration": 10,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('http://localhost:3001/api/media/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.data.url); // /resources/file-timestamp-123.mp4
```

---

### Get All Media
Mendapatkan list semua media yang sudah diupload.

**Endpoint:** `GET /api/media`

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "filename": "video1.mp4",
      "url": "/resources/video1.mp4",
      "type": "VIDEO",
      "duration": 30,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-2",
      "filename": "slide1.jpg",
      "url": "/resources/slide1.jpg",
      "type": "IMAGE",
      "duration": null,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Delete Media
Menghapus file media dari database (file fisik tidak dihapus).

**Endpoint:** `DELETE /api/media/:id`

**Response:**
```json
{
  "message": "Media deleted successfully"
}
```

---

## 📺 Signage Content Management

### Get Signage Configuration
Mengambil seluruh konfigurasi signage untuk client tertentu.

**Endpoint:** `GET /api/signage/:clientId`

**Example:** `GET /api/signage/PRAMITHA`

**Response:**
```json
{
  "data": {
    "client": {
      "id": "PRAMITHA",
      "description": "SIGNAGE ANTRIAN"
    },
    "content": {
      "videoUrls": [
        "/resources/video1.mp4",
        "/resources/video2.mp4"
      ],
      "slideUrls": [
        "/resources/slide1.jpg",
        "/resources/slide2.jpg"
      ],
      "runningText": "Selamat Datang di Layanan Kami",
      "scheduleTable": [
        {
          "poli": "Poli Umum",
          "dokter": "dr. Ahmad",
          "jam": "08:00 - 12:00"
        },
        {
          "poli": "Poli Gigi",
          "dokter": "drg. Siti",
          "jam": "13:00 - 16:00"
        }
      ],
      "backgroundUrl": "/resources/background.jpg"
    },
    "queueSlots": [
      {
        "id": 1,
        "clientId": "PRAMITHA",
        "slotNumber": 1,
        "loketName": "Loket 1",
        "currentNumber": "A001",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      // ... slots 2-5
    ]
  }
}
```

---

### Update Signage Content
Memperbarui konten signage dan trigger WebSocket broadcast.

**Endpoint:** `POST /api/signage/:clientId/content`

**Request Body:**
```json
{
  "videoUrls": ["/resources/video1.mp4", "/resources/video2.mp4"],
  "slideUrls": ["/resources/slide1.jpg", "/resources/slide2.jpg"],
  "runningText": "Selamat Datang",
  "scheduleTable": [
    {
      "poli": "Poli Umum",
      "dokter": "dr. Ahmad",
      "jam": "08:00 - 12:00"
    }
  ],
  "backgroundUrl": "/resources/background.jpg"
}
```

**Response:**
```json
{
  "message": "Content updated successfully",
  "data": {
    "id": "uuid-here",
    "clientId": "PRAMITHA",
    "videoUrls": "[...]",
    "slideUrls": "[...]",
    "runningText": "Selamat Datang",
    "scheduleTable": "[...]",
    "backgroundUrl": "/resources/background.jpg",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Side Effects:**
- WebSocket event `refresh:PRAMITHA` dipancarkan ke semua player yang connected
- Player akan otomatis update tanpa reload

---

## 🔔 Queue Management

### Call Queue Number
Memperbarui nomor antrian pada slot tertentu dan trigger WebSocket.

**Endpoint:** `POST /api/signage/:clientId/queue/call`

**Request Body:**
```json
{
  "slotNumber": 1,
  "loketName": "Loket 1",
  "currentNumber": "A001"
}
```

**Response:**
```json
{
  "message": "Queue called successfully",
  "data": {
    "id": 1,
    "clientId": "PRAMITHA",
    "slotNumber": 1,
    "loketName": "Loket 1",
    "currentNumber": "A001",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Side Effects:**
- WebSocket event `queue:PRAMITHA` dipancarkan
- Player akan:
  1. Update nomor di kotak antrian
  2. Highlight/berkedip kotak tersebut
  3. Memutar suara TTS panggilan

---

## 🔌 WebSocket Events

### Connection
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket');
});
```

---

### Event: `refresh:{clientId}`
Dipancarkan saat admin mempublish perubahan konten.

**Listen:**
```javascript
socket.on('refresh:PRAMITHA', (data) => {
  console.log('Content updated:', data);
  // data sama dengan response GET /api/signage/:clientId
});
```

**Data Structure:**
```json
{
  "client": { "id": "PRAMITHA", "description": "..." },
  "content": { "videoUrls": [...], "slideUrls": [...], ... },
  "queueSlots": [...]
}
```

---

### Event: `queue:{clientId}`
Dipancarkan saat operator memanggil nomor antrian.

**Listen:**
```javascript
socket.on('queue:PRAMITHA', (data) => {
  console.log('Queue called:', data);
  // Trigger animation & TTS
});
```

**Data Structure:**
```json
{
  "slotNumber": 1,
  "loketName": "Loket 1",
  "currentNumber": "A001"
}
```

---

## 📂 Static Files

File yang diupload disajikan sebagai static files.

**Base URL:** `/resources`

**Example:**
- Video: `http://localhost:3001/resources/video-123.mp4`
- Image: `http://localhost:3001/resources/slide-456.jpg`
- Background: `http://localhost:3001/resources/bg-789.jpg`

**Usage in HTML:**
```html
<img src="http://localhost:3001/resources/slide-456.jpg" />
<video src="http://localhost:3001/resources/video-123.mp4" />
```

---

## 🧪 Testing with cURL

### Upload File
```bash
curl -X POST http://localhost:3001/api/media/upload \
  -F "file=@/path/to/video.mp4"
```

### Get Config
```bash
curl http://localhost:3001/api/signage/PRAMITHA
```

### Update Content
```bash
curl -X POST http://localhost:3001/api/signage/PRAMITHA/content \
  -H "Content-Type: application/json" \
  -d '{
    "videoUrls": ["/resources/video1.mp4"],
    "slideUrls": ["/resources/slide1.jpg"],
    "runningText": "Hello",
    "scheduleTable": [],
    "backgroundUrl": ""
  }'
```

### Call Queue
```bash
curl -X POST http://localhost:3001/api/signage/PRAMITHA/queue/call \
  -H "Content-Type: application/json" \
  -d '{
    "slotNumber": 1,
    "loketName": "Loket 1",
    "currentNumber": "A001"
  }'
```

---

## 🔐 CORS Configuration

Backend mengizinkan all origins (`*`) untuk development:

```typescript
app.enableCors({
  origin: '*',
  credentials: true,
});
```

**Production:** Ganti `*` dengan domain spesifik.

---

## 📊 Database Schema (Prisma)

### Client
```prisma
model Client {
  id                String
  description       String
  activeTemplateId  String?
  activeChannelId   Int?
  signageContent    SignageContent?
  queueSlots        QueueSlot[]
}
```

### SignageContent
```prisma
model SignageContent {
  id            String
  clientId      String @unique
  videoUrls     String // JSON array
  slideUrls     String // JSON array
  runningText   String
  scheduleTable String // JSON array
  backgroundUrl String
}
```

### QueueSlot
```prisma
model QueueSlot {
  id            Int
  clientId      String
  slotNumber    Int // 1-5
  loketName     String
  currentNumber String
  
  @@unique([clientId, slotNumber])
}
```

---

## 🎯 Best Practices

1. **Always await API responses** untuk error handling
2. **Check HTTP status** sebelum parse JSON
3. **Use WebSocket events** untuk real-time updates
4. **Cache config** di localStorage untuk offline support
5. **Validate file types** sebelum upload
6. **Limit file size** untuk performa (max 50MB recommended)

---

**🔗 Links:**
- Backend: http://localhost:3001
- Swagger (jika ada): http://localhost:3001/api
- Prisma Studio: `npm run prisma:studio` (port 5555)
