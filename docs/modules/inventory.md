# Product & Inventory Management Module

## 📋 Overview

The Inventory Management module handles product catalog, stock tracking, inventory movements, and reorder management across multiple branches.

---

## 🎯 Key Features

- Product catalog management with categories and subcategories
- Multi-branch stock tracking
- Real-time inventory updates
- Stock movement history and auditing
- Reorder level alerts
- Product pricing with VAT and discounts
- Batch and expiry tracking
- Stock transfer between branches
- SKU and barcode management
- Unit of measurement support

---

## 🗄️ Database Tables

### Core Tables

- `products` - Product master data
- `product_pricing` - Pricing information
- `categories` - Product categories
- `sub_categories` - Product subcategories
- `units` - Units of measurement
- `stocks` - Stock levels per branch
- `stock_movements` - Inventory movement history

---

## 📦 Product Management

### Product Entity Structure

```prisma
model Product {
  id                String           @id @default(uuid())
  name              String           @db.VarChar(255)
  description       String?
  sku               String?          @unique
  barcode           String?          @unique
  unitId            String
  productType       ProductType      // GOODS or SERVICE
  is_active         Boolean          @default(true)
  companyId         String
  categoryId        String
  subCategoryId     String?
  productPricing    ProductPricing?
  stocks            Stock[]
}
```

### Product Types

- **GOODS**: Physical products with inventory tracking
- **SERVICE**: Non-physical items without inventory

### Product Hierarchy

```
Company
  └── Category (e.g., "Electronics")
       └── SubCategory (e.g., "Laptops")
            └── Product (e.g., "Dell XPS 15")
```

---

## 💰 Product Pricing

### Pricing Entity

```prisma
model ProductPricing {
  id                    String   @id @default(uuid())
  purchase_price        Float
  selling_price         Float
  vat_rate_percent      Int
  discount_rate_percent Int      @default(0)
  allow_discount        Boolean  @default(false)
  effective_from        DateTime
  productId             String   @unique
}
```

### Pricing Calculations

```typescript
// Line total without discount
lineTotal = quantity × selling_price

// With discount
discountAmount = lineTotal × (discount_rate_percent / 100)
subtotal = lineTotal - discountAmount

// With VAT
vatAmount = subtotal × (vat_rate_percent / 100)
grandTotal = subtotal + vatAmount
```

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

## 🏷️ Categories & Units

### Category Management

```typescript
// Category hierarchy
Company → Category → SubCategory → Product

// Example
{
  company: "ABC Electronics",
  category: "Computers",
  subCategory: "Laptops",
  products: ["Dell XPS", "MacBook Pro", "HP Pavilion"]
}
```

### Units of Measurement

```typescript
// Common units
- "piece" (pcs)
- "kilogram" (kg)
- "liter" (L)
- "meter" (m)
- "dozen" (dz)
- "box"
- "carton"

// With conversion
{
  name: "kilogram",
  conversion_base_unit: "gram",  // 1 kg = 1000 g
}
```

---

## 🔄 Core Operations

### 1. Create Product

```typescript
async function createProduct(data) {
  // 1. Validate product data
  // 2. Check SKU/Barcode uniqueness
  // 3. Create product record
  // 4. Create pricing record
  // 5. Initialize stock for all branches (quantity = 0)
  // 6. Return product with pricing
}
```

### 2. Update Stock (After Purchase)

```typescript
async function receiveStock(purchaseInvoiceItem) {
  // 1. Find stock record (product + branch)
  // 2. Increase current_quantity
  // 3. Create stock movement (PURCHASE)
  // 4. Update stock record
  // 5. Check if stock is above reorder level
}
```

### 3. Reduce Stock (After Sale)

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

### 4. Transfer Stock Between Branches

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

### 5. Stock Adjustment

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

### Product Management

- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product
- `PATCH /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/search` - Search products (SKU, barcode, name)

### Category Management

- `GET /api/v1/categories` - List categories
- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories/:id/subcategories` - Get subcategories
- `POST /api/v1/subcategories` - Create subcategory

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

### Pricing Rules

1. **Selling Price**: Must be >= purchase price (warning, not enforced)
2. **Discount**: Only if `allow_discount = true`
3. **VAT**: Applied based on product's `vat_rate_percent`
4. **Effective Date**: Pricing effective from specified date

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

- [Sales Module](./sales.md)
- [Purchase Module](./purchase.md)
- [Database Schema](../database/schema-overview.md)
- [API Documentation](../api/products-api.md)

---

**Last Updated:** December 31, 2025
