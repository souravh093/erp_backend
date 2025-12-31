# Environment Setup Guide

## 📋 Prerequisites

### Required Software

- **Node.js**: v18.x or higher
- **PostgreSQL**: v14.x or higher
- **npm** or **yarn** or **bun**: Package manager
- **Git**: Version control

---

## 🔧 Local Development Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd erp-backend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
```

### 3. Environment Variables

Create `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/erp_db?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=24h

# Email (for OTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# CORS
CORS_ORIGIN=http://localhost:3000

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880

# Optional: For production
DATABASE_URL_PROD="postgresql://user:pass@host:5432/prod_db"
```

### 4. Database Setup

**Create Database:**

```bash
# Using PostgreSQL CLI
createdb erp_db

# Or using psql
psql -U postgres
CREATE DATABASE erp_db;
\q
```

**Run Migrations:**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Optional: Seed initial data
npm run seed
```

### 5. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

---

## 🌐 Environment Types

### Development

- Local development environment
- Debug mode enabled
- Hot reload
- Detailed error messages
- Test data allowed

```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://localhost:5432/erp_dev"
```

### Staging

- Pre-production testing
- Production-like configuration
- Limited debug info
- Test with production data structure

```env
NODE_ENV=staging
PORT=5000
DATABASE_URL="postgresql://staging-host:5432/erp_staging"
```

### Production

- Live environment
- Optimized performance
- Error logging only
- Security hardened
- No test data

```env
NODE_ENV=production
PORT=80
DATABASE_URL="postgresql://prod-host:5432/erp_prod"
```

---

## 🔐 Security Configuration

### JWT Secret

Generate a secure secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Password Hashing

Configured in code with bcrypt:

```typescript
const saltRounds = 10;
```

### CORS Configuration

```typescript
// In app.ts
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  }),
);
```

---

## 📦 Database Management

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create new migration
npx prisma migrate dev --name description

# Apply migrations
npx prisma migrate deploy

# Reset database (DEV ONLY!)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Backup Database

```bash
# Backup
pg_dump -U username -d erp_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U username -d erp_db < backup_20251231.sql
```

---

## 🧪 Testing Setup

### Install Test Dependencies

```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

### Test Environment

Create `.env.test`:

```env
DATABASE_URL="postgresql://localhost:5432/erp_test"
NODE_ENV=test
JWT_SECRET=test-secret-key
```

### Run Tests

```bash
npm test
```

---

## 📝 Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "seed": "ts-node prisma/seed.ts",
    "test": "jest"
  }
}
```

---

## 🔍 Troubleshooting

### Common Issues

**Port Already in Use:**

```bash
# Find process using port
lsof -i :5000
# Kill process
kill -9 <PID>
```

**Database Connection Failed:**

- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check database exists
- Verify credentials

**Prisma Generate Fails:**

```bash
# Clear Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
```

**Migration Errors:**

```bash
# Check migration status
npx prisma migrate status

# Resolve migration issues
npx prisma migrate resolve --applied <migration-name>
```

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated:** December 31, 2025
