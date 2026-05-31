import React from 'react';

const Card = ({ title, children }) => (
  <div className="bg-surface-light dark:bg-surface-dark border border-silver-light dark:border-surface-hover-dark rounded-xl p-6 shadow-sm mb-6">
    <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">{title}</h3>
    {children}
  </div>
);

// ADMIN DASHBOARD PAGES
export const AdminTenants = () => <Card title="Tenant Management"><p className="text-text-muted-light dark:text-text-muted-dark">Add, Remove, Edit tenants and assign rooms here.</p><button className="btn-primary mt-4 px-4 py-2 text-sm">Add New Tenant</button></Card>;
export const AdminRooms = () => <Card title="Room Management"><p className="text-text-muted-light dark:text-text-muted-dark">Manage room statuses, pricing, and view assignments.</p></Card>;
export const AdminWater = () => <Card title="Water Business Overview"><p className="text-text-muted-light dark:text-text-muted-dark">Manage water business settings and global metrics.</p></Card>;
export const AdminPayments = () => <Card title="Payments & Invoices"><p className="text-text-muted-light dark:text-text-muted-dark">Create invoices and track rent, water, and garbage payments.</p></Card>;
export const AdminReports = () => <Card title="System Reports"><p className="text-text-muted-light dark:text-text-muted-dark">View financial and operational reports.</p></Card>;
export const AdminAnnouncements = () => <Card title="Announcements"><p className="text-text-muted-light dark:text-text-muted-dark">Post announcements to tenant portals.</p></Card>;
export const AdminSettings = () => <Card title="System Settings"><p className="text-text-muted-light dark:text-text-muted-dark">Configure global parameters and manage admin accounts.</p></Card>;

// WATER STAFF DASHBOARD PAGES
export const WaterInventory = () => <Card title="Inventory Management"><p className="text-text-muted-light dark:text-text-muted-dark">Track water stock, containers, and receive low stock alerts.</p></Card>;
export const WaterCustomers = () => <Card title="Customer Directory"><p className="text-text-muted-light dark:text-text-muted-dark">Manage water delivery customers.</p></Card>;
export const WaterReports = () => <Card title="Sales Reports"><p className="text-text-muted-light dark:text-text-muted-dark">Daily, Weekly, and Monthly sales reports.</p></Card>;
export const WaterProfile = () => <Card title="My Profile"><p className="text-text-muted-light dark:text-text-muted-dark">Manage your staff account.</p></Card>;

// TENANT PORTAL PAGES
export const TenantPayments = () => <Card title="My Payments"><p className="text-text-muted-light dark:text-text-muted-dark">View your rent, water, and garbage bills.</p></Card>;
export const TenantInvoices = () => <Card title="My Invoices"><p className="text-text-muted-light dark:text-text-muted-dark">Download past invoices and receipts.</p></Card>;
export const TenantNotices = () => <Card title="Community Notices"><p className="text-text-muted-light dark:text-text-muted-dark">Read announcements from management.</p></Card>;
export const TenantMaintenance = () => <Card title="Maintenance Requests"><p className="text-text-muted-light dark:text-text-muted-dark">Report issues or submit a vacation notice.</p></Card>;
export const TenantProfile = () => <Card title="My Profile"><p className="text-text-muted-light dark:text-text-muted-dark">View your room details and personal info.</p></Card>;
