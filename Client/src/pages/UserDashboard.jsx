import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Sparkles,
  Menu,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Zap,
  Home,
  Megaphone,
  Calendar,
  MapPin,
  Send,
  CheckCircle,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyComplaints } from '../services/complaintService';
import { askAssistant } from '../services/aiService';
import { useTheme } from '../context/ThemeContext';
import RecentRulesWidget from '../components/RecentRulesWidget';
import API_BASE_URL from '../config';

function readUserFromStorage() {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    const parsedUser = JSON.parse(storedUser);
    return {
      _id: parsedUser.id || parsedUser._id,
      fullName: parsedUser.fullName || 'User',
      block: parsedUser.block || 'N/A',
      avatar: parsedUser.avatar || '👤',
      unreadNotifications: parsedUser.unreadNotifications || 0,
    };
  } catch {
    return null;
  }
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user] = useState(readUserFromStorage);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [aiInput, setAiInput] = useState('');
  
  const defaultMessages = [
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello ${user ? user.fullName.split(' ')[0] : 'Resident'}! Ask me about society rules, notices, timings, or office details and I’ll answer using Panchayat knowledge with RAG.`,
      source: '🤖 AI Assistant',
      timestamp: new Date().toISOString()
    }
  ];

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('panchayatAiChat');
      return saved ? JSON.parse(saved) : defaultMessages;
    } catch {
      return defaultMessages;
    }
  });
  
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('panchayatAiChat', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const motivationalQuotes = useMemo(() => [
    { quote: 'सच्चा समाज वह है जहाँ हर व्यक्ति एक-दूसरे की मदद करता है।', author: 'महात्मा गांधी' },
    { quote: 'एकता में शक्ति है, साथ मिलकर हम सब कुछ कर सकते हैं।', author: 'स्वामी विवेकानंद' },
    { quote: 'अपने समाज की सेवा ही सबसे बड़ा धर्म है।', author: 'लोकमान्य तिलक' },
    { quote: 'स्वच्छता और अनुशासन से ही समाज का विकास होता है।', author: 'महात्मा गांधी' }
  ], []);

  const suvichar = useMemo(() => {
    const day = new Date().getDay();
    return motivationalQuotes[day % motivationalQuotes.length];
  }, [motivationalQuotes]);

  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 4 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour <= 23) return 'Good Afternoon';
    return 'Good Night';
  };

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

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/notifications`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        });
        if (response.ok) {
          const notifs = await response.json();
          // Filter to only show unread notifications
          const unreadNotifs = notifs.filter(n => !n.readBy.includes(user._id));
          setUnreadCount(unreadNotifs.length);
          setNotificationsList(unreadNotifs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        }
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchDashboardData();
    fetchNotifications();
  }, [user, navigate]);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      setNotificationsList(prev => prev.filter(n => n._id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark read', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleAiSubmit = async () => {
    if (!aiInput.trim()) return;
    
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: aiInput.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const updated = [...prev, userMsg];
      return updated.slice(-12); // Keep only the last 6 pairs (12 messages)
    });
    setAiInput('');
    setAiLoading(true);

    try {
      const response = await askAssistant(userMsg.content);
      
      setMessages(prev => {
        const updated = [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.answer,
          source: response.source,
          title: response.title,
          references: response.references || [],
          retrievalMode: response.retrievalMode,
          timestamp: new Date().toISOString()
        }];
        return updated.slice(-12);
      });
    } catch (error) {
      setMessages(prev => {
        const updated = [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: error.message || 'Sorry, I am having trouble connecting right now. Please try again later.',
          source: '⚠️ System Error',
          title: 'Assistant Error',
          timestamp: new Date().toISOString(),
          isError: true
        }];
        return updated.slice(-12);
      });
    } finally {
      setAiLoading(false);
    }
  };

  const getSourceIcon = (source) => {
    if (!source) return <Sparkles className="h-3 w-3" />;
    if (source.includes('Rule')) return <ShieldCheck className="h-3 w-3" />;
    if (source.includes('Notice')) return <Megaphone className="h-3 w-3" />;
    if (source.includes('Information')) return <Building2 className="h-3 w-3" />;
    return <Sparkles className="h-3 w-3" />;
  };

  const getSourceStyle = (source) => {
    if (!source) return 'bg-[#C8A45D]/10 text-[#C8A45D] border-[#C8A45D]/20';
    if (source.includes('Rule')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    if (source.includes('Notice')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    if (source.includes('Information')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    return 'bg-[#C8A45D]/10 text-[#C8A45D] border-[#C8A45D]/20';
  };

  const getReferenceLabel = (retrievalMode) => (
    retrievalMode === 'keyword-fallback' ? 'Fallback Match' : 'RAG Sources'
  );

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: MessageSquareWarning, label: 'Complaints', path: '/complaints' },
    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  const bottomNavItems = [
    { icon: HelpCircle, label: 'Support', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: handleLogout },
  ];

  const getLastMonday = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const complaintStats = useMemo(() => {
    const MAX_COMPLAINTS_PER_WEEK = 10;
    
    // Count complaints made this week
    const lastMonday = getLastMonday();
    const complaintsThisWeek = complaints.filter(c => new Date(c.createdAt || Date.now()) >= lastMonday).length;
    const complaintsLeft = Math.max(MAX_COMPLAINTS_PER_WEEK - complaintsThisWeek, 0);

    const open = complaints.filter(c => c.status === 'Pending').length;
    const inProgress = complaints.filter(c => c.status === 'In progress').length;
    const resolved = complaints.filter(c => c.status === 'Resolved').length;

    return {
      open,
      inProgress,
      resolved,
      complaintsLeft,
      openPercent: Math.min((open / MAX_COMPLAINTS_PER_WEEK) * 100, 100),
      inProgressPercent: Math.min((inProgress / MAX_COMPLAINTS_PER_WEEK) * 100, 100),
      resolvedPercent: Math.min((resolved / MAX_COMPLAINTS_PER_WEEK) * 100, 100),
    };
  }, [complaints]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#151210] text-slate-900 dark:text-[#F5F1EA] font-sans selection:bg-[#C8A45D]/20">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/30 dark:bg-black/60 lg:hidden backdrop-blur-sm"
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

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto pb-4">
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
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50 dark:bg-[#110e0c]/50">
        
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
              Panchayat
            </h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 ml-4">
            <button onClick={toggleTheme} className="text-[#8B6B4A] hover:text-[#C8A45D] transition bg-white dark:bg-[#1A1614] p-2 rounded-full border border-slate-200 dark:border-[#221C18]">
              {theme === 'light' ? <Moon className="h-[1.15rem] w-[1.15rem]" /> : <Sun className="h-[1.15rem] w-[1.15rem]" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-[#8B6B4A] hover:text-[#C8A45D] transition bg-white dark:bg-[#1A1614] p-2 rounded-full border border-slate-200 dark:border-[#221C18]">
                <Bell className="h-[1.15rem] w-[1.15rem]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-[#1A1614]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] shadow-xl shadow-slate-200/50 dark:shadow-black/50 overflow-hidden z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#221C18] px-4 py-3 bg-slate-50 dark:bg-[#151210]">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-[#dae2fd]">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-md">
                        {unreadCount} New
                      </span>
                    )}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                    {notificationsList.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 dark:text-[#B8AEA3] text-xs">
                        No new notifications.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-50 dark:divide-[#221C18]/50">
                        {notificationsList.map(notif => (
                          <div key={notif._id} className="p-4 hover:bg-slate-50 dark:hover:bg-[#221C18]/30 transition group flex gap-3 items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900 dark:text-[#dae2fd] mb-0.5">{notif.title}</p>
                              <p className="text-[11px] text-slate-500 dark:text-[#B8AEA3] leading-relaxed line-clamp-2">{notif.message}</p>
                              <p className="text-[9px] text-slate-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button 
                              onClick={() => markAsRead(notif._id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
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
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-[#dae2fd] leading-none mb-1">{user.fullName}</p>
                <p className="text-[9px] font-bold tracking-widest text-[#8B6B4A] uppercase leading-none">{user.block}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 lg:p-8 w-full max-w-[1600px] mx-auto space-y-6">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Hero Card */}
            <div className="lg:col-span-2 rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-8 flex flex-col justify-between relative overflow-hidden shadow-sm">
              <div className="absolute right-0 top-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=')]"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-[#8B6B4A] text-xs font-bold uppercase tracking-widest">
                  <span>{formattedDate}</span>
                  <span className="w-1 h-1 rounded-full bg-[#8B6B4A]"></span>
                  <span>{formattedTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#dae2fd] mb-3">{getGreeting()}, {user.fullName.split(' ')[0]}.</h2>
                <p className="text-slate-500 dark:text-[#B8AEA3] text-sm max-w-lg leading-relaxed">
                  Your society is safe and sound. 4 guards are currently patrolling and all systems are operational.
                </p>
              </div>
              <div className="mt-8 rounded-2xl bg-slate-100 dark:bg-[#221C18]/60 border border-slate-200 dark:border-[#221C18] py-8 px-6 min-h-[140px] flex items-center gap-5 backdrop-blur-md w-[85%] max-w-3xl relative z-10 shadow-inner">
                <span className="text-6xl font-serif font-bold text-[#8B6B4A] opacity-50 leading-none mt-2">"</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#8B6B4A] mb-2">Daily Suvichar - {suvichar.author}</p>
                  <p className="text-lg font-medium text-slate-900 dark:text-[#dae2fd] italic leading-relaxed">"{suvichar.quote}"</p>
                </div>
              </div>
            </div>

            {/* Panchayat AI Widget */}
            <div className="rounded-[24px] border border-[#C8A45D]/30 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-[#221C18] dark:to-[#151210] p-[1px] shadow-lg lg:col-span-1 h-full min-h-[300px]">
              <div className="h-full rounded-[23px] bg-slate-50 dark:bg-[#1A1614] p-4 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8A45D]/5 blur-3xl rounded-full"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] leading-tight text-base">Panchayat AI</h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Always Active</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-h-[250px] rounded-2xl bg-white dark:bg-[#221C18]/80 p-3 border border-slate-200 dark:border-[#221C18] mb-3 relative z-10 shadow-inner overflow-y-auto custom-scrollbar flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3 shadow-sm ${
                        msg.role === 'user' 
                          ? 'bg-gradient-to-br from-[#C8A45D] to-[#B38D46] text-[#151210] rounded-br-sm' 
                          : msg.isError 
                            ? 'bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-bl-sm'
                            : 'bg-emerald-50 dark:bg-[#151210] border border-emerald-500/30 dark:border-emerald-500 rounded-bl-sm'
                      }`}>
                        {msg.role === 'assistant' && msg.source && !msg.isError && (
                          <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[8px] font-bold uppercase tracking-wider mb-2 w-fit ${getSourceStyle(msg.source)}`}>
                            {getSourceIcon(msg.source)}
                            {msg.source}
                          </div>
                        )}
                        
                        {msg.title && (
                          <h4 className="font-bold text-[11px] mb-1 text-slate-900 dark:text-white">{msg.title}</h4>
                        )}
                        
                        <div className="text-[11px] leading-relaxed font-medium whitespace-pre-wrap text-slate-700 dark:text-white/90">
                          {msg.content}
                        </div>

                        {msg.references?.length > 0 && (
                          <div className="mt-3 border-t border-slate-200/80 dark:border-white/10 pt-2">
                            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-[#8B6B4A]">
                              {getReferenceLabel(msg.retrievalMode)}
                            </p>
                            <p className="mt-1 text-[10px] leading-relaxed text-slate-600 dark:text-white/70">
                              {msg.references
                                .map((reference) => `${reference.title}${reference.meta ? ` (${reference.meta})` : ''}`)
                                .join(' • ')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {aiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#f8fafc] dark:bg-[#1A1614] border border-slate-200 dark:border-[#221C18] rounded-2xl rounded-bl-sm p-3 shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="animate-pulse flex gap-1">
                            <div className="w-1.5 h-1.5 bg-[#C8A45D] rounded-full"></div>
                            <div className="w-1.5 h-1.5 bg-[#C8A45D] rounded-full animation-delay-200"></div>
                            <div className="w-1.5 h-1.5 bg-[#C8A45D] rounded-full animation-delay-400"></div>
                          </div>
                          <span className="text-[10px] text-slate-500 dark:text-[#B8AEA3] font-medium">Retrieving society context...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="relative mt-auto z-10">
                  <input 
                    type="text" 
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAiSubmit()}
                    placeholder="Ask about rules, office timings, gym location..." 
                    disabled={aiLoading}
                    className="w-full bg-white dark:bg-[#151210] border border-slate-200 dark:border-[#221C18] text-xs text-slate-900 dark:text-[#dae2fd] placeholder:text-[#6B4F3A] rounded-[14px] pl-4 pr-10 py-3 focus:outline-none focus:border-[#C8A45D]/50 focus:ring-1 focus:ring-[#C8A45D]/50 transition-colors shadow-inner disabled:opacity-50"
                  />
                  <button 
                    onClick={handleAiSubmit}
                    disabled={aiLoading || !aiInput.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B6B4A] hover:text-[#C8A45D] transition-colors p-1 bg-white dark:bg-[#151210] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-[1.15rem] w-[1.15rem]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Rules Widget */}
            <div className="lg:col-span-2">
              <RecentRulesWidget />
            </div>

            {/* Complaint Status */}
            <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 flex flex-col justify-between shadow-sm h-full min-h-[320px]">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-semibold text-slate-900 dark:text-[#dae2fd] text-base">Complaint Status</h3>
                    <Link to="/complaints" className="text-[10px] font-bold uppercase tracking-widest text-[#C8A45D] hover:text-[#E0C27A] transition">Show All</Link>
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                    complaintStats.complaintsLeft > 0 
                      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                  }`}>
                    {complaintStats.complaintsLeft} / 10 Left This Week
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-500 dark:text-[#B8AEA3]">Open</span>
                      <span className="text-slate-900 dark:text-[#dae2fd]">{complaintStats.open}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f8fafc] dark:bg-[#151210] rounded-full overflow-hidden border border-slate-200 dark:border-[#221C18]">
                      <div className="h-full bg-rose-400/90 rounded-full transition-all duration-1000" style={{ width: `${complaintStats.openPercent}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-500 dark:text-[#B8AEA3]">In Progress</span>
                      <span className="text-slate-900 dark:text-[#dae2fd]">{complaintStats.inProgress}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f8fafc] dark:bg-[#151210] rounded-full overflow-hidden border border-slate-200 dark:border-[#221C18]">
                      <div className="h-full bg-amber-500/90 rounded-full transition-all duration-1000" style={{ width: `${complaintStats.inProgressPercent}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-500 dark:text-[#B8AEA3]">Resolved</span>
                      <span className="text-slate-900 dark:text-[#dae2fd]">{complaintStats.resolved}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f8fafc] dark:bg-[#151210] rounded-full overflow-hidden border border-slate-200 dark:border-[#221C18]">
                      <div className="h-full bg-emerald-500/90 rounded-full transition-all duration-1000" style={{ width: `${complaintStats.resolvedPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Real Estate Section */}
          <div className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-[#dae2fd]">Exclusive Real Estate</h2>
                <p className="text-sm text-slate-500 dark:text-[#B8AEA3]">Managed listings within the community</p>
              </div>
              <div className="flex gap-2">
                <button className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] text-[#8B6B4A] hover:text-[#C8A45D] hover:border-[#6B4F3A] transition shadow-sm">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 flex items-center justify-center rounded-full border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] text-[#8B6B4A] hover:text-[#C8A45D] hover:border-[#6B4F3A] transition shadow-sm">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <div className="rounded-[20px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] overflow-hidden group shadow-sm flex flex-col">
                <div className="h-[180px] relative overflow-hidden bg-[#f8fafc] dark:bg-[#151210] flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[#1A1614] transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-transparent z-10"></div>
                  <Home className="h-16 w-16 text-[#221C18] group-hover:scale-110 group-hover:text-[#6B4F3A]/40 transition duration-500 relative z-10" />
                  <div className="absolute top-3 left-3 z-20 rounded-full bg-[#dae2fd]/90 backdrop-blur text-[10px] font-bold px-3 py-1 text-indigo-950 shadow-sm uppercase tracking-wide">TO-LET</div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-sm leading-tight">Zenith Penthouse</h3>
                      <span className="font-bold text-slate-900 dark:text-[#dae2fd] text-sm whitespace-nowrap">₹85,000<span className="text-[10px] text-slate-500 dark:text-[#B8AEA3] font-semibold">/mo</span></span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#B8AEA3] mb-4 flex items-center gap-1.5"><MapPin className="h-3 w-3"/> Block A, 14th Floor</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#221C18] text-[11px]">
                    <div className="flex gap-3 text-slate-500 dark:text-[#B8AEA3]">
                      <span className="flex items-center gap-1 font-medium"><Home className="h-3 w-3"/> 3 BHK</span>
                      <span className="flex items-center gap-1 font-medium"><Zap className="h-3 w-3"/> 2400 sq.ft</span>
                    </div>
                    <button className="font-bold text-slate-900 dark:text-[#dae2fd] hover:text-[#C8A45D] transition">Details</button>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] overflow-hidden group shadow-sm flex flex-col">
                <div className="h-[180px] relative overflow-hidden bg-[#f8fafc] dark:bg-[#151210] flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[#1A1614] transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-transparent z-10"></div>
                  <Home className="h-16 w-16 text-[#221C18] group-hover:scale-110 group-hover:text-[#6B4F3A]/40 transition duration-500 relative z-10" />
                  <div className="absolute top-3 left-3 z-20 rounded-full bg-amber-500/90 backdrop-blur text-[10px] font-bold px-3 py-1 text-amber-950 shadow-sm uppercase tracking-wide">FOR SALE</div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-sm leading-tight">Elite Garden Villa</h3>
                      <span className="font-bold text-amber-500 text-sm whitespace-nowrap">₹4.2 Cr</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#B8AEA3] mb-4 flex items-center gap-1.5"><MapPin className="h-3 w-3"/> Green Belt, Plot 42</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#221C18] text-[11px]">
                    <div className="flex gap-3 text-slate-500 dark:text-[#B8AEA3]">
                      <span className="flex items-center gap-1 font-medium"><Home className="h-3 w-3"/> 4 BHK</span>
                      <span className="flex items-center gap-1 font-medium"><Zap className="h-3 w-3"/> 3500 sq.ft</span>
                    </div>
                    <button className="font-bold text-amber-500 hover:text-amber-400 transition">Enquire</button>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] overflow-hidden group hidden lg:flex flex-col shadow-sm">
                <div className="h-[180px] relative overflow-hidden bg-[#f8fafc] dark:bg-[#151210] flex items-center justify-center group-hover:bg-white dark:group-hover:bg-[#1A1614] transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614] via-transparent to-transparent z-10"></div>
                  <Home className="h-16 w-16 text-[#221C18] group-hover:scale-110 group-hover:text-[#6B4F3A]/40 transition duration-500 relative z-10" />
                  <div className="absolute top-3 left-3 z-20 rounded-full bg-[#dae2fd]/90 backdrop-blur text-[10px] font-bold px-3 py-1 text-indigo-950 shadow-sm uppercase tracking-wide">TO-LET</div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-[#dae2fd] text-sm leading-tight">Skyline Studio</h3>
                      <span className="font-bold text-slate-900 dark:text-[#dae2fd] text-sm whitespace-nowrap">₹35,000<span className="text-[10px] text-slate-500 dark:text-[#B8AEA3] font-semibold">/mo</span></span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#B8AEA3] mb-4 flex items-center gap-1.5"><MapPin className="h-3 w-3"/> Block C, 8th Floor</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#221C18] text-[11px]">
                    <div className="flex gap-3 text-slate-500 dark:text-[#B8AEA3]">
                      <span className="flex items-center gap-1 font-medium"><Home className="h-3 w-3"/> 1 BHK</span>
                      <span className="flex items-center gap-1 font-medium"><Zap className="h-3 w-3"/> 900 sq.ft</span>
                    </div>
                    <button className="font-bold text-slate-900 dark:text-[#dae2fd] hover:text-[#C8A45D] transition">Details</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Footer */}
          <div className="pt-8 pb-4 mt-8 border-t border-slate-200 dark:border-[#221C18] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-[#8B6B4A]">
            <p>© 2026 Panchayat AI. Reserved for Elite Residences.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-900 dark:hover:text-[#dae2fd] transition">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-[#dae2fd] transition">Terms of Service</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-[#dae2fd] transition">Security</a>
              <a href="#" className="hover:text-slate-900 dark:hover:text-[#dae2fd] transition">Contact</a>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
