import React, { useEffect, useState } from 'react';
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
  MessageCircle,
  Image as ImageIcon,
  Heart,
  Calendar,
  Lightbulb
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { createCommunityPost, getCommunityPosts } from '../services/communityService';

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

const Community = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user] = useState(readUserFromStorage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [postCategory, setPostCategory] = useState('Suggestion');
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Users, label: 'Community', path: '/community', active: true },
    { icon: MessageSquareWarning, label: 'Complaints', path: '/complaints' },

    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  const bottomNavItems = [
    { icon: HelpCircle, label: 'Support', action: () => {} },
    { icon: LogOut, label: 'Sign Out', action: handleLogout },
  ];

  useEffect(() => {
    if (!user) return;

    const loadPosts = async () => {
      try {
        const data = await getCommunityPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to load community posts', error);
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, [user]);

  const formatTimestamp = (value) => {
    if (!value) return 'Just now';
    const date = new Date(value);
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      const newPost = await createCommunityPost({
        category: postCategory,
        content: postContent,
      });

      setPosts((prev) => [newPost, ...prev]);
      setPostContent('');
    } catch (error) {
      console.error('Failed to create community post', error);
    }
  };

  const getCategoryStyles = (cat) => {
    switch(cat) {
      case 'Lost & Found': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Community Event': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Suggestion': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-[#C8A45D] bg-[#C8A45D]/10 border-[#C8A45D]/20';
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

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
              Community Hub
            </h2>
            <div className="relative max-w-lg w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B6B4A]" />
              <input 
                type="text" 
                placeholder="Search community posts..." 
                className="w-full bg-white dark:bg-[#1A1614] border border-slate-200 dark:border-[#221C18] text-sm text-slate-900 dark:text-[#dae2fd] placeholder:text-[#6B4F3A] rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#C8A45D]/50 focus:ring-1 focus:ring-[#C8A45D]/50 transition-colors shadow-inner shadow-slate-200 dark:shadow-black/10"
              />
            </div>
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
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-[#dae2fd] leading-none mb-1">{user.fullName}</p>
                <p className="text-[9px] font-bold tracking-widest text-[#8B6B4A] uppercase leading-none">{user.block}</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Community Content */}
        <div className="p-6 lg:p-8 w-full max-w-3xl mx-auto space-y-6">
          
          {/* Create Post Widget */}
          <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-[#dae2fd] text-base mb-4 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[#C8A45D]" /> Connect with Neighbors
            </h3>
            
            <form onSubmit={handlePost}>
              <div className="flex gap-4 mb-4">
                <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-[#C8A45D]/40 ring-2 ring-white dark:ring-[#151210]">
                  {user.avatar && user.avatar.length > 5 ? (
                    <img src={user.avatar} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-white dark:bg-[#221C18] flex items-center justify-center text-[#C8A45D] font-bold">
                      {user.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <textarea 
                  placeholder="What's happening in the community?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full bg-[#f8fafc] dark:bg-[#151210] border border-slate-200 dark:border-[#221C18] text-sm text-slate-900 dark:text-[#dae2fd] placeholder:text-[#6B4F3A] rounded-[16px] p-4 min-h-[100px] resize-none focus:outline-none focus:border-[#C8A45D]/50 focus:ring-1 focus:ring-[#C8A45D]/50 transition-colors shadow-inner"
                ></textarea>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-14">
                <div className="flex items-center gap-2">
                  <select 
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="bg-[#f8fafc] dark:bg-[#151210] border border-slate-200 dark:border-[#221C18] text-xs font-semibold text-slate-900 dark:text-[#dae2fd] rounded-lg px-3 py-2 focus:outline-none focus:border-[#C8A45D]/50 cursor-pointer"
                  >
                    <option value="Suggestion">💡 Suggestion</option>
                    <option value="Community Event">📅 Community Event</option>
                    <option value="Lost & Found">🔍 Lost & Found</option>
                  </select>
                  <button type="button" className="p-2 text-[#8B6B4A] hover:text-[#C8A45D] hover:bg-white dark:hover:bg-[#221C18] rounded-lg transition-colors">
                    <ImageIcon className="h-4 w-4" />
                  </button>
                </div>
                <button 
                  type="submit"
                  disabled={!postContent.trim()}
                  className="px-6 py-2 rounded-xl bg-white dark:bg-[#221C18] border border-slate-200 dark:border-[#221C18] text-sm font-semibold text-slate-900 dark:text-[#dae2fd] hover:border-[#6B4F3A] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                  Post to Community
                </button>
              </div>
            </form>
          </div>

          {/* Feed */}
          <div className="space-y-6">
            {postsLoading ? (
              <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-[#B8AEA3]">Loading community posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-[#B8AEA3]">No community posts yet. Be the first to share an update.</p>
              </div>
            ) : posts.map(post => (
              <div key={post._id || post.id} className="rounded-[24px] border border-slate-200 dark:border-[#221C18] bg-white dark:bg-[#1A1614] p-6 shadow-sm transition-all hover:border-[#6B4F3A]/50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-[#C8A45D]/40">
                      {post.avatar && post.avatar.length > 5 ? (
                        <img src={post.avatar} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-white dark:bg-[#221C18] flex items-center justify-center text-[#C8A45D] font-bold">
                          {(post.authorName || post.author || 'R').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-[#dae2fd] text-sm">{post.authorName || post.author}</h4>
                      <p className="text-[10px] text-[#8B6B4A] uppercase tracking-widest">{post.block}</p>
                    </div>
                  </div>
                  <div className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border ${getCategoryStyles(post.category)}`}>
                    {post.category}
                  </div>
                </div>
                
                <p className="text-slate-900 dark:text-[#dae2fd]/90 text-sm leading-relaxed mb-5">
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#221C18]">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#B8AEA3] hover:text-rose-500 transition group">
                      <Heart className="h-4 w-4 group-hover:fill-rose-500/20" /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#B8AEA3] hover:text-slate-900 dark:hover:text-[#dae2fd] transition">
                      <MessageCircle className="h-4 w-4" /> {post.comments}
                    </button>
                  </div>
                  <span className="text-[10px] font-medium text-[#6B4F3A]">{formatTimestamp(post.createdAt || post.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Community;
