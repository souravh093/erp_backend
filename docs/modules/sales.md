# Sales & POS Management Module

## 📋 Overview

The Sales & POS module manages all sales operations including orders, invoices, customer management, and point-of-sale transactions across multiple branches.

---

## 🎯 Key Features

- Customer management (CRM)
- Sales order processing
- POS invoice generation
- Multiple order types (Counter, Table, Delivery, Takeaway)
- Payment processing (Cash, Card, Mobile Payment)
- Partial payments and due tracking
- Discount management
- VAT calculation
- Stock integration
- Invoice numbering
- Sales reports and analytics

---

## 🗄️ Database Tables

### Core Tables

- `customers` - Customer information
- `sales_orders` - Sales orders
- `sales_invoices` - Sales invoices
- `sales_invoice_items` - Invoice line items

---

## 👥 Customer Management

### Customer Entity

```prisma
model Customer {
  id              String   @id @default(uuid())
  name            String
  phone           String?  @unique
  email           String?  @unique
  address         String?
  opening_balance Float    @default(0)
  companyId       String
}
```

**Customer Types:**

- **Registered Customers**: Full profile with contact info
- **Walk-in Customers**: Anonymous or minimal info
- **Credit Customers**: Track due amounts

---

## 🛒 Sales Order Management

### Sales Order Entity

```prisma
model SalesOrder {
  id            String      @id @default(uuid())
  branchId      String
  customerId    String?     // Optional for walk-ins
  order_type    OrderType   // COUNTER, TABLE, DELIVERY, TAKEAWAY
  order_status  OrderStatus // PENDING, SERVED, COMPLETED, CANCELLED
  createdAt     DateTime
  updatedAt     DateTime
}
```

### Order Types

```typescript
enum OrderType {
  COUNTER, // Direct counter sale
  TABLE, // Restaurant table order
  DELIVERY, // Home delivery
  TAKEAWAY, // Take away order
}
```

### Order Status

```typescript
enum OrderStatus {
  PENDING, // Order placed, not processed
  SERVED, // Items served/delivered
  COMPLETED, // Payment completed
  CANCELLED, // Order cancelled
  PARTIAL, // Partially fulfilled
}
```

---

## 💳 Sales Invoice Management

### Sales Invoice Entity

```prisma
model SalesInvoice {
  id                String        @id @default(uuid())
  invoice_number    String        @unique
  salesOrderId      String?       // Optional (POS may skip order)
  branchId          String
  customerId        String?
  invoice_date      DateTime
  total_before_vat  Float
  total_discount    Float         @default(0)
  total_vat         Float         @default(0)
  grand_total       Float
  payment_amount    Float
  due_amount        Float         @default(0)
  payment_status    PaymentStatus // UNPAID, PARTIAL, PAID
}
```

### Invoice Line Item

```prisma
model SalesInvoiceItem {
  id                    String   @id @default(uuid())
  salesInvoiceId        String
  productId             String
  quantity              Int
  unit_price            Float
  vat_rate_percent      Int      @default(0)
  discount_rate_percent Int      @default(0)
  line_total            Float
}
```

---

## 🔄 Sales Flow

### Complete Sales Process

**1. Order Creation (Optional)**

```typescript
// Create sales order
const order = {
  branchId: 'branch-uuid',
  customerId: 'customer-uuid', // or null for walk-in
  order_type: 'COUNTER',
  order_status: 'PENDING',
};
```

**2. Invoice Generation**

```typescript
// Create invoice from order or directly
const invoice = {
  salesOrderId: "order-uuid",    // optional
  invoice_number: generateInvoiceNumber(), // "INV-2025-001"
  branchId: "branch-uuid",
  customerId: "customer-uuid",   // optional
  invoice_date: new Date(),
  items: [...]
};
```

**3. Calculate Invoice Totals**

```typescript
function calculateInvoice(items: InvoiceItem[]) {
  let totalBeforeVat = 0;
  let totalDiscount = 0;
  let totalVat = 0;

  items.forEach((item) => {
    // Line total
    const lineTotal = item.quantity * item.unit_price;

    // Discount
    const discount = lineTotal * (item.discount_rate_percent / 100);
    const afterDiscount = lineTotal - discount;

    // VAT
    const vat = afterDiscount * (item.vat_rate_percent / 100);

    totalBeforeVat += lineTotal;
    totalDiscount += discount;
    totalVat += vat;

    item.line_total = lineTotal;
  });

  const grandTotal = totalBeforeVat - totalDiscount + totalVat;

  return {
    total_before_vat: totalBeforeVat,
    total_discount: totalDiscount,
    total_vat: totalVat,
    grand_total: grandTotal,
  };
}
```

**4. Process Payment**

```typescript
const payment = {
  payment_amount: receivedAmount,
  due_amount: grandTotal - receivedAmount,
  payment_status: calculatePaymentStatus(receivedAmount, grandTotal),
};

function calculatePaymentStatus(paid, total) {
  if (paid === 0) return 'UNPAID';
  if (paid < total) return 'PARTIAL';
  return 'PAID';
}
```

**5. Update Stock**

```typescript
// Reduce stock for each item
for (const item of invoiceItems) {
  await reduceStock({
    branchId: invoice.branchId,
    productId: item.productId,
    quantity: item.quantity,
    reason: `Sales Invoice ${invoice.invoice_number}`,
    reason_type: 'SALE',
    reference_id: invoice.id,
  });
}
```

**6. Create VAT Transaction**

```typescript
if (invoice.total_vat > 0) {
  await createVatTransaction({
    source_type: 'SALE',
    source_id: invoice.id,
    branchId: invoice.branchId,
    vat_amount: invoice.total_vat,
  });
}
```

---

## 💰 Payment Processing

### Payment Status

```typescript
enum PaymentStatus {
  UNPAID, // No payment received
  PARTIAL, // Partial payment received
  PAID, // Fully paid
}
```

### Payment Methods

```typescript
enum PaymentMethod {
  CASH,
  BANK_TRANSFER,
  CHEQUE,
  MOBILE_PAYMENT, // bKash, Nagad, etc.
}
```

### Payment Scenarios

**Full Payment:**

```typescript
{
  grand_total: 1000,
  payment_amount: 1000,
  due_amount: 0,
  payment_status: 'PAID'
}
```

**Partial Payment:**

```typescript
{
  grand_total: 1000,
  payment_amount: 600,
  due_amount: 400,
  payment_status: 'PARTIAL'
}
```

**Credit Sale:**

```typescript
{
  grand_total: 1000,
  payment_amount: 0,
  due_amount: 1000,
  payment_status: 'UNPAID'
}
```

---

## 🏷️ Discount Management

### Discount Types

1. **Product-Level Discount**: Applied to individual items
2. **Invoice-Level Discount**: Applied to total invoice (future)
3. **Customer Discount**: Based on customer type (future)

### Discount Rules

```typescript
// Check if product allows discount
if (!product.productPricing.allow_discount) {
  throw new Error('Discount not allowed for this product');
}

// Apply discount
const discount = lineTotal * (discount_rate_percent / 100);
const finalAmount = lineTotal - discount;
```

---

## 📊 Invoice Numbering

### Format

```
INV-YYYY-NNNN
INV-2025-0001
INV-2025-0002
```

### Generation Logic

```typescript
async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  // Get last invoice for current year
  const lastInvoice = await getLastInvoice(year);

  let sequence = 1;
  if (lastInvoice) {
    const lastNumber = parseInt(lastInvoice.invoice_number.split('-')[2]);
    sequence = lastNumber + 1;
  }

  return `${prefix}${sequence.toString().padStart(4, '0')}`;
}
```

---

## 📊 API Endpoints

### Customer Management

- `GET /api/v1/customers` - List all customers
- `GET /api/v1/customers/:id` - Get customer details
- `POST /api/v1/customers` - Create customer
- `PATCH /api/v1/customers/:id` - Update customer
- `DELETE /api/v1/customers/:id` - Delete customer
- `GET /api/v1/customers/:id/invoices` - Customer invoice history
- `GET /api/v1/customers/:id/balance` - Customer balance

### Sales Orders

- `GET /api/v1/sales/orders` - List orders
- `GET /api/v1/sales/orders/:id` - Get order details
- `POST /api/v1/sales/orders` - Create order
- `PATCH /api/v1/sales/orders/:id` - Update order
- `PATCH /api/v1/sales/orders/:id/status` - Update order status
- `DELETE /api/v1/sales/orders/:id` - Cancel order

### Sales Invoices

- `GET /api/v1/sales/invoices` - List invoices
- `GET /api/v1/sales/invoices/:id` - Get invoice details
- `POST /api/v1/sales/invoices` - Create invoice
- `GET /api/v1/sales/invoices/:invoiceNumber` - Get by invoice number
- `POST /api/v1/sales/invoices/:id/payment` - Add payment
- `GET /api/v1/sales/invoices/:id/print` - Print invoice

### POS Operations

- `POST /api/v1/pos/quick-sale` - Quick POS sale (no order)
- `GET /api/v1/pos/active-orders` - Active orders for POS
- `POST /api/v1/pos/checkout` - Checkout and create invoice

### Reports

- `GET /api/v1/reports/sales/daily` - Daily sales report
- `GET /api/v1/reports/sales/by-product` - Sales by product
- `GET /api/v1/reports/sales/by-customer` - Sales by customer
- `GET /api/v1/reports/sales/by-branch` - Sales by branch
- `GET /api/v1/reports/sales/outstanding` - Outstanding invoices

---

## 🔄 Common Workflows

### POS Quick Sale (No Order)

```
1. Scan products or search
2. Add items to cart
3. Apply discounts (if allowed)
4. Calculate totals (subtotal, discount, VAT, grand total)
5. Select payment method
6. Enter payment amount
7. Generate invoice
8. Reduce stock for all items
9. Create VAT transaction
10. Print receipt
```

### Restaurant Order Flow

```
1. Waiter takes order at table
2. Create sales order (order_type: TABLE)
3. Send to kitchen (status: PENDING)
4. Kitchen prepares food (status: SERVED)
5. Customer requests bill
6. Create invoice from order
7. Customer pays
8. Complete order (status: COMPLETED)
9. Update stock
10. Generate kitchen and customer receipts
```

### Credit Sale Flow

```
1. Create invoice for customer
2. Set payment_amount = 0
3. Set due_amount = grand_total
4. Set payment_status = UNPAID
5. Update customer's outstanding balance
6. Send invoice to customer
7. Track payment due date
8. Send reminders for overdue payments
```

---

## 📊 Sales Reports

### Daily Sales Summary

```typescript
{
  date: "2025-12-31",
  branch: "Main Store",
  totalInvoices: 150,
  totalSales: 125000,
  totalDiscounts: 5000,
  totalVAT: 15000,
  grandTotal: 135000,
  cashSales: 80000,
  creditSales: 55000,
  topProducts: [...]
}
```

### Outstanding Invoices

```typescript
{
  customerId: "...",
  customerName: "John Doe",
  invoices: [
    {
      invoice_number: "INV-2025-001",
      invoice_date: "2025-12-01",
      grand_total: 5000,
      paid: 2000,
      due: 3000,
      dueDate: "2025-12-31"
    }
  ],
  totalOutstanding: 3000
}
```

---

## 🧪 Business Rules

### Sales Rules

1. **Stock Validation**: Check stock availability before invoice
2. **Negative Stock**: Prevent or allow (configurable)
3. **Price Override**: Require permission for manual price changes
4. **Discount Limits**: Maximum discount percentage per role
5. **Credit Limit**: Customer-specific credit limits
6. **Inactive Products**: Cannot sell inactive products
7. **Minimum Price**: Cannot sell below purchase price (warning)

### Payment Rules

1. **Overpayment**: Allow and track as customer credit
2. **Partial Payment**: Track remaining due amount
3. **Payment Deadline**: Credit sales have payment terms
4. **Multiple Payments**: Support installment payments
5. **Return Policy**: Define return window and conditions

---

## 🎯 Best Practices

1. **Validate stock** before confirming invoice
2. **Use transactions** for invoice creation + stock update
3. **Generate unique invoice numbers** sequentially
4. **Track all payments** separately from invoices
5. **Regular reconciliation** of cash and credit sales
6. **Send invoices** via email/SMS automatically
7. **Monitor overdue payments** and send reminders
8. **Daily closing** reports for cash reconciliation
9. **Backup invoice data** regularly
10. **Audit trail** for price/discount overrides

---

## 📚 Related Documentation

- [Inventory Module](./inventory.md)
- [Accounting Module](./accounting.md)
- [Tax & VAT Module](./tax-vat.md)
- [API Documentation](../api/sales-api.md)

---

**Last Updated:** December 31, 2025
