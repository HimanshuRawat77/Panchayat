import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, LayoutDashboard, ChevronLeft, ShieldCheck, Megaphone, Building2, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const Assistant = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Welcome to Panchayat AI! How can I assist you with society rules, notices, or general information today?',
      source: '🤖 AI Assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }
      setUser(JSON.parse(storedUser));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSourceIcon = (source) => {
    if (source.includes('Rule')) return <ShieldCheck className="h-3 w-3" />;
    if (source.includes('Notice')) return <Megaphone className="h-3 w-3" />;
    if (source.includes('Information')) return <Building2 className="h-3 w-3" />;
    return <Sparkles className="h-3 w-3" />;
  };

  const getSourceStyle = (source) => {
    if (source.includes('Rule')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (source.includes('Notice')) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    if (source.includes('Information')) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    return 'bg-[#C8A45D]/10 text-[#C8A45D] border-[#C8A45D]/20';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ question: userMsg.content })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get answer');
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        source: data.source,
        title: data.title,
        timestamp: new Date()
      }]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I am having trouble connecting right now. Please try again later.',
        source: '⚠️ System Error',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#151210] text-[#F5F1EA] font-sans selection:bg-[#C8A45D]/20 flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#151210]/90 backdrop-blur-xl border-b border-[#221C18]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 text-[#B8AEA3] hover:text-[#dae2fd] rounded-lg hover:bg-[#221C18] transition"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2a221d] to-[#1a1512] border border-[#C8A45D]/30 shadow-[0_0_15px_rgba(200,164,93,0.1)]">
              <Sparkles className="h-5 w-5 text-[#C8A45D]" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-[#dae2fd] leading-tight">
                Panchayat AI
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#8B6B4A]">
                Smart Assistant
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative">
        <div className="max-w-3xl mx-auto space-y-6 pb-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-[#C8A45D] to-[#B38D46] text-[#151210] rounded-br-sm' 
                  : msg.isError 
                    ? 'bg-rose-500/10 border border-rose-500/20 text-rose-200 rounded-bl-sm'
                    : 'bg-[#1A1614] border border-[#221C18] text-[#dae2fd] rounded-bl-sm'
              }`}>
                {msg.role === 'assistant' && msg.source && !msg.isError && (
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider mb-3 ${getSourceStyle(msg.source)}`}>
                    {getSourceIcon(msg.source)}
                    {msg.source}
                  </div>
                )}

                {msg.title && (
                  <h4 className="font-bold text-sm mb-1 text-[#dae2fd]">{msg.title}</h4>
                )}
                
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {msg.content}
                </p>
                
                <div className={`text-[10px] mt-2 font-medium ${msg.role === 'user' ? 'text-[#151210]/60' : 'text-[#8B6B4A]'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#1A1614] border border-[#221C18] rounded-2xl rounded-bl-sm p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#C8A45D] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs text-[#8B6B4A] font-medium ml-2">Searching knowledge base...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-[#151210] border-t border-[#221C18] p-4 sm:p-6 z-20">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about gym timings, recent notices, or society office..." 
              disabled={loading}
              className="w-full bg-[#1A1614] border border-[#221C18] text-sm text-[#dae2fd] placeholder:text-[#6B4F3A] rounded-xl pl-5 pr-14 py-4 focus:outline-none focus:border-[#C8A45D]/50 focus:ring-1 focus:ring-[#C8A45D]/50 transition-colors shadow-inner disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 flex items-center justify-center h-10 w-10 rounded-lg bg-[#C8A45D] text-[#151210] hover:bg-[#E0C27A] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-[10px] text-[#8B6B4A] font-medium uppercase tracking-widest">
              Panchayat AI searches internal rules & notices before consulting external knowledge.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Assistant;
