# ERP Backend System Documentation

Welcome to the ERP Backend API documentation. This comprehensive guide covers all aspects of the system architecture, implementation, and usage.

## 📚 Documentation Structure

### 🏗️ [Architecture](./architecture/)

High-level system design and architectural decisions

- [System Overview](./architecture/system-overview.md)
- [Technology Stack](./architecture/technology-stack.md)
- [Data Flow](./architecture/data-flow.md)
- [Security Architecture](./architecture/security-architecture.md)
- [Role & Permission Setup](./role_permission_setup.md)

### 🗄️ [Database](./database/)

Database schema, design patterns, and relationships

- [Schema Overview](./database/schema-overview.md)
- [Entity Relationships](./database/entity-relationships.md)
- [Design Decisions](./database/design-decisions.md)

### 📦 [Modules](./modules/)

Business module documentation

- [Authentication & Authorization](./modules/authentication.md)
- [Company & Branch Management](./modules/company-branch.md)
- [Product & Inventory Management](./modules/inventory.md)
- [Purchase Management](./modules/purchase.md)
- [Sales & POS Management](./modules/sales.md)
- [Payment & Accounting](./modules/accounting.md)
- [Tax & VAT Management](./modules/tax-vat.md)
- [Stock Movement](./modules/stock-movement.md)

### 🔌 [API Reference](./api/)

RESTful API endpoint documentation

- [Authentication API](./api/authentication-api.md)
- [Products API](./api/products-api.md)
- [Sales API](./api/sales-api.md)
- [Purchase API](./api/purchase-api.md)
- [Inventory API](./api/inventory-api.md)

### 📊 [Diagrams](./diagrams/)

Visual representations of system architecture and workflows

- Entity Relationship Diagrams
- Sequence Diagrams
- Data Flow Diagrams

### 🚀 [Deployment](./deployment/)

Environment setup and deployment guides

- [Environment Setup](./deployment/environment-setup.md)
- [Infrastructure](./deployment/infrastructure.md)

---

## 🎯 Quick Start Guide

### For Developers

1. Read [System Overview](./architecture/system-overview.md) for high-level understanding
2. Review [Database Schema](./database/schema-overview.md) to understand data structure
3. Explore [Module Documentation](./modules/) for business logic details
4. Reference [API Documentation](./api/) for endpoint implementation

### For Architects

1. Start with [System Overview](./architecture/system-overview.md)
2. Review [Technology Stack](./architecture/technology-stack.md)
3. Understand [Security Architecture](./architecture/security-architecture.md)
4. Check [Design Decisions](./database/design-decisions.md)

### For DevOps

1. Review [Environment Setup](./deployment/environment-setup.md)
2. Check [Infrastructure](./deployment/infrastructure.md)

---

## 📋 System Overview

### Purpose

A comprehensive ERP (Enterprise Resource Planning) system designed to manage complete business operations including inventory, sales, purchases, accounting, and multi-branch management.

### Key Features

- 🔐 Role-based access control (RBAC)
- 🏢 Multi-company and multi-branch support
- 📦 Real-time inventory management
- 💰 Complete accounting system with double-entry bookkeeping
- 🛒 Purchase order and invoice management
- 💳 POS and sales management
- 📊 VAT and tax calculation
- 👥 Customer and supplier management

### Technology Stack

- **Backend:** Node.js + Express + TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Validation:** Zod

---

## 🔧 Core Modules

### 1. Authentication & Authorization

User management, roles, permissions, and access control

### 2. Company & Branch Management

Multi-tenant architecture with company and branch organization

### 3. Product & Inventory Management

Product catalog, categories, pricing, and stock tracking

### 4. Purchase Management

Purchase orders, invoices, supplier management

### 5. Sales & POS Management

Sales orders, invoices, customer management, POS operations

### 6. Payment & Accounting

Payment processing, journal entries, account ledgers

### 7. Tax & VAT Management

Tax rate configuration and VAT transaction tracking

### 8. Stock Movement

Inventory tracking with reasons and references

---

## 📝 Documentation Status

| Section      | Status         | Last Updated |
| ------------ | -------------- | ------------ |
| Architecture | 🟡 In Progress | Dec 31, 2025 |
| Database     | 🟡 In Progress | Dec 31, 2025 |
| Modules      | 🟡 In Progress | Dec 31, 2025 |
| API          | ⚪ Planned     | -            |
| Diagrams     | ⚪ Planned     | -            |
| Deployment   | ⚪ Planned     | -            |

---

## 🤝 Contributing to Documentation

When updating documentation:

1. Keep it clear and concise
2. Include code examples where relevant
3. Update the "Last Updated" date
4. Follow the existing structure and formatting

---

## 📧 Support

For questions or clarifications about the system:

- Review the relevant documentation section
- Check the API reference for endpoint details
- Refer to code comments in the implementation

---

**Last Updated:** December 31, 2025
**Version:** 1.0.0
