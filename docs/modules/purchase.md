# Purchase Management Module

## 📋 Overview

The Purchase Management module handles supplier management, purchase orders, purchase invoices, and procurement workflows.

---

## 🎯 Key Features

- Supplier management
- Purchase order creation and tracking
- Purchase invoice processing
- Partial order fulfillment
- Batch and expiry tracking
- Stock integration
- Supplier payment tracking
- Purchase reports

---

## 🗄️ Database Tables

- `suppliers` - Supplier information
- `purchase_orders` - Purchase orders
- `purchase_order_items` - PO line items
- `purchase_invoices` - Purchase invoices
- `purchase_invoice_items` - Invoice line items with batch/expiry

---

## 🤝 Supplier Management

### Supplier Entity

```prisma
model Supplier {
  id              String   @id @default(uuid())
  name            String
  phone           String?  @unique
  email           String?  @unique
  address         String?
  vat_registered  Boolean  @default(false)
  opening_balance Float    @default(0)
}
```

---

## 📝 Purchase Order Management

### Purchase Order Entity

```prisma
model PurchaseOrder {
  id                String              @id
  order_date        DateTime
  expected_date     DateTime?
  status            PurchaseOrderStatus // PENDING, PARTIAL, COMPLETED, CANCELLED
  total_amount      Float
  total_vat         Float?
  grand_total       Float
  supplierId        String
  branchId          String
}
```

### Purchase Order Status

- **PENDING**: Order placed, not received
- **PARTIAL**: Partially received
- **COMPLETED**: Fully received
- **CANCELLED**: Order cancelled

---

## 📦 Purchase Invoice Management

### Purchase Invoice Entity

```prisma
model PurchaseInvoice {
  id                   String        @id
  purchaseOrderId      String
  invoice_date         DateTime
  total_before_vat     Float
  total_vat            Float         @default(0)
  grand_total          Float
  payment_status       PaymentStatus // UNPAID, PARTIAL, PAID
  payment_method       PaymentMethod?
}
```

### Invoice Item with Batch Tracking

```prisma
model PurchaseInvoiceItem {
  id                String   @id
  batchNumber       String?  // Track batch for inventory
  expiryDate        DateTime? // Track expiry for perishables
  quantity          Int
  unitPrice         Float
  vatRatePercent    Int      @default(0)
  lineTotal         Float
  purchaseInvoiceId String
  productId         String
}
```

---

## 🔄 Purchase Flow

### Complete Purchase Process

**1. Create Purchase Order**

```typescript
const purchaseOrder = {
  supplierId: 'supplier-uuid',
  branchId: 'branch-uuid',
  order_date: new Date(),
  expected_date: futureDate,
  status: 'PENDING',
  items: [
    {
      productId: 'product-uuid',
      quantity: 100,
      unit_price: 50,
      vat_rate_percent: 15,
    },
  ],
};
```

**2. Calculate Order Totals**

```typescript
let totalAmount = 0;
let totalVat = 0;

items.forEach((item) => {
  const lineTotal = item.quantity * item.unit_price;
  const vat = lineTotal * (item.vat_rate_percent / 100);

  totalAmount += lineTotal;
  totalVat += vat;

  item.line_total = lineTotal;
});

const grandTotal = totalAmount + totalVat;
```

**3. Receive Goods & Create Invoice**

```typescript
const purchaseInvoice = {
  purchaseOrderId: 'po-uuid',
  invoice_date: new Date(),
  payment_status: 'UNPAID',
  items: [
    {
      productId: 'product-uuid',
      quantity: 100, // May be less than ordered
      unitPrice: 50,
      batchNumber: 'BATCH-2025-001',
      expiryDate: '2026-12-31',
    },
  ],
};
```

**4. Update Stock**

```typescript
for (const item of invoiceItems) {
  await increaseStock({
    branchId: invoice.branchId,
    productId: item.productId,
    quantity: item.quantity,
    reason: `Purchase Invoice PI-${invoice.id}`,
    reason_type: 'PURCHASE',
    reference_id: invoice.id,
  });
}
```

**5. Update Order Status**

```typescript
// Check if order is fully received
const orderQuantity = getTotalOrderedQuantity(purchaseOrder);
const receivedQuantity = getTotalReceivedQuantity(purchaseOrder);

if (receivedQuantity === 0) {
  status = 'PENDING';
} else if (receivedQuantity < orderQuantity) {
  status = 'PARTIAL';
} else {
  status = 'COMPLETED';
}
```

---

## 📊 API Endpoints

### Supplier Management

- `GET /api/v1/suppliers` - List suppliers
- `POST /api/v1/suppliers` - Create supplier
- `GET /api/v1/suppliers/:id` - Get supplier details
- `PATCH /api/v1/suppliers/:id` - Update supplier
- `DELETE /api/v1/suppliers/:id` - Delete supplier

### Purchase Orders

- `GET /api/v1/purchase/orders` - List orders
- `POST /api/v1/purchase/orders` - Create order
- `GET /api/v1/purchase/orders/:id` - Get order details
- `PATCH /api/v1/purchase/orders/:id` - Update order
- `PATCH /api/v1/purchase/orders/:id/status` - Update status

### Purchase Invoices

- `GET /api/v1/purchase/invoices` - List invoices
- `POST /api/v1/purchase/invoices` - Create invoice (receive goods)
- `GET /api/v1/purchase/invoices/:id` - Get invoice details
- `POST /api/v1/purchase/invoices/:id/payment` - Record payment

### Reports

- `GET /api/v1/reports/purchase/by-supplier` - Purchase by supplier
- `GET /api/v1/reports/purchase/outstanding` - Outstanding payments

---

## 📚 Related Documentation

- [Inventory Module](./inventory.md)
- [Accounting Module](./accounting.md)

---

**Last Updated:** December 31, 2025
