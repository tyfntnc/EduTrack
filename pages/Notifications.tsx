
import React from 'react';
import { Notification, NotificationType, UserRole } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  markAllAsRead: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, markAllAsRead }) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'Ders Hatırlatıcısı' as NotificationType: return '📅';
      case 'Yoklama Güncellemesi' as NotificationType: return '✅';
      case 'Sistem Mesajı' as NotificationType: return '⚙️';
      case 'Okul Duyurusu' as NotificationType: return '📢';
      default: return '🔔';
    }
  };

  const getBadge = (type: NotificationType) => {
    if (type === 'Okul Duyurusu' as NotificationType) {
      return <span className="text-[7px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase tracking-widest ml-2">Yönetim</span>;
    }
    return null;
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 px-4 pt-4">
      {/* Top Action Row */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {notifications.length} DUYURU
        </span>
        <button 
          onClick={markAllAsRead}
          className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl active:scale-95 transition-transform"
        >
          Tümünü Oku
        </button>
      </div>

      <div className="space-y-3 pb-10">
        {notifications.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed">
            <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-4">
              <span className="text-2xl opacity-40">📭</span>
            </div>
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-300">Henüz bildiriminiz yok.</p>
          </div>
        ) : (
          notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(n => (
            <div 
              key={n.id} 
              className={`group p-5 rounded-[2.25rem] border transition-all duration-300 flex gap-4 ${
                n.isRead 
                  ? 'bg-white border-slate-100' 
                  : 'bg-white border-indigo-200 shadow-xl shadow-indigo-50 ring-1 ring-indigo-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0 border transition-colors ${
                n.isRead ? 'bg-slate-50 border-slate-100 text-slate-400' : 'bg-indigo-600 border-indigo-600 text-white'
              }`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight tracking-tight group-hover:text-indigo-600 transition-colors">
                      {n.title}
                    </h4>
                    {getBadge(n.type)}
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                    {new Date(n.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${n.isRead ? 'text-slate-500' : 'text-slate-600 font-medium'}`}>
                  {n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
