# Unit Management Module

## 📋 Overview

The Unit Management module defines the measurement units used across the product catalog. It keeps unit labels consistent for products, purchase flows, sales flows, and inventory reporting.

---

## 🎯 Key Features

- Company-scoped unit catalog
- Product unit assignment
- Standardized measurement naming
- Conversion base label support
- Permission-controlled maintenance

---

## 🗄️ Database Tables

### Core Tables

- `units` - Units of measurement used by products

---

## 📦 Unit Entity

```prisma
model Unit {
  id                   String    @id @default(uuid()) @db.Uuid
  name                 String    @db.VarChar(50)
  conversion_base_unit String?   @db.VarChar(50)
  companyId            String    @db.Uuid
  company              Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  createdAt            DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt            DateTime  @updatedAt @db.Timestamptz(6)
  products             Product[]

  @@map("units")
}
```

### Field Notes

- `name`: Display name for the unit, such as `piece`, `box`, or `kilogram`
- `conversion_base_unit`: Free-text base unit label used for readability, such as `gram` for `kilogram`
- `companyId`: Scopes the unit to a single company
- `products`: Products that use this unit

---

## 🔗 Relationships

- **Company -> Unit**: One company can own many units
- **Unit -> Product**: Each product must reference one unit through `unitId`
- **Cascade behavior**: The current schema uses cascade delete on the unit relation, so removing a unit can affect linked products

---

## 🧾 Product Usage

The `Product` model requires a unit reference:

```prisma
model Product {
  unitId String @db.Uuid
  unit   Unit   @relation(fields: [unitId], references: [id], onDelete: Cascade)
}
```

### Practical Examples

- Stocked items: `piece`, `box`, `carton`, `dozen`
- Weight-based products: `gram`, `kilogram`
- Volume-based products: `ml`, `liter`
- Service items: `hour`, `session`, `job`

---

## 🔄 Core Operations

### 1. Create Unit

```typescript
async function createUnit(data) {
  // 1. Validate unit name
  // 2. Ensure the name is not duplicated for the company
  // 3. Save the unit record
  // 4. Return the created unit
}
```

### 2. Update Unit

```typescript
async function updateUnit(unitId, data) {
  // 1. Load the unit by ID
  // 2. Validate the new name or conversion label
  // 3. Prevent conflicts with existing company units
  // 4. Save the update
}
```

### 3. Delete Unit

```typescript
async function deleteUnit(unitId) {
  // 1. Check whether the unit is used by products
  // 2. Block deletion if the unit is still in active use
  // 3. Delete the unit only when it is safe
}
```

### 4. Assign Unit to Product

```typescript
async function assignUnitToProduct(productId, unitId) {
  // 1. Validate the product exists
  // 2. Validate the unit exists in the same company
  // 3. Update product.unitId
}
```

---

## 📊 API Endpoints

Suggested REST endpoints for the module:

- `GET /api/v1/units` - List units
- `GET /api/v1/units/:id` - Get unit details
- `POST /api/v1/units` - Create unit
- `PATCH /api/v1/units/:id` - Update unit
- `DELETE /api/v1/units/:id` - Delete unit
- `GET /api/v1/units/company/:companyId` - List units for a company

---

## 🧪 Business Rules

1. **Company Scope**: Units belong to exactly one company
2. **Required for Products**: Every product must have a unit
3. **No Duplicate Names**: Unit names should be unique per company at the application layer
4. **Safe Deletion**: Do not delete units that are already used by products
5. **Readable Conversions**: `conversion_base_unit` should describe the base measure clearly

---

## 🎯 Best Practices

1. Use short, consistent unit names
2. Keep naming aligned with product entry screens
3. Use standard abbreviations where helpful, such as `pcs`, `kg`, and `L`
4. Validate unit reuse before allowing deletion
5. Keep conversion labels human-readable

---

## 📚 Related Documentation

- [Product Management Module](./product.md)
- [Inventory Management Module](./inventory.md)
- [Database Schema](../database/schema-overview.md)
- [Products API](../api/products-api.md)

---

**Last Updated:** June 13, 2026
