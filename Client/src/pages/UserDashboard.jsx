import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  Bell,
  BookOpen,
  Building2,
  ChevronRight,
  Hammer,
  Heart,
  Home,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Mic,
  PenLine,
  Pin,
  Send,
  Share2,
  Sparkles,
  Type,
  Users,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Typewriter } from '../components/ui/typewriter';
import { getMyComplaints } from '../services/complaintService';

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
    };
  } catch {
    return null;
  }
}

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(readUserFromStorage);
  const [showAIChat, setShowAIChat] = useState(false);
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

  const motivationalQuotes = useMemo(
    () => [
      {
        quote: 'सच्चा समाज वह है जहाँ हर व्यक्ति एक-दूसरे की मदद करता है।',
        author: 'महात्मा गांधी',
      },
      {
        quote: 'एकता में शक्ति है, साथ मिलकर हम सब कुछ कर सकते हैं।',
        author: 'स्वामी विवेकानंद',
      },
      {
        quote: 'अपने समाज की सेवा ही सबसे बड़ा धर्म है।',
        author: 'लोकमान्य तिलक',
      },
      {
        quote: 'स्वच्छता और अनुशासन से ही समाज का विकास होता है।',
        author: 'महात्मा गांधी',
      },
    ],
    [],
  );

  const suvichar = useMemo(() => {
    const day = new Date().getDay();
    return motivationalQuotes[day % motivationalQuotes.length];
  }, [motivationalQuotes]);

  const notices = [
    {
      id: 1,
      title: 'Annual Society Fest — 15 April',
      category: 'event',
      priority: 'high',
      content: 'Join us for the annual society fest with games, food, and entertainment.',
      expiryDate: '2026-04-15',
      isPinned: true,
    },
    {
      id: 2,
      title: 'Power maintenance — 14 April (2–6 PM)',
      category: 'urgent',
      priority: 'critical',
      content: 'Scheduled power maintenance. Please keep water tanks filled.',
      expiryDate: '2026-04-14',
      isPinned: true,
    },
    {
      id: 3,
      title: 'New parking guidelines',
      category: 'info',
      priority: 'medium',
      content: 'Updated parking rules effective from 1 April.',
      expiryDate: '2026-05-01',
      isPinned: false,
    },
  ];

  const complaintStats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(c => c.status === 'Pending').length,
      inProgress: complaints.filter(c => c.status === 'In progress').length,
      resolved: complaints.filter(c => c.status === 'Resolved').length,
    };
  }, [complaints]);

  const recentComplaints = useMemo(() => {
    return complaints.slice(0, 3).map(c => ({
      id: c._id,
      title: c.description,
      status: c.status,
      category: c.category.charAt(0).toUpperCase() + c.category.slice(1),
      date: new Date(c.createdAt).toLocaleDateString(),
      priority: c.priority,
      image: c.image,
      statusStyle:
        c.status === 'Resolved' 
          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200'
          : c.status === 'In progress'
          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-200'
    }));
  }, [complaints]);

  const quickServices = [
    { id: 1, name: 'Plumber', Icon: Wrench, from: 'from-sky-500', to: 'to-blue-600' },
    { id: 2, name: 'Electrician', Icon: Zap, from: 'from-amber-500', to: 'to-orange-600' },
    { id: 3, name: 'Carpenter', Icon: Hammer, from: 'from-orange-500', to: 'to-red-600' },
  ];

  const toLet = [
    {
      id: 1,
      block: 'Block B',
      bhk: '2 BHK',
      rent: '₹15,000',
      owner: 'Amit Singh',
      contact: '9876543210',
    },
    {
      id: 2,
      block: 'Block C',
      bhk: '3 BHK',
      rent: '₹22,000',
      owner: 'Priya Sharma',
      contact: '9876543211',
    },
  ];

  const propertyForSale = [
    {
      id: 1,
      block: 'Block A',
      bhk: '3 BHK',
      price: '₹45,00,000',
      owner: 'Vikram Patel',
      description: 'Corner plot',
    },
  ];

  const communityPosts = [
    {
      id: 1,
      author: 'Neha Gupta',
      block: 'Block A',
      type: 'Lost & found',
      content: 'Lost: black cat near Block A gate. Please contact if seen.',
      timestamp: '2 hours ago',
      likes: 5,
      comments: 2,
    },
    {
      id: 2,
      author: 'Raj Kumar',
      block: 'Block D',
      type: 'Event',
      content: 'Cricket match tomorrow evening at 5 PM. All are welcome.',
      timestamp: '4 hours ago',
      likes: 12,
      comments: 8,
    },
  ];

  const societyRules = [
    { rule: 'Gym timings: 6 AM – 9 PM' },
    { rule: 'No parking in common areas' },
    { rule: 'Quiet hours: 10 PM – 7 AM' },
    { rule: 'Events only on weekends' },
  ];

  if (!user) {
    return null;
  }

  const priorityBadge = (p) => {
    const map = {
      critical:
        'bg-rose-500/15 text-rose-700 ring-rose-500/20 dark:text-rose-300 dark:ring-rose-500/30',
      high: 'bg-amber-500/15 text-amber-800 ring-amber-500/20 dark:text-amber-200 dark:ring-amber-500/30',
      medium:
        'bg-sky-500/15 text-sky-800 ring-sky-500/20 dark:text-sky-200 dark:ring-sky-500/30',
    };
    return map[p] || map.medium;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-900 transition-colors dark:bg-[#070a12] dark:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-400/10 blur-[100px] dark:bg-indigo-600/15" />
        <div className="absolute -right-20 bottom-20 h-[28rem] w-[28rem] rounded-full bg-violet-400/10 blur-[120px] dark:bg-violet-600/12" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 rounded-xl text-slate-900 transition hover:opacity-90 dark:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25">
                <Building2 className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
              </span>
              <span className="hidden font-bold tracking-tight sm:inline">Panchayat</span>
            </Link>
            <span className="hidden h-6 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
            <span className="hidden items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:flex">
              <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={2} />
              Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative rounded-xl border border-slate-200/90 bg-white/90 p-2.5 text-slate-600 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-slate-600"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={2} />
              {user.unreadNotifications > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowAIChat((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:shadow-lg hover:shadow-indigo-500/30 sm:px-4"
            >
              <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2} />
              <span className="hidden sm:inline">AI assistant</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 py-1.5 pl-1.5 pr-3 transition hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-slate-600"
            >
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-inner">
                {user.avatar && user.avatar.length > 5 ? (
                  <img src={user.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg leading-none">{user.avatar || '👤'}</span>
                )}
              </div>
              <div className="hidden text-left sm:block">
                <p className="max-w-[8rem] truncate text-sm font-semibold leading-tight text-slate-900 dark:text-white">
                  {user.fullName}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user.block}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200/90 p-2.5 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-rose-900/50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {showAIChat && (
        <div
          className="fixed bottom-6 right-4 z-40 flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40 sm:right-6"
          role="dialog"
          aria-label="AI assistant"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
              Panchayat AI
            </div>
            <button
              type="button"
              onClick={() => setShowAIChat(false)}
              className="rounded-lg p-1 transition hover:bg-white/15"
              aria-label="Close"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
          <div className="max-h-64 space-y-3 overflow-y-auto p-4">
            <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-800 dark:bg-slate-800 dark:text-slate-200">
              Hi — ask about society rules, complaint status, or facilities.
            </div>
          </div>
          <div className="flex gap-2 border-t border-slate-200/80 p-3 dark:border-slate-700">
            <input
              type="text"
              placeholder="Ask anything…"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none ring-indigo-500/0 transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            />
            <button
              type="button"
              className="flex shrink-0 items-center justify-center rounded-xl bg-indigo-600 p-2.5 text-white transition hover:bg-indigo-500"
              aria-label="Send"
            >
              <Send className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      <main className="relative z-10 mx-auto max-w-6xl space-y-8 px-4 py-8 md:space-y-10 md:py-10">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-500/90 via-orange-500/85 to-rose-600/90 p-8 text-white shadow-glow-sm md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/20 blur-3xl" />
          <div className="relative mb-6 flex items-center gap-3">
            <Sparkles className="h-8 w-8 opacity-90" strokeWidth={1.5} />
            <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-95">
              आज का सुविचार
            </span>
          </div>
          <div className="relative text-2xl font-semibold leading-relaxed md:text-3xl">
            <Typewriter words={[suvichar.quote]} speed={50} delayBetweenWords={5000} cursor />
          </div>
          <p className="relative mt-6 border-l-2 border-white/40 pl-4 text-base font-medium opacity-95">
            — {suvichar.author}
          </p>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-card-dark md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Megaphone className="h-6 w-6" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Notice board</h2>
          </div>
          <div className="grid gap-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`group cursor-pointer rounded-2xl border p-5 transition hover:shadow-md md:p-6 ${
                  notice.isPinned
                    ? 'border-amber-200/80 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-500/5'
                    : 'border-slate-200/80 bg-slate-50/50 dark:border-slate-700/80 dark:bg-slate-800/30'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      {notice.isPinned && (
                        <Pin className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                      )}
                      <h3 className="font-semibold text-slate-900 dark:text-white">{notice.title}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ${priorityBadge(notice.priority)}`}
                      >
                        {notice.priority}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      {notice.content}
                    </p>
                    <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-500">
                      Expires {notice.expiryDate}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-indigo-200/60 bg-gradient-to-br from-indigo-500/5 via-white/80 to-violet-500/5 p-6 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:via-slate-900/50 dark:to-violet-500/10 md:p-8">
          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Raise a complaint</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Voice or text — same streamlined flow
            </p>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate('/complaints')}
              className="group flex flex-col items-start w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-glow-sm dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
                <Mic className="h-7 w-7" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Smart Voice Complaint</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Speak your issue and let our AI summarize it for the society admins.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                Start recording
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </button>
          </div>

        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total', count: complaintStats.total, Icon: LayoutDashboard, accent: 'from-sky-500 to-blue-600' },
            { label: 'Pending', count: complaintStats.pending, Icon: AlertCircle, accent: 'from-amber-500 to-orange-600' },
            { label: 'In progress', count: complaintStats.inProgress, Icon: Zap, accent: 'from-violet-500 to-purple-600' },
            { label: 'Resolved', count: complaintStats.resolved, Icon: Home, accent: 'from-emerald-500 to-teal-600' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-card backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-card-dark"
            >
              <div
                className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.accent} text-white shadow-md`}
              >
                <stat.Icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.label}
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{stat.count}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-card-dark md:p-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">Recent complaints</h2>
          <div className="space-y-3">
            {recentComplaints.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No complaints submitted recently.
              </p>
            ) : (
              recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 transition hover:border-indigo-200/80 hover:bg-white dark:border-slate-700/80 dark:bg-slate-800/40 dark:hover:border-indigo-500/30 dark:hover:bg-slate-800/60 md:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      {complaint.image && (
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                          <img src={complaint.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${complaint.statusStyle}`}
                          >
                            {complaint.status}
                          </span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {complaint.title}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                          <span>{complaint.category}</span>
                          <span>{complaint.date}</span>
                          <span className={`font-semibold ${
                            complaint.priority === 'High' ? 'text-rose-600 dark:text-rose-400' : 
                            complaint.priority === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 
                            'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {complaint.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-slate-600" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-card-dark md:p-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">Quick services</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickServices.map((service) => (
              <button
                key={service.id}
                type="button"
                className={`group flex flex-col items-center rounded-2xl bg-gradient-to-br ${service.from} ${service.to} p-8 text-center text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl`}
              >
                <service.Icon className="mb-4 h-10 w-10 opacity-95" strokeWidth={1.75} />
                <p className="text-lg font-semibold">{service.name}</p>
                <p className="mt-2 text-sm font-medium text-white/85">Request now</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-card-dark md:p-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">To-let listings</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {toLet.map((property) => (
              <div
                key={property.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/50 transition hover:border-indigo-200/60 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-indigo-500/25"
              >
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
                  <Home className="h-16 w-16 opacity-90 transition group-hover:scale-105" strokeWidth={1.25} />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {property.bhk} · {property.block}
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {property.rent}
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">/mo</span>
                  </p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Owner · {property.owner}</p>
                  <a
                    href={`tel:${property.contact}`}
                    className="mt-1 inline-block text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {property.contact}
                  </a>
                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-card-dark md:p-8">
          <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">Properties for sale</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {propertyForSale.map((property) => (
              <div
                key={property.id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50/50 transition hover:border-amber-200/60 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-amber-500/20"
              >
                <div className="flex h-36 items-center justify-center bg-gradient-to-br from-amber-500 to-rose-600 text-white">
                  <Building2 className="h-16 w-16 opacity-90 transition group-hover:scale-105" strokeWidth={1.25} />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {property.bhk} · {property.block}
                  </h3>
                  <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{property.price}</p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{property.description}</p>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">Owner · {property.owner}</p>
                  <button
                    type="button"
                    className="mt-5 w-full rounded-xl border-2 border-amber-200 bg-amber-50 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 dark:hover:bg-amber-500/20"
                  >
                    I&apos;m interested
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-card-dark md:p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="h-6 w-6" strokeWidth={2} />
              </div>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">Society rules</h2>
            </div>
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg"
            >
              View all
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {societyRules.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-5 py-4 text-sm font-medium text-slate-800 transition hover:border-indigo-200/60 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:border-indigo-500/25"
              >
                {item.rule}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-card backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50 dark:shadow-card-dark md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Users className="h-6 w-6" strokeWidth={2} />
            </div>
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">Community feed</h2>
          </div>
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-6 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-slate-600"
              >
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{post.author}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {post.block} · {post.timestamp}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    {post.type}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{post.content}</p>
                <div className="mt-5 flex gap-6 border-t border-slate-200/80 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 transition hover:text-rose-600 dark:hover:text-rose-400"
                  >
                    <Heart className="h-4 w-4" strokeWidth={2} />
                    {post.likes}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 transition hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    <MessageSquare className="h-4 w-4" strokeWidth={2} />
                    {post.comments}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 transition hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Share2 className="h-4 w-4" strokeWidth={2} />
                    Share
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-slate-200/80 bg-white/60 py-10 text-center text-sm text-slate-500 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
        <p className="font-medium">Panchayat · Smart society operations</p>
      </footer>
    </div>
  );
};

export default UserDashboard;
