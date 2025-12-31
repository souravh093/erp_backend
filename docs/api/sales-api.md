# Sales API

## 💰 Sales Management Endpoints

### Base URL

```
/api/v1/sales
```

---

## Invoice Endpoints

### Create Sales Invoice

Create a new sales invoice.

**Endpoint:** `POST /sales/invoices`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "branchId": "branch-uuid",
  "customerId": "customer-uuid",
  "salesOrderId": "order-uuid",
  "items": [
    {
      "productId": "product-uuid",
      "quantity": 2,
      "unit_price": 100,
      "vat_rate_percent": 15,
      "discount_rate_percent": 5
    },
    {
      "productId": "product-uuid-2",
      "quantity": 1,
      "unit_price": 50,
      "vat_rate_percent": 15,
      "discount_rate_percent": 0
    }
  ],
  "payment_amount": 200,
  "payment_method": "CASH"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Invoice created successfully",
  "data": {
    "id": "invoice-uuid",
    "invoice_number": "INV-2025-0001",
    "invoice_date": "2025-12-31T10:00:00Z",
    "customer": {
      "id": "customer-uuid",
      "name": "John Doe"
    },
    "items": [
      {
        "product": "Laptop",
        "quantity": 2,
        "unit_price": 100,
        "line_total": 200
      }
    ],
    "total_before_vat": 240,
    "total_discount": 10,
    "total_vat": 34.5,
    "grand_total": 264.5,
    "payment_amount": 200,
    "due_amount": 64.5,
    "payment_status": "PARTIAL"
  }
}
```

---

### List Invoices

Get all sales invoices.

**Endpoint:** `GET /sales/invoices`

**Query Parameters:**

- `page`, `limit`: Pagination
- `branchId`: Filter by branch
- `customerId`: Filter by customer
- `payment_status`: Filter by payment status
- `from_date`, `to_date`: Date range

**Response (200):**

```json
{
  "success": true,
  "data": {
    "invoices": [
      {
        "id": "uuid",
        "invoice_number": "INV-2025-0001",
        "invoice_date": "2025-12-31",
        "customer": "John Doe",
        "grand_total": 264.5,
        "payment_status": "PAID"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 3
    }
  }
}
```

---

### Get Invoice Details

Get detailed invoice information.

**Endpoint:** `GET /sales/invoices/:id`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoice_number": "INV-2025-0001",
    "invoice_date": "2025-12-31T10:00:00Z",
    "branch": "Main Store",
    "customer": {
      "id": "uuid",
      "name": "John Doe",
      "phone": "+880123456789"
    },
    "items": [
      {
        "product": {
          "id": "uuid",
          "name": "Laptop",
          "sku": "LAP-001"
        },
        "quantity": 2,
        "unit_price": 100,
        "discount_rate_percent": 5,
        "vat_rate_percent": 15,
        "line_total": 200
      }
    ],
    "total_before_vat": 240,
    "total_discount": 10,
    "total_vat": 34.5,
    "grand_total": 264.5,
    "payment_amount": 264.5,
    "due_amount": 0,
    "payment_status": "PAID"
  }
}
```

---

## Customer Endpoints

### Create Customer

**Endpoint:** `POST /customers`

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "+880123456789",
  "email": "john@example.com",
  "address": "123 Main St",
  "companyId": "company-uuid"
}
```

---

### List Customers

**Endpoint:** `GET /customers`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "id": "uuid",
        "name": "John Doe",
        "phone": "+880123456789",
        "email": "john@example.com",
        "opening_balance": 0
      }
    ]
  }
}
```

---

**Last Updated:** December 31, 2025
