
import React, { useState, useMemo } from 'react';
import { SYSTEM_BADGES } from '../constants';
import { Badge, User } from '../types';

interface OtherProps {
  currentUser: User;
}

export const Other: React.FC<OtherProps> = ({ currentUser }) => {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  
  const profileCompletion = useMemo(() => {
    const fields = [
      { key: 'name', label: 'Ad Soyad', check: (val: string) => val && val.trim().split(' ').length >= 2 },
      { key: 'email', label: 'E-Posta', check: (val: string) => !!val },
      { key: 'phoneNumber', label: 'Telefon', check: (val: string) => val && val.length > 5 },
      { key: 'avatar', label: 'Foto', check: (val: string) => !!val },
      { key: 'birthDate', label: 'Doğum', check: (val: string) => !!val },
      { key: 'gender', label: 'Cinsiyet', check: (val: string) => val && val !== 'Belirtilmedi' },
      { key: 'address', label: 'Adres', check: (val: string) => !!val },
      { key: 'bio', label: 'Bio', check: (val: string) => !!val }
    ];
    const completed = fields.filter(f => f.check((currentUser as any)[f.key]));
    return { percentage: Math.round((completed.length / fields.length) * 100), completedCount: completed.length, totalCount: fields.length, fields };
  }, [currentUser]);

  const earnedBadges = SYSTEM_BADGES.filter(b => (currentUser?.badges || []).includes(b.id));
  const unearnedBadges = SYSTEM_BADGES.filter(b => !(currentUser?.badges || []).includes(b.id));

  const BadgeItem: React.FC<{ badge: Badge, isEarned: boolean, compact?: boolean }> = ({ badge, isEarned, compact }) => (
    <div className={`bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-3 rounded-[1.5rem] border border-white/20 dark:border-slate-800 flex items-center gap-3 shadow-sm ${!isEarned ? 'opacity-30 grayscale' : 'opacity-100'}`}>
      <div className={`w-9 h-9 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center text-sm shrink-0 border border-white/20`}>{badge.icon}</div>
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-[9px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-none mb-1">{badge.name}</h4>
        <p className={`text-[7px] font-bold text-slate-400 leading-tight uppercase ${compact ? 'truncate' : ''}`}>{badge.description}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full page-transition px-4 space-y-3 pt-3 pb-24 overflow-hidden transition-all text-left h-full">
      {/* --- COMPACT PROFILE COMPLETION --- */}
      <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800 p-4 rounded-[2rem] shadow-sm flex items-center gap-4">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800" />
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${profileCompletion.percentage * 2.76} 276`} className="text-indigo-600 transition-all duration-1000" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-black text-slate-800 dark:text-slate-100">%{profileCompletion.percentage}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PROFİL GÜCÜ</h3>
          <div className="flex flex-wrap gap-1">
            {profileCompletion.fields.map(f => (
              <div key={f.key} className={`w-1.5 h-1.5 rounded-full ${f.check((currentUser as any)[f.key]) ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* --- COMPACT SUCCESS METRICS --- */}
      <section className="grid grid-cols-2 gap-2">
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-[1.8rem] border border-white/20 dark:border-slate-800 flex flex-col justify-center">
          <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1">BU AY</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-800 dark:text-slate-100">14</span>
            <span className="text-[7px] font-black text-indigo-500 uppercase">DERS</span>
          </div>
        </div>
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-4 rounded-[1.8rem] border border-white/20 dark:border-slate-800 flex flex-col items-center justify-center">
          <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1">BAŞARI</span>
          <div className="text-xl font-black text-emerald-500">%92</div>
        </div>
      </section>

      {/* --- ROZETLER (Compact Preview) --- */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ROZETLER</h3>
           <button onClick={() => setIsBadgeModalOpen(true)} className="text-[7px] font-black text-indigo-600 uppercase tracking-widest">TÜMÜNÜ GÖR</button>
        </div>
        <div className="space-y-1.5">
          {earnedBadges.slice(0, 3).map((badge) => <BadgeItem key={badge.id} badge={badge} isEarned={true} compact={true} />)}
          {earnedBadges.length === 0 && (
             <div className="text-center py-4 opacity-30 font-black text-[7px] uppercase tracking-widest">Henüz rozet kazanılmadı</div>
          )}
        </div>
      </div>

      {/* --- ROZETLER MODAL --- */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-slate-50 dark:bg-slate-950 flex flex-col animate-in slide-in-from-bottom-6 duration-500">
          <header className="px-6 py-5 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
            <div className="text-left">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter">ROZET KOLEKSİYONU</h2>
              <p className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1">BAŞARI VE HEDEFLER</p>
            </div>
            <button onClick={() => setIsBadgeModalOpen(false)} className="w-9 h-9 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
            {/* KAZANILANLAR */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1 h-3 bg-emerald-500 rounded-full"></span>
                <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">KAZANILANLAR ({earnedBadges.length})</h3>
              </div>
              <div className="space-y-2">
                {earnedBadges.map(badge => <BadgeItem key={badge.id} badge={badge} isEarned={true} />)}
                {earnedBadges.length === 0 && <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest text-center py-4">Henüz rozetin yok, hemen başla!</p>}
              </div>
            </section>

            {/* KAZANILABİLECEKLER */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="w-1 h-3 bg-slate-300 rounded-full"></span>
                <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">KAZANILABİLECEKLER ({unearnedBadges.length})</h3>
              </div>
              <div className="space-y-2">
                {unearnedBadges.map(badge => <BadgeItem key={badge.id} badge={badge} isEarned={false} />)}
              </div>
            </section>
          </div>

          <div className="p-4 pb-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-900">
             <button onClick={() => setIsBadgeModalOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">KOLEKSİYONA DÖN</button>
          </div>
        </div>
      )}
    </div>
  );
};
