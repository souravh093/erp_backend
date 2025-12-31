# Authentication API

## 🔐 Authentication Endpoints

### Base URL

```
/api/v1/auth
```

---

## Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+880123456789",
  "password": "SecurePass123!"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+880123456789",
      "is_Active": true
    },
    "token": "jwt-token-here"
  }
}
```

---

### Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["Manager"],
      "permissions": ["create_invoice", "view_reports"],
      "branches": ["branch-uuid-1", "branch-uuid-2"]
    },
    "token": "jwt-token-here"
  }
}
```

---

### Get Current User

Get authenticated user profile.

**Endpoint:** `GET /auth/me`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["Manager"],
    "permissions": ["create_invoice"],
    "branches": ["branch-uuid-1"]
  }
}
```

---

### Forgot Password

Request password reset OTP.

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

---

### Reset Password

Reset password using OTP.

**Endpoint:** `POST /auth/reset-password`

**Request Body:**

```json
{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## Error Responses

**401 Unauthorized:**

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**400 Bad Request:**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Email is required", "Password must be at least 8 characters"]
}
```

---

**Last Updated:** December 31, 2025
