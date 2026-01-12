
import React from 'react';
import { Notification, NotificationType, UserRole } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  markAllAsRead: () => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, markAllAsRead }) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.UPCOMING_CLASS: return '📅';
      case NotificationType.ATTENDANCE_UPDATE: return '✅';
      case NotificationType.SYSTEM_MESSAGE: return '⚙️';
      case NotificationType.ANNOUNCEMENT: return '📢';
      default: return '🔔';
    }
  };

  const getBadge = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ANNOUNCEMENT: 
        return <span className="text-[7px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase tracking-widest ml-2">Yönetim</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Duyurular</h2>
          <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest mt-1">Gelen Kutusu</p>
        </div>
        <button 
          onClick={markAllAsRead}
          className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-2 rounded-xl active:scale-95 transition-transform"
        >
          Tümünü Okundu İşaretle
        </button>
      </header>

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
                {!n.isRead && (
                  <div className="pt-2 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                    <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">YENİ MESAJ</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
