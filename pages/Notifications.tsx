
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
    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500 px-4 pt-4 transition-colors">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">
          {notifications.length} DUYURU
        </span>
        <button 
          onClick={markAllAsRead}
          className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 rounded-xl active:scale-95 transition-transform"
        >
          Tümünü Oku
        </button>
      </div>

      <div className="space-y-3 pb-10">
        {notifications.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 border-dashed">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-4">
              <span className="text-2xl opacity-40">📭</span>
            </div>
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-300 dark:text-slate-700">Henüz bildiriminiz yok.</p>
          </div>
        ) : (
          notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(n => (
            <div 
              key={n.id} 
              className={`group p-5 rounded-[2.25rem] border transition-all duration-300 flex gap-4 ${
                n.isRead 
                  ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' 
                  : 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/50 shadow-xl shadow-indigo-50 dark:shadow-none ring-1 ring-indigo-50 dark:ring-indigo-900/20'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm shrink-0 border transition-colors ${
                n.isRead ? 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-600' : 'bg-indigo-600 border-indigo-600 text-white'
              }`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {n.title}
                    </h4>
                    {getBadge(n.type)}
                  </div>
                  <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-tighter">
                    {new Date(n.timestamp).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className={`text-[11px] leading-relaxed ${n.isRead ? 'text-slate-500 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400 font-medium'}`}>
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