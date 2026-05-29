# ApexERP Premium Frontend Dashboard Design Prompts

Welcome to the **ApexERP** UI/UX implementation guide. This document contains a comprehensive, highly detailed catalog of screen-by-screen prompts designed for modern AI code generators (e.g., **v0.dev**, **Lovable.dev**, **Bolt.new**, **Cursor**, or **ChatGPT**) to build a state-of-the-art, premium frontend dashboard for our multi-tenant ERP system.

Each prompt has been custom-tailored to align with the underlying database schema and modular architecture of our backend.

---

## 🎨 System Brand & Design Token Blueprint

Before generating any screen, supply the AI with this core design blueprint to ensure a coherent, high-end, visual aesthetic across the entire application:

```json
{
  "theme": "Modern Enterprise Glassmorphism (Premium Dark & Light Modes)",
  "brand_name": "ApexERP",
  "fonts": {
    "heading": "Outfit (Google Fonts)",
    "body": "Inter (Google Fonts)"
  },
  "colors": {
    "light": {
      "background": "#F8FAFC",
      "surface": "rgba(255, 255, 255, 0.7)",
      "primary": "#4F46E5 (Indigo)",
      "secondary": "#0EA5E9 (Sky Blue)",
      "accent": "#10B981 (Emerald)",
      "destructive": "#EF4444 (Rose Red)",
      "border": "rgba(226, 232, 240, 0.8)",
      "text_primary": "#0F172A",
      "text_secondary": "#475569"
    },
    "dark": {
      "background": "#0B0F19",
      "surface": "rgba(17, 24, 39, 0.6)",
      "primary": "#6366F1 (Indigo Violet)",
      "secondary": "#38BDF8 (Sky)",
      "accent": "#34D399 (Emerald Green)",
      "destructive": "#F87171 (Rose Red)",
      "border": "rgba(255, 255, 255, 0.08)",
      "text_primary": "#F8FAFC",
      "text_secondary": "#94A3B8"
    }
  },
  "glassmorphism": {
    "backdrop_filter": "blur(12px) saturate(180%)",
    "box_shadow": "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
    "border_radius": "16px"
  },
  "micro_interactions": {
    "hover": "scale(1.02) transition-all duration-300 ease-out",
    "active": "scale(0.98)"
  }
}
```

---

## 🚀 Screen-by-Screen AI Prompts

Below are the production-grade, highly structured prompts for each screen. Copy and paste them into your chosen UI generator tool.

---

### Slide Carousel & Prompt Menu
````carousel
# Auth & Stripe Billing Prompt
```markdown
[PROMPT #1] Auth, Plan Selection & Stripe Billing
```
<!-- slide -->
# Company Setup Prompt
```markdown
[PROMPT #2] Multi-Tenant Onboarding Wizard
```
<!-- slide -->
# Base Dashboard Shell Prompt
```markdown
[PROMPT #3] Modern Interactive Portal Shell
```
<!-- slide -->
# Core Dashboard Analytics Prompt
```markdown
[PROMPT #4] Interactive KPI & Financial Dashboard
```
<!-- slide -->
# User & Roles Management Prompt
```markdown
[PROMPT #5] RBAC Customizer and User Directory
```
<!-- slide -->
# Inventory & Product Wizard Prompt
```markdown
[PROMPT #6] Catalog and Product Wizard
```
<!-- slide -->
# Stock Transfers Prompt
```markdown
[PROMPT #7] Cross-Branch Stock Transfers
```
<!-- slide -->
# Premium POS Terminal Prompt
```markdown
[PROMPT #8] Advanced Omnichannel POS Terminal
```
<!-- slide -->
# Accounting Ledger Prompt
```markdown
[PROMPT #9] Double-Entry Bookkeeping Ledger
```
<!-- slide -->
# Tax & VAT Auditor Prompt
```markdown
[PROMPT #10] Compliance & VAT Transaction Audit
```
````

---

### 1. User Authentication, Plan Selection & Stripe Billing Screen
**File Reference:** [subscription.md](file:///d:/MyDev/business/erp/backend/docs/modules/subscription.md)

```markdown
Role: Lead UI/UX Engineer & Senior React Developer
Task: Generate a premium, high-converting unified Auth and Pricing/Subscription Selection Screen for a multi-tenant ERP system named "ApexERP".

AESTHETICS:
- Elegant, immersive dark-themed landing style with a moving, subtle mesh-gradient background (Deep Indigo, Sky Blue, Dark Slate).
- Premium glassmorphic login card centering the screen with 12px backdrop-blur, subtle thin glowing borders (rgba(255,255,255,0.08)), and drop shadows.
- Beautiful, high-fidelity pricing selector with animated toggles for Monthly/Yearly plans.

SCREEN FLOW & LAYOUT:
1. Phase 1: Sleek Sign-In Panel
   - Floating input fields with active floating labels for Email and Password.
   - Smooth active state glows around inputs when focused.
   - Elegant "Sign In with Google" SSO button featuring custom SVGs and clean white/dark backgrounds.
   - Underneath, show custom validation handling.
2. Phase 2: Plan Selection Matrix (Revealed after successful Login if subscription is inactive)
   - A toggle component to switch billing cycles (Monthly vs Yearly) with a "Save 17%!" gold badge.
   - Two premium pricing cards:
     * "Growth Plan" (Monthly): 5,000 BDT/month. Ideal for emerging single-branch retail operators.
     * "Enterprise Plan" (Yearly): 50,000 BDT/year. Best value, unlocks multi-branch management, advanced tax modules, and complete accounting ledger exports.
   - Both cards must include a glowing border, sleek checkmarked bullet lists of features, dynamic CTA buttons stating "Activate Subscription", and a footer with a security disclaimer.
   - Interactive hover micro-animations that raise the card and increase its glow on hover.

FUNCTIONAL LOGIC:
- Integrate state management for the active Auth token, active billing toggle (`MONTHLY` vs `YEARLY`), and a loading state overlay with custom shimmer placeholders.
- When clicking "Activate Subscription", simulate a POST call to `/api/v1/subscription/checkout` with a request body structure of `{"userId": "uuid", "plan": "MONTHLY" | "YEARLY"}`.
- Trigger a beautifully styled modal showing a "Redirecting to Stripe Secure Payment Gateway..." progress ring, simulating Stripe Checkout handoff.

Use Tailwind CSS and Lucide React icons. Ensure the screen is fully responsive.
```

---

### 2. First-time Company & Branch Setup Onboarding Wizard
**File References:** [company-branch.md](file:///d:/MyDev/business/erp/backend/docs/modules/company-branch.md) | [role_permission_setup.md](file:///d:/MyDev/business/erp/backend/docs/modules/role_permission_setup.md)

```markdown
Role: Lead Product Designer & React Developer
Task: Generate a gorgeous, multi-step Onboarding Setup Wizard for "ApexERP" that coordinates multi-tenant initialization in a single structured flow.

AESTHETICS:
- Immersive Light/Dark adaptive UI utilizing neutral slate gradients, high-end typography (Outfit font for headings), and progress tracking indicators.
- Large card container with modern drop shadows, soft border radius (24px), and comfortable page margins.

WIZARD FLOW & UI COMPONENTS:
1. Top Header:
   - Brand logo with a dynamic step tracker.
   - Visual progress bar showing completion percentage, utilizing smooth CSS ease-in-out animations.
2. Step 1: Company Profile Info
   - Inputs for Company Name, Industry Selector (Retail, Restaurant, Wholesale, Manufacturing), Local Currency Selector (defaulting to BDT), and Corporate Tax ID.
3. Step 2: Primary Branch Settings
   - Fields to establish the default branch: Branch Name (prefilled as "Main Branch / HQ"), Physical Address, Branch Phone Number, and Branch Manager email.
4. Step 3: Initialization Summary & Final Confirmation
   - Summarized view of inputs in an structured, clean list.
   - A descriptive notice detailing the backend orchestration: "Confirming setup will automatically initialize your global permission registry, create the default 'super-admin' role, map all permissions, assign you as the primary super-admin, and grant you full access to the primary branch."
   - Clickable "Finalize Setup" button with an active loading spinner state.

FUNCTIONAL BEHAVIOR:
- Utilize React Hook Form with Zod validation. Inputs must display instantaneous, styled error indicators if left blank.
- The "Finalize Setup" button triggers a POST request to `/api/v1/companies/setup` and renders a full-page animated checkmark success state before redirecting to the main dashboard.

Implement using React, Tailwind CSS, and Lucide React.
```

---

### 3. Core App Layout Shell & Responsive Navigation Sidebar
**File Reference:** [role_permission_setup.md](file:///d:/MyDev/business/erp/backend/docs/role_permission_setup.md)

```markdown
Role: UI Engineer & Next.js Expert
Task: Build a production-grade, highly interactive responsive Navigation Sidebar & Layout Shell for the "ApexERP" portal.

AESTHETICS:
- Sleek, semi-transparent blur-glass sidebar (12% opacity background, backdrop-blur-xl) on the left side.
- Dark/Light mode theme toggle utilizing a dual Sun/Moon animated icon with micro-interactions.
- Seamless interactive states: Selected items must highlight with a subtle color pill and a soft left-aligned vertical brand border glow.

SIDEBAR SECTIONS & NAVIGATION ITEMS (Grouped by Permissions):
- Header: Elegant brand typography with a collapsible drawer icon.
- Branch Selector Dropdown: A premium combobox showing current active branch (e.g. "Main Warehouse - Dhaka") with indicators to switch branch contexts instantly.
- Section 1: Business Overview
  - Dashboard (Home Icon)
- Section 2: Core Operations
  - Sales & POS (Credit Card/Shopping Cart Icons)
  - Products & Inventory (Box/Barcode Icons)
  - Purchases & Supply (Truck/Briefcase Icons)
- Section 3: Finance & Administration
  - Accounts Ledger (Library/FileText Icons)
  - Tax & VAT (Receipt Icon)
  - Team & Security (Shield/Users Icons)
  - Billing & Stripe Settings (Settings/Wallet Icons)

NAVBAR FEATURES:
- Left: Collapsible menu button, page title breadcrumbs.
- Middle: Global Search Input (`Ctrl + K` Command Palette shortcut) showing active glassmorphic hover suggestions.
- Right: Notification Bell displaying an animated active red pulse circle; User Profile dropdown showcasing avatar, User Name, "Super Admin" pill, and Branch details.

RESPONSIVENESS & STATES:
- Left sidebar collapses smoothly into a mini-icon bar on tablet sizes, and slides completely off-screen on mobile devices with a slide-in overlay drawer.
- Create full hover transition effects for all menu links.

Use Tailwind CSS and React with Lucide icons.
```

---

### 4. Interactive KPI Overview & Analytics Dashboard
**File References:** [sales.md](file:///d:/MyDev/business/erp/backend/docs/modules/sales.md) | [inventory.md](file:///d:/MyDev/business/erp/backend/docs/modules/inventory.md) | [accounting.md](file:///d:/MyDev/business/erp/backend/docs/modules/accounting.md)

```markdown
Role: Full Stack Dashboard Developer & Data Visualization Expert
Task: Generate a gorgeous, interactive KPI and Data Analytics Dashboard page for "ApexERP".

AESTHETICS:
- Futuristic light/dark responsive dashboard dashboard.
- Elegant grid system with hoverable cards containing drop-shadows and mini-sparkline visualizations.
- Interactive charts utilizing smooth modern custom theme colors (Indigo, Cyan, Jade).

PAGE COMPONENTS:
1. Top KPI Grid (4 Premium Cards):
   - Card 1: Today's Total Sales. Big bold display: "৳ 1,35,420 BDT" with a "+12.4% vs yesterday" green pill. Includes a mini sparkline chart showing sales velocity throughout the day.
   - Card 2: Inventory Valuation. Display: "৳ 24,50,000 BDT" showcasing stock levels split by "Goods" vs "Services".
   - Card 3: Receivables & Payables. Display: "৳ 3,20,000 BDT Due" with a caution icon warning about outstanding invoices.
   - Card 4: Low Stock Warnings. Display: "18 Items Alert" in a dark rose badge with quick-actions to generate purchase orders.
2. Analytics Section (Double-Column Layout):
   - Column A: Dynamic Sales vs Purchases Area Chart (interactive tooltips, range selectors: 7 days, 30 days, Year).
   - Column B: Inventory Distribution Donut Chart displaying top stock categories (e.g., Electronics, Consumables) with interactive slice tooltips.
3. Bottom Activity Feed & Branch Leaderboard:
   - Left Pane: Real-time event log ("John Doe generated Invoice INV-2026-0045", "Dhaka Store completed stock transfer").
   - Right Pane: Branch Performance leaderboard ranking multi-branch sales conversions using progress bars.

INTERACTIVE FEATURES:
- Selecting a different active branch context in the dashboard automatically cascades a recalculation animation across all charts and numbers.
- Provide a date range picker component with calendar flyouts.

Use Tailwind, Lucide React, and Recharts (or Tremor library specs).
```

---

### 5. Multi-Tenant Role & Permission Customizer & Staff Directory
**File Reference:** [role_permission_setup.md](file:///d:/MyDev/business/erp/backend/docs/role_permission_setup.md)

```markdown
Role: Security UI Engineer & Frontend React Architect
Task: Generate an enterprise-grade Role Customizer and User Management screen for "ApexERP".

AESTHETICS:
- Advanced, professional table grid view with pristine micro-typography.
- Colorful, distinct badges for roles and status, featuring highly responsive action menus.
- Split-screen detail layout or slide-over drawer panel for granular role configuration.

SCREEN ARCHITECTURE:
1. Left Half: User Directory List
   - Search bar with instant list filtering.
   - Interactive table showcasing user info (Avatar, Email, Associated Branch badges, Assigned Role, Status toggle).
   - Row action buttons to edit branch access, assign alternative roles, or suspend user.
2. Right Half: Granular Role & Permission Customizer Matrix
   - A selector to select active role ("Super Admin", "Sales Agent", "Branch Manager", "Accountant").
   - Multi-tab UI grouping permissions by domain as defined in schema setup:
     * User & Staff (create_user, update_user, assign_role)
     * Product Catalog (create_product, view_product, manage_categories)
     * Sales & POS (create_sales_order, process_payment, apply_discount)
     * Inventory & Stock (view_stock, adjust_stock, transfer_stock)
     * Finance & VAT (create_journal_entry, view_vat_reports)
   - Every permission must have an interactive, beautiful custom toggle switch, dynamic description text explaining what authorization is granted, and an audit status tag showing if it is currently system-inherited or custom-assigned.

INTERACTIVE LOGIC:
- Checking/unchecking a toggle reflects in real-time inside state.
- Include a "Create New Custom Role" button that reveals a floating modal with an input for "Role Name" and compound uniqueness constraint disclaimer ("Role names must be unique within your company context").
- Validate edits and trigger a green toast popup stating "Permissions updated successfully."

Use Tailwind CSS, Lucide icons, and Framer Motion for slide animations.
```

---

### 6. Product Catalog & Drag-and-Drop Product Wizard
**File Reference:** [inventory.md](file:///d:/MyDev/business/erp/backend/docs/modules/inventory.md)

```markdown
Role: Senior UI/UX Designer & React Developer
Task: Generate a dynamic Product Catalog grid and a step-by-step "Add Product" Creator Drawer.

AESTHETICS:
- Modern catalog displaying visual grid cards or tight tabular inventory lines (user toggled).
- Beautiful product card animations, glowing barcodes, clean price tag displays, and low-stock indicators.
- Seamless slide-in drawer layout on the right for adding/editing products.

COMPONENTS & SECTIONS:
1. Header Bar:
   - Toggle buttons (Grid view vs List view), Search bar, category filters, and an "+ Add Product" button.
2. Catalog Grid:
   - Product cards showcasing Product Name, SKU, Barcode, Stock Quantity per active branch (e.g. "HQ: 45 units", "Warehouse: 12 units"), Product Type badge ("GOODS" or "SERVICE"), and Cost vs Retail Price tags.
   - Low-stock warning banner overlaying cards with levels <= reorder levels.
3. Multi-Tab Add/Edit Product Wizard (Right-side slide-out Drawer):
   - Tab A: General Info (Product Name, Category & Subcategory dropdowns, auto-generated SKU preview, and custom UoM measurements like pcs, kg, box).
   - Tab B: Pricing & Taxes (Cost Price input, Retail Selling Price input, allow-discount checkbox, dynamic Profit Margin percentage calculator, and local VAT Rate % dropdown).
   - Tab C: Stock & Thresholds (Initial Stock, Reorder Point, and active checkboxes to select branches).
   - Tab D: Barcode & Media (A file drop-zone area, barcode image generator preview showing code scanner guidelines).

FUNCTIONAL CALCULATIONS:
- Dynamic margin calculation: `Profit Margin % = ((Selling Price - Purchase Price) / Selling Price) * 100`. Recalculate this value as the user types prices.
- Instant validation checking that SKU and Barcodes are unique.

Use React, Tailwind CSS, Lucide icons, and smooth drawer transitions.
```

---

### 7. Branch-to-Branch Stock Transfer & Physical Adjustment Portal
**File Reference:** [inventory.md](file:///d:/MyDev/business/erp/backend/docs/modules/inventory.md)

```markdown
Role: Enterprise Workflow UI/UX Engineer
Task: Create a robust Branch Stock Transfer and Adjustment management screen.

AESTHETICS:
- Structured workflow boards utilizing directional visual elements (arrows, maps, active source-to-destination connection bars).
- Solid glass components, high contrast text, readable transaction dates, and real-time validation warnings.

SCREEN ARCHITECTURE:
1. Top Section - Branch Transfer Setup:
   - "Source Branch" selection box with details on current warehouse capacity.
   - Directional flowing arrow containing animated glowing pulses.
   - "Destination Branch" selection box.
2. Middle Section - Stock Item Selector Cart:
   - Dynamic, filterable combobox search to look up products in the Source Branch.
   - Grid listing selected products to transfer, showcasing: SKU, current source stock, transfer quantity inputs, and destination stock pre-estimates.
   - Quantitative validation: If user inputs a transfer quantity higher than available stock at source, flag the input field red and display "Insufficient source stock!" below it.
3. Bottom Section - Verification & Action:
   - Input for "Transfer Reference / Reason" (e.g., Seasonal Stock Rebalancing).
   - Clear summary of total items, weight/volumetric estimates, and an "Initiate Transfer" button.
4. Historical Transfers Audit Log Table:
   - Table showing past transfers: Reference ID, Date, Source-to-Destination, Items count, and Status badges ("PENDING", "IN_TRANSIT", "COMPLETED").

FUNCTIONAL LOGIC:
- Double-entry stock impact concept validation: Verify stock drops at source and rises at destination upon approval.
- An animated drawer showing detailed stock movement history logs upon clicking a transfer row.

Build using React, Tailwind CSS, and Lucide icons.
```

---

### 8. Advanced Omnichannel Point of Sale (POS) Terminal Screen
**File Reference:** [sales.md](file:///d:/MyDev/business/erp/backend/docs/modules/sales.md)

```markdown
Role: Lead POS Engineer & Expert React UI Developer
Task: Generate the ultimate, premium, high-speed Point of Sale (POS) Terminal interface for "ApexERP".

AESTHETICS:
- High-performance, full-height dual-pane layout designed for 1080p and tablet displays.
- Dark mode optimized glassmorphism shell allowing operators to work for long hours without eye strain.
- Ultra-responsive tactile active button states, card grids with rapid hover highlights, and compact tabular bill lists.

CORE WORKSPACE COMPONENT BREAKDOWN:
1. Left Pane: Product Catalog Grid & Search (60% Width)
   - Fast Search Bar (focused automatically on load, maps barcode scanner events).
   - Horizontal sliding Category Pills (All, Electronics, Apparel, Foods, etc.).
   - Responsive Product Cards grid: Large clickable area showing Product Image, Product Name, price tag ("৳ 450 BDT"), and dynamic circular stock badges (green if >10, yellow if low, red if out-of-stock).
   - Counter, Table, Takeaway, Delivery selector toggle buttons at the top.
2. Right Pane: Active Bill & Checkout Drawer (40% Width)
   - Selected Customer bar featuring quick search, customer loyalty points, and a "+" button to trigger a "Quick Add Customer" modal.
   - Invoice Cart List: Scrollable container displaying items added, with quantitative adjustments (+/- buttons), pricing, item-level discounts, and a delete trash can button.
   - Live Invoice Calculator Panel showing calculated breakdown:
     * Subtotal Before VAT: Sum of (item qty * selling price).
     * Applied Discount: Dynamic deduction input field (flat discount / percentage toggle).
     * VAT / Tax: Auto-calculated total based on individual product VAT rate percentages.
     * Grand Total: Large, glowing font display ("৳ 12,450 BDT").
   - Checkout Button Panel: Giant green "Pay Now" trigger.
3. Interactive Payment Drawer Modal (Triggered by "Pay Now"):
   - Payment method toggle group: cash, bank transfer, mobile payment (bKash/Nagad), and cheque.
   - Numerical calculator keypad for entering received amount.
   - Live calculations: Displaying "Amount Due" or "Change to Return" in highlighted status boxes.
   - Big print button that generates a beautiful, animated, high-fidelity receipt layout matching thermal printer widths (58mm/80mm), complete with brand logo, invoice number sequence `INV-2026-XXXX`, item tables, and a barcode.

UX REQUIREMENTS:
- Standard walk-in customer default.
- Fast cart interactions with smooth fade-in animations on item insertion.

Use Tailwind CSS, Framer Motion, and Lucide icons.
```

---

### 9. General Ledger & Double-Entry Bookkeeping Accounting Hub
**File Reference:** [accounting.md](file:///d:/MyDev/business/erp/backend/docs/modules/accounting.md)

```markdown
Role: FinTech UI Architect & Senior React Engineer
Task: Create a robust General Ledger and double-entry Journal Entry Voucher system for "ApexERP".

AESTHETICS:
- Elegant corporate layout using clean slate/slate-900 color palettes.
- Detailed hierarchical tree layout for the Chart of Accounts.
- Advanced ledger balance sheets displaying credit/debit indicators (Green/Red values).

COMPONENTS & FUNCTIONAL FLOW:
1. Chart of Accounts Tree (Left Side):
   - Collapsible categories showing Asset, Liability, Equity, Income, and Expense directories.
   - Sub-accounts listings (Cash, Trade Receivables, Inventory, VAT Payable, Owner Equity) with current balances.
2. Double-Entry Journal Entry Voucher (Right Side):
   - Sleek form to post manual journal entries.
   - Top fields: Transaction Date, Reference/Voucher Number, and Description/Narration.
   - Line Items Table with dynamic rows. Each row has: Account selection combobox, debit/credit input fields, and dynamic delete buttons.
   - Bottom Validation Panel: Live-calculated Debits Total and Credits Total.
   - CRITICAL VALIDATION RULE: Display a bright red warning badge stating "Voucher is out of balance! Debits must equal Credits" if the totals do not match, and disable the "Post Journal Entry" button. Show a green checkmark stating "Voucher in Balance" when they match.
3. Historical Journal Entries Table:
   - Multi-column ledger table illustrating: Date, Voucher Number, Account Details (debits indented, credits indented), Amount, and Posting status badges.

FUNCTIONAL EXPECTATIONS:
- Fully interactive adding and deleting of entry rows.
- Ensure the math values update in real-time on every input stroke.

Use Tailwind CSS, Lucide icons, and advanced React form logic.
```

---

### 10. Tax Configurations & VAT Compliance Auditor
**File Reference:** [tax-vat.md](file:///d:/MyDev/business/erp/backend/docs/modules/tax-vat.md)

```markdown
Role: FinTech Compliance Designer & Frontend Developer
Task: Generate a pristine Tax and VAT Compliance Audit dashboard screen for "ApexERP".

AESTHETICS:
- Sleek tax accountant layout featuring dark indigo accents, security borders, and prominent numeric metric blocks.
- Informative progress bars representing tax liability ratios.
- Clean audit tables featuring sorting, search, and CSV/PDF export actions.

SCREEN COMPONENT BREAKDOWN:
1. Top Metrics Bar (Tax Summary):
   - Total Output VAT (VAT collected from sales invoices).
   - Total Input VAT (VAT paid on purchase invoices).
   - Net VAT Payable/Receivable: Large colored pill (Red if Payable, Green if Receivable refund due) utilizing formula: `Net VAT = Output VAT - Input VAT`.
2. Tax Rate Configuration Panel:
   - Dynamic cards representing active Tax Rates (e.g. Standard 15%, Exempt 0%, Reduced 5%).
   - Inputs to adjust tax parameters and add new tax rules.
3. VAT Transactions Auditor:
   - High-fidelity grid logging transaction records: Transaction Date, Reference ID (linked to Sales/Purchase Invoice), Transaction Type (Sale vs Purchase), Base Taxable Amount, Tax Rate applied, VAT amount, and Audit Check status.
   - Detail expander drawer: Clicking any row slides open a breakdown of compliance metrics.

INTERACTIVE STATES:
- Range picker filtering results by fiscal quarters.
- Animated progress bar showing what percentage of sales was taxable vs exempt.

Construct with React, Tailwind CSS, and Lucide icons.
```

---

## 🛠️ How to Feed These Prompts into AI Codegen Tools

For optimal code output when pasting these prompts into AI generators, follow this sequence:

1. **Paste the Design Token Blueprint first**: Instruct the AI, *"I want to build a React application called ApexERP. First, memorize this brand theme, typography, color palette, and layout system. Do not write any code yet, just confirm you understand."*
2. **Select and Paste a Screen Prompt**: Once the AI confirms, select the specific prompt (e.g., **[PROMPT #8] Advanced Omnichannel POS Terminal**) and paste it.
3. **Iterate on Component Details**: After the initial render, customize specific parts by saying, *"Now add the bKash payment verification modal"* or *"Make the receipt printable layout scrollable."*
4. **Export Code**: Once satisfied with the UI output, extract the components, map them to your backend API endpoints, and plug them into your Next.js directory.

---

**Last Updated:** May 29, 2026  
**Document Version:** 1.1.0  
**Target Architecture:** Next.js (App Router), Tailwind CSS, Lucide Icons, Framer Motion
