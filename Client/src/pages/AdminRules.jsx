import React, { useState, useEffect } from 'react';
import { Search, Filter, Pin, Plus, Edit2, Trash2, X, AlertCircle, Users, MessageSquareWarning, ShieldCheck, Settings, HelpCircle, LogOut, BarChart3, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import API_BASE_URL from '../config';

const AdminRules = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const categories = ['All', 'Gym', 'Parking', 'Security', 'Maintenance', 'Visitors', 'Pets', 'Swimming Pool', 'Community Hall', 'General'];

  const initialFormState = {
    title: '',
    description: '',
    category: 'General',
    isPinned: false,
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/dashboard'); // redirect non-admins
        return;
      }
      setUser(parsedUser);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    fetchRules();
  }, [user]);

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rules`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error('Failed to fetch rules', error);
      toast.error('Failed to fetch rules');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingRule ? `${API_BASE_URL}/rules/${editingRule._id}` : `${API_BASE_URL}/rules/add`;
      const method = editingRule ? 'PUT' : 'POST';

      const dataToSend = { ...formData };
      if (!dataToSend.expiryDate) {
        delete dataToSend.expiryDate;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingRule(null);
        setFormData(initialFormState);
        fetchRules();
        toast.success(editingRule ? 'Rule updated successfully' : 'Rule published successfully');
      } else {
        const err = await response.json();
        toast.error(`Error: ${err.message}`);
      }
    } catch (error) {
      console.error('Failed to save rule', error);
      toast.error('Failed to save rule');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rules/${id}`, {
        method: 'DELETE',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (response.ok) {
        fetchRules();
        toast.success('Rule deleted');
      } else {
        toast.error('Failed to delete rule');
      }
    } catch (error) {
      console.error('Failed to delete rule', error);
      toast.error('Failed to delete rule');
    }
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setFormData({
      title: rule.title,
      description: rule.description,
      category: rule.category,
      isPinned: rule.isPinned || false,
      effectiveDate: rule.effectiveDate ? new Date(rule.effectiveDate).toISOString().split('T')[0] : '',
      expiryDate: rule.expiryDate ? new Date(rule.expiryDate).toISOString().split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filteredRules = rules.filter(rule => {
    const matchesCategory = selectedCategory === 'All' || rule.category === selectedCategory;
    const matchesSearch = rule.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedRules = [...filteredRules].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin-dashboard', active: false },
    { icon: MessageSquareWarning, label: 'Complaints', path: '#', active: false },
    { icon: Users, label: 'Users', path: '/admin-users', active: false },
    { icon: ShieldCheck, label: 'Rules', path: '/admin-rules', active: true },
    { icon: TrendingUp, label: 'Analytics', path: '#', active: false },
    { icon: Settings, label: 'Settings', path: '#', active: false },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col z-40 shadow-sm shrink-0">
        <div className="p-6 pb-8 border-b border-slate-100">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Panchayat AI
          </h1>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            ELITE SOCIETY ADMIN
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? 'bg-slate-100 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <HelpCircle className="h-4 w-4" /> Support
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar relative z-10">
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Manage Rules</h1>
              <p className="text-slate-500 text-sm font-medium">Create and oversee society guidelines.</p>
            </div>
            <button 
              onClick={() => { setEditingRule(null); setFormData(initialFormState); setIsModalOpen(true); }}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-indigo-700 shadow-sm hover:shadow-md"
            >
              <Plus size={18} />
              Add New Rule
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search rules by title..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="relative md:w-64">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 border-y border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Rule Title</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        Loading rules...
                      </td>
                    </tr>
                  ) : sortedRules.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                        <AlertCircle className="mx-auto text-slate-400 mb-2" size={32} />
                        No rules found.
                      </td>
                    </tr>
                  ) : (
                    sortedRules.map(rule => (
                      <tr key={rule._id} className="hover:bg-slate-50/80 transition">
                        <td className="px-6 py-4 font-medium text-slate-900 max-w-[300px] truncate">
                          <div className="flex items-center gap-2">
                            {rule.isPinned && <Pin size={14} className="text-amber-500" fill="currentColor" />}
                            {rule.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider rounded-full border border-slate-200">
                            {rule.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {(!rule.expiryDate || new Date(rule.expiryDate) > new Date()) ? (
                            <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">Active</span>
                          ) : (
                            <span className="text-rose-600 bg-rose-50 border border-rose-200 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">Expired</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          <div><span className="font-medium">Add:</span> {new Date(rule.createdAt).toLocaleDateString()}</div>
                          {rule.updatedAt !== rule.createdAt && <div><span className="font-medium">Upd:</span> {new Date(rule.updatedAt).toLocaleDateString()}</div>}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => openEditModal(rule)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDeleteRule(rule._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingRule ? 'Edit Rule' : 'Add New Rule'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSaveRule} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Rule Title *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., Gym Timings Updated"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  {categories.filter(c => c !== 'All').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
                <textarea 
                  required
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
                  placeholder="Detailed guidelines..."
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Effective Date</label>
                  <input 
                    type="date" 
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Expiry Date (Optional)</label>
                  <input 
                    type="date" 
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input 
                  type="checkbox" 
                  id="pin"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                  className="w-4 h-4 accent-indigo-600 rounded border-slate-300"
                />
                <label htmlFor="pin" className="text-slate-700 font-medium text-sm flex items-center gap-2 cursor-pointer">
                  <Pin size={16} className="text-indigo-600" fill={formData.isPinned ? "currentColor" : "none"} /> Pin this rule to top
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-indigo-600 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:bg-indigo-700 transition shadow-sm"
                >
                  {editingRule ? 'Save Changes' : 'Publish Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRules;
