
import React, { useState, useMemo } from 'react';
import { MOCK_USERS, SYSTEM_BADGES } from '../constants';
import { Badge, User } from '../types';

interface OtherProps {
  currentUser: User;
}

export const Other: React.FC<OtherProps> = ({ currentUser }) => {
  const [showAllBadges, setShowAllBadges] = useState(false);
  
  // Profil Tamamlanma Hesaplama
  const profileCompletion = useMemo(() => {
    const fields = [
      { key: 'name', label: 'Ad Soyad', check: (val: string) => val && val.trim().split(' ').length >= 2 },
      { key: 'email', label: 'E-Posta', check: (val: string) => !!val },
      { key: 'phoneNumber', label: 'Telefon', check: (val: string) => val && val !== '05550000000' && val.length > 5 },
      { key: 'avatar', label: 'Profil Fotoğrafı', check: (val: string) => !!val },
      { key: 'birthDate', label: 'Doğum Tarihi', check: (val: string) => !!val },
      { key: 'gender', label: 'Cinsiyet', check: (val: string) => val && val !== 'Belirtilmedi' },
      { key: 'address', label: 'Adres', check: (val: string) => !!val },
      { key: 'bio', label: 'Biyografi', check: (val: string) => !!val }
    ];

    const completed = fields.filter(f => f.check((currentUser as any)[f.key]));
    const percentage = Math.round((completed.length / fields.length) * 100);
    
    return { percentage, completedCount: completed.length, totalCount: fields.length, fields };
  }, [currentUser]);

  const userBadgeIds = currentUser?.badges || [];
  const earnedBadges = SYSTEM_BADGES.filter(b => userBadgeIds.includes(b.id));
  const unearnedBadges = SYSTEM_BADGES.filter(b => !userBadgeIds.includes(b.id));

  const attendanceCountThisMonth = 14;
  const attendancePercentage = 92;

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
    <div className="space-y-4 animate-in fade-in duration-700 pb-28 px-4 pt-1 transition-all overflow-hidden">
      
      {/* 1. PROFİL TAMAMLANMA GRAFİĞİ */}
      <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-100 dark:text-slate-800" />
              <circle 
                cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10" fill="transparent" 
                strokeDasharray={`${profileCompletion.percentage * 2.64} 264`}
                className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out" 
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900 dark:text-slate-100">%{profileCompletion.percentage}</span>
              <span className="text-[5px] font-black text-slate-400 uppercase tracking-widest">GÜCÜ</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">PROFİL TAMAMLANMA</h3>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                {profileCompletion.completedCount}/{profileCompletion.totalCount} Bilgi Girildi
              </p>
            </div>
            <div className="flex flex-wrap gap-1">
              {profileCompletion.fields.map(f => (
                <div key={f.key} className={`w-1.5 h-1.5 rounded-full ${f.check((currentUser as any)[f.key]) ? 'bg-indigo-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
              ))}
            </div>
            {profileCompletion.percentage < 100 && (
              <p className="text-[7px] font-black text-indigo-500 uppercase tracking-widest animate-pulse mt-1">HESABINI GÜÇLENDİR!</p>
            )}
          </div>
        </div>
      </section>

      {/* 2. SUCCESS METRICS */}
      <section className="grid grid-cols-2 gap-2">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center">
          <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1">AYLIK KATILIM</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">{attendanceCountThisMonth}</span>
            <span className="text-[7px] font-bold text-slate-400 uppercase">DERS</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-center text-center">
          <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1">GENEL BAŞARI</span>
          <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">%{attendancePercentage}</span>
        </div>
      </section>

      {/* 3. ROZETLER */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest">BAŞARI ROZETLERİ</h3>
           <button 
             onClick={() => setShowAllBadges(true)}
             className="text-[6.5px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-lg uppercase"
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

      {/* 4. AI ANALİZ */}
      <section className="bg-slate-950 dark:bg-indigo-600 rounded-[2.5rem] p-5 text-white shadow-xl space-y-3">
        <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-100">GELİŞİM ANALİZİ</h3>
        <div className="space-y-3">
          {[{ label: 'TEKNİK BECERİ', val: 88, c: 'bg-fuchsia-400' }, { label: 'DİSİPLİN PUANI', val: 96, c: 'bg-amber-400' }].map(s => (
            <div key={s.label} className="space-y-1.5">
              <div className="flex justify-between text-[7px] font-black uppercase tracking-wider"><span className="opacity-60">{s.label}</span><span>%{s.val}</span></div>
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${s.c} shadow-[0_0_10px_rgba(255,255,255,0.3)]`} style={{ width: `${s.val}%` }}></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* TÜM ROZETLER MODAL */}
      {showAllBadges && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowAllBadges(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[320px] max-h-[70vh] rounded-[2.5rem] p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col animate-in zoom-in-95 duration-300">
            <header className="flex justify-between items-center mb-4 shrink-0">
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">TÜM BAŞARIMLAR</h3>
              <button onClick={() => setShowAllBadges(false)} className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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
