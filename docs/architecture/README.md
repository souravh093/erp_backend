# ERP System Architecture

This document provides a comprehensive overview of the system architecture for both backend and frontend components of the ERP (Enterprise Resource Planning) system.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Data Flow](#data-flow)
6. [User Flows & Business Setup](#user-flows--business-setup)
7. [Business Management by Type](#business-management-by-type)
8. [Manager Dashboard & Controls](#manager-dashboard--controls)
9. [Technology Stack](#technology-stack)
10. [Core Modules](#core-modules)
11. [Database Design](#database-design)
12. [API Conventions](#api-conventions)
13. [Security Architecture](#security-architecture)

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

## User Flows & Business Setup

### 1. Initial System Setup Flow (Admin/Owner)

#### Step 1: User Registration

```
┌─────────────────────────────────────────────────────────┐
│  New User Registration                                  │
├─────────────────────────────────────────────────────────┤
│  1. User visits system landing page                     │
│  2. Click "Register" button                             │
│  3. Fill registration form:                             │
│     - Full Name                                         │
│     - Email                                             │
│     - Phone                                             │
│     - Password (hashed with bcryptjs)                   │
│  4. Email verification (optional)                       │
│  5. Account created                                     │
│  6. User redirected to login                            │
└─────────────────────────────────────────────────────────┘
```

**Database Operations**:

```
INSERT INTO users (id, name, email, phone, password, is_Active)
VALUES (uuid(), ?, ?, ?, bcrypt(?), true);
```

#### Step 2: Company Creation

```
┌────────────────────────────────────────────────────────────┐
│  Create First Company                                      │
├────────────────────────────────────────────────────────────┤
│  1. User logs in successfully                             │
│  2. Dashboard prompts: "Create your first company"        │
│  3. Fill Company Form:                                    │
│     ┌─ Company Name                                       │
│     ├─ Business Type (SELECT):                           │
│     │  ├─ Shop                                            │
│     │  ├─ Restaurant                                      │
│     │  ├─ Pharmacy                                        │
│     │  ├─ Hotel                                           │
│     │  ├─ Clinic                                          │
│     │  ├─ Gym                                             │
│     │  ├─ Salon                                           │
│     │  ├─ Warehouse                                       │
│     │  ├─ Factory                                         │
│     │  └─ Office                                          │
│     ├─ Trade License Number                              │
│     ├─ VAT Registration Number                           │
│     ├─ Address                                           │
│     ├─ Phone                                             │
│     ├─ Email                                             │
│     └─ Default Currency (USD/EUR/INR/BDT)               │
│  4. Submit & Create                                      │
│  5. Company created successfully                         │
└────────────────────────────────────────────────────────────┘
```

**Database Operations**:

```
INSERT INTO companies
(id, name, business_type, trade_license_number, vat_registration_number,
 address, phone, email, currency_default)
VALUES (uuid(), ?, ?, ?, ?, ?, ?, ?, 'BDT');

-- Assign user to company
INSERT INTO users (id) ... [already created]
```

#### Step 3: Branch Creation

```
┌────────────────────────────────────────────────────────────┐
│  Create Branches                                           │
├────────────────────────────────────────────────────────────┤
│  1. Navigate to Settings > Branches                        │
│  2. Click "Add Branch"                                     │
│  3. Fill Branch Form:                                      │
│     - Branch Name (e.g., "Main Store", "Downtown Branch") │
│     - Address                                             │
│     - Phone                                               │
│     - Email                                               │
│     - Is Active (Yes/No)                                  │
│  4. Submit & Create                                       │
│  5. Branch linked to company                              │
│                                                            │
│  Can Create Multiple Branches:                            │
│  - Headquarters                                           │
│  - Regional Branches                                      │
│  - Sub-branches                                           │
└────────────────────────────────────────────────────────────┘
```

**Database Operations**:

```
INSERT INTO branches (id, name, address, phone, email, is_active, companyId)
VALUES (uuid(), ?, ?, ?, ?, true, ?);
```

#### Step 4: Role & Permission Setup

```
┌────────────────────────────────────────────────────────────┐
│  Configure Roles & Permissions                             │
├────────────────────────────────────────────────────────────┤
│  1. Navigate to Settings > Roles & Permissions            │
│  2. System comes with default roles:                      │
│     ├─ Admin (All permissions)                            │
│     ├─ Manager (Branch/Department management)             │
│     ├─ Supervisor (Team lead)                             │
│     ├─ Staff (Basic operations)                           │
│     └─ Viewer (Read-only access)                          │
│  3. Create Custom Roles (if needed)                        │
│  4. Assign Permissions to Roles:                          │
│     - user.create, user.read, user.update, user.delete   │
│     - product.create, product.read, product.update       │
│     - sales.create, sales.read, sales.update, sales.delete│
│     - purchase.create, purchase.read, etc.                │
│     - report.read, inventory.update, etc.                 │
│  5. Save Configuration                                    │
└────────────────────────────────────────────────────────────┘
```

**Database Operations**:

```
INSERT INTO roles (id, role_name) VALUES (uuid(), 'Manager');

INSERT INTO permissions (id, permission)
VALUES
  (uuid(), 'sales.create'),
  (uuid(), 'sales.read'),
  (uuid(), 'inventory.update');

INSERT INTO role_permissions (id, roleId, permissionId)
VALUES (uuid(), ?, ?);
```

#### Step 5: User Assignment

```
┌────────────────────────────────────────────────────────────┐
│  Assign Users to Roles & Branches                          │
├────────────────────────────────────────────────────────────┤
│  1. Navigate to Settings > Users                           │
│  2. Click "Add User" or invite existing user              │
│  3. Assign User Details:                                  │
│     - Select User                                         │
│     - Select Role(s)                                      │
│     - Select Branch(es)                                   │
│  4. Save Assignment                                        │
│                                                            │
│  Example Assignments:                                     │
│  ├─ John (Admin) → All Branches → All Permissions        │
│  ├─ Sarah (Manager) → Branch 1 → Manager Permissions     │
│  ├─ Mike (Cashier) → Branch 1 → Sales Permissions        │
│  └─ Lisa (Accountant) → All Branches → Accounting        │
└────────────────────────────────────────────────────────────┘
```

**Database Operations**:

```
INSERT INTO user_roles (id, userId, roleId) VALUES (uuid(), ?, ?);
INSERT INTO user_branches (id, userId, branchId) VALUES (uuid(), ?, ?);
```

### 2. Daily Business Operations Flow

#### For Shop/Retail Business

```
MORNING (Opening)
    │
    ▼
┌──────────────────────────────────┐
│  1. Manager/Cashier Login        │
│     - Enter credentials          │
│     - JWT token generated        │
│     - Assigned branch loaded     │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  2. Dashboard View               │
│     - Today's sales target       │
│     - Current stock status       │
│     - Low stock alerts           │
│     - Recent transactions        │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  3. Setup POS Terminal           │
│     - Load product database      │
│     - Initialize payment methods │
│     - Check cash register        │
└──────────┬───────────────────────┘

DURING BUSINESS HOURS
    │
    ├─ SALES TRANSACTION
    │  ├─ Customer arrives
    │  ├─ Cashier creates sales order
    │  ├─ Scan/Select products
    │  ├─ Apply discounts (if authorized)
    │  ├─ Calculate tax & total
    │  ├─ Process payment
    │  ├─ Generate invoice
    │  ├─ Stock updated automatically
    │  └─ Customer receives receipt
    │
    ├─ STOCK CHECK
    │  ├─ Staff checks stock levels
    │  ├─ Low stock items flagged
    │  ├─ Manager notified
    │  └─ Purchase order created if needed
    │
    ├─ CUSTOMER INQUIRIES
    │  ├─ Check product availability
    │  ├─ Check pricing
    │  └─ Process special orders
    │
    └─ REFUNDS/RETURNS
       ├─ Verify purchase
       ├─ Accept item back
       ├─ Process refund/credit
       └─ Stock adjusted

EVENING (Closing)
    │
    ▼
┌──────────────────────────────────┐
│  1. End of Day Reconciliation    │
│     - Total sales count          │
│     - Payment verification       │
│     - Discrepancies noted        │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  2. Generate Daily Report        │
│     - Sales summary              │
│     - Payment breakdown          │
│     - Stock movements            │
│     - Inventory changes          │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  3. Close Register & Logout      │
└──────────────────────────────────┘
```

#### For Restaurant/Cafe Business

```
PRE-OPENING
    │
    ├─ Manager checks reservation list
    ├─ Inventory stock check
    ├─ Staff assignments set
    └─ POS system initialized

SERVICE
    │
    ├─ DINE-IN (Table Order)
    │  ├─ Customer seated
    │  ├─ Waiter creates order (Table-based)
    │  ├─ Kitchen receives order
    │  ├─ Items prepared
    │  ├─ Waiter serves
    │  ├─ Customer pays
    │  └─ Invoice generated
    │
    ├─ TAKEAWAY
    │  ├─ Customer orders
    │  ├─ Payment collected
    │  ├─ Order to kitchen
    │  ├─ Items packed
    │  └─ Customer takes order
    │
    ├─ DELIVERY
    │  ├─ Customer orders (phone/app/online)
    │  ├─ Payment collected/verified
    │  ├─ Delivery details captured
    │  ├─ Kitchen prepares
    │  ├─ Driver assigned
    │  └─ Delivery tracked
    │
    └─ INVENTORY MANAGEMENT
       ├─ Daily ingredient stock check
       ├─ Stock adjustments for waste/loss
       ├─ Supplier orders placed
       └─ Cost tracking

CLOSING
    │
    ├─ Process remaining orders
    ├─ Settle all payments
    ├─ Generate end-of-day report
    ├─ Stock count
    └─ System close
```

#### For Pharmacy Business

```
OPERATIONS
    │
    ├─ PRESCRIPTION SALES
    │  ├─ Customer presents prescription
    │  ├─ Verify prescription validity
    │  ├─ Check for drug interactions
    │  ├─ Stock availability check
    │  ├─ Prepare medicine
    │  ├─ Provide counseling
    │  ├─ Process payment
    │  └─ Generate invoice + receipt
    │
    ├─ OVER-THE-COUNTER SALES
    │  ├─ Customer requests medicine
    │  ├─ Check stock & expiry
    │  ├─ Suggest alternatives if needed
    │  ├─ Create invoice
    │  ├─ Process payment
    │  └─ Hand over medicine
    │
    ├─ INVENTORY MANAGEMENT
    │  ├─ Track expiry dates
    │  ├─ Auto-flag expiring medicines
    │  ├─ Remove expired items
    │  ├─ Batch number tracking
    │  ├─ Stock level monitoring
    │  └─ Reorder points alert
    │
    └─ COMPLIANCE
       ├─ Maintain audit trail
       ├─ Prescription records
       ├─ Tax calculation & reporting
       └─ Regulatory compliance reports
```

#### For Clinic Business

```
OPERATIONS
    │
    ├─ PATIENT REGISTRATION
    │  ├─ New patient intake
    │  ├─ Medical history capture
    │  ├─ Contact info storage
    │  └─ Insurance details (if applicable)
    │
    ├─ APPOINTMENT MANAGEMENT
    │  ├─ Schedule appointments
    │  ├─ Send reminders
    │  ├─ Track doctor availability
    │  └─ Manage cancellations
    │
    ├─ CONSULTATION
    │  ├─ Doctor-patient consultation
    │  ├─ Medical notes recorded
    │  ├─ Prescriptions issued
    │  └─ Follow-up scheduled
    │
    ├─ BILLING
    │  ├─ Consultation charges
    │  ├─ Medicine/Service charges
    │  ├─ Insurance claim processing
    │  └─ Payment collection
    │
    └─ PHARMACY INTEGRATION
       ├─ Prescription linking
       ├─ Medicine inventory
       └─ Pharmacy sales tracking
```

---

## Business Management by Type

### Supported Business Types

#### 1. **Shop** (Retail Store)

**Key Features**:

- SKU/Barcode tracking
- Multiple payment methods
- Inventory management
- Sales analytics

**Manager Controls**:

```
Dashboard View
├─ Daily Sales Summary
│  ├─ Total Revenue
│  ├─ Transaction Count
│  ├─ Top Selling Products
│  └─ Payment Method Breakdown
├─ Inventory Management
│  ├─ Stock Levels
│  ├─ Low Stock Alerts
│  ├─ Stock Movements
│  └─ Reorder Points
├─ Staff Performance
│  ├─ Cashier Performance
│  ├─ Sales by Staff
│  └─ Transaction Details
├─ Customer Analytics
│  ├─ New Customers
│  ├─ Repeat Customers
│  ├─ Customer Segmentation
│  └─ Purchase History
└─ Reports
   ├─ Daily Sales Report
   ├─ Inventory Report
   ├─ Tax/VAT Report
   └─ Payment Report
```

**Critical Workflows**:

```
Sales → Stock Update → VAT Calculation → Payment Processing → Reporting
```

---

#### 2. **Restaurant / Cafe**

**Key Features**:

- Table management
- Order types (Dine-in, Takeaway, Delivery)
- Kitchen order tracking
- Menu management
- Reservation system

**Manager Controls**:

```
Dashboard View
├─ Service Overview
│  ├─ Active Tables
│  ├─ Pending Orders
│  ├─ Average Service Time
│  └─ Kitchen Status
├─ Revenue Tracking
│  ├─ Current Service Total
│  ├─ Hourly Revenue
│  ├─ Item-wise Sales
│  └─ Order Type Breakdown
├─ Table Management
│  ├─ Table Status
│  ├─ Customer Capacity
│  ├─ Reservation Calendar
│  └─ Table History
├─ Menu & Pricing
│  ├─ Item Availability
│  ├─ Price Updates
│  ├─ Special Offers
│  └─ Item Popularity
├─ Ingredient Inventory
│  ├─ Stock Levels
│  ├─ Usage Tracking
│  ├─ Supplier Orders
│  └─ Cost Analysis
└─ Staff Management
   ├─ Waiter Performance
   ├─ Chef Efficiency
   ├─ Shift Management
   └─ Tip Tracking
```

**Critical Workflows**:

```
Table Reservation → Customer Seated → Order Created → Kitchen → Served → Payment
   ↓
   Stock Update → Cost Tracking → VAT Calculation → Revenue Recording
```

---

#### 3. **Pharmacy**

**Key Features**:

- Prescription management
- Batch tracking
- Expiry date management
- Drug interaction checking
- Regulatory compliance

**Manager Controls**:

```
Dashboard View
├─ Dispensing Summary
│  ├─ Prescriptions Filled
│  ├─ OTC Sales
│  ├─ Total Revenue
│  └─ Average Transaction Value
├─ Inventory Management
│  ├─ Total Items
│  ├─ Expiring Soon (30 days)
│  ├─ Expired Items
│  ├─ Low Stock Medicines
│  ├─ Batch Tracking
│  └─ Supplier Orders
├─ Prescription Tracking
│  ├─ Active Prescriptions
│  ├─ Refill Tracking
│  ├─ Doctor Integration
│  └─ Compliance Audit
├─ Sales Analysis
│  ├─ Top Medicines
│  ├─ Sales by Category
│  ├─ Price vs. Cost Analysis
│  └─ Margin Analysis
├─ Regulatory Compliance
│  ├─ Audit Trails
│  ├─ Prescription Records
│  ├─ Tax Reporting
│  └─ Regulatory Documents
└─ Stock Management
   ├─ Stock Adjustments
   ├─ Wastage Tracking
   ├─ Expiry Processing
   └─ Supplier Cost Analysis
```

**Critical Workflows**:

```
Prescription → Verify → Check Stock/Interactions → Dispense → Payment
   ↓
   Update Batch Tracking → Stock Update → Expiry Alert → Revenue Record
```

---

#### 4. **Hotel**

**Key Features**:

- Room management
- Booking system
- Multiple service billing
- Guest management
- Housekeeping tracking

**Manager Controls**:

```
Dashboard View
├─ Occupancy Overview
│  ├─ Total Rooms
│  ├─ Occupied Rooms
│  ├─ Occupancy Rate %
│  ├─ Vacant Rooms
│  └─ Maintenance Rooms
├─ Booking Management
│  ├─ Current Reservations
│  ├─ Check-in Today
│  ├─ Check-out Today
│  ├─ Extended Stays
│  └─ Cancellations
├─ Revenue Tracking
│  ├─ Room Revenue
│  ├─ Additional Services Revenue
│  ├─ Food & Beverage Revenue
│  ├─ Average Daily Rate (ADR)
│  └─ Revenue Per Available Room (RevPAR)
├─ Guest Management
│  ├─ Active Guests
│  ├─ Guest Details
│  ├─ Special Requests
│  ├─ Guest History
│  └─ Loyalty Program
├─ Housekeeping
│  ├─ Room Status (Clean, Dirty, In-Service)
│  ├─ Task Assignments
│  ├─ Task Completion
│  └─ Maintenance Issues
├─ Services & Amenities
│  ├─ Laundry Service
│  ├─ Room Service Orders
│  ├─ Facilities Status
│  └─ Additional Service Charges
└─ Financial Management
   ├─ Guest Invoices
   ├─ Payment Status
   ├─ Balance Due
   └─ Billing Report
```

**Critical Workflows**:

```
Booking Created → Check-in → Room Assigned → Services Used → Check-out → Invoice → Payment
   ↓
   Housekeeping Update → Room Status → Revenue Recording → Tax Calculation
```

---

#### 5. **Clinic / Medical Center**

**Key Features**:

- Patient management
- Appointment scheduling
- Medical records
- Prescription generation
- Billing & insurance

**Manager Controls**:

```
Dashboard View
├─ Patient Management
│  ├─ Active Patients Today
│  ├─ Appointment Schedule
│  ├─ Medical History
│  ├─ Patient Demographics
│  └─ Patient Contact History
├─ Doctor Schedule
│  ├─ Available Doctors
│  ├─ Doctor Appointments
│  ├─ Patient Queue
│  ├─ Consultation Time
│  └─ Doctor Availability
├─ Appointments
│  ├─ Scheduled Appointments
│  ├─ Check-ins
│  ├─ No-shows
│  ├─ Cancellations
│  └─ Rescheduling
├─ Consultation Tracking
│  ├─ Active Consultations
│  ├─ Medical Notes
│  ├─ Prescription Generated
│  ├─ Test Orders
│  └─ Follow-ups
├─ Pharmacy Integration
│  ├─ Prescription Fulfillment
│  ├─ Medicine Inventory
│  ├─ Pharmacy Sales
│  └─ Medicine Cost Analysis
├─ Financial Management
│  ├─ Consultation Charges
│  ├─ Test Charges
│  ├─ Total Collections
│  ├─ Payment Status
│  └─ Insurance Claims
└─ Reporting
   ├─ Daily Collection Report
   ├─ Doctor Performance
   ├─ Patient Analytics
   ├─ Test Reports
   └─ Financial Reports
```

**Critical Workflows**:

```
Patient Registration → Appointment → Consultation → Prescription → Billing → Payment
   ↓
   Medical Records → Pharmacy Integration → Invoice → Tax Calculation
```

---

#### 6. **Gym / Fitness Center**

**Key Features**:

- Membership management
- Class scheduling
- Attendance tracking
- Payment plans
- Trainer assignments

**Manager Controls**:

```
Dashboard View
├─ Membership Overview
│  ├─ Active Members
│  ├─ Membership Status
│  ├─ Expiring Soon
│  ├─ Renewal Rate
│  └─ Member Demographics
├─ Revenue Tracking
│  ├─ Membership Revenue
│  ├─ Class Revenue
│  ├─ Personal Training Revenue
│  ├─ Membership Renewals
│  └─ Payment Status
├─ Class Management
│  ├─ Class Schedule
│  ├─ Class Capacity
│  ├─ Attendance
│  ├─ Trainer Assignments
│  └─ Class Popularity
├─ Attendance Tracking
│  ├─ Daily Check-ins
│  ├─ Member Activity
│  ├─ Equipment Usage
│  └─ Peak Hours Analysis
├─ Trainer Management
│  ├─ Trainer Schedule
│  ├─ Personal Training Sessions
│  ├─ Trainer Ratings
│  └─ Session Revenue
├─ Equipment Management
│  ├─ Equipment Status
│  ├─ Maintenance Schedule
│  ├─ Usage Tracking
│  └─ Replacement Planning
└─ Financial Management
   ├─ Membership Billing
   ├─ Payment Collection
   ├─ Outstanding Dues
   ├─ Payment Plans
   └─ Revenue Report
```

**Critical Workflows**:

```
Member Registration → Payment Plan → Monthly/Annual Billing → Payment Collection
   ↓
   Class Attendance → Usage Tracking → Revenue Recording → Tax Calculation
```

---

#### 7. **Salon / Spa**

**Key Features**:

- Service catalog
- Appointment booking
- Stylist assignments
- Product inventory
- Client management

**Manager Controls**:

```
Dashboard View
├─ Service Overview
│  ├─ Services Offered
│  ├─ Pricing
│  ├─ Service Popularity
│  └─ Average Service Time
├─ Appointment Management
│  ├─ Today's Appointments
│  ├─ Stylist Schedule
│  ├─ Slot Availability
│  ├─ No-shows
│  └─ Cancellations
├─ Staff Management
│  ├─ Stylist Availability
│  ├─ Services by Stylist
│  ├─ Performance Metrics
│  ├─ Commission Tracking
│  └─ Client Ratings
├─ Revenue Tracking
│  ├─ Service Revenue
│  ├─ Product Sales Revenue
│  ├─ Package Deals
│  ├─ Membership Revenue
│  └─ Total Daily Revenue
├─ Inventory Management
│  ├─ Product Stock
│  ├─ Low Stock Alerts
│  ├─ Supplier Orders
│  └─ Cost Analysis
├─ Client Management
│  ├─ Client Database
│  ├─ Appointment History
│  ├─ Preferences & Notes
│  ├─ Loyalty Program
│  └─ Client Feedback
└─ Financial Management
   ├─ Daily Revenue
   ├─ Payment Methods
   ├─ Stylist Commission
   ├─ Product Margin Analysis
   └─ Financial Report
```

**Critical Workflows**:

```
Appointment Booking → Service Assignment → Stylist Selection → Service Delivery → Payment
   ↓
   Product Sales (if any) → Invoice → Tax Calculation → Commission Tracking
```

---

#### 8. **Warehouse**

**Key Features**:

- Large-scale inventory
- Zone management
- Stock allocation
- Supplier integration
- Bulk operations

**Manager Controls**:

```
Dashboard View
├─ Inventory Overview
│  ├─ Total Items in Stock
│  ├─ Stock by Zone/Section
│  ├─ Stock Movement (In/Out)
│  ├─ Inventory Valuation
│  └─ Turnover Rate
├─ Warehouse Operations
│  ├─ Receiving Operations
│  ├─ Stock Putaway
│  ├─ Picking Operations
│  ├─ Packing Operations
│  └─ Shipping Status
├─ Stock Management
│  ├─ Low Stock Items
│  ├─ Overstock Items
│  ├─ Stock Balancing
│  ├─ Reorder Management
│  └─ Supplier Performance
├─ Zone Management
│  ├─ Zone Allocation
│  ├─ Capacity Usage
│  ├─ Zone Performance
│  └─ Reorganization Plans
├─ Order Fulfillment
│  ├─ Pending Orders
│  ├─ Fulfillment Rate
│  ├─ Order Status Tracking
│  ├─ Delivery Status
│  └─ Return Processing
├─ Staff Management
│  ├─ Warehouse Staff
│  ├─ Task Assignments
│  ├─ Productivity Metrics
│  ├─ Error Tracking
│  └─ Performance Reports
└─ Financial Management
   ├─ Inventory Cost
   ├─ Purchase Costs
   ├─ Storage Costs
   ├─ Fulfillment Costs
   └─ Profitability Analysis
```

**Critical Workflows**:

```
Purchase Order → Receiving → Quality Check → Putaway → Storage
   ↓
   Sales Order → Picking → Packing → Shipping → Delivery → Invoice
   ↓
   Stock Update → Cost Tracking → Financial Recording
```

---

#### 9. **Factory / Manufacturing**

**Key Features**:

- Production planning
- Raw material management
- Work-in-progress tracking
- Quality control
- Production reporting

**Manager Controls**:

```
Dashboard View
├─ Production Overview
│  ├─ Daily Production Target
│  ├─ Production Actual vs Target
│  ├─ Items Produced
│  ├─ Items in Progress
│  └─ Production Efficiency %
├─ Raw Materials
│  ├─ Stock Levels
│  ├─ Material Usage Rate
│  ├─ Supplier Orders
│  ├─ Inventory Valuation
│  └─ Material Costs
├─ Production Management
│  ├─ Work Orders
│  ├─ Production Queue
│  ├─ Workstation Status
│  ├─ Production Line Status
│  └─ Batch Tracking
├─ Quality Control
│  ├─ Inspection Results
│  ├─ Defect Rate
│  ├─ Quality Issues
│  ├─ Rejection Count
│  └─ Rework Items
├─ Equipment Management
│  ├─ Machine Status
│  ├─ Maintenance Schedule
│  ├─ Downtime Tracking
│  ├─ Efficiency Metrics
│  └─ Repair History
├─ Labor Management
│  ├─ Labor Hours
│  ├─ Labor Allocation
│  ├─ Productivity Per Worker
│  ├─ Shift Management
│  └─ Payroll Integration
└─ Financial Management
   ├─ Production Cost
   ├─ Material Cost
   ├─ Labor Cost
   ├─ Overhead Cost
   └─ Unit Cost Analysis
```

**Critical Workflows**:

```
Production Plan → Raw Material Allocation → Manufacturing → Quality Check
   ↓
   Finished Goods → Sales Orders → Fulfillment → Payment → Revenue Recording
   ↓
   Cost Allocation → Profitability Analysis
```

---

#### 10. **Office / Professional Services**

**Key Features**:

- Project management
- Service billing
- Time tracking
- Document management
- Client projects

**Manager Controls**:

```
Dashboard View
├─ Project Overview
│  ├─ Active Projects
│  ├─ Project Status
│  ├─ Deadline Tracking
│  ├─ Budget vs Actual
│  └─ Project Profitability
├─ Service Billing
│  ├─ Time Entries
│  ├─ Billable Hours
│  ├─ Invoice Generation
│  ├─ Payment Status
│  └─ Billing Rate
├─ Resource Management
│  ├─ Staff Allocation
│  ├─ Staff Availability
│  ├─ Utilization Rate
│  ├─ Capacity Planning
│  └─ Skill Matrix
├─ Client Management
│  ├─ Active Clients
│  ├─ Client Projects
│  ├─ Contract Terms
│  ├─ Service Levels
│  └─ Client Feedback
├─ Financial Management
│  ├─ Project Revenue
│  ├─ Project Costs
│  ├─ Project Margin
│  ├─ Invoice Status
│  └─ Collections
├─ Document Management
│  ├─ Project Documents
│  ├─ Contract Files
│  ├─ Deliverables
│  ├─ Approval Tracking
│  └─ Archive
└─ Reporting
   ├─ Project Report
   ├─ Resource Utilization
   ├─ Financial Report
   ├─ Time Tracking Report
   └─ Client Performance Report
```

**Critical Workflows**:

```
Project Creation → Resource Allocation → Work Execution → Time Tracking
   ↓
   Invoice Generation → Payment Collection → Project Closure → Final Report
   ↓
   Cost Analysis → Profitability Review → Resource Feedback
```

---

## Manager Dashboard & Controls

### Universal Manager Dashboard Components

Every business manager has access to a centralized dashboard with these common features:

#### 1. **Key Performance Indicators (KPIs)**

```
┌─────────────────────────────────────┐
│         TODAY'S SUMMARY              │
├─────────────────────────────────────┤
│  Total Revenue:        12,450 BDT   │
│  Total Transactions:   45           │
│  Average Transaction:  276.67 BDT   │
│  Pending Payments:     2,100 BDT    │
│  Stock Movements:      38 items     │
│  New Customers:        5            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│         THIS WEEK (CHART)            │
├─────────────────────────────────────┤
│  Mon: 10,200                        │
│  Tue: 11,500                        │
│  Wed: 9,800                         │
│  Thu: 12,100                        │
│  Fri: 14,300                        │
│  Sat: 16,200                        │
│  Sun: [Today]                       │
└─────────────────────────────────────┘
```

#### 2. **Real-Time Alerts & Notifications**

```
┌─────────────────────────────────────┐
│         ACTIVE ALERTS                │
├─────────────────────────────────────┤
│  ⚠️  Low Stock: Item #234           │
│  ⚠️  Expiring Soon: Medicine #567   │
│  ℹ️  Payment Pending: Invoice #789   │
│  ✅ Sales Target: 85% achieved      │
│  ❌ System Error: API slow (5s)      │
└─────────────────────────────────────┘
```

#### 3. **Quick Actions Menu**

```
┌────────────────────────────────────────┐
│       QUICK ACTIONS                    │
├────────────────────────────────────────┤
│  [+ New Sale]     [+ New Purchase]    │
│  [+ New Customer] [+ New Supplier]    │
│  [Stock Check]    [Reconcile]         │
│  [Print Report]   [Export Data]       │
│  [Notifications]  [Messages]          │
└────────────────────────────────────────┘
```

#### 4. **Branch Selector & Switch**

```
Current Branch: Main Store (Downtown)

┌─────────────────────────────────────┐
│  Switch Branch:                     │
│  ├─ Main Store (Downtown)     [✓]   │
│  ├─ Branch 2 (Suburbs)        [ ]   │
│  ├─ Branch 3 (Airport)        [ ]   │
│  └─ All Branches              [ ]   │
└─────────────────────────────────────┘
```

#### 5. **User Profile & Settings**

```
┌─────────────────────────────────────┐
│  User: Sarah (Manager)              │
│  Branch: Main Store                 │
│  Role: Branch Manager               │
│  Permissions: [Read] [Write] [...]  │
│                                     │
│  [Edit Profile]                    │
│  [Change Password]                 │
│  [Notification Settings]           │
│  [Theme Settings]                  │
│  [Logout]                          │
└─────────────────────────────────────┘
```

#### 6. **Advanced Filtering & Reports**

```
Report Generation:
┌─────────────────────────────────────┐
│  Select Report Type:                │
│  ├─ Sales Report                    │
│  ├─ Inventory Report                │
│  ├─ Payment Report                  │
│  ├─ Tax Report                      │
│  ├─ Customer Report                 │
│  └─ Custom Report                   │
│                                     │
│  Date Range: [From] [To]           │
│  Filter: [Branch] [Category] [...]  │
│  Format: [PDF] [Excel] [CSV]       │
│                                     │
│  [Generate] [Schedule] [Email]     │
└─────────────────────────────────────┘
```

### Manager Actions by Authority Level

#### Admin Level

```
Full System Control
├─ Manage Companies
├─ Manage All Branches
├─ Manage Users & Roles
├─ Configure Permissions
├─ View All Reports
├─ System Settings
└─ Audit Logs
```

#### Branch Manager Level

```
Branch-Level Control
├─ View Branch Dashboard
├─ Manage Branch Operations
├─ Create Sales/Purchase Orders
├─ Manage Staff (Branch)
├─ View Branch Reports
├─ Inventory Management (Branch)
└─ Daily Reconciliation
```

#### Supervisor Level

```
Operational Control
├─ View Dashboard
├─ Process Sales
├─ Stock Management
├─ Manage Staff (Team)
├─ View Team Reports
└─ Escalate Issues
```

#### Staff Level

```
Limited Operations
├─ View Assigned Tasks
├─ Create Sales
├─ Scan/Process Items
└─ Request Assistance
```

#### Viewer Level

```
Read-Only Access
├─ View Reports
├─ View Dashboard
├─ View Transactions
└─ Export Data
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
