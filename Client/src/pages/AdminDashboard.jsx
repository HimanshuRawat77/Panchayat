import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Bell, Users, MessageSquareWarning, ShieldCheck, 
  Settings, HelpCircle, LogOut, BarChart3, TrendingUp, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getAllComplaints, updateComplaintStatus } from '../services/complaintService';
import toast, { Toaster } from 'react-hot-toast';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchComplaints = async () => {
      try {
        const data = await getAllComplaints();
        setComplaints(data);
      } catch (error) {
        toast.error('Failed to fetch complaints');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
      toast.success('Status updated successfully');
      // Update local state
      setComplaints(prev => prev.map(c => 
        c._id === complaintId ? { ...c, status: newStatus } : c
      ));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin-dashboard', active: true },
    { icon: MessageSquareWarning, label: 'Complaints', path: '#' },
    { icon: Users, label: 'Users', path: '/admin-users' },
    { icon: ShieldCheck, label: 'Rules', path: '#' },
    { icon: TrendingUp, label: 'Analytics', path: '#' },
    { icon: Settings, label: 'Settings', path: '#' },
  ];

  // Derived Metrics
  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter(c => c.status === 'Pending' || c.status === 'In progress').length;
  const resolvedCases = complaints.filter(c => c.status === 'Resolved').length;

  // Monthly Chart Data
  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ 
        name: d.toLocaleString('default', { month: 'short' }),
        monthNum: d.getMonth(),
        yearNum: d.getFullYear(),
        volume: 0 
      });
    }
    
    complaints.forEach(c => {
      const date = new Date(c.createdAt || Date.now());
      const target = months.find(x => x.monthNum === date.getMonth() && x.yearNum === date.getFullYear());
      if (target) target.volume += 1;
    });
    return months;
  }, [complaints]);

  // Category Donut Data
  const categoryData = useMemo(() => {
    const counts = {};
    let total = 0;
    complaints.forEach(c => {
      const cat = c.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
      total++;
    });
    
    const colors = ['#f59e0b', '#8b5cf6', '#10b981', '#3b82f6', '#ec4899'];
    return Object.keys(counts).map((key, index) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: counts[key],
      percentage: total > 0 ? Math.round((counts[key] / total) * 100) : 0,
      color: colors[index % colors.length]
    })).sort((a,b) => b.value - a.value);
  }, [complaints]);

  const getStatusColor = (status) => {
    if (status === 'Resolved') return 'text-emerald-600 bg-emerald-50 border border-emerald-200';
    if (status === 'In progress') return 'text-amber-600 bg-amber-50 border border-amber-200';
    return 'text-rose-600 bg-rose-50 border border-rose-200';
  };

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col z-50 shadow-sm shrink-0">
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
              <a
                key={item.label}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? 'bg-slate-100 text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
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
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                Community Overview
              </h2>
              <p className="text-slate-500 text-sm font-medium">Real-time governance for Elite Society Residences.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search resident or ID..." 
                  className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 shadow-sm"
                />
              </div>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 shadow-sm relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              </button>
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm shrink-0">
                A
              </div>
            </div>
          </header>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Users className="w-5 h-5" /></div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">+12% ↗</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Residents</p>
              <h3 className="text-3xl font-bold text-slate-900">1,284</h3>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><MessageSquareWarning className="w-5 h-5" /></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Complaints</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalComplaints}</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><AlertCircle className="w-5 h-5" /></div>
                <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider border border-amber-200">Priority</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Open Complaints</p>
              <h3 className="text-3xl font-bold text-amber-500">{String(openComplaints).padStart(2, '0')}</h3>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-200">Resolved</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resolved Cases</p>
              <h3 className="text-3xl font-bold text-emerald-500">{String(resolvedCases).padStart(2, '0')}</h3>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-bold text-slate-900">Complaint Analytics</h3>
                  <p className="text-xs text-slate-500 mt-1">Monthly volume vs Resolution speed</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button className="px-3 py-1.5 text-xs font-semibold rounded-md text-slate-500 hover:text-slate-900">30 Days</button>
                  <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-indigo-600 shadow-sm border border-slate-200">6 Months</button>
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="volume" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
              <div>
                <h3 className="font-bold text-slate-900">Issue Clusters</h3>
                <p className="text-xs text-slate-500 mt-1">Distribution of report types</p>
              </div>
              <div className="flex-1 relative flex items-center justify-center mt-6">
                <div className="h-[180px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%" cy="50%"
                        innerRadius={55} outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs font-semibold text-slate-400">Total</span>
                    <span className="text-2xl font-black text-slate-900">{totalComplaints}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {categoryData.slice(0,3).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-slate-600">{cat.name}</span>
                    </div>
                    <span className="text-slate-900 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">{cat.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Recent Activity</h3>
                <p className="text-xs text-slate-500 mt-1">Live feed of resident submissions</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">
                  Filter
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">
                  Export
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">COMPLAINT ID</th>
                    <th className="px-6 py-4">RESIDENT</th>
                    <th className="px-6 py-4">CATEGORY</th>
                    <th className="px-6 py-4">STATUS</th>
                    <th className="px-6 py-4">DATE</th>
                    <th className="px-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-500 font-medium">Loading complaints...</td></tr>
                  ) : complaints.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-500 font-medium">No complaints found.</td></tr>
                  ) : complaints.map((complaint) => {
                    const statusClass = getStatusColor(complaint.status);
                    const date = new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    const resident = complaint.userId || {};
                    const residentName = resident.fullName || 'Unknown Resident';
                    const initials = residentName.charAt(0).toUpperCase();
                    
                    return (
                      <tr key={complaint._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-bold text-indigo-600 text-xs">
                          #COMP-{complaint._id.slice(-4).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0 border border-indigo-100">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{residentName}</p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Block {resident.block || 'N/A'}, Flat {resident.houseNumber || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-[10px] uppercase tracking-wider rounded-full border border-slate-200">
                            {complaint.category || 'Maintenance'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider ${statusClass}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {complaint.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                          {date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select 
                            value={complaint.status}
                            onChange={(e) => handleStatusChange(complaint._id, e.target.value)}
                            className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2 outline-none shadow-sm cursor-pointer ml-auto hover:bg-slate-50 transition-colors"
                          >
                            <option value="Pending">Set Pending</option>
                            <option value="In progress">Set In Progress</option>
                            <option value="Resolved">Set Resolved</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {complaints.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Showing {complaints.length} of {complaints.length} entries</span>
                  <div className="flex gap-1">
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 font-bold">Previous</button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md bg-indigo-50 text-indigo-600 font-bold">1</button>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 font-bold">Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
