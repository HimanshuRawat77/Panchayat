import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config';
import { toast, Toaster } from 'react-hot-toast';
import { Building, Shield, Plus, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlatformDashboard = () => {
  const { authToken, authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showCreateSociety, setShowCreateSociety] = useState(false);
  const [societyForm, setSocietyForm] = useState({ name: '', address: '', city: '', state: '', pincode: '' });
  
  const [showCreateAdmin, setShowCreateAdmin] = useState(null); // societyId
  const [adminForm, setAdminForm] = useState({ fullName: '', phoneNumber: '', email: '', password: '', houseNumber: '', block: '' });

  useEffect(() => {
    if (!authUser || authUser.role !== 'platform_admin') {
      navigate('/login');
      return;
    }
    fetchSocieties();
  }, [authUser, navigate]);

  const fetchSocieties = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/societies`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSocieties(data);
      }
    } catch {
      toast.error('Failed to fetch societies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSociety = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/societies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(societyForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Society created successfully!');
        setShowCreateSociety(false);
        setSocietyForm({ name: '', address: '', city: '', state: '', pincode: '' });
        fetchSocieties();
      } else {
        toast.error(data.message || 'Error creating society');
      }
    } catch {
      toast.error('Network error');
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/societies/${showCreateAdmin}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(adminForm)
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Admin created successfully!');
        setShowCreateAdmin(null);
        setAdminForm({ fullName: '', phoneNumber: '', email: '', password: '', houseNumber: '', block: '' });
        fetchSocieties();
      } else {
        toast.error(data.message || 'Error creating admin');
      }
    } catch {
      toast.error('Network error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white p-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-600" />
              Platform Dashboard
            </h1>
            <p className="text-slate-500 mt-2">Manage societies and initial admins.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowCreateSociety(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-purple-700 transition flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Society
            </button>
            <button 
              onClick={logout}
              className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl font-medium hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Societies List */}
        {loading ? (
          <p>Loading societies...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {societies.map(society => (
              <div key={society._id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{society.name}</h3>
                  <span className="text-xs font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded-md">
                    CODE: {society.inviteCode}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4" /> {society.address}, {society.city}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-blue-600">{society.residentCount}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Residents</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center">
                    <p className="text-xl font-bold text-orange-600">{society.adminCount}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Admins</p>
                  </div>
                </div>

                {society.adminCount === 0 && (
                  <button 
                    onClick={() => setShowCreateAdmin(society._id)}
                    className="w-full bg-orange-100 text-orange-700 px-4 py-2 rounded-xl font-medium hover:bg-orange-200 transition flex justify-center items-center gap-2"
                  >
                    <Key className="w-4 h-4" /> Add Initial Admin
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {showCreateSociety && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Create New Society</h2>
              <form onSubmit={handleCreateSociety} className="space-y-4">
                <input required placeholder="Society Name" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={societyForm.name} onChange={e => setSocietyForm({...societyForm, name: e.target.value})} />
                <input required placeholder="Address" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={societyForm.address} onChange={e => setSocietyForm({...societyForm, address: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input placeholder="City" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={societyForm.city} onChange={e => setSocietyForm({...societyForm, city: e.target.value})} />
                  <input placeholder="State" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={societyForm.state} onChange={e => setSocietyForm({...societyForm, state: e.target.value})} />
                </div>
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowCreateSociety(false)} className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 font-medium">Cancel</button>
                  <button type="submit" className="flex-1 p-3 rounded-xl bg-purple-600 text-white font-medium">Create</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCreateAdmin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6">Create Initial Admin</h2>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <input required placeholder="Full Name" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={adminForm.fullName} onChange={e => setAdminForm({...adminForm, fullName: e.target.value})} />
                <input required placeholder="Email" type="email" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} />
                <input required placeholder="Phone Number" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={adminForm.phoneNumber} onChange={e => setAdminForm({...adminForm, phoneNumber: e.target.value})} />
                <input required placeholder="Password" type="password" className="w-full p-3 rounded-xl border dark:bg-slate-900 dark:border-slate-700" value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} />
                <div className="flex gap-4 mt-6">
                  <button type="button" onClick={() => setShowCreateAdmin(null)} className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 font-medium">Cancel</button>
                  <button type="submit" className="flex-1 p-3 rounded-xl bg-orange-600 text-white font-medium">Create Admin</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlatformDashboard;
