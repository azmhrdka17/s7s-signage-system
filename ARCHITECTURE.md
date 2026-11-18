# 🏗️ System Architecture - S7S Digital Signage System

Dokumentasi lengkap arsitektur sistem dan design decisions.

---

## 📊 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        End Users                            │
├──────────────┬─────────────────┬──────────────────────────┤
│  Admin CMS   │  Operator Panel │   Web Player (TV)        │
│  (Browser)   │    (Browser)    │     (Browser)            │
└──────┬───────┴────────┬────────┴────────┬─────────────────┘
       │                │                 │
       │ HTTP/REST      │ HTTP/REST       │ HTTP/REST
       │ WebSocket      │ WebSocket       │ WebSocket
       │                │                 │
       └────────────────┴─────────────────┘
                        │
                        ▼
         ┌──────────────────────────────┐
         │   Backend API (NestJS)       │
         │  - REST Endpoints            │
         │  - WebSocket Gateway         │
         │  - File Upload Service       │
         │  - Static File Serving       │
         └─────────┬────────────────────┘
                   │
                   │ Prisma ORM
                   │
                   ▼
         ┌──────────────────────────────┐
         │   Database (SQLite/PostgreSQL)│
         │  - Client                    │
         │  - SignageContent            │
         │  - QueueSlot                 │
         │  - MediaResource             │
         └──────────────────────────────┘
                   │
                   │ File System
                   │
                   ▼
         ┌──────────────────────────────┐
         │   Static Files (uploads/)    │
         │  - Videos (MP4)              │
         │  - Images (JPG/PNG)          │
         │  - Backgrounds               │
         └──────────────────────────────┘
```

---

## 🔄 Data Flow Diagrams

### 1. Content Management Flow (Admin → Player)

```
┌─────────────┐
│  Admin CMS  │
└──────┬──────┘
       │ 1. Upload media
       ▼
┌──────────────────┐
│ POST /api/media/ │
│      upload      │
└──────┬───────────┘
       │ 2. Save file & metadata
       ▼
┌──────────────────┐
│   File System    │
│    + Database    │
└──────┬───────────┘
       │ 3. Return URL
       ▼
┌─────────────┐
│  Admin CMS  │ 4. Add to content list
└──────┬──────┘
       │ 5. Click "Publish"
       ▼
┌──────────────────┐
│ POST /api/signage│
│  /:clientId/     │
│     content      │
└──────┬───────────┘
       │ 6. Update database
       │ 7. Emit WebSocket
       ▼
┌──────────────────┐
│  WebSocket Event │
│ "refresh:CLIENT" │
└──────┬───────────┘
       │ 8. Broadcast
       ▼
┌─────────────┐
│ Web Player  │ 9. Update UI
└─────────────┘
```

### 2. Queue Calling Flow (Operator → Player)

```
┌──────────────┐
│   Operator   │
└──────┬───────┘
       │ 1. Click "Panggil"
       ▼
┌──────────────────┐
│ POST /api/signage│
│  /:clientId/     │
│   queue/call     │
└──────┬───────────┘
       │ 2. Update QueueSlot
       ▼
┌──────────────────┐
│    Database      │
└──────┬───────────┘
       │ 3. Emit WebSocket
       ▼
┌──────────────────┐
│  WebSocket Event │
│  "queue:CLIENT"  │
└──────┬───────────┘
       │ 4. Broadcast
       ▼
┌─────────────┐
│ Web Player  │ 5. Highlight box
│             │ 6. Play TTS
└─────────────┘
```

### 3. Player Initialization Flow

```
┌─────────────┐
│ Web Player  │ 1. Load page
└──────┬──────┘
       │ 2. Check localStorage
       ▼
┌──────────────────┐
│  Cache exists?   │
├─────Yes──┬──No───┤
│          │       │
│ 3a. Load │       │ 3b. Fetch from API
│   cache  │       ▼
│          │  ┌──────────────────┐
│          │  │ GET /api/signage │
│          │  │   /:clientId     │
│          │  └────────┬─────────┘
│          │           │ 4. Return config
│          │           ▼
│          └───────►┌──────────────┐
│ 5. Render        │  Store cache │
│                  └──────┬───────┘
▼                         │
┌──────────────────────────┘
│ 6. Connect WebSocket
▼
┌──────────────────┐
│  Listen events   │
│ - refresh:CLIENT │
│ - queue:CLIENT   │
└──────────────────┘
```

---

## 🗂️ Module Structure

### Backend Modules

```
backend/src/
├── main.ts                 # Entry point, CORS, port
├── app.module.ts           # Root module, imports
│
├── prisma/                 # Database module
│   ├── prisma.module.ts    # Global module
│   └── prisma.service.ts   # PrismaClient wrapper
│
├── websocket/              # WebSocket module
│   ├── websocket.module.ts
│   └── signage.gateway.ts  # Socket.io gateway
│
├── media/                  # Media upload module
│   ├── media.module.ts
│   ├── media.controller.ts # Upload endpoints
│   └── media.service.ts    # CRUD operations
│
├── signage/                # Signage content module
│   ├── signage.module.ts
│   ├── signage.controller.ts # Content endpoints
│   └── signage.service.ts    # Config logic
│
└── queue/                  # Queue management module
    ├── queue.module.ts
    ├── queue.controller.ts # Queue call endpoint
    └── queue.service.ts    # Queue logic
```

### Frontend Admin Structure

```
frontend-admin/app/
├── layout.tsx              # Root layout, nav
├── page.tsx                # Home page
├── globals.css             # Global styles
│
├── admin/                  # Admin CMS route
│   └── page.tsx            # Content management UI
│
└── operator/               # Operator route
    └── page.tsx            # Queue control UI
```

### Web Player Structure

```
web-player/src/
├── main.tsx                # Entry point
├── App.tsx                 # Root component, WebSocket
├── types.ts                # TypeScript interfaces
│
├── components/             # UI components
│   ├── SignagePlayer.tsx   # Main player container
│   ├── QueueBox.tsx        # Single queue slot
│   ├── VideoPlayer.tsx     # Video playlist
│   ├── SlideShow.tsx       # Image slideshow
│   ├── ScheduleTable.tsx   # Doctor schedule
│   ├── RunningText.tsx     # Scrolling text
│   └── DateTime.tsx        # Clock & date
│
└── utils/
    └── tts.ts              # Text-to-speech logic
```

---

## 🗄️ Database Schema (Prisma)

### Entity Relationship Diagram

```
┌──────────────┐       ┌──────────────────┐
│   Client     │───┬───│ SignageContent   │
│              │   │   │                  │
│ - id (PK)    │   │   │ - clientId (FK)  │
│ - description│   │   │ - videoUrls      │
└──────┬───────┘   │   │ - slideUrls      │
       │           │   │ - runningText    │
       │           │   │ - scheduleTable  │
       │           │   │ - backgroundUrl  │
       │           │   └──────────────────┘
       │           │
       │           │   ┌──────────────────┐
       └───────────┴───│   QueueSlot      │
                       │                  │
                       │ - id (PK)        │
                       │ - clientId (FK)  │
                       │ - slotNumber     │
                       │ - loketName      │
                       │ - currentNumber  │
                       └──────────────────┘

┌──────────────────┐        ┌──────────────────┐
│  MediaResource   │        │    TvChannel     │
│                  │        │                  │
│ - id (PK)        │        │ - id (PK)        │
│ - filename       │        │ - code (unique)  │
│ - url            │        │ - name           │
│ - type           │        └──────────────────┘
│ - duration       │
└──────────────────┘
```

### Key Design Decisions

**1. JSON Fields vs Relations**
- `videoUrls`, `slideUrls`, `scheduleTable` disimpan sebagai JSON string
- **Reason**: Flexible, tidak perlu tabel terpisah untuk array sederhana
- **Trade-off**: Query kompleks lebih sulit, tapi cukup untuk use case ini

**2. QueueSlot Unique Constraint**
- `@@unique([clientId, slotNumber])` ensures 1 slot per client per number
- **Reason**: Prevent duplicate slots, enforce consistency

**3. Separate MediaResource Table**
- Store all uploaded media dengan metadata
- **Reason**: Centralized management, reusability (future), audit trail

**4. Client-centric Design**
- All content scoped to `clientId`
- **Reason**: Multi-tenant support, easy to scale to multiple locations

---

## 🔌 API Design

### RESTful Principles

**Resource-based URLs:**
```
/api/media              # Collection
/api/media/:id          # Single resource
/api/signage/:clientId  # Client-specific
```

**HTTP Methods:**
- `GET`: Read data
- `POST`: Create/Update (we use POST for updates too)
- `DELETE`: Delete resource

**Response Format:**
```json
{
  "message": "Success message",
  "data": { ... }
}
```

**Error Format:**
```json
{
  "statusCode": 400,
  "message": "Error message"
}
```

### WebSocket Events

**Event Naming:**
- `refresh:{clientId}` - Content update
- `queue:{clientId}` - Queue call

**Payload:**
```javascript
// refresh event
{
  client: { ... },
  content: { ... },
  queueSlots: [ ... ]
}

// queue event
{
  slotNumber: 1,
  loketName: "Loket 1",
  currentNumber: "A001"
}
```

---

## 🎨 Frontend Architecture

### State Management

**Admin CMS & Operator:**
- **React useState**: Local component state
- **Reason**: Simple, no need for Redux/MobX
- **API Calls**: Direct fetch with async/await

**Web Player:**
- **useState**: UI state (highlight, current slide, etc)
- **useEffect**: WebSocket listeners, timers
- **localStorage**: Config cache

### Component Hierarchy

```
App
├── SignagePlayer (container)
│   ├── QueueBox × 5
│   ├── VideoPlayer
│   ├── SlideShow
│   ├── ScheduleTable
│   ├── RunningText
│   └── DateTime
```

**Design Pattern**: Container/Presentational
- `SignagePlayer`: Smart component, handles data & WebSocket
- Child components: Dumb, receive props only

---

## 🚀 Deployment Architecture

### Development (Current)

```
┌─────────────────────────────────────┐
│  Local Machine (localhost)          │
│                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────┐│
│  │ Backend │  │ Admin   │  │Player││
│  │ :3001   │  │ :3000   │  │:3002 ││
│  └────┬────┘  └────┬────┘  └──┬──┘│
│       │            │           │   │
│       └────────────┴───────────┘   │
│                SQLite               │
└─────────────────────────────────────┘
```

### Production (Recommended)

```
┌──────────────────────────────────────────┐
│         Load Balancer / Nginx            │
│         (HTTPS, Reverse Proxy)           │
└─────┬────────────────────────────────┬───┘
      │                                │
      ▼                                ▼
┌──────────────┐              ┌──────────────┐
│  Backend API │              │   Frontend   │
│  (PM2 × 2)   │              │   (Static)   │
│  Port: 3001  │              │              │
└──────┬───────┘              └──────────────┘
       │
       ▼
┌──────────────────┐
│   PostgreSQL     │
│   (Master/Slave) │
└──────────────────┘
```

### Scaling Considerations

**Horizontal Scaling:**
- Multiple backend instances with PM2 cluster
- Nginx load balancer
- Redis for WebSocket sync (Socket.io adapter)

**Database Scaling:**
- PostgreSQL master-slave replication
- Connection pooling (Prisma default)
- Read replicas for heavy queries

**Media Storage:**
- Local disk (current)
- Network storage (NFS/Samba)
- Cloud storage (S3, GCS)

---

## 🔐 Security Architecture

### Current Security Layers

1. **Input Validation**
   - File type checking (Multer)
   - JSON parsing (NestJS built-in)
   - TypeScript type safety

2. **CORS**
   - Allow specific origins (configurable)
   - Credentials support

3. **Environment Variables**
   - `.env` for sensitive config
   - Not committed to git

### Recommended Additions (Production)

1. **Authentication**
   - JWT tokens
   - Session management
   - Role-based access (Admin, Operator, Viewer)

2. **Authorization**
   - Guards on endpoints
   - Client-specific access control
   - API key for Player

3. **Rate Limiting**
   - Throttle requests (NestJS Throttler)
   - DDoS protection

4. **File Upload Security**
   - Max file size limit
   - Virus scanning
   - Content-type validation

5. **HTTPS**
   - SSL/TLS encryption
   - Let's Encrypt certificates

---

## 📈 Performance Optimization

### Backend

- **Database Indexing**: 
  - Primary keys auto-indexed
  - Unique constraints indexed
  - Consider index on `clientId` if many clients

- **Query Optimization**:
  - Prisma `include` only needed relations
  - Avoid N+1 queries

- **Caching** (Future):
  - Redis for frequent queries
  - Cache config per client

### Frontend

- **Code Splitting**:
  - Next.js automatic code splitting
  - Vite dynamic imports

- **Asset Optimization**:
  - Image compression
  - Video encoding (H.264)
  - Lazy loading

- **WebSocket**:
  - Connection pooling
  - Event debouncing for rapid calls

---

## 🧪 Testing Strategy

### Unit Tests
- **Backend**: NestJS testing utilities, Jest
- **Frontend**: React Testing Library, Vitest

### Integration Tests
- **API**: Supertest, Postman collections
- **WebSocket**: Socket.io-client test script

### E2E Tests
- **Player**: Playwright, Cypress
- **Admin**: Playwright

### Manual Testing
- **UI/UX**: Browser testing, responsive check
- **TTS**: Audio validation
- **Real devices**: Test on actual TV/monitor

---

## 🔮 Future Architecture Enhancements

### Phase 1: Multi-tenancy
- JWT authentication
- Role-based access control
- Tenant isolation

### Phase 2: Microservices
- Separate media service
- Queue service
- WebSocket service (with Redis)

### Phase 3: Cloud Native
- Docker containers
- Kubernetes orchestration
- CI/CD pipeline
- Cloud storage (S3)

### Phase 4: Advanced Features
- Video transcoding service
- Analytics service
- Notification service (email, SMS)
- Mobile app (React Native)

---

## 📚 Design Patterns Used

1. **Module Pattern** (NestJS): Organize code by feature
2. **Repository Pattern** (Prisma): Abstract database access
3. **Observer Pattern** (WebSocket): Event-driven communication
4. **Component Pattern** (React): Reusable UI components
5. **Container/Presentational**: Smart vs dumb components
6. **Dependency Injection** (NestJS): Loose coupling, testability

---

## 🎯 Architectural Decisions Log

### ADR-001: WebSocket vs Polling
**Decision**: WebSocket (Socket.io)
**Reason**: Real-time requirement, lower latency, less overhead
**Trade-off**: More complex than polling, requires persistent connection

### ADR-002: SQLite vs PostgreSQL
**Decision**: SQLite for dev, PostgreSQL for prod
**Reason**: Easy setup for dev, scalability for prod
**Trade-off**: Need to test both databases

### ADR-003: Monorepo vs Separate Repos
**Decision**: Monorepo (3 folders)
**Reason**: Easier development, shared types, single deploy
**Trade-off**: Larger repo size, need good structure

### ADR-004: Next.js vs Create React App (Admin)
**Decision**: Next.js
**Reason**: Better DX, SSR option, API routes (future), built-in routing
**Trade-off**: Larger bundle, learning curve

### ADR-005: Vite vs CRA (Player)
**Decision**: Vite
**Reason**: Fast dev server, smaller bundle, modern tooling
**Trade-off**: Less ecosystem support than Webpack

---

**📝 Note:** Arsitektur ini dirancang untuk balance antara simplicity dan scalability. Untuk production, pertimbangkan enhancements di atas sesuai kebutuhan.
