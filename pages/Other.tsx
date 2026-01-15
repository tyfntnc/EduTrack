
import React, { useState } from 'react';
import { MOCK_USERS, SYSTEM_BADGES } from '../constants';
// Import Badge type for proper typing
import { Badge } from '../types';

export const Other: React.FC = () => {
  const [showAllBadges, setShowAllBadges] = useState(false);
  const currentUser = MOCK_USERS.find(u => u.id === 'u2') || MOCK_USERS[0];
  const userBadgeIds = currentUser?.badges || [];
  
  const earnedBadges = SYSTEM_BADGES.filter(b => userBadgeIds.includes(b.id));
  const unearnedBadges = SYSTEM_BADGES.filter(b => !userBadgeIds.includes(b.id));

  const attendanceCountThisMonth = 14;
  const attendancePercentage = 92;

  // Use React.FC to include standard props like key in the component's type definition
  const BadgeItem: React.FC<{ badge: Badge, isEarned: boolean }> = ({ badge, isEarned }) => (
    <div className={`bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3 shadow-sm transition-all ${!isEarned ? 'opacity-50 grayscale' : 'opacity-100'}`}>
      <div className={`w-8 h-8 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center text-lg shadow-md shrink-0`}>
        {badge.icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[9px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-none mb-1">{badge.name}</h4>
        <p className="text-[7px] font-medium text-slate-400 leading-tight truncate">{badge.description}</p>
      </div>
      {!isEarned && (
        <div className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md">
          <span className="text-[6px] font-black text-slate-400 uppercase">Kilitli</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2 animate-in fade-in duration-700 pb-28 px-4 pt-1 transition-all overflow-hidden">
      
      {/* 1. GÜNÜN SÖZÜ (COMPACT) */}
      <section className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border border-indigo-100/50 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
        <p className="text-[9.5px] font-bold text-slate-800 dark:text-slate-200 leading-tight italic tracking-tight">
          "Başarı, her gün tekrarlanan küçük çabaların toplamıdır."
        </p>
        <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest mt-0.5 block">— M. Luther King Jr.</span>
      </section>

      {/* 2. SUCCESS METRICS */}
      <section className="grid grid-cols-2 gap-2">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1">AYLIK KATILIM</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">{attendanceCountThisMonth}</span>
            <span className="text-[7px] font-bold text-slate-400 uppercase">DERS</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
          <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1">BAŞARI ORANI</span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">%{attendancePercentage}</span>
        </div>
      </section>

      {/* 3. ROZETLER (MIN 3 GÖSTERİM) */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest">BAŞARI ROZETLERİ</h3>
           <button 
             onClick={() => setShowAllBadges(true)}
             className="text-[6.5px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg uppercase"
           >
             Tümünü Gör
           </button>
        </div>
        <div className="space-y-1.5">
          {earnedBadges.slice(0, 3).map((badge) => (
            <BadgeItem key={badge.id} badge={badge} isEarned={true} />
          ))}
          {earnedBadges.length < 3 && unearnedBadges.slice(0, 3 - earnedBadges.length).map((badge) => (
            <BadgeItem key={badge.id} badge={badge} isEarned={false} />
          ))}
        </div>
      </div>

      {/* 4. AI ANALİZ (SCROLSUZ TASARIM İÇİN SIKIŞTIRILDI) */}
      <section className="bg-slate-900 dark:bg-indigo-600 rounded-2xl p-3 text-white shadow-lg space-y-2">
        <h3 className="text-[7px] font-black uppercase tracking-widest text-indigo-300 dark:text-indigo-100">GELİŞİM ANALİZİ</h3>
        <div className="space-y-1.5">
          {[{ label: 'TEKNİK', val: 88, c: 'bg-fuchsia-400' }, { label: 'DİSİPLİN', val: 96, c: 'bg-amber-400' }].map(s => (
            <div key={s.label} className="space-y-0.5">
              <div className="flex justify-between text-[6px] font-black uppercase"><span className="opacity-70">{s.label}</span><span>%{s.val}</span></div>
              <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${s.c}`} style={{ width: `${s.val}%` }}></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* TÜM ROZETLER MODAL (CENTERED) */}
      {showAllBadges && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowAllBadges(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[320px] max-h-[70vh] rounded-[2.5rem] p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-300">
            <header className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">TÜM BAŞARIMLAR</h3>
              <button onClick={() => setShowAllBadges(false)} className="w-6 h-6 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
              <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest mb-1">KAZANDIKLARIN ({earnedBadges.length})</p>
              {earnedBadges.map(b => <BadgeItem key={b.id} badge={b} isEarned={true} />)}
              
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-4 mb-1">YOLDAKİLER ({unearnedBadges.length})</p>
              {unearnedBadges.map(b => <BadgeItem key={b.id} badge={b} isEarned={false} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
