# Stock Movement Module

## 📋 Overview

Comprehensive tracking of all inventory movements with reasons and audit trail.

---

## 🎯 Key Features

- Track all stock changes
- Movement reasons (PURCHASE, SALE, RETURN, ADJUSTMENT, TRANSFER, EXPIRE, MANUAL)
- Reference linking to source transactions
- Audit trail with user tracking
- Branch-level movement history

---

## 📦 Stock Movement Entity

```prisma
model StockMovement {
  id               String              @id
  quantity_changed Int                 // +/- value
  reason           String              // Description
  reason_type      StockMovementReason
  reference_id     String?             // Link to invoice/order
  productId        String
  branchId         String
  createdAt        DateTime
}
```

---

## 🔄 Movement Types

### PURCHASE

Stock increased from supplier purchase

```typescript
{ quantity_changed: +100, reason_type: "PURCHASE" }
```

### SALE

Stock reduced from customer sale

```typescript
{ quantity_changed: -5, reason_type: "SALE" }
```

### RETURN

Stock returned by customer

```typescript
{ quantity_changed: +2, reason_type: "RETURN" }
```

### ADJUSTMENT

Manual stock correction

```typescript
{ quantity_changed: -3, reason_type: "ADJUSTMENT" }
```

### TRANSFER

Stock moved between branches

```typescript
// From branch
{ quantity_changed: -10, reason_type: "TRANSFER" }
// To branch
{ quantity_changed: +10, reason_type: "TRANSFER" }
```

### EXPIRE

Stock marked as expired

```typescript
{ quantity_changed: -5, reason_type: "EXPIRE" }
```

### MANUAL

Manual adjustment by authorized user

```typescript
{ quantity_changed: +/-N, reason_type: "MANUAL" }
```

---

## 📊 API Endpoints

- `GET /api/v1/stock-movements` - List movements
- `GET /api/v1/stock-movements/product/:id` - Product movements
- `GET /api/v1/stock-movements/branch/:id` - Branch movements
- `GET /api/v1/reports/movements` - Movement reports

---

**Last Updated:** December 31, 2025
