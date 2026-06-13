# Inventory Management Module

## 📋 Overview

The Inventory Management module handles stock tracking, inventory movements, reorder management, and inventory reporting across multiple branches.

---

## 🎯 Key Features

- Multi-branch stock tracking
- Real-time inventory updates
- Stock movement history and auditing
- Reorder level alerts
- Batch and expiry tracking
- Stock transfer between branches
- Product-aware stock tracking

---

## 🗄️ Database Tables

### Core Tables

- `stocks` - Stock levels per branch
- `stock_movements` - Inventory movement history

---

## 📊 Stock Management

### Stock Entity

```prisma
model Stock {
  id               String   @id @default(uuid())
  current_quantity Int      @default(0)
  reorder_level    Int      @default(0)
  branchId         String
  productId        String
}
```

**Key Points:**

- One stock record per product per branch
- `current_quantity`: Current available stock
- `reorder_level`: Minimum stock threshold for alerts

### Stock Status

```typescript
enum StockStatus {
  IN_STOCK, // current_quantity > reorder_level
  LOW_STOCK, // current_quantity <= reorder_level && > 0
  OUT_OF_STOCK, // current_quantity = 0
  NEGATIVE, // current_quantity < 0 (error state)
}
```

---

## 🔄 Stock Movements

### Stock Movement Entity

```prisma
model StockMovement {
  id               String              @id @default(uuid())
  quantity_changed Int                 // +/- value
  reason           String
  reason_type      StockMovementReason
  reference_id     String?             // Link to source transaction
  productId        String
  branchId         String
  createdAt        DateTime
}
```

### Movement Reasons

- **PURCHASE**: Stock received from supplier
- **SALE**: Stock sold to customer
- **RETURN**: Stock returned by customer
- **ADJUSTMENT**: Manual stock correction
- **TRANSFER**: Stock moved between branches
- **EXPIRE**: Stock marked as expired
- **MANUAL**: Manual adjustment by user

### Movement Flow

```typescript
// Example: Sale Transaction
{
  quantity_changed: -5,           // Reduced by 5
  reason: "Sales Invoice #INV-001",
  reason_type: "SALE",
  reference_id: "invoice-uuid",
  productId: "product-uuid",
  branchId: "branch-uuid"
}

// Example: Purchase
{
  quantity_changed: +100,         // Added 100
  reason: "Purchase Invoice #PI-001",
  reason_type: "PURCHASE",
  reference_id: "purchase-invoice-uuid",
  productId: "product-uuid",
  branchId: "branch-uuid"
}
```

---

## 🔄 Core Operations

### 1. Update Stock (After Purchase)

```typescript
async function receiveStock(purchaseInvoiceItem) {
  // 1. Find stock record (product + branch)
  // 2. Increase current_quantity
  // 3. Create stock movement (PURCHASE)
  // 4. Update stock record
  // 5. Check if stock is above reorder level
}
```

### 2. Reduce Stock (After Sale)

```typescript
async function reduceStock(salesInvoiceItem) {
  // 1. Find stock record
  // 2. Check if sufficient stock available
  // 3. Decrease current_quantity
  // 4. Create stock movement (SALE)
  // 5. Check if stock falls below reorder level
  // 6. Trigger low stock alert if needed
}
```

### 3. Transfer Stock Between Branches

```typescript
async function transferStock(fromBranch, toBranch, product, quantity) {
  // 1. Validate sufficient stock in source branch
  // 2. Reduce stock from source branch
  // 3. Create movement (TRANSFER OUT) for source
  // 4. Increase stock in destination branch
  // 5. Create movement (TRANSFER IN) for destination
  // 6. Link both movements with same reference_id
}
```

### 4. Stock Adjustment

```typescript
async function adjustStock(branchId, productId, newQuantity, reason) {
  // 1. Get current stock
  // 2. Calculate difference
  // 3. Update stock quantity
  // 4. Create stock movement (ADJUSTMENT)
  // 5. Log adjustment with user reference
}
```

---

## 📊 Inventory Reports

### 1. Stock Status Report

```typescript
// Current stock levels across all branches
{
  productId: "...",
  productName: "Laptop",
  sku: "LAP-001",
  branches: [
    { branch: "Main Store", quantity: 50, status: "IN_STOCK" },
    { branch: "Warehouse", quantity: 5, status: "LOW_STOCK" },
    { branch: "Branch 2", quantity: 0, status: "OUT_OF_STOCK" }
  ],
  totalStock: 55
}
```

### 2. Low Stock Alert

```typescript
// Products below reorder level
{
  productId: "...",
  productName: "Mouse",
  branchId: "...",
  branchName: "Main Store",
  currentQuantity: 5,
  reorderLevel: 20,
  shortfall: 15,
  status: "LOW_STOCK"
}
```

### 3. Stock Movement Report

```typescript
// Movements within date range
{
  productId: "...",
  productName: "Keyboard",
  movements: [
    { date: "2025-12-01", type: "PURCHASE", quantity: +100 },
    { date: "2025-12-05", type: "SALE", quantity: -20 },
    { date: "2025-12-10", type: "SALE", quantity: -15 },
    { date: "2025-12-15", type: "ADJUSTMENT", quantity: -2 }
  ],
  startingStock: 50,
  endingStock: 113
}
```

### 4. Inventory Valuation

```typescript
// Total inventory value
{
  branchId: "...",
  branchName: "Main Store",
  items: [
    { product: "Laptop", quantity: 50, costPrice: 500, value: 25000 },
    { product: "Mouse", quantity: 100, costPrice: 10, value: 1000 }
  ],
  totalValue: 26000
}
```

---

## 📊 API Endpoints

### Stock Management

- `GET /api/v1/stock` - List all stock (with filters)
- `GET /api/v1/stock/branch/:branchId` - Stock by branch
- `GET /api/v1/stock/product/:productId` - Stock by product (all branches)
- `PATCH /api/v1/stock/:id/adjust` - Adjust stock quantity
- `POST /api/v1/stock/transfer` - Transfer stock between branches

### Stock Movements

- `GET /api/v1/stock-movements` - List movements (with filters)
- `GET /api/v1/stock-movements/product/:productId` - Movements for product
- `GET /api/v1/stock-movements/branch/:branchId` - Movements for branch

### Reports

- `GET /api/v1/reports/inventory/status` - Current stock status
- `GET /api/v1/reports/inventory/low-stock` - Low stock alerts
- `GET /api/v1/reports/inventory/movements` - Movement history
- `GET /api/v1/reports/inventory/valuation` - Inventory valuation

---

## 🧪 Business Rules

### Stock Rules

1. **Non-Negative Stock**: Prevent stock from going negative (configurable)
2. **Reorder Alerts**: Alert when stock <= reorder_level
3. **Multi-Branch**: Each branch maintains independent stock
4. **Service Products**: No stock tracking for SERVICE type products
5. **Inactive Products**: Cannot create new transactions for inactive products

### Movement Rules

1. **Audit Trail**: All stock changes must create movement record
2. **Reference Required**: Link to source transaction when possible
3. **Negative Movements**: Sales, returns, transfers OUT
4. **Positive Movements**: Purchases, returns received, transfers IN

---

## 🎯 Best Practices

1. **Always use transactions** for stock updates
2. **Create movement record** for every stock change
3. **Validate stock availability** before sales
4. **Implement locking** for concurrent stock updates
5. **Regular stock audits** and reconciliation
6. **Set appropriate reorder levels** based on sales velocity
7. **Monitor low stock alerts** proactively
8. **Track batch numbers** for perishable goods
9. **Use SKU/Barcode** for quick product lookup
10. **Archive** old movement records periodically

---

## 📚 Related Documentation

- [Product Management Module](./product.md)
- [Unit Management Module](./unit.md)
- [Sales Module](./sales.md)
- [Purchase Module](./purchase.md)
- [Database Schema](../database/schema-overview.md)
- [Inventory API](../api/inventory-api.md)

---

**Last Updated:** June 13, 2026
