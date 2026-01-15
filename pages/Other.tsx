
import React, { useMemo } from 'react';
import { MOCK_USERS, SYSTEM_BADGES } from '../constants';

export const Other: React.FC = () => {
  const currentUser = MOCK_USERS.find(u => u.id === 'u2') || MOCK_USERS[0];

  const profileCompletion = useMemo(() => {
    const fields = [
      currentUser.name, currentUser.email, currentUser.phoneNumber,
      currentUser.avatar, currentUser.birthDate, currentUser.gender, currentUser.address
    ];
    const filledCount = fields.filter(f => f && f !== 'Belirtilmedi').length;
    return Math.round((filledCount / fields.length) * 100);
  }, [currentUser]);

  const userBadges = SYSTEM_BADGES.filter(b => currentUser?.badges?.includes(b.id));

  const attendanceCountThisMonth = 14;
  const attendancePercentage = 92;

  return (
    <div className="space-y-4 animate-in fade-in duration-700 pb-24 px-4 pt-3 transition-all">
      
      {/* 1. GÜNÜN SÖZÜ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border border-indigo-100/50 dark:border-slate-800 p-5 rounded-[2.25rem] shadow-sm">
        <div className="absolute -top-4 -left-2 text-6xl text-indigo-200/30 font-serif pointer-events-none">“</div>
        <div className="relative z-10 space-y-3">
          <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] block">Günün İlham Kaynağı</span>
          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
            "Zeka artı karakter; gerçek eğitimin amacı budur. Başarı, her gün tekrarlanan küçük çabaların toplamıdır."
          </p>
          <div className="flex items-center gap-2 pt-1">
             <div className="h-0.5 w-6 bg-indigo-500/30 rounded-full"></div>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">M. Luther King Jr.</span>
          </div>
        </div>
      </section>

      {/* 2. SUCCESS METRICS */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-0.5">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">AYLIK KATILIM</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{attendanceCountThisMonth}</span>
            <span className="text-[8px] font-bold text-slate-300 uppercase">DERS</span>
          </div>
          <div className="h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
             <div className="h-full bg-indigo-600" style={{ width: '75%' }}></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-0.5">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">BAŞARI ORANI</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">%{attendancePercentage}</span>
          </div>
          <p className="text-[7px] font-black text-emerald-500 uppercase flex items-center gap-1 mt-1.5 tracking-tighter leading-none">
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            ARTAN TREND
          </p>
        </div>
      </section>

      {/* 3. BAŞARI KOLEKSİYONU */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">BAŞARI KOLEKSİYONU</h3>
           <span className="text-[8px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg">{userBadges.length} / {SYSTEM_BADGES.length} ROZET</span>
        </div>
        <div className="space-y-2">
          {userBadges.map((badge) => (
            <div key={badge.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all">
              <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">{badge.name}</h4>
                <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 leading-tight mt-0.5">{badge.description}</p>
              </div>
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AI ANALİZİ (RENKLİ TASARIM) */}
      <section className="space-y-3">
        <h3 className="text-[9px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 px-1">AI PERFORMANS ANALİZİ</h3>
        <div className="bg-gradient-to-br from-fuchsia-500 via-purple-600 to-indigo-700 rounded-[2.5rem] p-6 text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-4 relative z-10">
            {[
              { label: 'Teknik Kapasite', val: 88, color: 'bg-fuchsia-300' },
              { label: 'Fiziksel Kondisyon', val: 92, color: 'bg-emerald-300' },
              { label: 'Disiplin ve Devamlılık', val: 96, color: 'bg-amber-300' }
            ].map(skill => (
              <div key={skill.label} className="space-y-1.5">
                <div className="flex justify-between items-center px-0.5">
                  <span className="text-[8px] font-black text-white/70 uppercase tracking-widest">{skill.label}</span>
                  <span className="text-[10px] font-black">%{skill.val}</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <div className={`h-full ${skill.color} transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.3)]`} style={{ width: `${skill.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-5 border border-white/20 space-y-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-xl shadow-lg">🤖</div>
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/80">EduAI Önerisi</h4>
                <p className="text-[11px] font-bold text-white mt-0.5 tracking-tight leading-none">Gelişim Sürüyor!</p>
              </div>
            </div>
            <div className="h-px bg-white/10 w-full"></div>
            <p className="text-[10px] font-medium leading-relaxed opacity-90 italic">
              "Kondisyon verilerin son 4 haftada %12 artış gösterdi. Rozet koleksiyonun harika görünüyor, bu tempo seni zirveye taşıyacak!"
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
