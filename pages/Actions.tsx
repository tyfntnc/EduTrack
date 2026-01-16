
import React from 'react';
import { User, UserRole } from '../types';

interface ActionsProps {
  currentUser: User;
  onActionClick: (actionId: string) => void;
}

export const Actions: React.FC<ActionsProps> = ({ currentUser, onActionClick }) => {
  const isAdmin = currentUser.role === UserRole.SYSTEM_ADMIN || currentUser.role === UserRole.SCHOOL_ADMIN;

  const quickActions = [
    { id: 'qr', label: 'QR Kod', icon: '📱', color: 'bg-indigo-500/10 text-indigo-500' },
    { id: 'add_family', label: 'Aile Ekle', icon: '➕👨‍👩‍👦', color: 'bg-rose-500/10 text-rose-500' },
    { id: 'delete_family', label: 'Aile Sil', icon: '➖👨‍👩‍👦', color: 'bg-slate-500/10 text-slate-500' },
    { id: 'my_payments', label: 'Ödemelerim', icon: '🧾', color: 'bg-emerald-500/10 text-emerald-500' },
    { id: 'pay_dues', label: 'Aidat Öde', icon: '💰', color: 'bg-amber-500/10 text-amber-500' },
    { id: 'create_individual', label: 'Bireysel', icon: '🎯', color: 'bg-cyan-500/10 text-cyan-500' },
    { id: 'new_goal', label: 'Yeni Hedef', icon: '🚀', color: 'bg-blue-500/10 text-blue-500' },
    { id: 'create_announcement', label: 'Duyuru', icon: '📢', color: 'bg-purple-500/10 text-purple-500' },
  ];

  return (
    <div className="w-full page-transition px-4 space-y-4 pt-3 pb-24 overflow-hidden transition-all text-left h-full">
      
      {/* --- GRID ACTIONS --- */}
      <section className="space-y-2">
        <h2 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">HIZLI İŞLEMLER</h2>
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map(action => (
            <button 
              key={action.id} 
              onClick={() => onActionClick(action.id)}
              className="p-3 rounded-[1.5rem] bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800 shadow-sm flex flex-col items-center gap-2 active:scale-95 transition-all text-center group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <span className="text-[7px] font-black uppercase tracking-tighter text-slate-800 dark:text-slate-100 leading-none">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* --- COMPACT ADMIN ACTION --- */}
      {isAdmin && (
        <section className="space-y-2">
          <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">SİSTEM YÖNETİMİ</h3>
          <button 
            onClick={() => onActionClick('admin_panel')}
            className="w-full p-3.5 rounded-[1.5rem] bg-indigo-600 dark:bg-indigo-600/20 text-white dark:text-indigo-400 backdrop-blur-md flex items-center gap-3 active:scale-[0.98] transition-all shadow-md"
          >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg">🛠️</div>
            <div className="text-left flex-1 min-w-0">
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">Yönetici Paneli</span>
              <p className="text-[7px] font-bold opacity-70 uppercase tracking-tighter mt-1">Sistem yetkili ayarları</p>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </section>
      )}

      {/* --- COMPACT FOOTER SUPPORT --- */}
      <section className="mt-auto pt-2">
        <div className="bg-white/50 dark:bg-slate-900/30 backdrop-blur-md p-4 rounded-[2rem] border border-white/20 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div className="space-y-0.5">
             <p className="text-[6px] font-black text-indigo-500 uppercase tracking-[0.3em]">HIZLI DESTEK</p>
             <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">Sorun mu var?</h4>
          </div>
          <div className="flex gap-2">
             <a href="https://wa.me/905550000000" target="_blank" rel="noreferrer" className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-500 transition-all active:scale-90">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.6h.1a8.38 8.38 0 0 1 8.4 7.8Z"/><path d="m11 11 3 3"/><path d="m14 11-3 3"/></svg>
             </a>
             <a href="mailto:destek@edutrack.com" className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 transition-all active:scale-90">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
             </a>
          </div>
        </div>
        <p className="text-[6px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest text-center mt-3">EduTrack Mobile Support v2.5</p>
      </section>
    </div>
  );
};
