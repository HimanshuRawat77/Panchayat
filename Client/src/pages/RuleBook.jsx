import { useState, useEffect } from 'react';
import { Search, Filter, Pin, Calendar, Download, AlertCircle, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_BASE_URL from '../config';

const RuleBook = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Gym', 'Parking', 'Security', 'Maintenance', 'Visitors', 'Pets', 'Swimming Pool', 'Community Hall', 'General'];

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      // Assuming a token might be needed if it's protected, but rules are usually public or available to all residents.
      // If verifyUser is strict, we should pass token.
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(`${API_BASE_URL}/rules`, { headers });
      if (response.ok) {
        const data = await response.json();
        setRules(data);
      }
    } catch (error) {
      console.error('Failed to fetch rules', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rules/export`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rules.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const filteredRules = rules.filter(rule => {
    const matchesCategory = selectedCategory === 'All' || rule.category === selectedCategory;
    const matchesSearch = rule.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rule.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedRules = [...filteredRules].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const isRecentlyAdded = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 7;
  };

  return (
    <div className="min-h-screen bg-[#151210] font-sans text-[#F5F1EA]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#C8A45D] mb-2 flex items-center gap-3">
              Society Rule Book
            </h1>
            <p className="text-[#B8AEA3] text-lg">Official guidelines and policies for residents.</p>
          </div>
          <div className="flex gap-4 items-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-[#6B4F3A] bg-[#221C18] px-4 py-3 text-sm font-semibold text-[#F5F1EA] transition hover:bg-[#6B4F3A]"
            >
              <Building2 className="h-4 w-4" />
              Dashboard
            </Link>
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C8A45D] to-[#A38245] px-6 py-3 text-sm font-semibold text-[#151210] transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(200,164,93,0.25)] hover:shadow-[0_6px_24px_rgba(200,164,93,0.4)]"
            >
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AEA3]" size={20} />
            <input 
              type="text" 
              placeholder="Search rules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#221C18] border border-[#6B4F3A]/50 rounded-xl pl-11 pr-4 py-3.5 text-[#F5F1EA] focus:outline-none focus:border-[#C8A45D] focus:ring-1 focus:ring-[#C8A45D] transition-colors"
            />
          </div>
          <div className="relative md:w-72">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8AEA3]" size={20} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#221C18] border border-[#6B4F3A]/50 rounded-xl pl-11 pr-4 py-3.5 text-[#F5F1EA] focus:outline-none focus:border-[#C8A45D] focus:ring-1 focus:ring-[#C8A45D] transition-colors appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Rules List */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C8A45D]"></div>
          </div>
        ) : sortedRules.length === 0 ? (
          <div className="bg-[#221C18] rounded-2xl p-16 text-center border border-[#6B4F3A]/30">
            <AlertCircle className="mx-auto text-[#B8AEA3] mb-4 h-16 w-16" />
            <h3 className="text-2xl font-semibold text-[#F5F1EA] mb-2">No Rules Found</h3>
            <p className="text-[#B8AEA3]">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedRules.map((rule) => (
              <div 
                key={rule._id} 
                className={`bg-[#221C18] rounded-2xl p-7 border flex flex-col h-full hover:-translate-y-1 transition-transform duration-300 ${
                  rule.isPinned ? 'border-[#C8A45D]/60 shadow-[0_4px_24px_rgba(200,164,93,0.15)]' : 'border-[#6B4F3A]/40'
                }`}
              >
                <div className="flex justify-between items-start mb-5 gap-4">
                  <span className="inline-block px-3 py-1 bg-[#6B4F3A]/30 text-[#C8A45D] text-xs font-bold uppercase tracking-wider rounded-lg border border-[#6B4F3A]">
                    {rule.category}
                  </span>
                  <div className="flex gap-2">
                    {isRecentlyAdded(rule.createdAt) && (
                      <span className="inline-block px-3 py-1 bg-green-900/40 text-green-400 text-xs font-bold uppercase tracking-wider rounded-lg border border-green-800/50">
                        New
                      </span>
                    )}
                    {rule.isPinned && <Pin size={22} className="text-[#C8A45D]" fill="currentColor" />}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#F5F1EA] mb-3 leading-tight">{rule.title}</h3>
                <p className="text-[#B8AEA3] flex-grow mb-6 leading-relaxed text-sm">{rule.description}</p>
                
                <div className="mt-auto pt-4 border-t border-[#6B4F3A]/30 flex flex-col gap-2 text-xs text-[#B8AEA3]">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#C8A45D]" />
                    <span>Effective: {new Date(rule.effectiveDate || rule.createdAt).toLocaleDateString()}</span>
                  </div>
                  {rule.expiryDate && (
                    <div className="flex items-center gap-2">
                      <AlertCircle size={14} className="text-red-400" />
                      <span className="text-red-400/80">Expires: {new Date(rule.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RuleBook;
