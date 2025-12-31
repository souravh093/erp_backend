# Entity Relationships

## 🔗 Introduction

This document details all entity relationships in the ERP system, explaining how different tables are connected and interact with each other.

---

## 🏢 Multi-Tenancy Relationships

### Company → Branches (One-to-Many)

```
Company
  ├── branches[]
  ├── categories[]
  ├── products[]
  └── customers[]
```

**Relationship Type:** Cascade Delete  
**Business Rule:** When a company is deleted, all its branches, categories, products, and customers are removed.

**Example:**

- Company "ABC Corp" has 3 branches: Main Office, Warehouse 1, Warehouse 2
- Deleting ABC Corp removes all 3 branches automatically

---

## 👥 User & Access Control Relationships

### User ↔ Role (Many-to-Many via UserRole)

```
User ←→ UserRole ←→ Role
```

**Relationship Details:**

- One user can have multiple roles
- One role can be assigned to multiple users
- Junction table: `user_roles`
- Unique constraint: `[userId, roleId]`

**Example:**

- User "John" can be both "Sales Manager" and "Inventory Manager"
- Role "Admin" can be assigned to multiple users

### Role ↔ Permission (Many-to-Many via RolePermission)

```
Role ←→ RolePermission ←→ Permission
```

**Relationship Details:**

- One role can have multiple permissions
- One permission can belong to multiple roles
- Junction table: `role_permissions`
- Unique constraint: `[roleId, permissionId]`

**Example:**

- Role "Sales Manager" has permissions: "create_invoice", "view_reports", "manage_customers"
- Permission "view_dashboard" is shared by "Admin", "Manager", "Accountant" roles

### User ↔ Branch (Many-to-Many via UserBranch)

```
User ←→ UserBranch ←→ Branch
```

**Relationship Details:**

- One user can access multiple branches
- One branch can have multiple users
- Junction table: `user_branches`

**Example:**

- User "Sarah" has access to both "Downtown Store" and "Mall Branch"
- "Main Warehouse" has 5 users with access

---

## 📦 Product & Inventory Relationships

### Product Hierarchy

```
Company
  └── Category
       ├── SubCategory
       │    └── Product
       └── Product (direct category assignment)
```

**Relationship Details:**

- Product belongs to one Category (required)
- Product optionally belongs to one SubCategory
- SubCategory belongs to one Category
- Category belongs to one Company

**Example:**

```
Company: Electronics Store
  └── Category: Computers
       ├── SubCategory: Laptops
       │    └── Product: Dell XPS 15
       ├── SubCategory: Desktops
       │    └── Product: HP Pavilion
       └── Product: Computer Accessories (no subcategory)
```

### Product → Unit (Many-to-One)

```
Unit (1) ←── (N) Product
```

**Example:**

- Products: Rice (kg), Milk (liter), Shirts (piece)
- Multiple products can use the same unit

### Product → ProductPricing (One-to-One)

```
Product (1) ←→ (1) ProductPricing
```

**Relationship Details:**

- Each product has exactly one pricing record
- Cascade delete: deleting product removes pricing
- Pricing includes: purchase_price, selling_price, vat_rate, discount_rate

### Product → Stock (One-to-Many by Branch)

```
Product (1) ←── (N) Stock
Branch (1) ←── (N) Stock
```

**Relationship Details:**

- One product can have stock in multiple branches
- Each stock record is unique per product-branch combination
- Tracks: current_quantity, reorder_level

**Example:**

- Product "iPhone 15" has stock in:
  - Branch A: 50 units
  - Branch B: 30 units
  - Branch C: 75 units

---

## 📊 Stock Movement Tracking

### StockMovement Relationships

```
StockMovement
  ├── Product (productId)
  ├── Branch (branchId)
  └── User (reference_id, optional)
```

**Relationship Details:**

- Tracks every stock change with reason
- Links to product and branch
- Optional reference to user who made the change
- Reasons: PURCHASE, SALE, RETURN, ADJUSTMENT, TRANSFER, EXPIRE, MANUAL

**Example:**

```
Product: Laptop Model X
Branch: Downtown Store
Movement: +10 units
Reason: PURCHASE
Reference: Purchase Invoice #PO-2025-001
```

---

## 🛒 Purchase Management Relationships

### Purchase Flow

```
Supplier
  └── PurchaseOrder
       ├── PurchaseOrderItem[] (links to Product)
       │    └── Product
       └── PurchaseInvoice[]
            └── PurchaseInvoiceItem[] (links to Product)
                 └── Product
```

**Relationship Details:**

1. **Supplier → PurchaseOrder** (One-to-Many)
   - One supplier can have multiple purchase orders
2. **PurchaseOrder → PurchaseOrderItem** (One-to-Many)
   - Each PO has multiple line items
   - Each item references a Product
3. **PurchaseOrder → PurchaseInvoice** (One-to-Many)
   - One PO can have multiple invoices (partial deliveries)
4. **PurchaseInvoice → PurchaseInvoiceItem** (One-to-Many)
   - Each invoice has multiple line items
   - Includes batch number and expiry date

**Example Flow:**

```
Supplier: ABC Electronics
  └── PO-001 (Order Date: Jan 1)
       ├── Item: 10x Laptop @ $500
       ├── Item: 20x Mouse @ $10
       └── Invoice-001 (Invoice Date: Jan 5)
            ├── Received: 10x Laptop
            └── Received: 20x Mouse
```

---

## 💰 Sales Management Relationships

### Sales Flow

```
Customer
  ├── SalesOrder
  │    └── SalesInvoice[]
  └── SalesInvoice[]
       └── SalesInvoiceItem[]
            └── Product
```

**Relationship Details:**

1. **Customer → SalesOrder** (One-to-Many)
   - One customer can have multiple orders
   - Optional: walk-in customers may not link to SalesOrder
2. **Customer → SalesInvoice** (One-to-Many)
   - Direct invoices without orders (POS)
3. **SalesOrder → SalesInvoice** (One-to-Many)
   - One order can generate multiple invoices (partial payments)
4. **SalesInvoice → SalesInvoiceItem** (One-to-Many)
   - Each invoice has multiple line items
   - Each item links to a Product

**Example Flow:**

```
Customer: John Doe
  └── SalesOrder (Table Order)
       └── Invoice-001
            ├── Item: 2x Burger @ $5
            ├── Item: 1x Fries @ $2
            └── Total: $12
```

---

## 💳 Payment & Accounting Relationships

### Payment Structure

```
Payment
  ├── reference_type (enum: PURCHASE_INVOICE, SALES_INVOICE, etc.)
  └── reference_id (UUID of the referenced entity)
```

**Relationship Details:**

- Polymorphic relationship (not enforced at DB level)
- Links to various entity types via reference_type + reference_id
- Tracks payment method, amount, currency

### Accounting Structure

```
JournalEntry
  └── JournalLine[]
       └── Account
```

**Relationship Details:**

1. **JournalEntry → JournalLine** (One-to-Many)
   - Double-entry bookkeeping
   - Multiple lines per entry
2. **Account → JournalLine** (One-to-Many)
   - Each line links to one account
   - Tracks debit and credit amounts

**Example:**

```
JournalEntry: Sale Transaction
  ├── Line 1: Debit → Cash Account ($100)
  └── Line 2: Credit → Sales Revenue Account ($100)
```

---

## 📋 Tax & VAT Relationships

### VAT Transaction Structure

```
VatTransaction
  ├── Branch (branchId)
  ├── TaxRate (taxRateId)
  ├── source_type (SALE or PURCHASE)
  └── source_id (Invoice ID)
```

**Relationship Details:**

- Links to branch for reporting
- Links to tax rate for percentage
- Polymorphic link to source (sale or purchase invoice)

**Example:**

```
Sales Invoice #INV-001
  └── VAT Transaction
       ├── Branch: Main Store
       ├── Tax Rate: Standard VAT (15%)
       ├── Source: SALE
       └── VAT Amount: $15
```

---

## 🔄 Cascade Delete Behavior

### Critical Cascades

| Parent        | Child                               | Behavior |
| ------------- | ----------------------------------- | -------- |
| Company       | Branch, Category, Product, Customer | CASCADE  |
| Branch        | Stock, Sales Order, Purchase Order  | CASCADE  |
| Product       | Stock, Pricing, Invoice Items       | CASCADE  |
| User          | UserRole, UserBranch, StockMovement | CASCADE  |
| Role          | UserRole, RolePermission            | CASCADE  |
| Permission    | RolePermission                      | CASCADE  |
| PurchaseOrder | PurchaseOrderItem, PurchaseInvoice  | CASCADE  |
| SalesInvoice  | SalesInvoiceItem                    | CASCADE  |
| JournalEntry  | JournalLine                         | CASCADE  |

---

## ⚠️ Relationship Constraints

### Unique Constraints

- `user_roles`: One user cannot have the same role twice
- `role_permissions`: One role cannot have the same permission twice
- `user_branches`: Prevents duplicate user-branch assignments

### Required Relationships

- Product MUST have Category, Unit, Company
- Stock MUST have Product, Branch
- Invoice Items MUST have Product, Invoice
- JournalLine MUST have Account, JournalEntry

### Optional Relationships

- Product may or may not have SubCategory
- SalesInvoice may or may not have Customer (walk-in)
- SalesInvoice may or may not have SalesOrder (direct POS)

---

## 📚 Related Documentation

- [Schema Overview](./schema-overview.md)
- [Design Decisions](./design-decisions.md)
- [Module Documentation](../modules/)

---

**Last Updated:** December 31, 2025
