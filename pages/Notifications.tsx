
import React, { useState } from 'react';
import { Notification, NotificationType, UserRole, User } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  currentUser: User;
  addNotification: (notif: Notification) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, markAllAsRead, markAsRead, currentUser }) => {
  const [viewMode, setViewMode] = useState<'inbox' | 'create' | 'manage'>('inbox');
  const [selectedNotifId, setSelectedNotifId] = useState<string | null>(null);
  const canManage = [UserRole.TEACHER, UserRole.SCHOOL_ADMIN, UserRole.SYSTEM_ADMIN].includes(currentUser.role);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.UPCOMING_CLASS: return '📅';
      case NotificationType.PAYMENT_REMINDER: return '💳';
      default: return '📢';
    }
  };

  return (
    <div className="w-full page-transition px-4 space-y-3 pt-3 pb-24 overflow-hidden transition-all text-left h-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[7px] font-black uppercase tracking-widest text-slate-400">{notifications.length} DUYURU</span>
          {viewMode === 'inbox' && notifications.length > 0 && (
            <button onClick={markAllAsRead} className="text-[6px] font-black uppercase text-indigo-600">HEPSİNİ OKU</button>
          )}
        </div>
        {canManage && (
          <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {['inbox', 'create', 'manage'].map(mode => (
              <button key={mode} onClick={() => setViewMode(mode as any)} className={`flex-1 py-2 rounded-lg text-[7px] font-black uppercase transition-all ${viewMode === mode ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'text-slate-400'}`}>
                {mode === 'inbox' ? 'Gelen' : mode === 'create' ? 'Yeni' : 'Yönet'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-1.5 overflow-y-auto no-scrollbar">
        {notifications.length === 0 ? (
          <div className="text-center py-10 opacity-20 font-black text-[7px] uppercase tracking-widest">DUYURU YOK</div>
        ) : (
          notifications.map(n => (
            <button key={n.id} onClick={() => { markAsRead(n.id); setSelectedNotifId(n.id); }} className={`w-full text-left p-3 rounded-2xl border transition-all flex gap-3 active:scale-[0.98] ${n.isRead ? 'bg-white/50 dark:bg-slate-900/30 opacity-60' : 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900 shadow-sm'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${n.isRead ? 'bg-slate-50 dark:bg-slate-800 text-slate-400' : 'bg-indigo-600 text-white'}`}>{getIcon(n.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-black text-slate-800 dark:text-slate-100 text-[10px] truncate leading-none uppercase tracking-tight">{n.title}</h4>
                  <span className="text-[5px] font-bold text-slate-300 uppercase shrink-0">Yeni</span>
                </div>
                <p className="text-[8px] font-medium text-slate-500 dark:text-slate-400 leading-tight line-clamp-1">{n.message}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
