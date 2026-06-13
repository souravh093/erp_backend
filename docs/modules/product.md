# Product Management Module

## 📋 Overview

The Product Management module defines the product master catalog, pricing, SKU and barcode identity, and the relationships that tie products to categories, subcategories, and units.

---

## 🎯 Key Features

- Product catalog management
- Category and subcategory assignment
- Unit assignment
- SKU and barcode management
- Product pricing with VAT and discounts
- Product activation control
- Product-level inventory linkage

---

## 🗄️ Database Tables

### Core Tables

- `products` - Product master data
- `product_pricing` - Pricing information
- `categories` - Product categories
- `sub_categories` - Product subcategories
- `units` - Units used by products

---

## 📦 Product Entity

```prisma
model Product {
  id                   String         @id @default(uuid()) @db.Uuid
  name                 String         @db.VarChar(255)
  description          String?        @db.Text
  sku                  String?        @unique @db.VarChar(100)
  barcode              String?        @unique @db.VarChar(100)
  unitId               String         @db.Uuid
  unit                 Unit           @relation(fields: [unitId], references: [id], onDelete: Cascade)
  productType          ProductType    @default(GOODS)
  is_active            Boolean       @default(true)
  companyId            String         @db.Uuid
  company              Company        @relation(fields: [companyId], references: [id], onDelete: Cascade)
  categoryId           String         @db.Uuid
  category             Category       @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  subCategoryId        String?        @db.Uuid
  subCategory          SubCategory?   @relation(fields: [subCategoryId], references: [id], onDelete: Cascade)
  createdAt            DateTime       @default(now()) @db.Timestamptz(6)
  updatedAt            DateTime       @updatedAt @db.Timestamptz(6)
  productPricing       ProductPricing?
  stocks               Stock[]
  stockMovements       StockMovement[]
  purchaseOrderItems   PurchaseOrderItem[]
  purchaseInvoiceItems PurchaseInvoiceItem[]
  salesInvoiceItems    SalesInvoiceItem[]

  @@map("products")
}
```

### Product Types

- **GOODS**: Physical products that can be stocked and moved
- **SERVICE**: Non-physical products that may not require stock tracking

### Product Hierarchy

```
Company
  └── Category (e.g., "Electronics")
       └── SubCategory (e.g., "Laptops")
            └── Product (e.g., "Dell XPS 15")
```

---

## 💰 Product Pricing

```prisma
model ProductPricing {
  id                    String   @id @default(uuid()) @db.Uuid
  purchase_price        Float
  selling_price         Float
  vat_rate_percent      Int
  discount_rate_percent Int      @default(0)
  productId             String   @unique @db.Uuid
  product               Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  allow_discount        Boolean  @default(false)
  effective_from        DateTime @default(now()) @db.Timestamptz(6)
  createdAt             DateTime @default(now()) @db.Timestamptz(6)
  updatedAt             DateTime @updatedAt @db.Timestamptz(6)

  @@map("product_pricing")
}
```

### Pricing Rules

- Purchase price is the base acquisition cost
- Selling price is used in sales calculations
- VAT and discount are applied from product pricing configuration
- Effective dates allow pricing changes over time

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

## 🔎 Product Identity

### SKU and Barcode

- `sku` should be unique across the catalog
- `barcode` should be unique across the catalog
- Both fields support fast lookup in POS and inventory workflows

### Activity Status

- Active products can be sold and stocked
- Inactive products should be blocked from new transactions

---

## 📚 Related Documentation

- [Inventory Management Module](./inventory.md)
- [Unit Management Module](./unit.md)
- [Database Schema](../database/schema-overview.md)
- [Products API](../api/products-api.md)

---

**Last Updated:** June 13, 2026
