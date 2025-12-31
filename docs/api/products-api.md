# Products API

## 📦 Product Management Endpoints

### Base URL

```
/api/v1/products
```

---

## Endpoints

### List Products

Get all products with optional filters.

**Endpoint:** `GET /products`

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `search` (string): Search by name, SKU, or barcode
- `categoryId` (uuid): Filter by category
- `is_active` (boolean): Filter by active status

**Response (200):**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "Laptop",
        "sku": "LAP-001",
        "barcode": "123456789",
        "description": "15-inch laptop",
        "category": "Electronics",
        "subCategory": "Computers",
        "unit": "piece",
        "productType": "GOODS",
        "is_active": true,
        "pricing": {
          "purchase_price": 500,
          "selling_price": 750,
          "vat_rate_percent": 15,
          "discount_rate_percent": 0,
          "allow_discount": true
        }
      }
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

---

### Get Product by ID

Get detailed product information.

**Endpoint:** `GET /products/:id`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Laptop",
    "sku": "LAP-001",
    "barcode": "123456789",
    "description": "15-inch laptop",
    "unit": "piece",
    "productType": "GOODS",
    "is_active": true,
    "category": {
      "id": "uuid",
      "name": "Electronics"
    },
    "subCategory": {
      "id": "uuid",
      "name": "Computers"
    },
    "pricing": {
      "purchase_price": 500,
      "selling_price": 750,
      "vat_rate_percent": 15,
      "discount_rate_percent": 0,
      "allow_discount": true
    },
    "stock": [
      {
        "branchId": "uuid",
        "branchName": "Main Store",
        "current_quantity": 50,
        "reorder_level": 20
      }
    ]
  }
}
```

---

### Create Product

Create a new product.

**Endpoint:** `POST /products`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "Laptop",
  "description": "15-inch laptop",
  "sku": "LAP-001",
  "barcode": "123456789",
  "unitId": "unit-uuid",
  "productType": "GOODS",
  "categoryId": "category-uuid",
  "subCategoryId": "subcategory-uuid",
  "companyId": "company-uuid",
  "pricing": {
    "purchase_price": 500,
    "selling_price": 750,
    "vat_rate_percent": 15,
    "discount_rate_percent": 0,
    "allow_discount": true
  }
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "uuid",
    "name": "Laptop",
    "sku": "LAP-001",
    "...": "..."
  }
}
```

---

### Update Product

Update existing product.

**Endpoint:** `PATCH /products/:id`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Request Body:**

```json
{
  "name": "Updated Laptop Name",
  "selling_price": 800,
  "is_active": true
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "uuid",
    "name": "Updated Laptop Name",
    "...": "..."
  }
}
```

---

### Delete Product

Soft delete or deactivate product.

**Endpoint:** `DELETE /products/:id`

**Headers:**

```
Authorization: Bearer <jwt-token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Stock Endpoints

### Get Stock Status

Get stock levels for a product.

**Endpoint:** `GET /products/:id/stock`

**Response (200):**

```json
{
  "success": true,
  "data": {
    "productId": "uuid",
    "productName": "Laptop",
    "branches": [
      {
        "branchId": "uuid",
        "branchName": "Main Store",
        "current_quantity": 50,
        "reorder_level": 20,
        "status": "IN_STOCK"
      },
      {
        "branchId": "uuid",
        "branchName": "Warehouse",
        "current_quantity": 5,
        "reorder_level": 20,
        "status": "LOW_STOCK"
      }
    ],
    "totalStock": 55
  }
}
```

---

**Last Updated:** December 31, 2025
