
import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS, SYSTEM_BADGES, SHORT_DAYS } from '../constants';

interface DashboardProps {
  userRole: UserRole;
  userName: string;
  currentUserId: string;
  isSystemAdmin?: boolean;
  onImpersonate?: (userId: string) => void;
  onTabChange?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userRole, userName, currentUserId, isSystemAdmin, onImpersonate, onTabChange 
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'activity' | 'badges'>('none');
  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  
  const quotes = [
    "Eğitim, dünyayı değiştirmek için kullanabileceğiniz en güçlü silahtır.",
    "Zeka artı karakter; gerçek eğitimin amacı budur.",
    "Öğrenmek, akıntıya karşı kürek çekmek gibidir; durduğunuz anda geri gidersiniz.",
    "Başarı, her gün tekrarlanan küçük çabaların toplamıdır.",
    "Gelecek, hayallerinin peşinden gidenlerindir."
  ];
  
  const quoteOfTheDay = quotes[Math.floor(Math.random() * quotes.length)];

  // Mock metrics
  const attendanceCountThisMonth = 14;
  const attendancePercentage = 92;

  // Aktivite Verisi
  const activityData = [true, true, false, true, true, false, true];
  const fullActivityHistory = Array.from({ length: 30 }, (_, i) => Math.random() > 0.3);

  // Kullanıcının Rozetleri
  const userBadges = SYSTEM_BADGES.filter(b => currentUser?.badges?.includes(b.id));

  // Modals Overlay Component
  const ModalOverlay = ({ title, children, onClose }: { title: string, children?: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white dark:bg-slate-950 page-transition">
      <header className="px-6 py-6 border-b border-slate-50 dark:border-slate-900 flex items-center justify-between">
        <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">{title}</h3>
        <button onClick={onClose} className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        {children}
      </div>
    </div>
  );

  const RealisticFlame = () => (
    <div className="relative w-8 h-8 flex items-center justify-center animate-flame-flicker">
      <div className="absolute inset-0 bg-orange-400 blur-md opacity-40 rounded-full animate-pulse"></div>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]">
        <path d="M12 2C12 2 17 7.5 17 13.5C17 16.5 14.76 19 12 19C9.24 19 7 16.5 7 13.5C7 7.5 12 2 12 2Z" fill="#F97316" className="animate-pulse" />
        <path d="M12 7C12 7 15.5 11 15.5 14.5C15.5 16.5 13.93 18 12 18C10.07 18 8.5 16.5 8.5 14.5C8.5 11 12 7 12 7Z" fill="#FB923C" />
        <path d="M12 11C12 11 13.5 13.5 13.5 15.5C13.5 16.5 12.83 17.2 12 17.2C11.17 17.2 10.5 16.5 10.5 15.5C10.5 13.5 12 11 12 11Z" fill="#FEF08A" />
      </svg>
      <div className="absolute top-0 w-1 h-1 bg-yellow-400 rounded-full animate-flame-rise opacity-60" style={{ left: '40%' }}></div>
    </div>
  );

  return (
    <div className="w-full page-transition px-4 space-y-6 overflow-x-hidden transition-colors pb-32">
      
      {/* MODALS */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 page-transition">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsQRModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Hızlı Giriş</h3>
            <div className="p-4 bg-white rounded-3xl border border-slate-100 mb-6 mt-4">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUserId}&color=4f46e5`} alt="QR" className="w-40 h-40" />
            </div>
            <button onClick={() => setIsQRModalOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold active:scale-95 transition-all">Kapat</button>
          </div>
        </div>
      )}

      {activeModal === 'activity' && (
        <ModalOverlay title="Aktivite Geçmişi" onClose={() => setActiveModal('none')}>
          <div className="space-y-6">
            <div className="grid grid-cols-7 gap-2">
              {fullActivityHistory.map((attended, idx) => (
                <div key={idx} className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black ${attended ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-300'}`}>
                  {idx + 1}
                </div>
              ))}
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-400 mb-2 uppercase">İstatistikler</h4>
              <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400/80">Bu ay toplam {fullActivityHistory.filter(Boolean).length} gün aktif katılım sağladınız. Harika bir performans!</p>
            </div>
          </div>
        </ModalOverlay>
      )}

      {activeModal === 'badges' && (
        <ModalOverlay title="Rozet Koleksiyonu" onClose={() => setActiveModal('none')}>
          <div className="grid grid-cols-2 gap-4">
            {SYSTEM_BADGES.map(badge => {
              const isEarned = currentUser?.badges?.includes(badge.id);
              return (
                <div key={badge.id} className={`p-5 rounded-[2rem] border transition-all flex flex-col items-center text-center gap-3 ${isEarned ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm' : 'opacity-40 grayscale border-dashed border-slate-200 dark:border-slate-800'}`}>
                   <div className={`w-14 h-14 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                    {badge.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">{badge.name}</h4>
                    <p className="text-[9px] text-slate-400 leading-tight">{badge.description}</p>
                  </div>
                  {!isEarned && <span className="text-[7px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md mt-1">KİLİTLİ</span>}
                </div>
              );
            })}
          </div>
        </ModalOverlay>
      )}

      {/* 1. HEADER (USER INFO) - NOW AT THE VERY TOP */}
      <section className="pt-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl border-2 border-slate-100 dark:border-slate-800 p-0.5 shadow-sm overflow-hidden">
            <img src={currentUser?.avatar} alt={userName} className="w-full h-full object-cover rounded-[0.8rem]" />
          </div>
          <div className="space-y-0.5">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">Merhaba, {userName.split(' ')[0]}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest leading-none">{userRole}</p>
          </div>
        </div>
      </section>

      {/* 2. SOFT QR BUTTON (DIGITAL IDENTITY) - NOW BELOW HEADER */}
      <section>
        <button 
          onClick={() => setIsQRModalOpen(true)}
          className="w-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 p-5 rounded-[2rem] flex items-center justify-between group active:scale-[0.98] transition-all shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-600 dark:text-white">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest">Dijital Kimliğim</h4>
              <p className="text-[10px] text-indigo-600/60 dark:text-indigo-400/60 font-medium">Hızlı yoklama için kodu göster</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-indigo-300 group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </section>

      {/* 3. MINIMAL METRICS */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AYLIK KATILIM</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{attendanceCountThisMonth}</span>
            <span className="text-[10px] font-bold text-slate-300 uppercase">Ders</span>
          </div>
          <div className="h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-indigo-600 w-3/4"></div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-1">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BAŞARI ORANI</span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">%{attendancePercentage}</span>
          </div>
          <p className="text-[8px] font-black text-emerald-500 uppercase flex items-center gap-1 mt-2">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
            ARTAN TREND
          </p>
        </div>
      </section>

      {/* 4. ACTIVITY SECTION */}
      <section className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">AKTİVİTE YOĞUNLUĞU</h3>
           <button onClick={() => setActiveModal('activity')} className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl">Detay</button>
        </div>
        <div className="flex justify-between gap-2">
          {activityData.map((attended, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm relative overflow-hidden ${attended ? 'bg-slate-900 dark:bg-slate-800 border border-slate-700 scale-105' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-30'}`}>
                {attended ? <RealisticFlame /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>}
              </div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{SHORT_DAYS[i === 6 ? 0 : i + 1]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BADGES SECTION */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">SON KAZANILAN ROZETLER</h3>
           <button onClick={() => setActiveModal('badges')} className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-xl">Tümünü Gör</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {userBadges.slice(0, 3).map((badge) => (
            <div key={badge.id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
              <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-1`}>
                {badge.icon}
              </div>
              <span className="text-[8px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-center leading-tight line-clamp-1">{badge.name}</span>
            </div>
          ))}
          {userBadges.length === 0 && (
            <div className="col-span-3 py-6 text-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
               <p className="text-[9px] font-bold text-slate-400 uppercase">Henüz rozet kazanılmadı</p>
            </div>
          )}
        </div>
      </section>

      {/* 6. QUOTE (INSPIRATIONAL) - AT THE BOTTOM */}
      <section className="w-full pt-4">
        <div className="bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-indigo-900/10 dark:via-slate-900 dark:to-indigo-900/10 rounded-[2.5rem] p-8 border border-slate-100 dark:border-indigo-900/20 text-center relative overflow-hidden group">
          <span className="text-4xl absolute -top-2 left-4 opacity-10 font-serif text-indigo-600">“</span>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed italic relative z-10 px-4">
            {quoteOfTheDay}
          </p>
          <div className="mt-4 flex flex-col items-center">
             <div className="w-8 h-1 bg-indigo-500/20 rounded-full mb-2"></div>
             <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em]">GÜNÜN İLHAMI</span>
          </div>
        </div>
      </section>

      <section className="pt-4 text-center">
         <p className="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em] italic">Potansiyelini her gün keşfet!</p>
      </section>
    </div>
  );
};
