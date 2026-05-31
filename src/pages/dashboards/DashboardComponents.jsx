import React, { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';
import DataTable from '../../components/ui/DataTable';

const Card = ({ title, children }) => (
  <div className="bg-surface-light dark:bg-surface-dark border border-silver-light dark:border-surface-hover-dark rounded-xl p-6 shadow-sm mb-6">
    <h3 className="text-xl font-bold text-text-light dark:text-text-dark mb-4">{title}</h3>
    {children}
  </div>
);

// ADMIN DASHBOARD PAGES
export const AdminTenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', roomId: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/apartments/tenants');
      setTenants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/apartments/tenants', form);
      toast.success('Tenant added successfully!');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', roomId: '' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { header: 'Name', render: (row) => row.user?.name || 'N/A' },
    { header: 'Email', render: (row) => row.user?.email || 'N/A' },
    { header: 'Phone', render: (row) => row.user?.phone || 'N/A' },
    { header: 'Room', accessor: 'unitId' }
  ];

  return (
    <Card title="Tenant Management">
      <div className="flex justify-between items-center mb-4">
        <p className="text-text-muted-light dark:text-text-muted-dark">Manage all active tenants in the system.</p>
        <button onClick={() => setShowModal(true)} className="btn-primary px-4 py-2 text-sm">Add New Tenant</button>
      </div>
      {loading ? <p>Loading...</p> : <DataTable columns={columns} data={tenants} />}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Tenant</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="block text-sm mb-1">Name</label><input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full bg-background-light dark:bg-background-dark border border-silver-light dark:border-surface-hover-dark rounded p-2" /></div>
              <div><label className="block text-sm mb-1">Email</label><input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full bg-background-light dark:bg-background-dark border border-silver-light dark:border-surface-hover-dark rounded p-2" /></div>
              <div><label className="block text-sm mb-1">Phone</label><input required value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="w-full bg-background-light dark:bg-background-dark border border-silver-light dark:border-surface-hover-dark rounded p-2" /></div>
              <div><label className="block text-sm mb-1">Room ID (e.g. G8)</label><input required value={form.roomId} onChange={e=>setForm({...form, roomId: e.target.value})} className="w-full bg-background-light dark:bg-background-dark border border-silver-light dark:border-surface-hover-dark rounded p-2" /></div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">Cancel</button>
                <button type="submit" className="btn-primary px-4 py-2">Save Tenant</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
};
export const AdminRooms = () => <Card title="Room Management"><p className="text-text-muted-light dark:text-text-muted-dark">Manage room statuses, pricing, and view assignments.</p></Card>;
export const AdminWater = () => <Card title="Water Business Overview"><p className="text-text-muted-light dark:text-text-muted-dark">Manage water business settings and global metrics.</p></Card>;
export const AdminPayments = () => <Card title="Payments & Invoices"><p className="text-text-muted-light dark:text-text-muted-dark">Create invoices and track rent, water, and garbage payments.</p></Card>;
export const AdminReports = () => <Card title="System Reports"><p className="text-text-muted-light dark:text-text-muted-dark">View financial and operational reports.</p></Card>;
export const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/apartments/announcements');
      setAnnouncements(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/apartments/announcements', form);
      toast.success('Announcement posted!');
      setForm({ title: '', content: '' });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card title="Post Announcement">
        <form onSubmit={handlePost} className="space-y-4">
          <div><label className="block text-sm mb-1">Title</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full bg-background-light dark:bg-background-dark border border-silver-light dark:border-surface-hover-dark rounded p-2" /></div>
          <div><label className="block text-sm mb-1">Message</label><textarea required rows={4} value={form.content} onChange={e=>setForm({...form, content: e.target.value})} className="w-full bg-background-light dark:bg-background-dark border border-silver-light dark:border-surface-hover-dark rounded p-2" /></div>
          <button type="submit" className="btn-primary px-4 py-2 w-full">Post to Tenant Portal</button>
        </form>
      </Card>

      <Card title="Recent Announcements">
        {loading ? <p>Loading...</p> : (
          <div className="space-y-4 h-64 overflow-y-auto pr-2">
            {announcements.map(a => (
              <div key={a.id} className="p-4 bg-background-light dark:bg-background-dark border border-silver-light dark:border-surface-hover-dark rounded-lg">
                <h4 className="font-bold text-maroon">{a.title}</h4>
                <p className="text-sm mt-1">{a.content}</p>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">Posted by {a.admin?.name} on {new Date(a.date).toLocaleDateString()}</p>
              </div>
            ))}
            {announcements.length === 0 && <p className="text-sm text-gray-500">No recent announcements.</p>}
          </div>
        )}
      </Card>
    </div>
  );
};
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
