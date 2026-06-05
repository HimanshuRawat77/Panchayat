import React, { useState, useEffect } from 'react';
import {
  Search, Bell, Users, MessageSquareWarning, ShieldCheck, 
  Settings, HelpCircle, LogOut, BarChart3, TrendingUp, MoreVertical
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getUsersAdmin } from '../services/adminService';
import toast, { Toaster } from 'react-hot-toast';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
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
    const fetchUsers = async () => {
      try {
        const data = await getUsersAdmin();
        setUsersList(data);
      } catch (error) {
        toast.error('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin-dashboard', active: false },
    { icon: MessageSquareWarning, label: 'Complaints', path: '#', active: false },
    { icon: Users, label: 'Users', path: '/admin-users', active: true },
    { icon: ShieldCheck, label: 'Rules', path: '/admin-rules', active: false },
    { icon: TrendingUp, label: 'Analytics', path: '#', active: false },
    { icon: Settings, label: 'Settings', path: '#', active: false },
  ];

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
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar">
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 pb-20">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
                Resident Directory
              </h2>
              <p className="text-slate-500 text-sm font-medium">Manage and view all registered society members.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search resident or flat..." 
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

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">All Registered Users</h3>
                <p className="text-xs text-slate-500 mt-1">Total {usersList.length} members found</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:bg-slate-50">
                  Filter
                </button>
                <button className="px-4 py-2 bg-indigo-600 border border-transparent rounded-lg text-xs font-bold text-white shadow-sm hover:bg-indigo-700">
                  Add Resident
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">RESIDENT INFO</th>
                    <th className="px-6 py-4">CONTACT</th>
                    <th className="px-6 py-4">FLAT / BLOCK</th>
                    <th className="px-6 py-4">ROLE</th>
                    <th className="px-6 py-4">JOINED</th>
                    <th className="px-6 py-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {loading ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-500 font-medium">Loading residents...</td></tr>
                  ) : usersList.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-10 text-slate-500 font-medium">No users found.</td></tr>
                  ) : usersList.map((member) => {
                    const joined = new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const initials = member.fullName ? member.fullName.charAt(0).toUpperCase() : '?';
                    const isVerified = member.isVerified;
                    
                    return (
                      <tr key={member._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0 border border-indigo-100">
                              {initials}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{member.fullName || 'Unknown'}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {isVerified ? (
                                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Verified</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unverified</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-semibold text-slate-700">{member.phoneNumber}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{member.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-xs">Flat {member.houseNumber || 'N/A'}</p>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">Block {member.block || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 font-bold text-[10px] uppercase tracking-wider rounded-full border ${member.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                            {member.role || 'resident'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                          {joined}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
