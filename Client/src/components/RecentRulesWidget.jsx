import React, { useState, useEffect } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const RecentRulesWidget = () => {
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentUpdates();
  }, []);

  const fetchRecentUpdates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (response.ok) {
        const data = await response.json();
        // Show only the latest 5 rules related notifications
        const ruleUpdates = data.filter(n => n.type && n.type.startsWith('Rule')).slice(0, 5);
        setRecentUpdates(ruleUpdates);
      }
    } catch (error) {
      console.error('Failed to fetch recent rules', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1A1614] rounded-[24px] border border-slate-200 dark:border-[#221C18] p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A45D]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1A1614] rounded-[24px] border border-slate-200 dark:border-[#221C18] p-6 h-full flex flex-col shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-[#dae2fd] flex items-center gap-2">
          <BookOpen className="text-[#C8A45D]" size={24} />
          Recent Rule Updates
        </h3>
        <Link 
          to="/rulebook" 
          className="text-[10px] font-bold uppercase tracking-widest text-[#C8A45D] hover:text-[#E0C27A] transition flex items-center"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex-grow flex flex-col gap-3">
        {recentUpdates.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <p className="text-slate-500 dark:text-[#B8AEA3]">No recent rule updates.</p>
          </div>
        ) : (
          recentUpdates.map(update => (
            <Link 
              key={update._id} 
              to="/rulebook"
              className="bg-slate-50 dark:bg-[#151210] border border-slate-200 dark:border-[#221C18] hover:border-[#C8A45D]/50 rounded-xl p-4 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h4 className="text-slate-900 dark:text-[#dae2fd] font-semibold text-sm mb-1 truncate group-hover:text-[#C8A45D] transition-colors">
                    {update.title}
                  </h4>
                  <p className="text-slate-500 dark:text-[#B8AEA3] text-xs truncate">
                    {update.message}
                  </p>
                </div>
                <span className="text-[10px] text-[#8B6B4A] uppercase font-bold whitespace-nowrap mt-1">
                  {new Date(update.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentRulesWidget;
