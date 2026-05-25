# City Lake Enterprises Platform

City Lake Enterprises is a professional ERP/business management platform that manages two main business divisions under one unified system:
1. **Fairview Apartments**: Apartment rental and tenant management.
2. **City Lake Water Services**: Water purification and digital POS selling business located on the ground floor.

## System Features
- **Global Theme Persistence**: Dark/Light mode supported natively across all interfaces using standard tailwind variants.
- **Enterprise Dashboards**: Role-based access control rendering vastly different portals for Admins, Property Managers, Tenants, and Water Staff.
- **Real-Time Digital POS**: A robust Point of Sale system built exclusively for the Water Station to auto-deduct inventory, track payment methods (Cash, M-Pesa, etc.), and generate exportable End-of-Day `.csv` reports.
- **Automated Delivery Logic**: Online water orders are automatically evaluated for free-delivery eligibility based on exact time windows and volume rules.

---

## Testing Logins / Portals

The database has been seeded with standard mock accounts so you can test every specific portal and dashboard constraint. All accounts share the same password.

**Universal Password for all accounts**: `admin123`

| Role | Email Address | Access Level & Portal |
| :--- | :--- | :--- |
| **Super Admin** | `admin@citylake.com` | Has access to EVERYTHING. Will route to the Super Admin Dashboard with complete system control. |
| **Water Staff** | `water@citylake.com` | Restricted to the Water Station Portal. Has access to the Digital POS, Sales Ledger, Online Orders queue, and EOD Reports. Cannot view apartment management. |
| **Property Manager** | `manager@citylake.com` | Restricted to the Fairview Apartments Portal. Has access to room statuses, tenant profiles, bookings, and building analytics. |
| **Tenant** | `tenant@citylake.com` | Restricted to the Tenant Portal. Used to view personal rent invoices, maintenance notices, and building announcements. |

### How to use:
1. Ensure your backend server is running.
2. Seed the database if you haven't already: `cd server && npx prisma db seed`
3. Navigate to `http://localhost:5173/login`
4. Enter any of the emails above to be automatically routed to their respective enterprise dashboard!
