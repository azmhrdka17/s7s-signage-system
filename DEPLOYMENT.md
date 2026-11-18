# 🚀 Deployment Guide - S7S Digital Signage System

Panduan lengkap untuk deploy sistem ke production.

---

## 📋 Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL 14+ (untuk production)
- Nginx atau Apache (sebagai reverse proxy)
- SSL Certificate (untuk HTTPS)
- Domain atau IP Public

---

## 🗄️ Database Migration (SQLite → PostgreSQL)

### 1. Install PostgreSQL

**Windows:**
Download dari https://www.postgresql.org/download/windows/

**Linux:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 2. Create Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE s7s_signage;
CREATE USER s7s_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE s7s_signage TO s7s_user;
\q
```

### 3. Update Prisma Schema

Edit `backend/prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Ganti dari "sqlite"
  url      = env("DATABASE_URL")
}
```

### 4. Update .env

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://s7s_user:your_strong_password@localhost:5432/s7s_signage"
PORT=3001
NODE_ENV=production
```

### 5. Run Migration

```bash
cd backend
npx prisma migrate deploy
npx prisma generate
npm run prisma:seed
```

---

## 🏗️ Build for Production

### Backend

```bash
cd backend
npm install --production
npm run build
```

Output: `dist/` folder

### Frontend Admin

```bash
cd frontend-admin
npm install
npm run build
```

Output: `.next/` folder

### Web Player

```bash
cd web-player
npm install
npm run build
```

Output: `dist/` folder

---

## 🔧 Environment Configuration

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://s7s_user:password@localhost:5432/s7s_signage"

# Server
PORT=3001
NODE_ENV=production

# CORS (ganti dengan domain production)
ALLOWED_ORIGINS="https://yourdomain.com,https://player.yourdomain.com"

# Upload limit
MAX_FILE_SIZE=52428800  # 50MB in bytes
```

### Frontend Admin (.env.local)

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Web Player (.env)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_CLIENT_ID=PRAMITHA
```

---

## 🌐 Nginx Configuration

### Backend API Proxy

File: `/etc/nginx/sites-available/s7s-api`

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Certificate
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Backend API
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /socket.io/ {
        proxy_pass http://localhost:3001/socket.io/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files (uploads)
    location /resources {
        alias /var/www/s7s/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Frontend Admin

File: `/etc/nginx/sites-available/s7s-admin`

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/admin.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Web Player

File: `/etc/nginx/sites-available/s7s-player`

```nginx
server {
    listen 80;
    server_name player.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name player.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/player.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/player.yourdomain.com/privkey.pem;

    root /var/www/s7s/web-player/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/s7s-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/s7s-admin /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/s7s-player /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d admin.yourdomain.com
sudo certbot --nginx -d player.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🔄 Process Management (PM2)

### Install PM2

```bash
npm install -g pm2
```

### Backend

```bash
cd backend
pm2 start dist/main.js --name s7s-backend
pm2 save
pm2 startup
```

### Frontend Admin

```bash
cd frontend-admin
pm2 start npm --name s7s-admin -- start
pm2 save
```

### PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 's7s-backend',
      cwd: './backend',
      script: 'dist/main.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 's7s-admin',
      cwd: './frontend-admin',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      instances: 1,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
```

Run:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 📊 Monitoring & Logs

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs

# Monitor CPU & Memory
pm2 monit
```

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/access.log

# Error logs
tail -f /var/log/nginx/error.log
```

### Application Logs

```bash
# Backend logs
pm2 logs s7s-backend

# Admin logs
pm2 logs s7s-admin
```

---

## 🔒 Security Hardening

### 1. Update CORS in Backend

Edit `backend/src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://admin.yourdomain.com',
    'https://player.yourdomain.com',
  ],
  credentials: true,
});
```

### 2. Add Rate Limiting

Install:
```bash
npm install @nestjs/throttler
```

Edit `backend/src/app.module.ts`:

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    // ... other modules
  ],
})
```

### 3. Helmet for Security Headers

Install:
```bash
npm install helmet
```

Edit `backend/src/main.ts`:

```typescript
import helmet from 'helmet';

app.use(helmet());
```

### 4. File Upload Validation

Edit `backend/src/media/media.controller.ts`:

```typescript
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

fileFilter: (req, file, cb) => {
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error('File too large'), false);
  }
  // ... existing validation
}
```

---

## 🧪 Health Checks

### Add Health Endpoint

Install:
```bash
npm install @nestjs/terminus
```

Create `backend/src/health/health.controller.ts`:

```typescript
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, PrismaHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

Test:
```bash
curl https://api.yourdomain.com/health
```

---

## 📦 Backup Strategy

### Database Backup

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U s7s_user s7s_signage > /backups/s7s_db_$DATE.sql
find /backups -name "s7s_db_*.sql" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /usr/local/bin/backup-s7s.sh
```

### Media Files Backup

```bash
# Rsync backup
rsync -avz /var/www/s7s/backend/uploads /backups/uploads_$(date +%Y%m%d)
```

---

## 🚨 Troubleshooting

### Port already in use
```bash
lsof -i :3001
kill -9 <PID>
```

### PM2 not starting
```bash
pm2 delete all
pm2 start ecosystem.config.js
```

### Database connection error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection
psql -U s7s_user -d s7s_signage -h localhost
```

### Nginx 502 Bad Gateway
```bash
# Check backend is running
pm2 status

# Check Nginx error log
tail -f /var/log/nginx/error.log
```

---

## ✅ Deployment Checklist

- [ ] PostgreSQL installed & configured
- [ ] Database migrated & seeded
- [ ] Backend built & tested
- [ ] Frontend built & tested
- [ ] Environment variables set
- [ ] Nginx configured & tested
- [ ] SSL certificates installed
- [ ] PM2 configured & running
- [ ] CORS updated for production domains
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] File upload limits set
- [ ] Health checks working
- [ ] Backup scripts scheduled
- [ ] Monitoring setup
- [ ] Firewall configured
- [ ] DNS records updated

---

## 🌍 Multi-Server Deployment

For high availability:

1. **Load Balancer** (Nginx/HAProxy) → Multiple Backend instances
2. **Database** → PostgreSQL with replication
3. **Media Storage** → Shared NFS or S3-compatible storage
4. **Redis** → For WebSocket scaling (Socket.io adapter)

---

**📞 Support:** Jika ada masalah deployment, check logs terlebih dahulu:
- `pm2 logs`
- `/var/log/nginx/error.log`
- Database logs
