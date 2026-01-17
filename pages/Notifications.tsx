
import React, { useState } from 'react';
import { Notification, NotificationType, UserRole, User } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  currentUser: User;
  addNotification: (notif: Notification) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ 
  notifications, 
  markAllAsRead, 
  markAsRead, 
  currentUser 
}) => {
  const [viewMode, setViewMode] = useState<'inbox' | 'create' | 'manage'>('inbox');
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const canManage = [UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.SYSTEM_ADMIN].includes(currentUser.role);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.UPCOMING_CLASS: return '📅';
      case NotificationType.PAYMENT_REMINDER: return '💳';
      case NotificationType.ATTENDANCE_UPDATE: return '✅';
      case NotificationType.ANNOUNCEMENT: return '📢';
      default: return '🔔';
    }
  };

  const handleOpenDetail = (n: Notification) => {
    setSelectedNotif(n);
    if (!n.isRead) {
      markAsRead(n.id);
    }
  };

  return (
    <div className="w-full page-transition px-4 space-y-3 pt-3 pb-24 overflow-hidden transition-all text-left h-full flex flex-col">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex flex-col">
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-slate-400">BİLDİRİM MERKEZİ</span>
            <span className="text-[9px] font-black uppercase text-indigo-600 dark:text-indigo-400 mt-0.5">
              {notifications.filter(n => !n.isRead).length} OKUNMAMIŞ MESAJ
            </span>
          </div>
          {viewMode === 'inbox' && notifications.some(n => !n.isRead) && (
            <button 
              onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} 
              className="text-[7px] font-black uppercase tracking-widest text-white bg-indigo-600 px-3 py-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none active:scale-90 transition-all"
            >
              HEPSİNİ OKU
            </button>
          )}
        </div>
        
        {canManage && (
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
            {['inbox', 'create', 'manage'].map(mode => (
              <button 
                key={mode} 
                onClick={() => setViewMode(mode as any)} 
                className={`flex-1 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}
              >
                {mode === 'inbox' ? 'Gelen' : mode === 'create' ? 'Yeni' : 'Yönet'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar pt-1">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 opacity-20">
             <div className="text-5xl mb-4">📭</div>
             <p className="font-black text-[10px] uppercase tracking-[0.3em]">HENÜZ DUYURU YOK</p>
          </div>
        ) : (
          notifications.map(n => (
            <button 
              key={n.id} 
              onClick={() => handleOpenDetail(n)} 
              className={`w-full text-left p-4 rounded-[2rem] border transition-all flex gap-4 active:scale-[0.98] ${
                n.isRead 
                  ? 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-100 dark:border-slate-900/50 opacity-60' 
                  : 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-md ring-1 ring-indigo-500/5'
              }`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition-all ${
                n.isRead 
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-300' 
                  : 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none'
              }`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-black text-[11px] truncate leading-none uppercase tracking-tight ${n.isRead ? 'text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                    {n.title}
                  </h4>
                  {!n.isRead && (
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse shadow-sm shadow-indigo-500/50"></div>
                  )}
                </div>
                <p className={`text-[9px] font-medium leading-tight line-clamp-1 mt-0.5 ${n.isRead ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {n.message}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* DUYURU DETAY MODALI (TAM EKRAN ORTALANMIŞ) */}
      {selectedNotif && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedNotif(null)} />
          <div className="relative w-full max-w-[340px] bg-white dark:bg-slate-900 rounded-[3rem] p-8 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-500 flex flex-col overflow-hidden max-h-[80vh]">
            
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-indigo-600 rounded-[1.8rem] flex items-center justify-center text-3xl text-white shadow-2xl shadow-indigo-200 dark:shadow-none mb-6 animate-bounce">
                {getIcon(selectedNotif.type)}
              </div>
              <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-2">{selectedNotif.type}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight uppercase tracking-tight">{selectedNotif.title}</h3>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar mb-8">
              <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800">
                <p className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic text-center">
                  "{selectedNotif.message}"
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-6 px-2">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">GÖNDEREN</span>
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase mt-1">{selectedNotif.senderRole || "Sistem"}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-[7px] font-black text-slate-300 uppercase tracking-widest">TARİH</span>
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase mt-1">
                    {new Date(selectedNotif.timestamp).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedNotif(null)} 
                className="w-full py-4.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                KAPAT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
