# Database Schema Overview

## 📊 Introduction

The ERP system uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database access. The schema is designed to support multi-tenant operations with a comprehensive business management structure.

---

## 🗂️ Schema Organization

The database is organized into **8 major functional groups**:

### 1. Authentication & Access Control (5 tables)

- `users` - System users
- `roles` - User roles
- `user_roles` - User-role mapping (many-to-many)
- `permissions` - System permissions
- `role_permissions` - Role-permission mapping (many-to-many)

### 2. Company & Branch Management (3 tables)

- `companies` - Business entities
- `branches` - Company branches/locations
- `user_branches` - User-branch assignments

### 3. Product & Inventory Management (6 tables)

- `categories` - Product categories
- `sub_categories` - Product subcategories
- `units` - Units of measurement
- `products` - Product catalog
- `product_pricing` - Product pricing information
- `stocks` - Stock levels per branch

### 4. Stock Movement Tracking (1 table)

- `stock_movements` - Inventory movement history

### 5. Purchase Management (4 tables)

- `suppliers` - Supplier information
- `purchase_orders` - Purchase orders
- `purchase_order_items` - PO line items
- `purchase_invoices` - Purchase invoices
- `purchase_invoice_items` - Invoice line items

### 6. Sales & POS Management (4 tables)

- `customers` - Customer information
- `sales_orders` - Sales orders
- `sales_invoices` - Sales invoices
- `sales_invoice_items` - Invoice line items

### 7. Payment & Accounting (4 tables)

- `payments` - Payment transactions
- `accounts` - Chart of accounts
- `journal_entries` - Journal entries
- `journal_lines` - Journal entry lines

### 8. Tax & VAT Management (2 tables)

- `tax_rates` - Tax rate configuration
- `vat_transactions` - VAT transaction records

---

## 📈 Database Statistics

| Metric                | Count |
| --------------------- | ----- |
| Total Tables          | 30    |
| Total Enums           | 10    |
| Authentication Tables | 5     |
| Business Tables       | 25    |
| Junction Tables       | 4     |

---

## 🔑 Key Design Patterns

### Primary Keys

- All tables use **UUID** (`@db.Uuid`) as primary keys
- Format: `id String @id @default(uuid())`
- Benefits: Distributed system friendly, no collision risk

### Timestamps

Every table includes:

```prisma
createdAt DateTime @default(now()) @db.Timestamptz(6)
updatedAt DateTime @updatedAt @db.Timestamptz(6)
```

### Foreign Key Relationships

- Cascade delete on dependent records: `onDelete: Cascade`
- Maintains referential integrity
- Automatic cleanup of related records

### Unique Constraints

Applied where business logic requires:

- Email addresses (users, companies, branches)
- Phone numbers (users, suppliers, customers)
- SKU and Barcode (products)
- Invoice numbers (sales invoices)
- Composite unique constraints for many-to-many relations

---

## 🎯 Enums Used

### Business Type

```prisma
enum BusinessType {
  SHOP, RESTAURANT, PHARMACY, HOTEL, CLINIC,
  GYM, SALON, WAREHOUSE, FACTORY, OFFICE
}
```

### Currency

```prisma
enum Currency {
  USD, EUR, INR, BDT
}
```

### Order & Invoice Status

```prisma
enum PurchaseOrderStatus { PENDING, PARTIAL, COMPLETED, CANCELLED }
enum OrderStatus { PENDING, SERVED, COMPLETED, CANCELLED, PARTIAL }
enum PaymentStatus { UNPAID, PARTIAL, PAID }
```

### Product & Stock

```prisma
enum ProductType { GOODS, SERVICE }
enum StockMovementReason {
  PURCHASE, SALE, RETURN, ADJUSTMENT, TRANSFER, EXPIRE, MANUAL
}
```

### Accounting

```prisma
enum AccountType { ASSET, LIABILITY, INCOME, EXPENSE, EQUITY }
enum ReferenceType {
  PURCHASE_INVOICE, SALES_INVOICE, EXPENSE_INVOICE,
  PURCHASE_ORDER, SALES_ORDER, EXPENSE, OTHER
}
```

### Payment & Tax

```prisma
enum PaymentMethod { CASH, BANK_TRANSFER, CHEQUE, MOBILE_PAYMENT }
enum SourceType { SALE, PURCHASE }
enum ApplicableType { PRODUCT, SERVICE, CATEGORY }
enum OrderType { COUNTER, TABLE, DELIVERY, TAKEAWAY }
```

---

## 🔗 Core Relationships

### Multi-Tenancy

```
Company (1) ─── (N) Branch
Company (1) ─── (N) Category
Company (1) ─── (N) Product
Company (1) ─── (N) Customer
```

### Access Control

```
User (N) ───< UserRole >─── (N) Role
Role (N) ───< RolePermission >─── (N) Permission
User (N) ───< UserBranch >─── (N) Branch
```

### Product Management

```
Product (1) ─── (1) ProductPricing
Product (N) ─── (1) Category
Product (N) ─── (1) SubCategory
Product (N) ─── (1) Unit
Product (1) ─── (N) Stock (per branch)
```

### Purchase Flow

```
Supplier (1) ─── (N) PurchaseOrder
PurchaseOrder (1) ─── (N) PurchaseOrderItem
PurchaseOrder (1) ─── (N) PurchaseInvoice
PurchaseInvoice (1) ─── (N) PurchaseInvoiceItem
```

### Sales Flow

```
Customer (1) ─── (N) SalesOrder
Customer (1) ─── (N) SalesInvoice
SalesOrder (1) ─── (N) SalesInvoice
SalesInvoice (1) ─── (N) SalesInvoiceItem
```

### Accounting

```
JournalEntry (1) ─── (N) JournalLine
Account (1) ─── (N) JournalLine
```

---

## 📊 Data Types

### String Fields

- `VarChar(20)` - Phone numbers
- `VarChar(50)` - Small text (units)
- `VarChar(100)` - Medium text (names, SKU, invoice numbers)
- `VarChar(255)` - Large text (names, emails, addresses)
- `Text` - Unlimited text (descriptions, notes)

### Numeric Fields

- `Int` - Quantities, percentages, counts
- `Float` - Prices, amounts, totals
- `Boolean` - Flags (is_active, vat_registered)

### Date/Time Fields

- `Timestamptz(6)` - All timestamps (timezone-aware)
- `DateTime` - Date fields (expiry, order dates)

---

## 🔒 Data Integrity Rules

### Cascade Delete Rules

When parent is deleted, children are automatically deleted:

- Delete Company → Delete Branches, Products, Categories
- Delete Branch → Delete Stocks, Sales Orders
- Delete Product → Delete Stock, Pricing, Invoice Items
- Delete User → Delete UserRoles, UserBranches

### Required Fields

- All IDs (UUID)
- Names (users, products, companies)
- Passwords (users)
- Amounts and prices in transactions
- Status fields (default values provided)

### Optional Fields

- Description texts
- Secondary contact info (email when phone exists)
- VAT numbers
- Discount rates
- Reference IDs

---

## 🗄️ Storage Considerations

### Indexes

Primary indexes automatically created on:

- Primary keys (all tables)
- Foreign keys (all relations)
- Unique constraints (email, phone, SKU, etc.)

### Recommended Additional Indexes

Consider adding indexes on:

- `invoice_date` in sales/purchase invoices
- `order_date` in orders
- `createdAt` for time-based queries
- `status` fields for filtering

---

## 📝 Schema File Location

```
prisma/
├── schema.prisma (main schema definition)
└── migrations/
    └── [timestamp]_[name]/
        └── migration.sql
```

---

## 🔄 Schema Updates

To update the schema:

1. Modify `schema.prisma`
2. Run `npx prisma migrate dev --name description`
3. Run `npx prisma generate` to update Prisma Client
4. Update TypeScript types if needed

---

## 📚 Related Documentation

- [Entity Relationships](./entity-relationships.md)
- [Design Decisions](./design-decisions.md)
- [Module Documentation](../modules/)

---

**Last Updated:** December 31, 2025
