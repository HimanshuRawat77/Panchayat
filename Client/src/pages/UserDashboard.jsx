import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  MessageCircle, 
  Plus, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Wrench,
  FileText,
  Home,
  User,
  ChevronRight,
  Heart,
  MessageSquare,
  Share2,
  MapPin,
  Users,
  BookOpen,
  Phone,
  MapPinIcon,
  Briefcase,
  Send
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Typewriter } from '../components/ui/typewriter';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: 'Loading...',
    block: '...',
    avatar: '👤',
    unreadNotifications: 0
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    // console.log("Dashboard loaded user data:", storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        fullName: parsedUser.fullName || 'User',
        block: parsedUser.block || 'N/A',
        avatar: parsedUser.avatar || '👤',
        unreadNotifications: parsedUser.unreadNotifications || 0
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Daily Suvichar/Motivational Quotes
  const motivationalQuotes = [
    { 
      quote: "सच्चा समाज वह है जहाँ हर व्यक्ति एक-दूसरे की मदद करता है।", 
      author: "महात्मा गांधी",
      emoji: "🕉️"
    },
    { 
      quote: "एकता में शक्ति है, साथ मिलकर हम सब कुछ कर सकते हैं।", 
      author: "स्वामी विवेकानंद",
      emoji: "💪"
    },
    { 
      quote: "अपने समाज की सेवा ही सबसे बड़ा धर्म है।", 
      author: "लोकमान्य तिलक",
      emoji: "🙏"
    },
    { 
      quote: "स्वच्छता और अनुशासन से ही समाज का विकास होता है।", 
      author: "महात्मा गांध��",
      emoji: "✨"
    }
  ];

  const getDailySuvichar = () => {
    const day = new Date().getDay();
    return motivationalQuotes[day % motivationalQuotes.length];
  };

  const [suvichar] = useState(getDailySuvichar());

  // Notices Data
  const notices = [
    {
      id: 1,
      title: "🎉 Annual Society Fest - 15th April",
      category: "event",
      priority: "high",
      content: "Join us for the annual society fest with games, food, and entertainment.",
      expiryDate: "2026-04-15",
      isPinned: true
    },
    {
      id: 2,
      title: "⚡ Power Maintenance - 14th April (2-6 PM)",
      category: "urgent",
      priority: "critical",
      content: "Scheduled power maintenance. Please keep water tanks filled.",
      expiryDate: "2026-04-14",
      isPinned: true
    },
    {
      id: 3,
      title: "📋 New Parking Guidelines",
      category: "info",
      priority: "medium",
      content: "Updated parking rules effective from April 1st.",
      expiryDate: "2026-05-01",
      isPinned: false
    }
  ];

  // User's Complaints Summary
  const complaintStats = {
    total: 12,
    pending: 2,
    inProgress: 3,
    resolved: 7
  };

  const recentComplaints = [
    {
      id: 'C001',
      title: 'Water Leakage in Kitchen',
      status: 'In Progress',
      category: 'Plumber',
      date: '2026-04-10',
      priority: 'high',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'C002',
      title: 'Electrical Fault in Main Gate',
      status: 'Pending',
      category: 'Electrician',
      date: '2026-04-11',
      priority: 'critical',
      statusColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'C003',
      title: 'Broken Door Lock',
      status: 'Resolved',
      category: 'Carpenter',
      date: '2026-04-05',
      priority: 'low',
      statusColor: 'bg-green-100 text-green-800'
    }
  ];

  // Quick Services
  const quickServices = [
    { id: 1, name: 'Plumber', icon: '🔧', color: 'from-blue-500 to-blue-600' },
    { id: 2, name: 'Electrician', icon: '⚡', color: 'from-yellow-500 to-yellow-600' },
    { id: 3, name: 'Carpenter', icon: '🪛', color: 'from-orange-500 to-orange-600' },
  ];

  // To-Let Listings
  const toLet = [
    {
      id: 1,
      block: 'Block B',
      bhk: '2 BHK',
      rent: '₹15,000',
      owner: 'Amit Singh',
      contact: '9876543210',
      image: '🏠'
    },
    {
      id: 2,
      block: 'Block C',
      bhk: '3 BHK',
      rent: '₹22,000',
      owner: 'Priya Sharma',
      contact: '9876543211',
      image: '🏢'
    }
  ];

  // Property Sell Listings
  const propertyForSale = [
    {
      id: 1,
      block: 'Block A',
      bhk: '3 BHK',
      price: '₹45,00,000',
      owner: 'Vikram Patel',
      description: 'Corner Plot',
      image: '🏡'
    }
  ];

  // Community Feed
  const communityPosts = [
    {
      id: 1,
      author: 'Neha Gupta',
      block: 'Block A',
      type: 'Lost & Found',
      content: 'Lost: Black cat near Block A gate. Please contact if seen.',
      timestamp: '2 hours ago',
      likes: 5,
      comments: 2,
      isLiked: false
    },
    {
      id: 2,
      author: 'Raj Kumar',
      block: 'Block D',
      type: 'Event',
      content: 'Cricket match tomorrow evening at 5 PM. All are welcome!',
      timestamp: '4 hours ago',
      likes: 12,
      comments: 8,
      isLiked: false
    }
  ];

  const societyRules = [
    { rule: '🏋️ Gym Timings: 6 AM - 9 PM', icon: '🏋️' },
    { rule: '🚗 No Parking in Common Areas', icon: '🚗' },
    { rule: '🔕 Quiet Hours: 10 PM - 7 AM', icon: '🔕' },
    { rule: '🎭 Events Only on Weekends', icon: '🎭' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏘️</span>
            <h1 className="text-2xl font-black text-white">Panchayat</h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            
            <button 
              onClick={() => setShowAIChat(!showAIChat)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              <MessageCircle className="w-5 h-5" />
              AI Chat
            </button>
            
            <div onClick={() => navigate("/profile")} className="flex items-center gap-3 pl-4 border-l border-white/20 cursor-pointer hover:bg-white/5 p-1 rounded-xl transition">
              <div className="text-right">
                <p className="text-white font-semibold text-sm">{user.fullName}</p>
                <p className="text-white/60 text-xs">{user.block}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl overflow-hidden shadow-lg border-2 border-white/20">
                {user.avatar && user.avatar.length > 5 ? (
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.avatar || '👤'
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* AI Chat Widget */}
      {showAIChat && (
        <div className="fixed bottom-20 right-8 w-96 h-96 bg-white rounded-2xl shadow-2xl z-40 flex flex-col">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-t-2xl text-white font-bold flex justify-between items-center">
            🤖 Panchayat AI Assistant
            <button onClick={() => setShowAIChat(false)} className="text-lg">×</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-gray-100 p-3 rounded-lg max-w-xs">
              <p className="text-sm text-gray-800">Hi! 👋 I'm your AI assistant. Ask me about society rules, complaint status, or anything else!</p>
            </div>
          </div>
          <div className="border-t p-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* 1. Daily Suvichar Card */}
        <div className="bg-gradient-to-r from-orange-400 via-pink-400 to-red-400 rounded-3xl p-8 text-white shadow-2xl hover:shadow-orange-500/30 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{suvichar.emoji}</span>
            <span className="text-sm font-black uppercase tracking-widest opacity-90">आज का सुविचार</span>
          </div>
          <div className="text-3xl md:text-4xl font-bold leading-relaxed italic mb-6">
            <Typewriter 
              words={[suvichar.quote]} 
              speed={50}
              delayBetweenWords={5000}
              cursor={true}
            />
          </div>
          <p className="text-lg font-semibold opacity-90 border-l-4 border-white/30 pl-4">
            — {suvichar.author}
          </p>
        </div>

        {/* 2. Notice Board */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
            <h2 className="text-3xl font-bold text-white">📢 Notice Board</h2>
          </div>
          <div className="grid gap-4">
            {notices.map((notice) => (
              <div 
                key={notice.id}
                className={`p-6 rounded-2xl border-l-4 cursor-pointer hover:shadow-lg transition ${
                  notice.isPinned 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-400' 
                    : 'bg-white/5 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {notice.isPinned && <span className="text-yellow-400">📌</span>}
                      <h3 className="text-xl font-bold text-white">{notice.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        notice.priority === 'critical' ? 'bg-red-500/30 text-red-200' :
                        notice.priority === 'high' ? 'bg-orange-500/30 text-orange-200' :
                        'bg-blue-500/30 text-blue-200'
                      }`}>
                        {notice.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-white/70 mb-3">{notice.content}</p>
                    <p className="text-white/50 text-sm">Expires: {notice.expiryDate}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/50" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Quick Complaint Access */}
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">🎤 Raise Complaint</h2>
            <p className="text-white/70">Use voice or text to report issues</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <button className="group p-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl text-white hover:shadow-2xl hover:shadow-blue-500/50 transition">
              <div className="text-5xl mb-4">🎙️</div>
              <h3 className="text-2xl font-bold mb-2">Voice Input</h3>
              <p className="text-white/80 mb-4">Describe your issue by speaking</p>
              <p className="text-sm opacity-75">Click to start recording →</p>
            </button>
            <button className="group p-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white hover:shadow-2xl hover:shadow-green-500/50 transition">
              <div className="text-5xl mb-4">✍️</div>
              <h3 className="text-2xl font-bold mb-2">Text Input</h3>
              <p className="text-white/80 mb-4">Type your complaint details</p>
              <p className="text-sm opacity-75">Click to start typing →</p>
            </button>
          </div>
        </div>

        {/* 4. Complaint Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Total', count: complaintStats.total, color: 'from-blue-500 to-blue-600', icon: '📊' },
            { label: 'Pending', count: complaintStats.pending, color: 'from-yellow-500 to-orange-600', icon: '⏳' },
            { label: 'In Progress', count: complaintStats.inProgress, color: 'from-purple-500 to-pink-600', icon: '🔄' },
            { label: 'Resolved', count: complaintStats.resolved, color: 'from-green-500 to-emerald-600', icon: '✅' },
          ].map((stat, idx) => (
            <div 
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition`}
            >
              <div className="text-4xl mb-4">{stat.icon}</div>
              <p className="text-sm opacity-80 mb-2">{stat.label}</p>
              <p className="text-4xl font-black">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* 5. Recent Complaints */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">📋 My Recent Complaints</h2>
          <div className="space-y-4">
            {recentComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 transition group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${complaint.statusColor}`}>
                        {complaint.status}
                      </span>
                      <p className="text-white font-bold text-lg">{complaint.title}</p>
                    </div>
                    <div className="flex gap-4 text-sm text-white/60">
                      <span>🏷️ {complaint.category}</span>
                      <span>📅 {complaint.date}</span>
                      <span className="text-red-400">🔴 {complaint.priority}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/30 group-hover:text-white/60 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Quick Services Panel */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">🔧 Quick Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickServices.map((service) => (
              <button 
                key={service.id}
                className={`group p-8 rounded-2xl text-white font-bold text-2xl bg-gradient-to-br ${service.color} hover:shadow-2xl hover:scale-105 transition`}
              >
                <div className="text-6xl mb-4">{service.icon}</div>
                <p>{service.name}</p>
                <p className="text-sm font-normal opacity-80 mt-2">Request Now →</p>
              </button>
            ))}
          </div>
        </div>

        {/* 7. To-Let Listings */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">🏠 To-Let Listings</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {toLet.map((property) => (
              <div key={property.id} className="bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition border border-white/10 group cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-8xl group-hover:scale-110 transition">
                  {property.image}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{property.bhk} • {property.block}</h3>
                  <p className="text-3xl font-black text-green-400 mb-4">{property.rent}/month</p>
                  <div className="space-y-2 text-white/70 text-sm mb-6">
                    <p>👤 Owner: {property.owner}</p>
                    <p className="flex items-center gap-2">📞 <a href={`tel:${property.contact}`} className="text-blue-400 hover:underline">{property.contact}</a></p>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 8. Property for Sale */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">🏡 Properties for Sale</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {propertyForSale.map((property) => (
              <div key={property.id} className="bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10 transition border border-white/10 group cursor-pointer">
                <div className="h-40 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-8xl group-hover:scale-110 transition">
                  {property.image}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3">{property.bhk} • {property.block}</h3>
                  <p className="text-3xl font-black text-yellow-400 mb-4">{property.price}</p>
                  <p className="text-white/70 mb-4">{property.description}</p>
                  <p className="text-white/60 text-sm mb-6">Owner: {property.owner}</p>
                  <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition">
                    I'm Interested
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 9. Society Rules */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">📘 Society Rules</h2>
            <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition">
              View All Rules
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {societyRules.map((item, idx) => (
              <div key={idx} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition text-white font-semibold">
                {item.rule}
              </div>
            ))}
          </div>
        </div>

        {/* 11. Community Feed */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">👥 Community Feed</h2>
          <div className="space-y-6">
            {communityPosts.map((post) => (
              <div key={post.id} className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-bold">{post.author}</p>
                      <p className="text-white/50 text-sm">📍 {post.block} • {post.timestamp}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/30 text-blue-200 rounded-full text-xs font-bold">
                    {post.type}
                  </span>
                </div>
                <p className="text-white/80 mb-6">{post.content}</p>
                <div className="flex gap-6 text-white/60">
                  <button className="flex items-center gap-2 hover:text-red-400 transition">
                    <Heart className="w-5 h-5" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-400 transition">
                    <MessageSquare className="w-5 h-5" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-400 transition">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-white/60 border-t border-white/10 mt-12">
        <p className="text-sm">🏘️ Panchayat Smart Living Platform | Building Better Communities Together</p>
      </footer>
    </div>
  );
};

export default UserDashboard;