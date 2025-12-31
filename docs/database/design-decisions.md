# Database Design Decisions

## 🎯 Introduction

This document explains the key design decisions made in the ERP database architecture, the reasoning behind them, and their implications.

---

## 🔑 Primary Key Strategy

### Decision: UUID for All Primary Keys

**Implementation:**

```prisma
id String @id @default(uuid()) @db.Uuid
```

**Rationale:**

1. **Distributed System Ready**: UUIDs can be generated anywhere without coordination
2. **No Collision Risk**: Globally unique identifiers prevent conflicts
3. **Security**: Non-sequential IDs don't expose record count or order
4. **Merge-Friendly**: Easy to merge data from different sources

**Trade-offs:**

- ✅ Better for distributed systems
- ✅ Enhanced security
- ✅ Merge and migration friendly
- ❌ 16 bytes vs 4 bytes for integers (larger storage)
- ❌ Slightly slower index operations

**Alternative Considered:** Auto-increment integers
**Why Not Chosen:** Not suitable for multi-tenant, distributed architecture

---

## 🏢 Multi-Tenancy Architecture

### Decision: Company-Branch Hierarchy

**Implementation:**

```
Company (root tenant)
  └── Branch[] (sub-tenants)
       └── Operations (sales, inventory, etc.)
```

**Rationale:**

1. **Business Flexibility**: Support franchises, chains, and multi-location businesses
2. **Data Isolation**: Each company's data is logically separated
3. **Branch-Level Operations**: Sales, inventory, and reporting per branch
4. **User Access Control**: Users can be restricted to specific branches

**Key Design Points:**

- Company ID cascades to most entities
- Stock is tracked per branch
- Invoices are linked to branches
- Users can access multiple branches via `user_branches`

**Alternative Considered:** Single-tenant per database
**Why Not Chosen:** Would require separate database instances for each company

---

## 🗓️ Timestamp Strategy

### Decision: Automatic Timestamps on All Tables

**Implementation:**

```prisma
createdAt DateTime @default(now()) @db.Timestamptz(6)
updatedAt DateTime @updatedAt @db.Timestamptz(6)
```

**Rationale:**

1. **Audit Trail**: Track when records were created/modified
2. **Timezone Aware**: `Timestamptz` stores timezone information
3. **Automatic Updates**: `@updatedAt` automatically updates on changes
4. **Reporting**: Enable time-based queries and analytics

**Benefits:**

- Complete audit history
- No manual timestamp management
- Consistent across all tables
- Supports compliance requirements

---

## 🔗 Relationship Design

### Decision: Explicit Cascade Deletes

**Implementation:**

```prisma
company Company @relation(fields: [companyId], references: [id], onDelete: Cascade)
```

**Rationale:**

1. **Data Integrity**: Prevent orphaned records
2. **Automatic Cleanup**: Simplifies deletion logic
3. **Performance**: Database handles cascades efficiently
4. **Safety**: Explicit declaration makes behavior clear

**Cascade Strategy:**

- Parent-child relationships: CASCADE
- Reference data: CASCADE
- Cross-entity references: CASCADE when appropriate

**Example:**

- Delete Company → Cascade to Branches, Products, Categories
- Delete Product → Cascade to Stock, Pricing
- Delete Invoice → Cascade to Invoice Items

---

## 📊 Enum Usage Strategy

### Decision: Database-Level Enums for Status Fields

**Implementation:**

```prisma
enum PurchaseOrderStatus {
  PENDING
  PARTIAL
  COMPLETED
  CANCELLED
}
```

**Rationale:**

1. **Type Safety**: Database enforces valid values
2. **Performance**: Enums are stored efficiently
3. **Documentation**: Self-documenting valid states
4. **Consistency**: Prevents typos and invalid data

**Enums Defined:**

- Business types (SHOP, RESTAURANT, etc.)
- Status fields (orders, payments, invoices)
- Account types (ASSET, LIABILITY, etc.)
- Movement reasons (PURCHASE, SALE, etc.)

**Alternative Considered:** String fields with application-level validation
**Why Not Chosen:** Database-level enforcement is more robust

---

## 💰 Financial Data Storage

### Decision: Float for Currency Amounts

**Implementation:**

```prisma
total_amount Float
unit_price Float
grand_total Float
```

**Rationale:**

1. **Simplicity**: Easier to work with in calculations
2. **Range**: Supports very large and very small amounts
3. **Performance**: Native database type

**Important Considerations:**
⚠️ **Precision Warning**: Floats have precision limitations

- Always round to 2 decimal places for display
- Use decimal libraries for critical calculations
- Consider `DECIMAL` type for future migration if needed

**Best Practices:**

```typescript
// Always round to 2 decimals
const displayAmount = Number(amount.toFixed(2));

// For critical calculations
import { Decimal } from 'decimal.js';
const total = new Decimal(price).times(quantity);
```

---

## 📦 Product & Inventory Design

### Decision: Separate Product and Pricing Tables

**Implementation:**

```prisma
Product (1) ←→ (1) ProductPricing
```

**Rationale:**

1. **Flexibility**: Pricing can change without affecting product data
2. **History**: Future enhancement for price history
3. **Clarity**: Separates product attributes from financial data
4. **Performance**: Can query products without loading pricing

**Current Limitation:** Only current pricing stored (no history)
**Future Enhancement:** Add `price_history` table for historical pricing

### Decision: Stock Per Branch

**Implementation:**

```prisma
Stock {
  branchId + productId (unique combination)
  current_quantity
  reorder_level
}
```

**Rationale:**

1. **Branch Autonomy**: Each branch manages its own inventory
2. **Accuracy**: Prevents stock confusion across locations
3. **Reporting**: Branch-level inventory reports
4. **Transfer Tracking**: Stock movements between branches

---

## 🛒 Order & Invoice Strategy

### Decision: Separate Orders and Invoices

**Implementation:**

```
Order → Invoice (One-to-Many)
```

**Rationale:**

1. **Partial Fulfillment**: One order can generate multiple invoices
2. **Business Process**: Matches real-world workflows
3. **Flexibility**: Supports various business models
4. **Status Tracking**: Orders and invoices have independent statuses

**Example Scenarios:**

- **Purchase**: Order 100 items → Receive 60 (Invoice 1) → Receive 40 (Invoice 2)
- **Sales**: Table order → Multiple bills for same table
- **POS**: Direct invoice without order

---

## 🔐 Authentication & Authorization

### Decision: Role-Based Access Control (RBAC)

**Implementation:**

```
User ↔ Role ↔ Permission (Many-to-Many)
```

**Rationale:**

1. **Scalability**: Easy to add new roles and permissions
2. **Flexibility**: Users can have multiple roles
3. **Maintainability**: Permissions managed at role level
4. **Granularity**: Fine-grained access control

**Design Pattern:**

- Roles: Admin, Manager, Cashier, Accountant, etc.
- Permissions: create_invoice, view_reports, manage_users, etc.
- Users get permissions through roles

**Alternative Considered:** Direct user-permission mapping
**Why Not Chosen:** Less maintainable at scale

---

## 📋 Journal Entry Design

### Decision: Double-Entry Bookkeeping

**Implementation:**

```prisma
JournalEntry
  └── JournalLine[] (debit + credit)
```

**Rationale:**

1. **Accounting Standard**: Follows GAAP principles
2. **Balance Verification**: Debits must equal credits
3. **Audit Trail**: Complete transaction history
4. **Flexibility**: Supports complex transactions

**Business Rule Enforced:**

```typescript
// Application-level validation
sum(journalLines.debit) === sum(journalLines.credit);
```

---

## 🏷️ Unique Constraints Strategy

### Decision: Composite Unique Constraints

**Implementation:**

```prisma
@@unique([phone, email, trade_license_number, vat_registration_number])
```

**Rationale:**

1. **Data Quality**: Prevents duplicate records
2. **Business Rules**: Enforces uniqueness where needed
3. **Performance**: Automatic indexes created

**Applied To:**

- User email (globally unique)
- Product SKU and Barcode
- Invoice numbers
- Company identifiers (when provided)
- Junction tables (userId + roleId, etc.)

**Note:** Some fields use `@unique` vs `@@unique`

- `@unique` - Single field uniqueness
- `@@unique([field1, field2])` - Composite uniqueness

---

## 🔄 Soft Delete vs Hard Delete

### Decision: Hard Delete with Cascade

**Current Implementation:**

```prisma
onDelete: Cascade
```

**Rationale:**

1. **Simplicity**: No soft delete flags to manage
2. **Data Integrity**: Cascade prevents orphaned records
3. **Performance**: No filtering of deleted records
4. **GDPR Compliance**: True deletion when required

**Future Consideration:**
For audit requirements, consider:

```prisma
deleted_at DateTime?
is_deleted Boolean @default(false)
```

**When to Add Soft Delete:**

- Regulatory compliance requirements
- Audit trail requirements
- "Undo" functionality needed
- Historical reporting needs

---

## 📊 Index Strategy

### Decision: Automatic Indexes Only

**Current State:**

- Primary keys: Automatically indexed
- Foreign keys: Automatically indexed
- Unique constraints: Automatically indexed

**Future Optimization:**
Add explicit indexes for:

```prisma
@@index([invoice_date])
@@index([order_date])
@@index([createdAt])
@@index([status])
```

**When to Add:**

- Query performance issues identified
- Slow report generation
- High-volume tables (100k+ records)

---

## 🌍 Internationalization

### Decision: Currency Enum + Default Currency

**Implementation:**

```prisma
enum Currency { USD, EUR, INR, BDT }
currency_default Currency @default(BDT)
```

**Rationale:**

1. **Multi-Currency Support**: Prepared for international operations
2. **Company-Level Default**: Each company sets its currency
3. **Type Safety**: Enum prevents invalid currencies

**Future Enhancement:**

- Exchange rate table
- Multi-currency transactions
- Currency conversion logic

---

## ⚡ Performance Considerations

### Current Design Choices

1. **Normalized Structure**: Reduces data redundancy
2. **Selective Denormalization**: `line_total`, `grand_total` stored for performance
3. **UUID Storage**: `@db.Uuid` uses native PostgreSQL UUID type
4. **Timestamp Precision**: `Timestamptz(6)` - microsecond precision

### Calculated vs Stored Fields

**Stored:**

- `line_total` (quantity × unit_price)
- `grand_total` (total_before_vat + total_vat - total_discount)

**Rationale:**

- Avoid recalculation on every query
- Historical accuracy (prices may change)
- Simpler queries

---

## 🔮 Future Enhancements

### Planned Improvements

1. **Price History**: Track historical product pricing
2. **Audit Logging**: Detailed change tracking
3. **Soft Deletes**: For critical entities
4. **Custom Indexes**: Based on query patterns
5. **Partitioning**: For large transaction tables
6. **Read Replicas**: For reporting queries

---

## 📚 Related Documentation

- [Schema Overview](./schema-overview.md)
- [Entity Relationships](./entity-relationships.md)
- [Architecture Documentation](../architecture/)

---

**Last Updated:** December 31, 2025
