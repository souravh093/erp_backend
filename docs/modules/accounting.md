# Payment & Accounting Module

## 📋 Overview

The Accounting module provides double-entry bookkeeping, journal entries, chart of accounts, and financial reporting capabilities.

---

## 🎯 Key Features

- Chart of accounts management
- Double-entry bookkeeping
- Journal entries
- Payment tracking
- Account ledgers
- Financial reports (Balance Sheet, P&L)
- Multi-currency support (future)

---

## 🗄️ Database Tables

- `accounts` - Chart of accounts
- `journal_entries` - Journal entry headers
- `journal_lines` - Journal entry lines (debits/credits)
- `payments` - Payment transactions

---

## 💼 Chart of Accounts

### Account Types

```prisma
enum AccountType {
  ASSET,      // Cash, Bank, Inventory, Receivables
  LIABILITY,  // Payables, Loans
  INCOME,     // Sales Revenue, Service Income
  EXPENSE,    // Operating Expenses, COGS
  EQUITY      // Capital, Retained Earnings
}
```

### Account Entity

```prisma
model Account {
  id           String      @id @default(uuid())
  name         String
  type         AccountType
  journalLines JournalLine[]
}
```

### Common Accounts

```typescript
// Assets
- Cash
- Bank Account
- Accounts Receivable
- Inventory
- Fixed Assets

// Liabilities
- Accounts Payable
- VAT Payable
- Loans Payable

// Income
- Sales Revenue
- Service Income
- Other Income

// Expenses
- Cost of Goods Sold (COGS)
- Operating Expenses
- Salaries
- Rent
- Utilities

// Equity
- Owner's Capital
- Retained Earnings
```

---

## 📖 Double-Entry Bookkeeping

### Journal Entry Structure

```prisma
model JournalEntry {
  id           String        @id
  date         DateTime
  description  String?
  createdBy    String        // User who created entry
  journalLines JournalLine[]
}

model JournalLine {
  id             String  @id
  journalEntryId String
  accountId      String
  debit          Float   @default(0)
  credit         Float   @default(0)
}
```

### Accounting Equation

```
Assets = Liabilities + Equity
Debit = Credit (for every transaction)
```

### Example: Sales Transaction

```typescript
// Sale of goods for $1000 (including $100 VAT)
{
  date: "2025-12-31",
  description: "Sale - Invoice INV-2025-001",
  lines: [
    { account: "Cash", debit: 1000, credit: 0 },          // Asset increase
    { account: "Sales Revenue", debit: 0, credit: 900 },  // Income increase
    { account: "VAT Payable", debit: 0, credit: 100 }     // Liability increase
  ]
}
// Total Debits: 1000 = Total Credits: 1000 ✓
```

### Example: Purchase Transaction

```typescript
// Purchase of inventory for $500 (including $50 VAT)
{
  date: "2025-12-31",
  description: "Purchase - Invoice PI-2025-001",
  lines: [
    { account: "Inventory", debit: 450, credit: 0 },         // Asset increase
    { account: "VAT Receivable", debit: 50, credit: 0 },     // Asset increase
    { account: "Accounts Payable", debit: 0, credit: 500 }   // Liability increase
  ]
}
// Total Debits: 500 = Total Credits: 500 ✓
```

---

## 💳 Payment Management

### Payment Entity

```prisma
model Payment {
  id             String        @id
  reference_type ReferenceType // PURCHASE_INVOICE, SALES_INVOICE, etc.
  reference_id   String        // ID of the invoice/order
  payment_method PaymentMethod
  amount         Float
  date           DateTime
  currency       Currency      @default(BDT)
  notes          String?
}
```

### Payment Types

- Sales payment (from customers)
- Purchase payment (to suppliers)
- Expense payment
- Inter-account transfer

---

## 📊 Financial Reports

### Balance Sheet

```typescript
{
  date: "2025-12-31",
  assets: {
    current: {
      cash: 50000,
      bank: 100000,
      receivables: 30000,
      inventory: 200000
    },
    total: 380000
  },
  liabilities: {
    current: {
      payables: 50000,
      vatPayable: 10000
    },
    total: 60000
  },
  equity: {
    capital: 250000,
    retainedEarnings: 70000,
    total: 320000
  }
}
// Assets (380,000) = Liabilities (60,000) + Equity (320,000) ✓
```

### Profit & Loss Statement

```typescript
{
  period: "2025-01-01 to 2025-12-31",
  revenue: {
    salesRevenue: 500000,
    otherIncome: 10000,
    total: 510000
  },
  expenses: {
    cogs: 300000,
    salaries: 50000,
    rent: 24000,
    utilities: 6000,
    total: 380000
  },
  netProfit: 130000
}
```

---

## 📊 API Endpoints

### Accounts

- `GET /api/v1/accounts` - List all accounts
- `POST /api/v1/accounts` - Create account
- `GET /api/v1/accounts/:id/ledger` - Account ledger

### Journal Entries

- `GET /api/v1/journal-entries` - List entries
- `POST /api/v1/journal-entries` - Create entry
- `GET /api/v1/journal-entries/:id` - Get entry details

### Payments

- `GET /api/v1/payments` - List payments
- `POST /api/v1/payments` - Record payment

### Reports

- `GET /api/v1/reports/financial/balance-sheet` - Balance sheet
- `GET /api/v1/reports/financial/profit-loss` - P&L statement
- `GET /api/v1/reports/financial/trial-balance` - Trial balance

---

## 📚 Related Documentation

- [Sales Module](./sales.md)
- [Purchase Module](./purchase.md)
- [Tax & VAT Module](./tax-vat.md)

---

**Last Updated:** December 31, 2025
