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
      <div className="bg-[#221C18] rounded-2xl border border-[#6B4F3A]/30 p-6 h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C8A45D]"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#221C18] rounded-2xl border border-[#6B4F3A]/30 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#F5F1EA] flex items-center gap-2">
          <BookOpen className="text-[#C8A45D]" size={24} />
          Recent Rule Updates
        </h3>
        <Link 
          to="/rulebook" 
          className="text-sm font-semibold text-[#C8A45D] hover:text-[#F5F1EA] transition-colors flex items-center"
        >
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="flex-grow flex flex-col gap-3">
        {recentUpdates.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <p className="text-[#B8AEA3]">No recent rule updates.</p>
          </div>
        ) : (
          recentUpdates.map(update => (
            <Link 
              key={update._id} 
              to="/rulebook"
              className="bg-[#151210] border border-[#6B4F3A]/20 hover:border-[#C8A45D]/50 rounded-xl p-4 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h4 className="text-[#F5F1EA] font-semibold text-sm mb-1 truncate group-hover:text-[#C8A45D] transition-colors">
                    {update.title}
                  </h4>
                  <p className="text-[#B8AEA3] text-xs truncate">
                    {update.message}
                  </p>
                </div>
                <span className="text-[10px] text-[#6B4F3A] uppercase font-bold whitespace-nowrap mt-1">
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
