# 🏢 City Lake Enterprises Platform

![City Lake Cover](https://via.placeholder.com/1200x400/800000/FFFFFF?text=City+Lake+Enterprises)

City Lake Enterprises is a comprehensive ERP and business management platform that unifies two distinct business divisions into a single, cohesive ecosystem:
1. **Fairview Apartments**: A complete property management system covering tenant lifecycle, lease tracking, maintenance requests, and automated invoicing.
2. **City Lake Water Services**: A robust digital POS and inventory system for the ground-floor water purification and distribution business.

This monolithic application leverages a modern React frontend architecture coupled with a high-performance Express/Node backend and a Prisma-managed SQLite database to deliver a state-of-the-art SaaS experience.

---

## ✨ Key Features

### 🔐 Enterprise Role-Based Access Control (RBAC)
The application dynamically routes users to heavily sandboxed portals based on their assigned roles. The authentication mechanism strictly validates login tabs, ensuring absolute segregation of data between property managers, water staff, and tenants.
* **Super Admin**: Omni-level access. Oversee property metrics, water sales, global settings, and staff provisioning.
* **Apartment Manager**: Dedicated portal for monitoring room vacancies, tenant profiles, maintenance pipelines, and rent ledgers.
* **Water Staff**: Specialized digital Point-of-Sale (POS) environment for rapid water dispatching, inventory deduction, and shift reporting.
* **Tenant**: Personal self-service portal for tracking invoices, submitting maintenance requests, and reading community notices.

### 💧 Real-Time Digital POS System
Built exclusively for City Lake Water Services, the Digital POS features:
* **Quick Checkout**: One-click product additions (Refills, New Bottles, Dispenser Sales).
* **Multi-Payment Parsing**: Support for Cash, M-Pesa, and integrated tenant billing.
* **Automated Delivery Logistics**: Automatically evaluates online water orders for free-delivery eligibility based on exact time windows and volume rules.
* **EOD Reporting**: Generate and export end-of-day sales ledgers in CSV format.

### 🏢 Property Management Core
* **Interactive Room Availability**: Visual grid tracking vacant, occupied, and reserved rooms.
* **Automated Billing Engine**: Recurring invoice generation for rent, utility sub-metering, and ad-hoc fees.
* **Maintenance Ticketing**: Tenants can log issues with photos, and managers can assign statuses (Pending, In Progress, Resolved).

### 🎨 Premium UI/UX & Global Theme Persistence
* **Adaptive Design**: Built with Tailwind CSS, featuring glassmorphism elements, micro-animations, and smooth page transitions.
* **Dark Mode**: Native Dark/Light mode persistence managed via Zustand and `localStorage`, applying instantly across all nested routes and layouts.
* **Nested Dashboard Routing**: Seamless SPA navigation utilizing React Router v6 Outlet architecture. Sidebar navigation never triggers full-page reloads.

---

## 🛠️ Technology Stack

**Frontend**
* React 18
* Vite
* React Router v6 (Nested Layouts)
* Tailwind CSS (V4)
* Zustand (Global State & Auth Persistence)
* Framer Motion (Animations)
* Lucide React (Iconography)
* React Hot Toast (Notifications)

**Backend & Database**
* Node.js / Express.js
* Prisma ORM (v5.14.0)
* SQLite (Zero-config local database)
* JSON Web Tokens (JWT Authentication)
* bcryptjs (Password Hashing)

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed:
* Node.js (v18+)
* npm or yarn

### 2. Installation
Clone the repository and install dependencies for both the root (frontend) and the server:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 3. Database Setup
The system uses SQLite for out-of-the-box readiness. Initialize your database and seed it with the mock enterprise data:
```bash
cd server
npx prisma generate
npx prisma db push
npm run seed
```

### 4. Running the Application
Return to the root directory and start both the backend server and frontend Vite development server concurrently:
```bash
npm run dev:all
```
* **Frontend**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000`

---

## 🧪 Testing the Portals

The database seed script generates standard mock accounts allowing you to test every specific portal and dashboard constraint immediately. 

**Universal Password for all accounts**: `admin123`

| Role | Login Email | Assigned Portal | Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@citylake.com` | `Admin Tab` | Complete system control, user provisioning, global analytics. |
| **Water Staff** | `water@citylake.com` | `Staff Tab` | Digital POS, Sales Ledger, Inventory Tracking. No access to apartments. |
| **Property Manager** | `manager@citylake.com` | `Staff Tab` | Room statuses, tenant profiles, maintenance, billing. No access to water. |
| **Tenant** | `tenant@citylake.com` | `Tenant Tab` | Personal rent invoices, notices, profile management. |

> **Note on Login Validation:** The system enforces strict portal separation. If you attempt to log in as a Tenant using the "Admin" tab, the system will actively reject the session and throw a role mismatch error.

---

## 📂 Project Structure

```text
Fairview/
├── server/                 # Express Backend
│   ├── index.js            # Entry point & API definitions
│   ├── prisma/             # Database schema & seed scripts
│   ├── middleware/         # Auth & RBAC validation
│   └── routes/             # Modular API endpoints
├── src/                    # React Frontend
│   ├── assets/             # Images & static media
│   ├── components/         # Reusable UI elements (Navbar, Cards, DataTables)
│   ├── layouts/            # Nested layout wrappers (EnterpriseLayout)
│   ├── pages/              # Public & Auth pages
│   │   └── dashboards/     # Role-specific nested dashboards
│   ├── store/              # Zustand global state (useStore.js)
│   ├── App.jsx             # React Router configuration
│   └── index.css           # Global Tailwind directives
└── README.md
```

---

## 🔒 Security
* Passwords are irreversibly hashed using `bcrypt` before storage.
* Protected endpoints are guarded by JWT-validating middleware.
* Frontend nested routes are protected by `<ProtectedRoute />` wrappers that verify both authentication state and role authorization.
* Invalid portal login attempts are blocked prior to token assignment.
