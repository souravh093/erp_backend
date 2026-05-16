# ERP System Architecture

This document provides a comprehensive overview of the system architecture for both backend and frontend components of the ERP (Enterprise Resource Planning) system.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Data Flow](#data-flow)
6. [Technology Stack](#technology-stack)
7. [Core Modules](#core-modules)
8. [Database Design](#database-design)
9. [API Conventions](#api-conventions)
10. [Security Architecture](#security-architecture)

---

## System Overview

This is a **multi-tenant ERP system** designed to manage business operations across multiple companies and branches. It supports various business types (Shop, Restaurant, Pharmacy, Hotel, Clinic, Gym, Salon, Warehouse, Factory, Office) with integrated functionality for:

- **Authentication & Authorization** (Role-based access control)
- **Company & Branch Management** (Multi-branch support)
- **Product & Inventory Management** (SKU, Barcode, Stock tracking)
- **Purchase Management** (PO, Supplier management)
- **Sales Management** (POS, Invoices, Customers)
- **Accounting** (General Ledger, Journal entries)
- **Tax & VAT Management** (Tax rate configurations, VAT transactions)
- **Payment Processing** (Multiple payment methods)

---

## Architecture Layers

The system follows a **three-tier architecture**:

```
┌─────────────────────────────────────┐
│      Frontend (Client Layer)         │
│  (React/Vue + TypeScript + Tailwind) │
└────────────────┬────────────────────┘
                 │ (REST/HTTP)
┌────────────────▼────────────────────┐
│    Backend (API Layer)               │
│  (Express.js + TypeScript + Zod)     │
├─────────────────────────────────────┤
│    Business Logic & Services         │
├─────────────────────────────────────┤
│    Data Access Layer (Prisma ORM)    │
└────────────────┬────────────────────┘
                 │ (SQL)
┌────────────────▼────────────────────┐
│   Database (Persistence Layer)       │
│      (PostgreSQL)                    │
└─────────────────────────────────────┘
```

---

## Backend Architecture

### 1. Technology Stack

- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Email**: Nodemailer
- **Image Processing**: Sharp
- **Runtime**: Node.js with tsx for development

### 2. Project Structure

```
src/
├── app.ts                          # Main application entry point
├── app/
│   ├── builders/                   # Query builders (PrismaQueryBuilder)
│   ├── configs/                    # Configuration management
│   ├── constant/                   # Constants (roles, accepted types)
│   ├── errors/                     # Custom error classes & handlers
│   │   ├── AppError.ts             # Custom error class
│   │   ├── handlePrismaError.ts    # Prisma error handling
│   │   └── handleZodError.ts       # Validation error handling
│   ├── middlewares/                # Express middlewares
│   │   ├── authorization.ts        # JWT & permission validation
│   │   ├── validation.ts           # Request body validation
│   │   ├── globalErrorHandler.ts   # Error handling middleware
│   │   ├── multer.ts               # File upload configuration
│   │   └── parseFormData.ts        # Form data parsing
│   ├── modules/                    # Business modules (empty in current structure)
│   │   └── [module]/               # Each module follows pattern:
│   │       ├── [module].routes.ts
│   │       ├── [module].controller.ts
│   │       ├── [module].service.ts
│   │       ├── [module].validation.ts
│   │       └── [module].interface.ts
│   ├── routes/                     # Route aggregator
│   │   └── index.ts                # Combines all module routes
│   ├── types/                      # TypeScript type definitions
│   │   ├── errors.type.ts
│   │   ├── moduleRoute.type.ts
│   │   ├── roleData.type.ts
│   │   └── index.d.ts              # Global types
│   └── utils/                      # Utility functions
│       ├── catchAsync.ts           # Async error wrapper
│       ├── deleteFile.ts           # File deletion utility
│       ├── email.ts                # Email sending utility
│       ├── generateOTP.ts          # OTP generation
│       ├── generateToken.ts        # JWT token generation
│       └── ...
├── db/
│   ├── db.config.ts                # Database connection config
│   └── seedData.ts                 # Database seeding
└── public/                         # Static files (HTML, CSS)
    ├── index.html
    └── styles.css

prisma/
├── schema.prisma                   # Database schema
└── migrations/                     # Database migrations
    └── [timestamp]_[migration_name]/
        └── migration.sql
```

### 3. Request/Response Flow

```
Client Request
    │
    ▼
┌─────────────────────────────┐
│  Express Middleware Stack   │
│  - CORS, JSON parsing       │
│  - Request logging          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Route Handler              │
│  - Maps to module routes    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Authorization Middleware   │
│  - JWT validation           │
│  - Permission check         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Validation Middleware      │
│  - Zod schema validation    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Controller                 │
│  - Request handling         │
│  - Service invocation       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Service Layer              │
│  - Business logic           │
│  - Data manipulation        │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Prisma ORM                 │
│  - Query generation         │
│  - Database operations      │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  PostgreSQL Database        │
│  - Data persistence         │
└──────────┬──────────────────┘
           │
           ▼
Response sent to Client
```

### 4. Module Structure Pattern

Each business module should follow this standardized structure:

```
modules/
└── sales/
    ├── sales.routes.ts         # Route definitions
    ├── sales.controller.ts      # Request handlers
    ├── sales.service.ts         # Business logic
    ├── sales.validation.ts      # Zod schemas
    └── sales.interface.ts       # TypeScript interfaces
```

**Example: Sales Module**

- **Routes**: Define endpoints for CRUD operations
- **Controller**: Handle HTTP requests, validate inputs, call services
- **Service**: Core business logic, database queries via Prisma
- **Validation**: Zod schemas for request body/query validation
- **Interface**: TypeScript types and interfaces

### 5. Error Handling

```
Custom Error Flow:
AppError (extends Error)
    ├── statusCode
    ├── message
    └── isOperational (true for known errors)
         │
         ▼
   Global Error Handler Middleware
         │
    ┌────┴────┐
    ▼         ▼
Prisma     Zod
Errors     Validation Errors
    │         │
    └────┬────┘
         ▼
    HTTP Response (JSON)
```

### 6. Authentication & Authorization

**JWT-based Authentication**

```
Login Flow:
1. User provides email/password
2. Password verified via bcryptjs
3. JWT token generated
4. Token sent to client

Authorization Flow:
1. Client sends JWT in Authorization header
2. Middleware validates token
3. User info extracted from token
4. Permission check based on User Role
5. Grant/Deny access to resource
```

---

## Frontend Architecture

### 1. Recommended Technology Stack

- **Framework**: React 18+ or Vue 3 (TypeScript recommended)
- **State Management**: Redux Toolkit / Zustand or Pinia
- **Styling**: Tailwind CSS + component library (shadcn/ui, Ant Design)
- **HTTP Client**: Axios or Fetch API with custom interceptors
- **Form Handling**: React Hook Form or Vee Validate
- **Validation**: Zod (same as backend)
- **Build Tool**: Vite or Create React App
- **Testing**: Jest + React Testing Library / Vitest
- **Development**: ES Modules

### 2. Recommended Project Structure

```
frontend/
├── src/
│   ├── main.tsx/main.jsx           # Entry point
│   ├── App.tsx                      # Root component
│   ├── components/                  # Reusable components
│   │   ├── common/                  # Shared UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Loading.tsx
│   │   └── modules/                 # Module-specific components
│   │       ├── sales/
│   │       ├── purchase/
│   │       └── inventory/
│   ├── pages/                       # Page components
│   │   ├── Dashboard.tsx
│   │   ├── Sales/
│   │   ├── Purchase/
│   │   ├── Inventory/
│   │   └── NotFound.tsx
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   └── useForm.ts
│   ├── services/                    # API services
│   │   ├── api.ts                   # Axios configuration
│   │   ├── authService.ts
│   │   ├── salesService.ts
│   │   ├── purchaseService.ts
│   │   └── inventoryService.ts
│   ├── store/                       # State management
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── store.ts
│   ├── types/                       # TypeScript types
│   │   ├── api.types.ts
│   │   ├── user.types.ts
│   │   ├── sales.types.ts
│   │   └── common.types.ts
│   ├── utils/                       # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/                      # Global styles
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── tailwind.config.js
│   ├── middleware/                  # Route middleware
│   │   ├── ProtectedRoute.tsx
│   │   └── authMiddleware.ts
│   ├── config/                      # Configuration
│   │   ├── api.config.ts
│   │   └── env.config.ts
│   └── router/                      # Routing
│       ├── routes.tsx
│       └── Router.tsx
├── public/
├── index.html
├── vite.config.ts / webpack.config.js
├── tsconfig.json
├── package.json
└── .env.example
```

### 3. Frontend Data Flow (Redux/Zustand)

```
User Interaction
    │
    ▼
Component Event
    │
    ▼
Action Dispatch
    │
    ▼
Reducer Updates State
    │
    ▼
Component Re-renders
    │
    ▼
API Service Call
    │
    ▼
Backend API
    │
    ▼
Response Handler
    │
    ▼
State Update
    │
    ▼
UI Update
```

### 4. Key Frontend Modules

#### Authentication Module

```
- Login/Register pages
- JWT token management
- Session persistence
- Role-based UI rendering
- Protected routes
```

#### Dashboard Module

```
- Analytics & KPIs
- Recent activities
- Quick actions
- Charts & graphs
```

#### Sales Module

```
- POS Interface
- Invoice generation
- Payment tracking
- Customer management
- Sales reports
```

#### Purchase Module

```
- Purchase orders
- Supplier management
- Invoice tracking
- Payment management
```

#### Inventory Module

```
- Product catalog
- Stock tracking
- Stock movements
- Categories & subcategories
```

#### Accounting Module

```
- General ledger
- Journal entries
- Chart of accounts
- Financial reports
```

---

## Data Flow

### End-to-End Data Flow (Complete Example: Creating Sales Invoice)

```
FRONTEND                          BACKEND                        DATABASE
    │                                │                              │
    │  1. User fills invoice form     │                              │
    ├─ Form validation (Zod)         │                              │
    │                                │                              │
    │  2. POST /api/v1/sales-invoices│                              │
    │  (with auth token)              │                              │
    ├───────────────────────────────►│                              │
    │                                │                              │
    │                                │  3. Middleware chain:        │
    │                                │  - JWT validation           │
    │                                │  - Permission check         │
    │                                │  - Body validation (Zod)    │
    │                                │                              │
    │                                │  4. Controller processes    │
    │                                │  5. Service layer:          │
    │                                │  - Calculate totals         │
    │                                │  - Check stock              │
    │                                │  - Validate references      │
    │                                │                              │
    │                                │  6. Prisma ORM query:       │
    │                                ├─────────────────────────────►│
    │                                │  - Create invoice           │
    │                                │  - Create line items        │
    │                                │  - Update stock             │
    │                                │  - Create VAT transactions  │
    │                                │  (within transaction)        │
    │                                │                              │
    │                                │◄─────────────────────────────┤
    │                                │  Data persisted             │
    │                                │                              │
    │  7. 201 Created + invoice data  │                              │
    │◄───────────────────────────────┤                              │
    │                                │                              │
    │  8. Update UI                   │                              │
    │  - Show success message         │                              │
    │  - Update state                 │                              │
    │  - Redirect or refresh list     │                              │
```

---

## Technology Stack

### Backend

| Component        | Technology | Version    |
| ---------------- | ---------- | ---------- |
| Runtime          | Node.js    | Latest LTS |
| Framework        | Express.js | ^5.1.0     |
| Language         | TypeScript | ^5.8.3     |
| ORM              | Prisma     | ^7.2.0     |
| Database Driver  | pg         | ^8.16.3    |
| Authentication   | JWT        | ^9.0.2     |
| Password Hashing | bcryptjs   | ^3.0.2     |
| Validation       | Zod        | ^3.25.30   |
| File Upload      | Multer     | ^2.0.2     |
| Email            | Nodemailer | ^7.0.10    |
| Image Processing | Sharp      | ^0.34.4    |
| CORS             | cors       | ^2.8.5     |
| Env Management   | dotenv     | ^16.6.1    |

### Frontend (Recommended)

| Component        | Technology                     | Purpose                 |
| ---------------- | ------------------------------ | ----------------------- |
| Framework        | React 18+ / Vue 3              | UI rendering            |
| Language         | TypeScript                     | Type safety             |
| Styling          | Tailwind CSS                   | Utility-first CSS       |
| HTTP Client      | Axios                          | API requests            |
| State Management | Redux Toolkit / Zustand        | Global state            |
| Form Handling    | React Hook Form                | Form validation         |
| Validation       | Zod                            | Runtime type validation |
| Build Tool       | Vite                           | Fast bundling           |
| Testing          | Vitest + React Testing Library | Testing                 |

---

## Core Modules

### 1. Authentication Module

**Entities**: User, Role, Permission, UserRole, RolePermission
**Features**:

- User registration and login
- JWT token generation
- Role-based access control (RBAC)
- Permission management

### 2. Company & Branch Management

**Entities**: Company, Branch, UserBranch
**Features**:

- Multi-company support
- Multi-branch support per company
- Company details (business type, licensing)
- Branch assignment for users

### 3. Product & Inventory Management

**Entities**: Product, Category, SubCategory, Unit, Stock, StockMovement, ProductPricing
**Features**:

- Product catalog with SKU/Barcode
- Product categories and subcategories
- Dynamic pricing with VAT rates
- Stock tracking per branch
- Stock movement history
- Inventory adjustments

### 4. Purchase Management

**Entities**: Supplier, PurchaseOrder, PurchaseOrderItem, PurchaseInvoice, PurchaseInvoiceItem
**Features**:

- Purchase order management
- Supplier management
- Purchase invoice generation
- Payment tracking
- Batch and expiry tracking
- VAT calculation

### 5. Sales Management (POS)

**Entities**: Customer, SalesOrder, SalesInvoice, SalesInvoiceItem
**Features**:

- Point of Sale (POS) interface
- Sales order types (Counter, Table, Delivery, Takeaway)
- Invoice generation
- Customer management
- Discount management
- Payment tracking

### 6. Accounting Module

**Entities**: Account, JournalEntry, JournalLine
**Features**:

- Chart of accounts
- Journal entry recording
- Debit/Credit operations
- Double-entry bookkeeping

### 7. Tax & VAT Management

**Entities**: TaxRate, VatTransaction
**Features**:

- Tax rate configuration
- VAT transaction tracking
- Tax application to products/services/categories
- Tax reports

### 8. Payment Module

**Entities**: Payment
**Features**:

- Multiple payment methods (Cash, Bank Transfer, Cheque, Mobile Payment)
- Payment tracking
- Payment reference management

---

## Database Design

### Database Architecture

```
PostgreSQL Database
├── Authentication & Access Control
│   ├── users
│   ├── roles
│   ├── permissions
│   ├── user_roles
│   └── role_permissions
├── Company & Branch
│   ├── companies
│   ├── branches
│   └── user_branches
├── Inventory
│   ├── categories
│   ├── sub_categories
│   ├── products
│   ├── units
│   ├── stocks
│   ├── stock_movements
│   └── product_pricing
├── Purchase
│   ├── suppliers
│   ├── purchase_orders
│   ├── purchase_order_items
│   ├── purchase_invoices
│   └── purchase_invoice_items
├── Sales
│   ├── customers
│   ├── sales_orders
│   ├── sales_invoices
│   └── sales_invoice_items
├── Accounting
│   ├── accounts
│   ├── journal_entries
│   └── journal_lines
├── Tax & VAT
│   ├── tax_rates
│   └── vat_transactions
└── Payments
    └── payments
```

### Key Relationships

**Cascade Delete**: Most relations use `onDelete: Cascade` to maintain data integrity:

- User → UserRole → Role (orphaned roles deleted)
- Company → Branch (orphaned branches deleted)
- Branch → Stock (orphaned stocks deleted)
- etc.

**Unique Constraints**:

- Email must be unique per user
- Company name + business type uniqueness
- Product SKU/Barcode uniqueness
- Invoice number uniqueness

### Enum Types

**Business Types**: SHOP, RESTAURANT, PHARMACY, HOTEL, CLINIC, GYM, SALON, WAREHOUSE, FACTORY, OFFICE

**Currencies**: USD, EUR, INR, BDT

**Order Status**: PENDING, SERVED, COMPLETED, CANCELLED, PARTIAL

**Payment Status**: UNPAID, PARTIAL, PAID

**Payment Methods**: CASH, BANK_TRANSFER, CHEQUE, MOBILE_PAYMENT

---

## API Conventions

### Base URL

```
http://localhost:3000/api/v1
```

### Response Format

**Success Response (2xx)**

```json
{
  "success": true,
  "data": {
    /* actual data */
  },
  "message": "Operation successful"
}
```

**Error Response (4xx, 5xx)**

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": {
      /* validation errors */
    }
  }
}
```

### HTTP Methods

| Method | Purpose                |
| ------ | ---------------------- |
| GET    | Retrieve data          |
| POST   | Create new resource    |
| PUT    | Update entire resource |
| PATCH  | Partial update         |
| DELETE | Delete resource        |

### Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 500  | Internal Server Error |

### Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

### Pagination (Recommended)

```
GET /api/v1/resource?page=1&limit=20&sort=-createdAt
```

Response:

```json
{
  "data": [
    /* items */
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Security Architecture

### 1. Authentication Layer

```
┌─────────────────┐
│  User Login     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│  Validate Credentials       │
│  - Email exists?            │
│  - Password correct?        │
│  (bcryptjs comparison)      │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Generate JWT Token         │
│  - User ID                  │
│  - Roles                    │
│  - Permissions              │
│  - Expiration (1h/7d)       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Return Token to Client     │
│  - Store in localStorage    │
│  - OR Secure HttpOnly cookie│
└─────────────────────────────┘
```

### 2. Authorization Layer

```
Request with JWT
    │
    ▼
┌─────────────────────────────┐
│  Verify JWT Signature       │
│  - Valid secret?            │
│  - Not expired?             │
└────────┬────────────────────┘
         │ (Valid)
         ▼
┌─────────────────────────────┐
│  Extract User Info          │
│  - User ID                  │
│  - Roles                    │
│  - Permissions              │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Check Route Permissions    │
│  - User has required role?  │
│  - User has permission?     │
└────────┬────────────────────┘
         │ (Authorized)
         ▼
┌─────────────────────────────┐
│  Allow Request to Proceed   │
└─────────────────────────────┘
```

### 3. Security Best Practices

**Backend**

- [ ] Validate all inputs (Zod schemas)
- [ ] Hash passwords (bcryptjs)
- [ ] Use JWT with short expiration
- [ ] Implement refresh tokens
- [ ] Rate limiting on auth endpoints
- [ ] CORS configuration
- [ ] Input sanitization
- [ ] SQL injection prevention (via Prisma ORM)
- [ ] HTTPS in production
- [ ] Environment variables for secrets

**Frontend**

- [ ] Secure token storage (HttpOnly cookies preferred)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF tokens for state-changing operations
- [ ] Content Security Policy (CSP)
- [ ] Sanitize user inputs
- [ ] Validate on client before sending
- [ ] Secure API communication (HTTPS)
- [ ] Handle sensitive data carefully

### 4. Role-Based Access Control (RBAC)

```
User
  ├── Role 1 (Admin)
  │   ├── Permission: user.create
  │   ├── Permission: user.read
  │   ├── Permission: user.update
  │   └── Permission: user.delete
  ├── Role 2 (Manager)
  │   ├── Permission: sales.create
  │   ├── Permission: sales.read
  │   ├── Permission: report.read
  │   └── Permission: inventory.update
  └── Role 3 (Cashier)
      ├── Permission: sales.create
      ├── Permission: sales.read
      └── Permission: payment.create
```

---

## Development Workflow

### 1. Backend Development

**Setup**

```bash
npm install
npx prisma migrate dev --name initial
npm run start:dev
```

**Adding a New Module**

1. Create folder in `src/app/modules/{module-name}`
2. Create files: routes, controller, service, validation, interface
3. Implement business logic in service
4. Add validation schemas
5. Add route handlers in controller
6. Register routes in `src/app/routes/index.ts`

**Database Changes**

```bash
# Update schema.prisma
npx prisma migrate dev --name {migration-name}
# This creates migration and updates generated types
```

### 2. Frontend Development

**Setup** (Recommended)

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm run dev
```

**Adding a New Page**

1. Create component in `pages/{module-name}/`
2. Create service in `services/{module-name}Service.ts`
3. Create types in `types/{module-name}.types.ts`
4. Add route in router configuration
5. Connect to state management
6. Implement API calls

---

## Deployment Considerations

### Backend Deployment

- Build: `npm run build`
- Start: `npm run start:prod` or Docker container
- Environment: .env file with sensitive values
- Database: Managed PostgreSQL
- Node version: LTS

### Frontend Deployment

- Build: `npm run build`
- Output: `/dist` folder
- Host: Static hosting (Vercel, Netlify, S3)
- Environment: .env variables at build time
- Cache: Static file caching strategies

### DevOps

- Containerization: Docker + Docker Compose
- CI/CD: GitHub Actions / GitLab CI
- Monitoring: Application performance monitoring
- Logging: Centralized logging
- Database backups: Regular automated backups

---

## Performance Optimization

### Backend

- Database indexing on frequently queried columns
- Query optimization (avoid N+1 queries)
- Caching with Redis
- Pagination for large datasets
- Compression (gzip)
- Connection pooling

### Frontend

- Code splitting and lazy loading
- Image optimization
- State management optimization
- Memoization for expensive computations
- Virtual scrolling for long lists
- Service workers for offline support

---

## Monitoring & Logging

### Backend Logging

```typescript
// Example
console.log(`${req.method} ${req.url}`); // Basic logging
// Recommended: Winston, Pino for production logging
```

### Frontend Monitoring

- Error tracking (Sentry)
- Performance monitoring (Google Analytics, Datadog)
- User session tracking

---

## References & Documentation

- Prisma ORM: https://www.prisma.io/docs
- Express.js: https://expressjs.com/
- TypeScript: https://www.typescriptlang.org/docs
- PostgreSQL: https://www.postgresql.org/docs
- JWT: https://jwt.io/
- React: https://react.dev
- Vue.js: https://vuejs.org

---

**Last Updated**: May 16, 2026
**Version**: 1.0.0
**Maintained By**: Development Team
