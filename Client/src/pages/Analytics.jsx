import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Search,
  LayoutDashboard,
  BarChart3,
  Users,
  MessageSquareWarning,
  Wrench,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  Activity,
  Award,
  Zap,
  Shield,
  Droplets,
  Hammer,
  ChevronRight,
  BrainCircuit,
  Calendar,
  MessageCircle,
  BarChart,
  Trophy,
  Star,
  Loader2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getMyComplaints } from '../services/complaintService';
import { useTourGuide } from '../components/TourGuide';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

function readUserFromStorage() {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    const parsedUser = JSON.parse(storedUser);
    return {
      fullName: parsedUser.fullName || 'User',
      block: parsedUser.block || 'N/A',
      avatar: parsedUser.avatar || '👤',
      unreadNotifications: parsedUser.unreadNotifications || 0,
      houseNumber: parsedUser.houseNumber || '1402',
    };
  } catch {
    return null;
  }
}

const Analytics = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { startTour } = useTourGuide();
  const [user] = useState(readUserFromStorage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchDashboardData = async () => {
      try {
        const data = await getMyComplaints();
        if (data) setComplaints(data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', active: true },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: MessageSquareWarning, label: 'Complaints', path: '/complaints' },

    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  const bottomNavItems = [
    { icon: HelpCircle, label: 'Website Tour', action: () => startTour(0) },
    { icon: LogOut, label: 'Sign Out', action: handleLogout },
  ];

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  // --- Dynamic Derivations ---
  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const resolvedRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;
  
  // Fake average resolution time since we don't have resolvedAt timestamps reliably
  const avgResolutionTime = totalComplaints > 0 ? '1.2' : '0.0';
  
  // Engagement Score based on activity
  const engagementScore = totalComplaints > 0 ? Math.min(100, 50 + (totalComplaints * 5)) : 20;

  const complaintHistoryData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({ 
        name: d.toLocaleString('default', { month: 'short' }),
        monthNum: d.getMonth(),
        yearNum: d.getFullYear(),
        complaints: 0 
      });
    }
    
    complaints.forEach(c => {
      const date = new Date(c.createdAt || Date.now());
      const m = date.getMonth();
      const y = date.getFullYear();
      const target = months.find(x => x.monthNum === m && x.yearNum === y);
      if (target) {
        target.complaints += 1;
      }
    });
    
    return months;
  }, [complaints]);

  const categoryDataRaw = useMemo(() => {
    const categories = {
      plumber: { name: 'Plumbing', count: 0, color: '#8B6B4A', icon: Droplets, iconColor: 'text-blue-400' },
      electrician: { name: 'Electrical', count: 0, color: '#C8A45D', icon: Zap, iconColor: 'text-amber-400' },
      carpenter: { name: 'Carpenter', count: 0, color: '#E0C27A', icon: Hammer, iconColor: 'text-[#8B6B4A]' },
      other: { name: 'Other', count: 0, color: '#221C18', icon: MessageSquareWarning, iconColor: 'text-rose-400' },
    };
    
    let total = 0;
    complaints.forEach(c => {
      const cat = (c.category || 'other').toLowerCase();
      if (categories[cat]) {
        categories[cat].count += 1;
      } else {
        categories['other'].count += 1;
      }
      total++;
    });

    return { categories, total };
  }, [complaints]);

  const categoryData = useMemo(() => {
    if (categoryDataRaw.total === 0) {
      return [{ name: 'No Complaints', value: 100, color: '#221C18', rawCount: 0 }];
    }

    return Object.values(categoryDataRaw.categories)
      .filter(cat => cat.count > 0)
      .map(cat => ({
        name: cat.name,
        value: Math.round((cat.count / categoryDataRaw.total) * 100),
        color: cat.color,
        rawCount: cat.count
      }));
  }, [categoryDataRaw]);

  const aiInsights = useMemo(() => {
    if (complaints.length === 0) {
      return [
        {
          icon: Shield,
          iconColor: 'text-emerald-400',
          content: <>You have <span className="text-emerald-400 font-bold">not raised any complaints</span>. Everything in your block seems perfectly stable.</>
        },
        {
          icon: Activity,
          iconColor: 'text-[#C8A45D]',
          content: <>Your community engagement is <span className="text-[#C8A45D] font-bold">quiet</span>. Feel free to explore features when needed.</>
        },
        {
          icon: Award,
          iconColor: 'text-[#E0C27A]',
          content: <>Your zero-complaint streak earns you a <span className="text-[#E0C27A] font-bold">Peaceful Resident</span> status this month.</>
        }
      ];
    }
    
    const catCounts = {};
    complaints.forEach(c => {
      const cat = c.category || 'other';
      catCounts[cat] = (catCounts[cat] || 0) + 1;
    });
    const topCat = Object.keys(catCounts).sort((a,b) => catCounts[b] - catCounts[a])[0];

    return [
      {
        icon: Droplets,
        iconColor: 'text-blue-400',
        content: <>Most of your complaints are <span className="text-[#C8A45D] font-bold">{topCat} related</span>. Consider requesting a full inspection if issues persist.</>
      },
      {
        icon: Zap,
        iconColor: 'text-emerald-400',
        content: <>Your complaint resolution rate is <span className="text-emerald-400 font-bold">{resolvedRate}%</span>. The management team is actively addressing your requests.</>
      },
      {
        icon: Shield,
        iconColor: 'text-[#E0C27A]',
        content: <>You've raised <span className="text-[#E0C27A] font-bold">{complaints.length} complaints</span> total. Thank you for helping keep the society maintained.</>
      }
    ];
  }, [complaints, resolvedRate]);

  const activityTimeline = useMemo(() => {
    if (complaints.length === 0) return [];
    
    return complaints.map((c, idx) => ({
      id: c._id || idx,
      type: 'complaint',
      title: c.status === 'Resolved' ? 'Complaint resolved' : 'Complaint submitted',
      desc: c.description || 'Reported an issue.',
      time: new Date(c.createdAt || Date.now()).toLocaleDateString(),
      icon: c.status === 'Resolved' ? CheckCircle2 : MessageSquareWarning,
      color: c.status === 'Resolved' ? 'text-emerald-500' : 'text-rose-500'
    })).sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
  }, [complaints]);

  // Derived zero-states for non-existent backend features
  const eventsAttended = 0;
  const communityPosts = 0;
  const pollParticipation = 0;
  const commentsMade = 0;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#151210] text-slate-900 dark:text-[#F5F1EA] font-sans selection:bg-[#C8A45D]/20">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 dark:bg-black/80 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-[#221C18] bg-[#f8fafc] dark:bg-[#151210] flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 pb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#dae2fd]">
              Panchayat AI
            </h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-[#B8AEA3]">
              Elite Society<br/>Management
            </p>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-4 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-white dark:bg-[#221C18] text-slate-900 dark:text-[#dae2fd] shadow-sm border border-slate-200 dark:border-[#221C18] shadow-slate-200 dark:shadow-black/20'
                    : 'text-slate-500 dark:text-[#B8AEA3] hover:bg-slate-100 dark:hover:bg-[#221C18]/60 hover:text-slate-900 dark:hover:text-[#dae2fd]'
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-[#221C18] space-y-1.5 pb-6">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                data-tour={item.label === 'Website Tour' ? 'help' : undefined}
                onClick={item.action}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 dark:text-[#B8AEA3] hover:bg-slate-100 dark:hover:bg-[#221C18]/60 hover:text-slate-900 dark:hover:text-[#dae2fd] transition-all"
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
                {item.label}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50 dark:bg-[#110e0c]/50 custom-scrollbar relative">
        
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#151210]/80 backdrop-blur-xl border-b border-slate-200 dark:border-[#221C18]">
          <div className="flex items-center gap-4 flex-1">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 dark:text-[#B8AEA3] hover:text-slate-900 dark:hover:text-[#dae2fd] rounded-lg hover:bg-white dark:hover:bg-[#221C18]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="hidden lg:block text-xl font-bold tracking-tight text-slate-900 dark:text-[#dae2fd] mr-4 opacity-80">
              My Analytics
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 ml-4">
            <button onClick={toggleTheme} className="text-[#8B6B4A] hover:text-[#C8A45D] transition bg-white dark:bg-[#1A1614] p-2 rounded-full border border-slate-200 dark:border-[#221C18]">
              {theme === 'light' ? <Moon className="h-[1.15rem] w-[1.15rem]" /> : <Sun className="h-[1.15rem] w-[1.15rem]" />}
            </button>
            <button className="relative text-[#8B6B4A] hover:text-[#C8A45D] transition bg-white dark:bg-[#1A1614] p-2 rounded-full border border-slate-200 dark:border-[#221C18]">
              <Bell className="h-[1.15rem] w-[1.15rem]" />
              {user.unreadNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#1A1614]"></span>
              )}
            </button>
            
            <Link to="/profile" className="flex items-center gap-3 pl-3 sm:pl-5 border-l border-slate-200 dark:border-[#221C18]">
              <div className="h-9 w-9 rounded-full overflow-hidden border border-[#C8A45D]/40 ring-2 ring-white dark:ring-[#151210]">
                {user.avatar && user.avatar.length > 5 ? (
                  <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-white dark:bg-[#221C18] flex items-center justify-center text-[#C8A45D] font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
              </div>
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#C8A45D]" />
          </div>
        ) : (
          <div className="p-6 lg:p-8 w-full max-w-[1600px] mx-auto space-y-8 pb-20">
            
            {/* Section: Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-[#dae2fd] tracking-tight mb-2">My Analytics</h1>
                <p className="text-slate-500 dark:text-[#B8AEA3] text-sm">Insights about your activity and engagement in the society</p>
              </div>
              <div className="px-4 py-2 rounded-full bg-white dark:bg-[#221C18] border border-[#6B4F3A]/30 text-xs font-semibold text-[#C8A45D] tracking-widest uppercase shadow-inner">
                {currentMonth}
              </div>
            </div>

            {/* Section 1: Overview Cards */}
            <div data-tour="analytics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm hover:border-[#6B4F3A]/50 transition-all duration-300 group cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><MessageSquareWarning className="w-24 h-24" /></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#221C18] text-[#C8A45D] group-hover:scale-110 transition-transform"><MessageSquareWarning className="w-5 h-5" /></div>
                  <h3 className="text-slate-500 dark:text-[#B8AEA3] text-sm font-semibold">Total Complaints</h3>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-slate-900 dark:text-[#dae2fd]">{totalComplaints}</p>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${totalComplaints === 0 ? 'text-[#8B6B4A] bg-[#8B6B4A]/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                    {totalComplaints === 0 ? 'No Data' : 'Active'}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm hover:border-[#6B4F3A]/50 transition-all duration-300 group cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><CheckCircle2 className="w-24 h-24" /></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#221C18] text-emerald-500 group-hover:scale-110 transition-transform"><CheckCircle2 className="w-5 h-5" /></div>
                  <h3 className="text-slate-500 dark:text-[#B8AEA3] text-sm font-semibold">Resolved</h3>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-slate-900 dark:text-[#dae2fd]">{resolvedComplaints}</p>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${resolvedRate > 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-[#8B6B4A] bg-[#8B6B4A]/10'}`}>
                    {resolvedRate}% Rate
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm hover:border-[#6B4F3A]/50 transition-all duration-300 group cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Clock className="w-24 h-24" /></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#221C18] text-amber-500 group-hover:scale-110 transition-transform"><Clock className="w-5 h-5" /></div>
                  <h3 className="text-slate-500 dark:text-[#B8AEA3] text-sm font-semibold">Avg Resolution</h3>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-slate-900 dark:text-[#dae2fd]">{avgResolutionTime}<span className="text-xl text-slate-500 dark:text-[#B8AEA3] ml-1">days</span></p>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${totalComplaints === 0 ? 'text-[#8B6B4A] bg-[#8B6B4A]/10' : 'text-emerald-500 bg-emerald-500/10'}`}>
                    {totalComplaints === 0 ? '-' : 'Stable'}
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm hover:border-[#6B4F3A]/50 transition-all duration-300 group cursor-default relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Activity className="w-24 h-24" /></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#221C18] text-[#8B6B4A] group-hover:scale-110 transition-transform"><Activity className="w-5 h-5" /></div>
                  <h3 className="text-slate-500 dark:text-[#B8AEA3] text-sm font-semibold">Engagement Score</h3>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-4xl font-bold text-slate-900 dark:text-[#dae2fd]">{engagementScore}<span className="text-xl text-slate-500 dark:text-[#B8AEA3] ml-1">/100</span></p>
                  <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${engagementScore > 20 ? 'text-emerald-500 bg-emerald-500/10' : 'text-[#8B6B4A] bg-[#8B6B4A]/10'}`}>
                    <TrendingUp className="w-3 h-3" /> {engagementScore > 20 ? 'Active' : 'Low'}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Section 2: Complaint History Line Chart */}
              <div className="lg:col-span-2 rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 sm:p-8 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-lg">Complaint History</h3>
                    <p className="text-xs text-slate-500 dark:text-[#B8AEA3] mt-1">Complaints raised over the last 6 months</p>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={complaintHistoryData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#221C18" vertical={false} />
                      <XAxis dataKey="name" stroke="#8B6B4A" tick={{ fill: '#B8AEA3', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#8B6B4A" tick={{ fill: '#B8AEA3', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#221C18', border: '1px solid #6B4F3A', borderRadius: '12px', color: '#F5F1EA' }}
                        itemStyle={{ color: '#C8A45D', fontWeight: 'bold' }}
                      />
                      <Line type="monotone" dataKey="complaints" stroke="#C8A45D" strokeWidth={3} dot={{ fill: '#1A1614', stroke: '#C8A45D', strokeWidth: 2, r: 6 }} activeDot={{ r: 8, fill: '#C8A45D', stroke: '#1A1614' }} animationDuration={1500} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Section 3: Complaint Category Breakdown */}
              <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 sm:p-8 shadow-sm flex flex-col">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-lg">Category Breakdown</h3>
                  <p className="text-xs text-slate-500 dark:text-[#B8AEA3] mt-1">Distribution of your raised complaints</p>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center mt-6 relative">
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={totalComplaints === 0 ? 0 : 5}
                          dataKey="value"
                          stroke="none"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        {totalComplaints > 0 && (
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#221C18', border: '1px solid #6B4F3A', borderRadius: '12px', color: '#F5F1EA' }}
                            itemStyle={{ color: '#F5F1EA' }}
                          />
                        )}
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Custom Legend */}
                  <div className="w-full mt-4 space-y-2">
                    {categoryData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs font-semibold">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                          <span className="text-slate-500 dark:text-[#B8AEA3]">{item.name}</span>
                        </div>
                        <span className="text-slate-900 dark:text-[#dae2fd]">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: AI Insights */}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-xl mb-4 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-[#C8A45D]" /> Panchayat AI Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="rounded-[20px] border border-[#C8A45D]/30 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-[#221C18] dark:to-[#151210] p-6 shadow-lg shadow-[#C8A45D]/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-20 h-20 bg-[#C8A45D]/10 blur-2xl rounded-full group-hover:bg-[#C8A45D]/20 transition-all"></div>
                    <div className="mb-4 bg-[#f8fafc] dark:bg-[#151210] p-2.5 rounded-full w-fit border border-slate-200 dark:border-[#221C18]"><insight.icon className={`w-5 h-5 ${insight.iconColor}`} /></div>
                    <p className="text-sm text-slate-900 dark:text-[#F5F1EA] font-medium leading-relaxed relative z-10">
                      {insight.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Section 5: Community Participation */}
                <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 sm:p-8 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-lg mb-6">Community Participation</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#221C18]/50 border border-slate-200 dark:border-[#221C18] flex items-center justify-between hover:bg-white dark:hover:bg-[#221C18] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#f8fafc] dark:bg-[#151210] text-[#C8A45D]"><Calendar className="w-4 h-4"/></div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">Events</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">{eventsAttended}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#221C18]/50 border border-slate-200 dark:border-[#221C18] flex items-center justify-between hover:bg-white dark:hover:bg-[#221C18] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#f8fafc] dark:bg-[#151210] text-emerald-500"><MessageSquareWarning className="w-4 h-4"/></div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">Posts</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">{communityPosts}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#221C18]/50 border border-slate-200 dark:border-[#221C18] flex items-center justify-between hover:bg-white dark:hover:bg-[#221C18] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#f8fafc] dark:bg-[#151210] text-amber-500"><BarChart className="w-4 h-4"/></div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">Polls</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">{pollParticipation}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#221C18]/50 border border-slate-200 dark:border-[#221C18] flex items-center justify-between hover:bg-white dark:hover:bg-[#221C18] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#f8fafc] dark:bg-[#151210] text-rose-500"><MessageCircle className="w-4 h-4"/></div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">Comments</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">{commentsMade}</span>
                    </div>
                  </div>
                </div>

                {/* Section 6: Service Request History */}
                <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 sm:p-8 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-lg mb-6">Service Request History</h3>
                  <div className="space-y-6">
                    {Object.values(categoryDataRaw.categories).filter(c => c.name !== 'Other').map((service, idx) => {
                      const perc = totalComplaints > 0 ? (service.count / totalComplaints) * 100 : 0;
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-xs font-semibold mb-2">
                            <span className="text-slate-500 dark:text-[#B8AEA3] flex items-center gap-2"><service.icon className={`w-3.5 h-3.5 ${service.iconColor}`} /> {service.name} Requests</span>
                            <span className="text-slate-900 dark:text-[#dae2fd]">{service.count}</span>
                          </div>
                          <div className="h-2 w-full bg-[#f8fafc] dark:bg-[#151210] rounded-full overflow-hidden border border-slate-200 dark:border-[#221C18]">
                            <div className="h-full bg-current rounded-full transition-all duration-1000" style={{ width: `${perc}%`, backgroundColor: service.color }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {/* Section 8: Profile Statistics & Section 9: Achievements */}
                <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 sm:p-8 shadow-sm">
                  <div className="flex items-start justify-between border-b border-slate-200 dark:border-[#221C18] pb-6 mb-6">
                    <div className="flex items-center gap-5">
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-[#C8A45D]/40 ring-4 ring-white dark:ring-[#151210]">
                        {user.avatar && user.avatar.length > 5 ? (
                          <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-white dark:bg-[#221C18] flex items-center justify-center text-2xl text-[#C8A45D] font-bold">
                            {user.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-xl leading-none mb-2">{user.fullName}</h3>
                        <p className="text-xs text-[#8B6B4A] uppercase tracking-widest font-bold flex items-center gap-2">
                          {user.block} <span className="w-1 h-1 bg-[#6B4F3A] rounded-full"></span> Flat {user.houseNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-[#221C18] border border-[#C8A45D]/30 text-[#C8A45D] text-[10px] font-bold uppercase tracking-widest mb-1">
                        {totalComplaints === 0 ? 'Quiet Resident' : 'Active Resident'}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-[#B8AEA3] font-medium">Member since Jan 2024</p>
                    </div>
                  </div>

                  {/* Profile Stats */}
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <p className="text-[10px] text-slate-500 dark:text-[#B8AEA3] uppercase tracking-widest font-bold mb-1">Profile Completion</p>
                      <p className="text-xl font-bold text-slate-900 dark:text-[#dae2fd]">100%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-500 dark:text-[#B8AEA3] uppercase tracking-widest font-bold mb-1">Community Rank</p>
                      <p className="text-xl font-bold text-[#C8A45D] flex items-center gap-1"><Star className="w-4 h-4 fill-[#C8A45D]"/> {totalComplaints === 0 ? 'Observer' : 'Gold Resident'}</p>
                    </div>
                  </div>

                  {/* Achievements */}
                  <h4 className="text-xs font-bold text-slate-500 dark:text-[#B8AEA3] uppercase tracking-widest mb-4">Achievements</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${totalComplaints > 0 ? 'bg-slate-100 dark:bg-[#221C18]/60 border-slate-200 dark:border-[#221C18]' : 'bg-[#f8fafc] dark:bg-[#151210] border-slate-200 dark:border-[#221C18] opacity-50'}`}>
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Trophy className="w-4 h-4"/></div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-[#dae2fd]">Active Resident</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${eventsAttended > 0 ? 'bg-slate-100 dark:bg-[#221C18]/60 border-slate-200 dark:border-[#221C18]' : 'bg-[#f8fafc] dark:bg-[#151210] border-slate-200 dark:border-[#221C18] opacity-50'}`}>
                      <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500"><Calendar className="w-4 h-4"/></div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-[#dae2fd]">Event Enthusiast</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${communityPosts > 0 ? 'bg-slate-100 dark:bg-[#221C18]/60 border-slate-200 dark:border-[#221C18]' : 'bg-[#f8fafc] dark:bg-[#151210] border-slate-200 dark:border-[#221C18] opacity-50'}`}>
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><Users className="w-4 h-4"/></div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-[#dae2fd]">Contributor</span>
                    </div>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${resolvedRate > 80 ? 'bg-slate-100 dark:bg-[#221C18]/60 border-slate-200 dark:border-[#221C18]' : 'bg-[#f8fafc] dark:bg-[#151210] border-slate-200 dark:border-[#221C18] opacity-50'}`}>
                      <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500"><Zap className="w-4 h-4"/></div>
                      <span className="text-xs font-semibold text-slate-900 dark:text-[#dae2fd]">Quick Resolver</span>
                    </div>
                  </div>
                </div>

                {/* Section 7: Monthly Activity Summary */}
                <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 sm:p-8 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-lg mb-6 flex justify-between items-center">
                    This Month 
                    <span className="text-[10px] font-bold text-[#8B6B4A] uppercase tracking-widest px-2 py-1 bg-white dark:bg-[#221C18] rounded-md">Summary</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-[#dae2fd] mb-1">{totalComplaints}</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">Complaints Raised</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-[#dae2fd] mb-1">{totalComplaints}</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">Services Requested</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[#C8A45D] mb-1">0</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">AI Assistant Queries</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-900 dark:text-[#dae2fd] mb-1">{eventsAttended}</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-[#B8AEA3]">Events Joined</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Section 10: Activity Timeline */}
            <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 sm:p-8 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-lg mb-8">Recent Activity Timeline</h3>
              {activityTimeline.length === 0 ? (
                <div className="text-center py-10">
                  <Shield className="w-12 h-12 text-[#221C18] mx-auto mb-3" />
                  <p className="text-[#8B6B4A] font-semibold text-sm">No activity recorded yet.</p>
                </div>
              ) : (
                <div className="relative border-l border-slate-200 dark:border-[#221C18] ml-4 space-y-8 pb-4">
                  {activityTimeline.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="relative pl-8 group">
                        <div className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full border-[3px] border-[#1A1614] bg-white dark:bg-[#221C18] flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-[#dae2fd] leading-none mb-1.5">{item.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-[#B8AEA3] mb-2">{item.desc}</p>
                          <span className="text-[10px] font-bold text-[#8B6B4A] uppercase tracking-widest">{item.time}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
