# Authentication & Authorization Module

## 📋 Overview

The Authentication & Authorization module provides secure user management, role-based access control (RBAC), and multi-branch access management for the ERP system.

---

## 🎯 Key Features

- User registration and authentication
- JWT-based token authentication
- Role-based access control (RBAC)
- Permission management
- Multi-branch user access
- Password security with hashing
- Email/Phone-based login
- OTP generation for password reset

---

## 🗄️ Database Tables

### Users Table

```prisma
model User {
  id             String   @id @default(uuid())
  name           String   @db.VarChar(100)
  email          String   @unique
  phone          String?  @unique
  password       String   (hashed)
  is_Active      Boolean  @default(true)
  avatar         String?
  createdAt      DateTime
  updatedAt      DateTime
}
```

### Roles Table

```prisma
model Role {
  id              String   @id @default(uuid())
  role_name       String   @unique
  createdAt       DateTime
  updatedAt       DateTime
}
```

### Permissions Table

```prisma
model Permission {
  id              String   @id @default(uuid())
  permission      String   @unique
  createdAt       DateTime
  updatedAt       DateTime
}
```

### Junction Tables

- `user_roles` - Links users to roles (many-to-many)
- `role_permissions` - Links roles to permissions (many-to-many)
- `user_branches` - Links users to branches (many-to-many)

---

## 🔑 Core Functionality

### 1. User Authentication

**Registration Flow:**

```typescript
1. Validate user input (email, phone, password)
2. Check for existing user
3. Hash password (bcrypt)
4. Create user record
5. Assign default role
6. Generate JWT token
7. Return user data + token
```

**Login Flow:**

```typescript
1. Validate credentials (email/phone + password)
2. Find user in database
3. Verify password hash
4. Check if user is active
5. Load user roles and permissions
6. Generate JWT token
7. Return user data + token
```

**JWT Token Structure:**

```typescript
{
  userId: string,
  email: string,
  roles: string[],
  permissions: string[],
  branches: string[],
  iat: number,
  exp: number
}
```

---

### 2. Role-Based Access Control (RBAC)

**Role Hierarchy:**

```
Super Admin
  └── Company Admin
       ├── Branch Manager
       ├── Accountant
       ├── Sales Manager
       ├── Purchase Manager
       ├── Inventory Manager
       ├── Cashier
       └── Staff
```

**Common Roles:**

- **Super Admin**: Full system access
- **Company Admin**: Company-level management
- **Branch Manager**: Branch-level operations
- **Accountant**: Financial transactions and reports
- **Sales Manager**: Sales operations management
- **Purchase Manager**: Purchase operations management
- **Inventory Manager**: Stock and inventory control
- **Cashier**: POS operations only
- **Staff**: Limited read access

---

### 3. Permission Management

**Permission Categories:**

**User Management:**

- `create_user`
- `view_user`
- `update_user`
- `delete_user`
- `assign_role`

**Product Management:**

- `create_product`
- `view_product`
- `update_product`
- `delete_product`
- `manage_pricing`

**Sales Operations:**

- `create_sales_order`
- `create_sales_invoice`
- `view_sales`
- `process_payment`
- `apply_discount`

**Purchase Operations:**

- `create_purchase_order`
- `create_purchase_invoice`
- `view_purchases`
- `approve_purchase`

**Inventory Management:**

- `view_stock`
- `adjust_stock`
- `transfer_stock`
- `view_stock_movements`

**Financial Operations:**

- `view_reports`
- `create_journal_entry`
- `view_accounts`
- `manage_payments`

**System Administration:**

- `manage_company`
- `manage_branch`
- `manage_roles`
- `manage_permissions`
- `system_settings`

---

### 4. Branch Access Control

**Implementation:**

```typescript
// User can access multiple branches
user.branches = [
  { branchId: 'branch-1', branchName: 'Main Store' },
  { branchId: 'branch-2', branchName: 'Warehouse' },
];

// Authorization check
function checkBranchAccess(userId: string, branchId: string): boolean {
  return userHasAccessToBranch(userId, branchId);
}
```

**Use Cases:**

- Regional managers access multiple branches
- Staff restricted to single branch
- Accountants access all branches
- Reports filtered by user's branch access

---

## 🔐 Security Features

### Password Security

```typescript
// Password hashing (bcrypt)
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Password verification
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

**Password Requirements:**

- Minimum 8 characters
- Mix of uppercase and lowercase
- At least one number
- At least one special character

### JWT Token Management

```typescript
// Token generation
const token = jwt.sign(payload, JWT_SECRET, {
  expiresIn: '24h',
});

// Token verification
const decoded = jwt.verify(token, JWT_SECRET);
```

**Token Security:**

- Stored in HTTP-only cookies (recommended) or localStorage
- 24-hour expiration
- Refresh token support (future)
- Automatic expiration handling

### OTP for Password Reset

```typescript
// Generate 6-digit OTP
const otp = generateOTP(); // e.g., "123456"

// Store with expiration (5 minutes)
await storeOTP(email, otp, expiresAt);

// Send via email
await sendOTPEmail(email, otp);
```

---

## 🛡️ Middleware Implementation

### Authentication Middleware

```typescript
async function authMiddleware(req, res, next) {
  // Extract token from header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
```

### Authorization Middleware

```typescript
function requirePermission(permission: string) {
  return (req, res, next) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
      });
    }
    next();
  };
}

// Usage
router.post(
  '/products',
  authMiddleware,
  requirePermission('create_product'),
  createProduct,
);
```

### Branch Access Middleware

```typescript
function requireBranchAccess(req, res, next) {
  const branchId = req.params.branchId || req.body.branchId;

  if (!req.user.branches.includes(branchId)) {
    return res.status(403).json({
      message: 'No access to this branch',
    });
  }

  next();
}
```

---

## 📊 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password with OTP
- `GET /api/v1/auth/me` - Get current user

### User Management

- `GET /api/v1/users` - List all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create user
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user
- `PATCH /api/v1/users/:id/status` - Activate/deactivate user

### Role Management

- `GET /api/v1/roles` - List all roles
- `POST /api/v1/roles` - Create role
- `PATCH /api/v1/roles/:id` - Update role
- `DELETE /api/v1/roles/:id` - Delete role
- `POST /api/v1/roles/:id/permissions` - Assign permissions to role

### Permission Management

- `GET /api/v1/permissions` - List all permissions
- `POST /api/v1/permissions` - Create permission

### User-Role Assignment

- `POST /api/v1/users/:userId/roles` - Assign role to user
- `DELETE /api/v1/users/:userId/roles/:roleId` - Remove role from user

### User-Branch Assignment

- `POST /api/v1/users/:userId/branches` - Assign branch to user
- `DELETE /api/v1/users/:userId/branches/:branchId` - Remove branch access

---

## 🔄 Common Workflows

### User Registration Workflow

```
1. User submits registration form
2. Validate input (email, phone, password)
3. Check if email/phone already exists
4. Hash password
5. Create user record
6. Assign default "Staff" role
7. Send welcome email
8. Generate JWT token
9. Return user data + token
```

### Login Workflow

```
1. User submits credentials (email/phone + password)
2. Find user by email or phone
3. Check if user exists and is active
4. Verify password
5. Load user roles and permissions
6. Load user branch access
7. Generate JWT token with user data
8. Return token + user profile
```

### Password Reset Workflow

```
1. User requests password reset (email)
2. Verify email exists
3. Generate 6-digit OTP
4. Store OTP with 5-minute expiration
5. Send OTP via email
6. User submits OTP + new password
7. Verify OTP is valid and not expired
8. Hash new password
9. Update user password
10. Invalidate OTP
11. Send confirmation email
```

---

## 🧪 Testing Scenarios

### Authentication Tests

- ✅ User can register with valid data
- ✅ User cannot register with existing email
- ✅ User can login with correct credentials
- ✅ User cannot login with wrong password
- ✅ Inactive user cannot login
- ✅ JWT token is generated correctly
- ✅ Token expires after 24 hours

### Authorization Tests

- ✅ User with permission can access endpoint
- ✅ User without permission is denied
- ✅ User can access assigned branches only
- ✅ Role permissions are correctly loaded
- ✅ Multiple roles combine permissions correctly

---

## 🎯 Best Practices

1. **Never store plain text passwords**
2. **Always use HTTPS in production**
3. **Implement rate limiting on auth endpoints**
4. **Log all authentication attempts**
5. **Use secure JWT secret (32+ characters)**
6. **Implement token refresh mechanism**
7. **Validate all user input**
8. **Use HTTP-only cookies for tokens**
9. **Implement account lockout after failed attempts**
10. **Regular security audits**

---

## 📚 Related Documentation

- [Security Architecture](../architecture/security-architecture.md)
- [API Documentation](../api/authentication-api.md)
- [Database Schema](../database/schema-overview.md)

---

**Last Updated:** December 31, 2025
