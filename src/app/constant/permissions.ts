export const permissions = [
  // User management permissions
  'create_user',
  'view_user',
  'update_user',
  'delete_user',
  'assign_role',

  // Product & Catalog Management permissions
  'create_product',
  'view_product',
  'update_product',
  'delete_product',
  'manage_pricing',
  'manage_categories',
  'manage_units',

  // Sales & POS Operations permissions
  'create_sales_order',
  'create_sales_invoice',
  'view_sales',
  'process_payment',
  'apply_discount',
  'manage_customers',

  // Purchase & Supply Operations permissions
  'create_purchase_order',
  'create_purchase_invoice',
  'view_purchases',
  'approve_purchase',
  'manage_suppliers',

  // Inventory & Warehouse Management permissions
  'view_stock',
  'adjust_stock',
  'transfer_stock',
  'manage_payments',

  // Tax & VAT Management permissions
  'manage_tax_rates',
  'view_tax_reports',

  // System Administration permissions
  'manage_company',
  'manage_branch',
  'manage_roles',
  'manage_permissions',
  'system_settings',
  'view_billing',
  'manage_billing',
] as const;

export type Permission = typeof permissions[number];
