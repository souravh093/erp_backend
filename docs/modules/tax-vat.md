# Tax & VAT Management Module

## 📋 Overview

Tax rate configuration and VAT transaction tracking for sales and purchases.

---

## 🎯 Key Features

- Tax rate configuration
- VAT calculation on sales and purchases
- VAT transaction tracking
- Tax reports and filing

---

## 💰 Tax Rate Entity

```prisma
model TaxRate {
  id              String         @id
  name            String         // "Standard VAT", "Reduced VAT"
  percentage      Float          // 15, 7.5, 5, 0
  applicable_type ApplicableType // PRODUCT, SERVICE, CATEGORY
}
```

---

## 📊 VAT Transaction Entity

```prisma
model VatTransaction {
  id          String     @id
  source_type SourceType // SALE or PURCHASE
  source_id   String     // Invoice ID
  branchId    String
  taxRateId   String
  vat_amount  Float
  date        DateTime
}
```

**VAT on Sales**: VAT collected (liability)  
**VAT on Purchases**: VAT paid (asset/receivable)

---

## 📊 API Endpoints

- `GET /api/v1/tax-rates` - List tax rates
- `POST /api/v1/tax-rates` - Create tax rate
- `GET /api/v1/vat-transactions` - List VAT transactions
- `GET /api/v1/reports/vat/summary` - VAT summary report

---

**Last Updated:** December 31, 2025
