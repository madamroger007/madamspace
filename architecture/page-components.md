You want a **`agents.md`** file that instructs AI (or developers using AI) to **split large page files into small reusable components**, like **Lego blocks**. This is a great approach for AI-assisted development.

Below is a clean **`agents.md`** you can place in your repo root.

---

# agents.md

AI Coding Guidelines — Component Decomposition

## Purpose

This document instructs AI agents and developers to structure code in a **modular component-based architecture**.

All large files (especially **page files**) must be **decomposed into smaller components** that behave like **Lego blocks**. This improves:

* readability
* maintainability
* reusability
* AI-assisted development

---

# Core Principle

### Pages should orchestrate, not implement UI.

A **page file must only coordinate components**, not contain large UI logic.

Bad example:

```tsx
export default function DashboardPage() {
  return (
    <div>
      <header>...</header>
      <form>...</form>
      <table>...</table>
      <modal>...</modal>
    </div>
  )
}
```

Good example:

```tsx
import DashboardHeader from "./components/dashboard-header"
import UserTable from "./components/user-table"
import CreateUserModal from "./components/create-user-modal"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader />
      <UserTable />
      <CreateUserModal />
    </>
  )
}
```

Pages should behave like **composition layers**.

---

# Component Decomposition Rule

When a page exceeds **~100 lines**, the AI must split it into components.

Break the UI into logical parts:

| UI Part      | Component     |
| ------------ | ------------- |
| Header       | `header.tsx`  |
| Table        | `table.tsx`   |
| Form         | `form.tsx`    |
| Modal        | `modal.tsx`   |
| Button group | `actions.tsx` |

Example structure:

```
dashboard/
 ├ page.tsx
 └ components/
    ├ dashboard-header.tsx
    ├ user-table.tsx
    ├ create-user-modal.tsx
    └ user-actions.tsx
```

---

# Component Design Rules

### 1. Components must be small

Ideal component size:

```
30–80 lines
```

Large components must be decomposed further.

---

### 2. Components must have single responsibility

Bad:

```
UserTable
 ├ fetch data
 ├ render table
 ├ open modal
 ├ delete user
```

Good:

```
UserTable
UserRow
UserActions
DeleteUserDialog
```

---

### 3. Business logic must NOT live in UI components

Business logic must live in **services**.

Architecture:

```
db → repositories → service → api → component → page
```

Components should only:

* render UI
* call API
* manage local state

---

# Example Decomposition

### Before (Bad)

`page.tsx`

```
Dashboard
 ├ Header
 ├ Search input
 ├ Table
 ├ Pagination
 ├ Modal
 ├ Form
 └ Buttons
```

### After (Good)

```
dashboard/
 ├ page.tsx
 └ components/
    ├ dashboard-header.tsx
    ├ user-search.tsx
    ├ user-table.tsx
    ├ user-row.tsx
    ├ pagination.tsx
    ├ create-user-modal.tsx
    └ user-form.tsx
```

---

# Data Flow Pattern

Components must follow this flow:

```
API
 ↓
Service
 ↓
Hook
 ↓
Component
 ↓
Page
```

Example:

```
useUsers()
   ↓
UserTable
   ↓
DashboardPage
```

---

# Reusable Component Library

Shared UI components should be placed in:

```
components/ui/
```

Example:

```
components/ui/
 ├ button.tsx
 ├ input.tsx
 ├ modal.tsx
 ├ table.tsx
 └ badge.tsx
```

Pages must reuse these components instead of recreating UI elements.

---

# Naming Convention

Components must follow **kebab-case** naming.

Examples:

```
user-table.tsx
create-user-modal.tsx
payment-form.tsx
email-preview-card.tsx
```

---

# AI Refactor Instructions

When an AI agent encounters a large page file, it must:

1. Identify UI sections
2. Extract them into components
3. Move components into a `components/` folder
4. Replace inline UI with component imports
5. Preserve functionality

---

# Example AI Task

Input:

```
page.tsx
```

Output:

```
page.tsx
components/
 ├ header.tsx
 ├ table.tsx
 ├ form.tsx
 └ modal.tsx
```

---

# Goal

The project should evolve into **composable Lego-style UI architecture** where pages assemble components like:

```
<Page>
 ├ Header
 ├ Filters
 ├ Table
 ├ Pagination
 └ Modals
```

This ensures:

* faster development
* easier AI collaboration
* scalable UI architecture

