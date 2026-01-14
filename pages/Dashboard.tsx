
import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_COURSES, MOCK_USERS } from '../constants';

interface DashboardProps {
  userRole: UserRole;
  userName: string;
  currentUserId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userRole, userName, currentUserId }) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const today = new Date().getDay();
  
  const todayClasses = MOCK_COURSES.filter(c => 
    (c.studentIds.includes(currentUserId) || c.teacherId === currentUserId) &&
    c.schedule.some(s => s.day === today)
  ).map(c => ({
    ...c,
    schedule: c.schedule.find(s => s.day === today)
  })).sort((a, b) => a.schedule!.startTime.localeCompare(b.schedule!.startTime));

  const QRModal = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 page-transition">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsQRModalOpen(false)} />
      <div className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[2.5rem] p-8 relative z-10 shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">Giriş QR Kodu</h3>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 text-center">Yoklama için bu kodu okutun</p>
        <div className="p-4 bg-slate-50 dark:bg-white rounded-3xl border border-slate-100 mb-6">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUserId}&color=4f46e5`} alt="QR" className="w-40 h-40 mix-blend-multiply" />
        </div>
        <button onClick={() => setIsQRModalOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold active:scale-95 transition-all">Kapat</button>
      </div>
    </div>
  );

  return (
    <div className="w-full page-transition px-4 space-y-5 overflow-x-hidden transition-colors">
      {isQRModalOpen && <QRModal />}
      
      {/* Hero Header */}
      <section className="pt-4 flex justify-between items-center">
        <div className="space-y-0.5">
          <p className="text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-widest leading-none">Hoş Geldin</p>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">{userName.split(' ')[0]} 👋</h2>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tighter">Bugünkü Derslerin</p>
          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 leading-none">{todayClasses.length}</p>
        </div>
      </section>

      {/* Primary Action Card (Performance + QR) */}
      <section className="bg-slate-900 dark:bg-indigo-600/20 rounded-[2.25rem] p-5 text-white relative overflow-hidden shadow-xl shadow-slate-200 dark:shadow-none border dark:border-indigo-500/20">
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-4 flex-1">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-indigo-300 mb-1">Performans Özeti</p>
              <h3 className="text-xl font-bold leading-tight">Gelişim Yolun <br/> Harika Gidiyor! 🚀</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-emerald-400">%94</span>
              <div className="flex-1 max-w-[120px] h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="w-[94%] h-full bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
              </div>
            </div>
          </div>

          {userRole === UserRole.STUDENT && (
            <button 
              onClick={() => setIsQRModalOpen(true)}
              className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
            >
              <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-white/80">QR Okut</span>
            </button>
          )}
        </div>
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </section>

      {/* Daily List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Sıradaki Dersler</h3>
          <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 active:opacity-50">Tümünü Gör</button>
        </div>
        
        <div className="space-y-2.5">
          {todayClasses.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">Bugün planlı ders yok</p>
            </div>
          ) : (
            todayClasses.map((cls, i) => {
              const isTrainer = cls.teacherId === currentUserId;
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm active:bg-slate-50 dark:active:bg-slate-800 transition-all border-l-4 border-l-indigo-500">
                  <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 ${isTrainer ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-100 dark:border-slate-700'}`}>
                    <span className="text-[10px] font-bold leading-none">{cls.schedule?.startTime}</span>
                    <span className="text-[7px] font-bold opacity-40 mt-1 uppercase">Ders</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">{cls.title}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                      {isTrainer ? 'Kurum: ' + cls.schoolId.toUpperCase() : 'Eğitmen: ' + MOCK_USERS.find(u => u.id === cls.teacherId)?.name.split(' ')[0]}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${isTrainer ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                    {isTrainer ? 'Hoca' : 'Öğrenci'}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
