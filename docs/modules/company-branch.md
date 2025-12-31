# Company & Branch Management Module

## 📋 Overview

Multi-tenant company and branch management with support for different business types and multi-location operations.

---

## 🎯 Key Features

- Multi-company support
- Multi-branch per company
- Business type configuration
- Currency settings
- Branch-level operations
- User-branch access control

---

## 🏢 Company Entity

```prisma
model Company {
  id                      String       @id
  name                    String
  business_type           BusinessType // SHOP, RESTAURANT, PHARMACY, etc.
  trade_license_number    String?
  vat_registration_number String?
  address                 String?
  phone                   String?
  email                   String?
  currency_default        Currency     @default(BDT)
}
```

### Business Types

- SHOP
- RESTAURANT
- PHARMACY
- HOTEL
- CLINIC
- GYM
- SALON
- WAREHOUSE
- FACTORY
- OFFICE

---

## 🏪 Branch Entity

```prisma
model Branch {
  id              String   @id
  name            String
  address         String?
  phone           String?
  email           String?
  is_active       Boolean  @default(true)
  companyId       String
}
```

**Branch Operations:**

- Independent stock management
- Sales and purchase transactions
- User access control
- Branch-specific reporting

---

## 📚 Related Documentation

- [Authentication Module](./authentication.md)
- [Database Schema](../database/schema-overview.md)

---

**Last Updated:** December 31, 2025
