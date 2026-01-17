
import React, { useState, useMemo } from 'react';
import { SYSTEM_BADGES } from '../constants';
import { Badge, User } from '../types';

interface OtherProps {
  currentUser: User;
}

export const Other: React.FC<OtherProps> = ({ currentUser }) => {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  
  // Profil Tamamlama Hesaplama Mantığı
  const profileCompletion = useMemo(() => {
    if (!currentUser) return { percentage: 0, completedCount: 0, totalCount: 0, fields: [] };
    
    const fields = [
      { key: 'name', label: 'Ad Soyad', check: (val: any) => val && val.trim().split(' ').length >= 2 },
      { key: 'email', label: 'E-Posta', check: (val: any) => !!val },
      { key: 'phoneNumber', label: 'Telefon', check: (val: any) => val && val.length > 5 },
      { key: 'avatar', label: 'Fotoğraf', check: (val: any) => !!val },
      { key: 'birthDate', label: 'Doğum Tarihi', check: (val: any) => !!val },
      { key: 'gender', label: 'Cinsiyet', check: (val: any) => val && val !== 'Belirtilmedi' },
      { key: 'address', label: 'Adres', check: (val: any) => !!val },
      { key: 'bio', label: 'Hakkında', check: (val: any) => !!val }
    ];
    
    const completed = fields.filter(f => f.check((currentUser as any)[f.key]));
    return { 
      percentage: Math.round((completed.length / fields.length) * 100), 
      completedCount: completed.length, 
      totalCount: fields.length, 
      fields 
    };
  }, [currentUser]);

  // Rozet Filtreleme
  const earnedBadges = useMemo(() => 
    SYSTEM_BADGES.filter(b => (currentUser?.badges || []).includes(b.id)),
    [currentUser]
  );
  
  const unearnedBadges = useMemo(() => 
    SYSTEM_BADGES.filter(b => !(currentUser?.badges || []).includes(b.id)),
    [currentUser]
  );

  const BadgeItem: React.FC<{ badge: Badge, isEarned: boolean, compact?: boolean }> = ({ badge, isEarned, compact }) => (
    <div className={`bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-[2.5rem] border border-white/20 dark:border-slate-800 flex items-center gap-5 shadow-sm transition-all ${!isEarned ? 'opacity-30 grayscale saturate-0' : 'opacity-100'}`}>
      <div className={`w-14 h-14 bg-gradient-to-br ${badge.color} rounded-[1.5rem] flex items-center justify-center text-2xl shrink-0 border border-white/20 shadow-lg`}>
        {badge.icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h4 className="text-[12px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-none mb-2">
          {badge.name}
        </h4>
        <p className={`text-[9px] font-bold text-slate-500 dark:text-slate-400 leading-tight uppercase tracking-tighter ${compact ? 'line-clamp-1' : 'line-clamp-2'}`}>
          {badge.description}
        </p>
      </div>
      {isEarned && !compact && (
        <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-[12px] text-white shadow-lg shadow-emerald-500/20 shrink-0">
          ✓
        </div>
      )}
    </div>
  );

  if (!currentUser) return null;

  return (
    <div className="w-full page-transition px-4 space-y-4 pt-3 pb-24 overflow-hidden transition-all text-left h-full">
      
      {/* --- PROFİL GÜCÜ --- */}
      <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800 p-6 rounded-[2.8rem] shadow-sm flex items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800" />
            <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${profileCompletion.percentage * 2.76} 276`} className="text-indigo-600 transition-all duration-1000" strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">%{profileCompletion.percentage}</span>
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Güç</span>
          </div>
        </div>
        <div className="flex-1 space-y-3">
          <div className="space-y-1">
             <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">PROFİL ANALİZİ</h3>
             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter opacity-80 leading-tight">Bilgilerini tamamlayarak rozet kazanma şansını artır.</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {profileCompletion.fields.map(f => (
              <div key={f.key} className={`w-2.5 h-2.5 rounded-full shadow-sm ${f.check((currentUser as any)[f.key]) ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
            ))}
          </div>
        </div>
      </section>

      {/* --- METRİKLER --- */}
      <div className="grid grid-cols-2 gap-4 px-1">
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 dark:border-slate-800 flex flex-col justify-center gap-2 shadow-sm">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">AYLIK AKTİVİTE</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-800 dark:text-slate-100">14</span>
            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Ders</span>
          </div>
          <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
        </div>
        <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 dark:border-slate-800 flex flex-col justify-center gap-2 shadow-sm">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">VERİMLİLİK</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-500">%92</span>
          </div>
          <div className="w-8 h-1 bg-emerald-500 rounded-full"></div>
        </div>
      </div>

      {/* --- ROZET ÖNİZLEME --- */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ROZET KOLEKSİYONU</h3>
           <button onClick={() => setIsBadgeModalOpen(true)} className="text-[7px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl active:scale-95 transition-all">TÜMÜNÜ GÖR</button>
        </div>
        
        <div className="space-y-2">
          {earnedBadges.slice(0, 3).map((badge) => (
            <BadgeItem key={badge.id} badge={badge} isEarned={true} compact={true} />
          ))}
          {earnedBadges.length === 0 && (
             <div className="bg-slate-50 dark:bg-slate-900/20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-10 text-center">
                <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">Henüz rozet kazanılmadı</p>
             </div>
          )}
        </div>
      </section>

      {/* --- TÜM ROZETLER MODAL (FIXED) --- */}
      {isBadgeModalOpen && (
        <div className="fixed inset-0 z-[1000] bg-white dark:bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-400 overflow-hidden">
          <header className="px-6 py-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-950 z-30 shadow-sm">
            <div className="text-left min-w-0">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter leading-none">ROZETLERİM</h2>
              <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1.5">BAŞARI VE GELİŞİM TAKİBİ</p>
            </div>
            <button 
              onClick={() => setIsBadgeModalOpen(false)} 
              className="w-11 h-11 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 active:scale-90 transition-all shadow-sm"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-5 space-y-10 no-scrollbar pb-36">
            
            {/* KAZANILANLAR */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30"></div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">KAZANILANLAR ({earnedBadges.length})</h3>
              </div>
              <div className="grid gap-4">
                {earnedBadges.map(badge => <BadgeItem key={badge.id} badge={badge} isEarned={true} />)}
              </div>
            </section>

            {/* KAZANILABİLECEKLER */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 px-1">
                <div className="w-1.5 h-4 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">KİLİTLİLER ({unearnedBadges.length})</h3>
              </div>
              <div className="grid gap-4">
                {unearnedBadges.map(badge => <BadgeItem key={badge.id} badge={badge} isEarned={false} />)}
              </div>
            </section>
          </div>

          <div className="p-6 pb-12 bg-white dark:bg-slate-950 border-t border-slate-50 dark:border-slate-900 sticky bottom-0 z-30">
             <button onClick={() => setIsBadgeModalOpen(false)} className="w-full py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all">KOLEKSİYONA DÖN</button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="pt-6 pb-4 text-center opacity-30">
        <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em]">EduTrack Analytics Engine v2.5</p>
      </footer>

    </div>
  );
};
