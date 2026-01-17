
import React, { useState, useMemo } from 'react';
import { MOCK_USERS, SHORT_DAYS } from '../constants';
import { PaymentRecord, Course, PaymentStatus } from '../types';

interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
}

interface Goal {
  id: string;
  title: string;
  category: 'sport' | 'academic' | 'personal';
  tasks: Task[];
}

interface DashboardProps {
  userName: string;
  currentUserId: string;
  goals: Goal[];
  onToggleTask: (goalId: string, taskId: string) => void;
  payments: PaymentRecord[];
  courses: Course[];
}

type ActivityStatus = 'attended' | 'missed' | 'none';

export const Dashboard: React.FC<DashboardProps> = ({ 
  userName, currentUserId, goals, onToggleTask, payments, courses
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const [showMonthlyView, setShowMonthlyView] = useState(false);
  const [expandedGoalIds, setExpandedGoalIds] = useState<string[]>([]);
  const [showFinancialDetails, setShowFinancialDetails] = useState(false);

  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  
  const today = new Date();
  const weeklyActivity = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      const status: ActivityStatus = i === 2 ? 'missed' : i === 4 ? 'none' : 'attended';
      return { dayNum: d.getDate(), status, dayName: SHORT_DAYS[d.getDay()] };
    });
  }, []);

  const unpaidPayments = useMemo(() => {
    return payments
      .filter(p => p.studentId === currentUserId && p.status !== PaymentStatus.PAID)
      .map(p => ({
        ...p,
        course: courses.find(c => c.id === p.courseId)
      }))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [payments, currentUserId, courses]);

  const overdueCount = unpaidPayments.filter(p => p.status === PaymentStatus.OVERDUE).length;
  const pendingCount = unpaidPayments.filter(p => p.status === PaymentStatus.PENDING).length;

  const handleToggleGoalExpand = (id: string) => {
    setExpandedGoalIds(prev => prev.includes(id) ? [] : [id]);
  };

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="w-full page-transition px-4 space-y-3 overflow-hidden pb-24 pt-3 transition-all text-slate-900 dark:text-slate-100 text-left h-full">
      
      {/* --- COMPACT DIGITAL IDENTITY --- */}
      <section className="relative overflow-hidden bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[1.8rem] p-3 shadow-sm border border-white/20 dark:border-slate-800 transition-all">
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsAvatarExpanded(true)}
              className="w-11 h-11 rounded-xl border-2 border-white dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-800 shadow-sm overflow-hidden active:scale-90 transition-transform"
            >
              <img src={currentUser?.avatar} className="w-full h-full object-cover rounded-lg" alt="" />
            </button>
          </div>
          
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-1.5">
               <span className="text-[6px] font-black uppercase tracking-[0.2em] text-indigo-500">DİJİTAL KART</span>
               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
             </div>
             <h2 className="text-sm font-black tracking-tight leading-none truncate uppercase text-slate-800 dark:text-slate-100 mt-0.5">
               {userName}
             </h2>
          </div>

          <button onClick={() => setIsQRModalOpen(true)} className="w-9 h-9 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-white dark:border-slate-700 active:scale-90 transition-all shrink-0 text-slate-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </button>
        </div>
      </section>

      {/* --- AVATAR EXPAND MODAL --- */}
      {isAvatarExpanded && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsAvatarExpanded(false)} />
          <div className="relative z-10 w-full max-w-xs animate-in zoom-in-95 duration-300">
             <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-2 shadow-2xl overflow-hidden border border-white/10">
                <img src={currentUser?.avatar} className="w-full aspect-square object-cover rounded-[2.5rem]" alt="" />
                <div className="p-6 text-center">
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-none">{userName}</h3>
                  <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-2">DİJİTAL KİMLİK DOĞRULANDI</p>
                </div>
             </div>
             <button 
               onClick={() => setIsAvatarExpanded(false)}
               className="mt-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white mx-auto border border-white/20 active:scale-90 transition-transform shadow-lg"
             >
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
             </button>
          </div>
        </div>
      )}

      {/* --- FINANCIAL STATUS --- */}
      {(overdueCount > 0 || pendingCount > 0) && (
        <section className="animate-in slide-in-from-top-2">
          <div className={`p-4 rounded-[1.8rem] border backdrop-blur-md flex items-center justify-between shadow-md transition-all ${overdueCount > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="flex items-center gap-3">
               <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${overdueCount > 0 ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' : 'bg-amber-500 text-white shadow-lg shadow-amber-200'}`}>
                  {overdueCount > 0 ? '!' : '💰'}
               </div>
               <div className="text-left">
                  <h4 className={`text-[10px] font-black uppercase tracking-tight ${overdueCount > 0 ? 'text-rose-600' : 'text-amber-600'}`}>FİNANSAL DURUM</h4>
                  <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                    {overdueCount > 0 ? `${overdueCount} Gecikmiş Aidat` : `${pendingCount} Ödeme Bekliyor`}
                  </p>
               </div>
            </div>
            <button onClick={() => setShowFinancialDetails(true)} className={`px-3 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest ${overdueCount > 0 ? 'bg-rose-600 text-white shadow-md' : 'bg-amber-600 text-white shadow-md'}`}>Detaylar</button>
          </div>
        </section>
      )}

      {/* --- ACTIVITY DENSITY --- */}
      <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[1.8rem] p-4 shadow-sm border border-white/20 dark:border-slate-800 relative overflow-hidden transition-all">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-500">HAFTALIK AKTİVİTE</h3>
          <button onClick={() => setShowMonthlyView(true)} className="px-2 py-1 bg-white/50 dark:bg-slate-800 rounded-lg text-[6px] font-black uppercase tracking-widest border border-white/20 dark:border-slate-700 text-slate-400">AYLIK</button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeklyActivity.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[5px] font-black text-slate-300 dark:text-slate-600 uppercase">{item.dayName}</span>
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center relative ${
                item.status === 'attended' ? 'bg-orange-500/10 border border-orange-500/20' :
                item.status === 'missed' ? 'bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700' :
                'bg-slate-50/50 dark:bg-slate-900/20'
              }`}>
                <span className="absolute top-1 left-1.5 text-[5px] font-black text-slate-400">{item.dayNum}</span>
                {item.status === 'attended' && <span className="text-[10px] animate-flame-flicker">🔥</span>}
                {item.status === 'none' && <div className="w-0.5 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full"></div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- GOALS SECTION --- */}
      <section className="space-y-2">
        <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">HEDEFLERİM</h3>
        <div className="space-y-2">
          {goals.map(goal => {
            const progress = calculateProgress(goal.tasks);
            const isExpanded = expandedGoalIds.includes(goal.id);
            return (
              <div key={goal.id} className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[1.5rem] border border-white/20 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
                <button onClick={() => handleToggleGoalExpand(goal.id)} className="w-full p-3 flex items-center justify-between text-left">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base ${goal.category === 'sport' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-500'}`}>
                         {goal.category === 'sport' ? '⚽' : goal.category === 'academic' ? '📚' : '🎯'}
                      </div>
                      <div>
                         <h4 className="text-[9px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{goal.title}</h4>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="h-0.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-[6px] font-black text-indigo-600">%{progress}</span>
                         </div>
                      </div>
                   </div>
                   <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                   </div>
                </button>
                {isExpanded && (
                  <div className="px-3 pb-3 space-y-1 border-t border-white/10 dark:border-slate-800 pt-2 animate-in slide-in-from-top-1">
                    {goal.tasks.length === 0 ? (
                      <p className="text-[7px] font-medium text-slate-400 py-1 italic text-center uppercase tracking-widest">Henüz görev eklenmemiş</p>
                    ) : (
                      goal.tasks.map(task => (
                        <button key={task.id} onClick={() => onToggleTask(goal.id, task.id)} className="w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-left transition-all">
                          <div className={`w-3 h-3 rounded border flex items-center justify-center shrink-0 ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800'}`}>
                            {task.isCompleted && <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <span className={`text-[8px] font-bold ${task.isCompleted ? 'text-slate-300 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{task.text}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* --- FINANCIAL DETAILS MODAL --- */}
      {showFinancialDetails && (
        <div className="fixed inset-0 z-[1000] bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom duration-500">
           <header className="px-6 py-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center sticky top-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md z-10">
              <div className="text-left">
                 <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-none">ÖDEME DETAYLARI</h2>
                 <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1.5">BEKLEYEN VE GECİKMİŞ BORÇLAR</p>
              </div>
              <button onClick={() => setShowFinancialDetails(false)} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
           </header>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {unpaidPayments.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                  <span className="text-5xl">✅</span>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Tüm ödemeleriniz güncel!</p>
                </div>
              ) : (
                unpaidPayments.map((pay) => (
                  <div key={pay.id} className={`p-5 rounded-[2.5rem] border flex items-center justify-between shadow-sm transition-all ${pay.status === PaymentStatus.OVERDUE ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100/50' : 'bg-white dark:bg-slate-900/40 border-slate-100'}`}>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${pay.status === PaymentStatus.OVERDUE ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}></span>
                        <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase truncate leading-none">{pay.course?.title || 'Genel Aidat'}</h4>
                      </div>
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-tighter">Vade Tarihi: {pay.dueDate}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded-md text-[6px] font-black uppercase tracking-widest ${pay.status === PaymentStatus.OVERDUE ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {pay.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-slate-100 leading-none">₺{pay.amount}</span>
                    </div>
                  </div>
                ))
              )}
           </div>

           <div className="p-6 pb-12 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-900">
              <button onClick={() => setShowFinancialDetails(false)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">ANLADIM</button>
           </div>
        </div>
      )}

      {/* --- MONTHLY MODAL --- */}
      {showMonthlyView && (
        <div className="fixed inset-0 z-[1000] bg-slate-50 dark:bg-slate-950 flex flex-col animate-in slide-in-from-right duration-500">
           <header className="px-6 py-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-10">
              <div className="text-left">
                 <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tighter uppercase leading-none">AYLIK ANALİZ</h2>
                 <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1.5">Süreklilik Isı Haritası</p>
              </div>
              <button onClick={() => setShowMonthlyView(false)} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
           </header>
           <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar text-center">
              <div className="grid grid-cols-7 gap-1">
                 {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map(d => <span key={d} className="text-center text-[7px] font-black text-slate-300 dark:text-slate-700 uppercase mb-2">{d}</span>)}
                 {Array.from({ length: 30 }).map((_, i) => {
                    const dayNum = i + 1;
                    const status = [2, 5, 8, 12, 15, 19, 22, 26, 29].includes(dayNum) ? 'attended' : (dayNum % 7 === 0 ? 'missed' : 'none');
                    return (
                      <div key={i} className={`relative aspect-square rounded-xl border flex items-center justify-center ${
                        status === 'attended' ? 'bg-orange-500/10 border-orange-500/20' : 
                        status === 'missed' ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' :
                        'bg-slate-50 dark:bg-slate-900 border-slate-50 dark:border-slate-800'
                      }`}>
                         <span className="absolute top-1 left-1.5 text-[5px] font-black text-slate-400">{dayNum}</span>
                         {status === 'attended' && <span className="text-[10px] animate-flame-flicker">🔥</span>}
                      </div>
                    );
                 })}
              </div>
              
              <div className="bg-white/70 dark:bg-slate-900/40 p-5 rounded-[2.5rem] border border-white/20 dark:border-slate-800 text-left">
                 <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3">AYLIK ÖZET</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-[14px] font-black text-slate-800 dark:text-slate-100">14 Gün</p>
                       <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Katılım</p>
                    </div>
                    <div>
                       <p className="text-[14px] font-black text-emerald-500">%82</p>
                       <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verimlilik</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="p-6 pb-12 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
              <button onClick={() => setShowMonthlyView(false)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">ANLADIM</button>
           </div>
        </div>
      )}

      {/* --- QR MODAL --- */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsQRModalOpen(false)} />
          <div className="relative z-10 w-full max-w-[320px] bg-white dark:bg-slate-900 rounded-[3rem] p-8 text-center flex flex-col items-center shadow-2xl border border-white/10">
             <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-8"></div>
             <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase mb-1">{userName}</h3>
             <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 mb-8">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${currentUserId}`} className="w-44 h-44 bg-white p-4 rounded-[2rem]" alt="QR" />
             </div>
             <button onClick={() => setIsQRModalOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">KAPAT</button>
          </div>
        </div>
      )}
    </div>
  );
};
