import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle, Info, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API_BASE_URL from '../config';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  // Assume user ID is available or we just use a generic 'read' status if readBy includes the user.
  // For this mock, we will just consider them unread if the user ID is not in readBy.
  // We'll simulate getting userId from token or localStorage. Let's assume a generic unread state for now.
  const userId = JSON.parse(localStorage.getItem('user'))?._id || 'mockId'; // Replace with actual user ID logic

  return (
    <div className="min-h-screen bg-[#151210] font-sans text-[#F5F1EA]">
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 pb-14 pt-28 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-end mb-8 border-b border-[#6B4F3A]/30 pb-6">
          <div>
            <h1 className="text-4xl font-bold text-[#C8A45D] mb-2 flex items-center gap-3">
              <Bell className="text-[#C8A45D]" size={36} />
              Notifications
            </h1>
            <p className="text-[#B8AEA3] text-lg">Stay updated with society rules and announcements.</p>
          </div>
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 text-[#C8A45D] hover:text-[#F5F1EA] transition-colors font-medium"
          >
            <CheckCircle size={18} />
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8A45D]"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-[#221C18] rounded-2xl p-16 text-center border border-[#6B4F3A]/30">
            <Bell className="mx-auto text-[#6B4F3A] mb-4 h-16 w-16" />
            <h3 className="text-2xl font-semibold text-[#F5F1EA] mb-2">You're all caught up!</h3>
            <p className="text-[#B8AEA3]">No new notifications to display.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => {
              const isRead = notif.readBy && notif.readBy.includes(userId);
              return (
                <div 
                  key={notif._id} 
                  className={`p-6 rounded-2xl border transition-all duration-300 flex justify-between items-start gap-4 ${
                    isRead 
                    ? 'bg-[#221C18]/50 border-[#6B4F3A]/20 opacity-70' 
                    : 'bg-[#221C18] border-[#C8A45D]/40 shadow-[0_4px_20px_rgba(200,164,93,0.1)]'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-xl mt-1 ${isRead ? 'bg-[#6B4F3A]/20 text-[#B8AEA3]' : 'bg-[#6B4F3A]/40 text-[#C8A45D]'}`}>
                      <Info size={24} />
                    </div>
                    <div>
                      <h4 className={`text-lg font-semibold mb-1 ${isRead ? 'text-[#B8AEA3]' : 'text-[#F5F1EA]'}`}>
                        {notif.title}
                      </h4>
                      <p className={`mb-2 leading-relaxed ${isRead ? 'text-[#B8AEA3]/70' : 'text-[#B8AEA3]'}`}>
                        {notif.message}
                      </p>
                      <span className="text-xs text-[#6B4F3A] font-medium tracking-wide uppercase">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {!isRead && (
                    <button 
                      onClick={() => markAsRead(notif._id)}
                      className="text-[#C8A45D] hover:text-[#F5F1EA] p-2 bg-[#6B4F3A]/20 rounded-lg transition-colors flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check size={20} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
