# Infrastructure & Deployment

## 🏗️ Architecture Overview

```
Client (Browser/Mobile)
        ↓
    Load Balancer
        ↓
    Application Servers (Node.js)
        ↓
    Database (PostgreSQL)
        ↓
    Backup Storage
```

---

## 🖥️ Server Requirements

### Minimum Specifications

- **CPU**: 2 cores
- **RAM**: 4 GB
- **Storage**: 50 GB SSD
- **OS**: Ubuntu 20.04 LTS or higher

### Recommended (Production)

- **CPU**: 4+ cores
- **RAM**: 8+ GB
- **Storage**: 100+ GB SSD
- **OS**: Ubuntu 22.04 LTS

---

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '5000:5000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/erp
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=erp
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy with Docker

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## 🌐 Traditional Server Deployment

### 1. Server Setup (Ubuntu)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 2. Database Setup

```bash
# Create database user
sudo -u postgres psql
CREATE USER erp_user WITH PASSWORD 'secure_password';
CREATE DATABASE erp_db OWNER erp_user;
GRANT ALL PRIVILEGES ON DATABASE erp_db TO erp_user;
\q
```

### 3. Application Deployment

```bash
# Clone repository
git clone <repo-url> /var/www/erp-backend
cd /var/www/erp-backend

# Install dependencies
npm ci --only=production

# Setup environment
cp .env.example .env
nano .env

# Build application
npm run build

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Start with PM2
pm2 start dist/app.js --name erp-backend
pm2 save
pm2 startup
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to server
        run: |
          scp -r dist/ user@server:/var/www/erp-backend/
          ssh user@server 'cd /var/www/erp-backend && pm2 restart erp-backend'
```

---

## 🔒 Security Hardening

### Firewall Setup

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 💾 Backup Strategy

### Database Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/database"
DB_NAME="erp_db"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U erp_user $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

### Automated Backups (Cron)

```bash
# Edit crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## 📊 Monitoring

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Check status
pm2 status
```

### Application Logs

```typescript
// In app.ts - Add logging middleware
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

---

## 🚀 Scaling Strategies

### Horizontal Scaling

- Multiple application instances behind load balancer
- Session storage in Redis
- Database read replicas

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Add database indexes

### Database Optimization

```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_invoices_date ON sales_invoices(invoice_date);
CREATE INDEX idx_stock_branch ON stocks(branchId);
```

---

## 📚 Related Documentation

- [Environment Setup](./environment-setup.md)
- [Architecture Overview](../architecture/system-overview.md)

---

**Last Updated:** December 31, 2025
