
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
  onOpenFinancials: () => void;
  onOpenMonthlyAnalysis: () => void;
}

type ActivityStatus = 'attended' | 'missed' | 'none';

export const Dashboard: React.FC<DashboardProps> = ({ 
  userName, currentUserId, goals, onToggleTask, payments, courses, onOpenFinancials, onOpenMonthlyAnalysis
}) => {
  const [isAvatarExpanded, setIsAvatarExpanded] = useState(false);
  const [expandedGoalIds, setExpandedGoalIds] = useState<string[]>([]);

  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  
  const today = new Date();
  const weeklyActivity = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      // Weekly Logic sync'd with monthly heatmap logic
      const status: ActivityStatus = i === 2 ? 'missed' : i === 4 ? 'none' : 'attended';
      return { dayNum: d.getDate(), status, dayName: SHORT_DAYS[d.getDay()] };
    });
  }, []);

  const unpaidPayments = useMemo(() => {
    return payments.filter(p => p.studentId === currentUserId && p.status !== PaymentStatus.PAID);
  }, [payments, currentUserId]);

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
    <div className="w-full page-transition px-4 space-y-4 overflow-hidden pb-24 pt-3 transition-all text-slate-900 dark:text-slate-100 text-left h-full">
      
      {/* --- DIGITAL IDENTITY --- */}
      <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[1.8rem] p-3 shadow-sm border border-white/20 dark:border-slate-800 transition-all">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAvatarExpanded(true)}
            className="w-11 h-11 rounded-xl border-2 border-white dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shadow-sm overflow-hidden active:scale-90 transition-transform"
          >
            <img src={currentUser?.avatar} className="w-full h-full object-cover" alt="" />
          </button>
          <div className="flex-1 min-w-0">
             <span className="text-[6px] font-black uppercase tracking-[0.2em] text-indigo-500">ÜYE KİMLİĞİ</span>
             <h2 className="text-sm font-black truncate uppercase text-slate-800 dark:text-slate-100 leading-none mt-0.5">{userName}</h2>
          </div>
        </div>
      </section>

      {/* --- FINANCIAL STATUS --- */}
      {(overdueCount > 0 || pendingCount > 0) && (
        <section className="animate-in slide-in-from-top-2">
          <div className={`p-4 rounded-[1.8rem] border backdrop-blur-md flex items-center justify-between shadow-md ${overdueCount > 0 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
            <div className="flex items-center gap-3">
               <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${overdueCount > 0 ? 'bg-rose-500 text-white shadow-lg' : 'bg-amber-500 text-white shadow-lg'}`}>!</div>
               <div className="text-left">
                  <h4 className={`text-[10px] font-black uppercase ${overdueCount > 0 ? 'text-rose-600' : 'text-amber-600'}`}>ÖDEME DURUMU</h4>
                  <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">{overdueCount > 0 ? `${overdueCount} Gecikmiş Aidat` : `${pendingCount} Ödeme Bekliyor`}</p>
               </div>
            </div>
            <button onClick={onOpenFinancials} className={`px-3 py-2 rounded-xl text-[7px] font-black uppercase tracking-widest text-white ${overdueCount > 0 ? 'bg-rose-600' : 'bg-amber-600'}`}>Detaylar</button>
          </div>
        </section>
      )}

      {/* --- ACTIVITY DENSITY --- */}
      <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[1.8rem] p-4 shadow-sm border border-white/20 dark:border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[8px] font-black uppercase tracking-[0.2em] text-orange-500">HAFTALIK AKTİVİTE</h3>
          <button onClick={onOpenMonthlyAnalysis} className="px-2 py-1 bg-white/50 dark:bg-slate-800 rounded-lg text-[6px] font-black uppercase border border-white/20 dark:border-slate-700 text-slate-400 active:scale-95">AYLIK GÖRÜNÜM</button>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weeklyActivity.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <span className="text-[5px] font-black text-slate-300 dark:text-slate-600 uppercase">{item.dayName}</span>
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center relative transition-all ${
                item.status === 'attended' ? 'bg-orange-500/10 border border-orange-500/20 shadow-sm' :
                item.status === 'missed' ? 'bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700' :
                'bg-slate-50/50 dark:bg-slate-900/20'
              }`}>
                <span className="absolute top-1 left-1.5 text-[5px] font-black text-slate-400">{item.dayNum}</span>
                {item.status === 'attended' && <span className="text-[10px] animate-flame-flicker">🔥</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- GOALS SECTION --- */}
      <section className="space-y-3">
        <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] px-1">GÜNCEL HEDEFLERİM</h3>
        <div className="space-y-2">
          {goals.length === 0 ? (
            <div className="bg-slate-50/50 dark:bg-slate-900/20 rounded-3xl p-8 border border-dashed border-slate-200 dark:border-slate-800 text-center opacity-30">
               <p className="text-[8px] font-black uppercase">Henüz hedef eklenmedi</p>
            </div>
          ) : (
            goals.map(goal => {
              const progress = calculateProgress(goal.tasks);
              const isExpanded = expandedGoalIds.includes(goal.id);
              return (
                <div key={goal.id} className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[1.5rem] border border-white/20 dark:border-slate-800 shadow-sm overflow-hidden transition-all">
                  <button onClick={() => handleToggleGoalExpand(goal.id)} className="w-full p-4 flex items-center justify-between text-left">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${goal.category === 'sport' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-500' : goal.category === 'academic' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}>
                           {goal.category === 'sport' ? '⚽' : goal.category === 'academic' ? '📚' : '🎯'}
                        </div>
                        <div>
                           <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight leading-none">{goal.title}</h4>
                           <div className="flex items-center gap-3 mt-1.5">
                              <div className="h-1 w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                 <div className="h-full bg-indigo-500" style={{ width: `${progress}%` }}></div>
                              </div>
                              <span className="text-[8px] font-black text-indigo-600">%{progress}</span>
                           </div>
                        </div>
                     </div>
                     <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="6 9 12 15 18 9"/></svg>
                     </div>
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-1.5 border-t border-white/10 dark:border-slate-800 pt-3 animate-in slide-in-from-top-1">
                      {goal.tasks.length === 0 ? (
                        <p className="text-[8px] font-bold text-slate-400 py-2 italic text-center uppercase tracking-widest opacity-50">Henüz görev eklenmemiş</p>
                      ) : (
                        goal.tasks.map(task => (
                          <button key={task.id} onClick={() => onToggleTask(goal.id, task.id)} className="w-full flex items-center gap-3 py-2 px-3 rounded-xl text-left bg-slate-50/50 dark:bg-slate-800/30 border border-transparent transition-all">
                            <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center shrink-0 ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                              {task.isCompleted && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="6"><polyline points="20 6 9 17 4 12"/></svg>}
                            </div>
                            <span className={`text-[9px] font-bold tracking-tight ${task.isCompleted ? 'text-slate-300 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{task.text}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* --- AVATAR MODAL --- */}
      {isAvatarExpanded && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsAvatarExpanded(false)} />
          <div className="relative z-10 w-full max-w-xs animate-in zoom-in-95 duration-300">
             <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-2 shadow-2xl overflow-hidden border border-white/10">
                <img src={currentUser?.avatar} className="w-full aspect-square object-cover rounded-[2.5rem]" alt="" />
             </div>
             <button onClick={() => setIsAvatarExpanded(false)} className="mt-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white mx-auto border border-white/20 active:scale-90 shadow-lg">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
