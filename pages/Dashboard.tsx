
import React, { useState, useMemo } from 'react';
import { UserRole } from '../types';
import { MOCK_USERS, SHORT_DAYS } from '../constants';

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
  userRole: UserRole;
  userName: string;
  currentUserId: string;
  isSystemAdmin?: boolean;
  onImpersonate?: (userId: string) => void;
  onTabChange?: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userRole, userName, currentUserId 
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'activity'>('none');
  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  
  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1', 
      title: 'Haftalık Antrenman Programı', 
      category: 'sport', 
      tasks: [
        { id: 't1', text: 'Pazartesi: Kondisyon', isCompleted: true },
        { id: 't2', text: 'Çarşamba: Teknik Çalışma', isCompleted: true },
        { id: 't3', text: 'Cuma: Taktik Maç', isCompleted: false },
        { id: 't4', text: 'Pazar: Dinlenme/Esneklik', isCompleted: false },
      ]
    },
    { 
      id: '2', 
      title: 'Matematik Temelini Güçlendir', 
      category: 'academic', 
      tasks: [
        { id: 't5', text: 'Türev Problemleri Çöz', isCompleted: true },
        { id: 't6', text: 'Deneme Sınavına Gir', isCompleted: true },
        { id: 't7', text: 'Logaritma Tekrarı', isCompleted: false },
      ]
    }
  ]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'sport' | 'academic' | 'personal'>('sport');
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  const toggleTask = (goalId: string, taskId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          tasks: g.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
        };
      }
      return g;
    }));
  };

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const addNewGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoalTitle,
      category: newGoalCategory,
      tasks: []
    };
    setGoals([newGoal, ...goals]);
    setNewGoalTitle('');
    setIsGoalModalOpen(false);
  };

  const addTaskToGoal = (goalId: string, taskText: string) => {
    if (!taskText.trim()) return;
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          tasks: [...g.tasks, { id: Math.random().toString(36).substr(2, 5), text: taskText, isCompleted: false }]
        };
      }
      return g;
    }));
  };

  const activityData = [true, true, false, true, true, false, true];
  
  const monthlyActivity = useMemo(() => 
    Array.from({ length: 30 }, (_, i) => ({ 
      day: i + 1, 
      attended: [1, 3, 4, 8, 10, 11, 14, 15, 18, 20, 21, 25, 28, 29].includes(i + 1)
    })), 
  []);

  const RealisticFlame = ({ size = "w-6 h-6", opacity = "1" }: { size?: string, opacity?: string }) => (
    <div className={`relative ${size} flex items-center justify-center animate-flame-flicker`} style={{ opacity }}>
      <div className="absolute inset-0 bg-orange-400 blur-sm opacity-30 rounded-full animate-pulse"></div>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]">
        <path d="M12 2C12 2 17 7.5 17 13.5C17 16.5 14.76 19 12 19C9.24 19 7 16.5 7 13.5C7 7.5 12 2 12 2Z" fill="#F97316" className="animate-pulse" />
        <path d="M12 7C12 7 15.5 11 15.5 14.5C15.5 16.5 13.93 18 12 18C10.07 18 8.5 16.5 8.5 14.5C8.5 11 12 7 12 7Z" fill="#FB923C" />
      </svg>
    </div>
  );

  return (
    <div className="w-full page-transition px-4 space-y-3 overflow-x-hidden pb-24 transition-all">
      
      {/* 1. HEADER (MINIMAL) */}
      <section className="pt-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-slate-100 dark:border-slate-800 p-0.5 overflow-hidden">
            <img src={currentUser?.avatar} className="w-full h-full object-cover rounded-lg" alt="" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Merhaba, {userName.split(' ')[0]}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-[8px] font-bold uppercase tracking-widest mt-0.5">{userRole}</p>
          </div>
        </div>
      </section>

      {/* 2. DIGITAL ID */}
      <button 
        onClick={() => setIsQRModalOpen(true)}
        className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 p-3 rounded-2xl flex items-center justify-between group active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div className="text-left">
            <h4 className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest leading-none">Dijital Kimliğim</h4>
            <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Hızlı yoklama kodu</p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-300"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>

      {/* 3. ACTIVITY INTENSITY (MİNİMAL TASARIM) */}
      <section className="bg-slate-50 dark:bg-slate-900/30 p-4 rounded-[2rem] border border-slate-100 dark:border-slate-800/40 space-y-3">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">AKTİVİTE YOĞUNLUĞU</h3>
           <button onClick={() => setActiveModal('activity')} className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700">Detay</button>
        </div>
        <div className="flex justify-between gap-1.5">
          {activityData.map((attended, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${attended ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-40'}`}>
                {attended ? <RealisticFlame size="w-5 h-5" /> : <div className="w-1 h-1 rounded-full bg-slate-300"></div>}
              </div>
              <span className="text-[7px] font-black text-slate-400 uppercase">{SHORT_DAYS[i === 6 ? 0 : i + 1]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GOALS */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1 mb-1">
          <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">HEDEFLERİM</h3>
          <button onClick={() => setIsGoalModalOpen(true)} className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center active:scale-90 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        <div className="space-y-2">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.tasks);
            const isExpanded = expandedGoalId === goal.id;
            const uncompletedCount = goal.tasks.filter(t => !t.isCompleted).length;
            
            return (
              <div key={goal.id} className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-indigo-500/20 shadow-md' : 'shadow-sm'}`}>
                <button onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)} className="w-full p-3 flex items-center gap-3 text-left">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                    {goal.category === 'sport' ? '⚽' : goal.category === 'academic' ? '📚' : '🌱'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[11px] font-bold text-slate-900 dark:text-slate-100 truncate leading-none">{goal.title}</h4>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-1 flex-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-[7px] font-black text-slate-400 shrink-0">%{progress}</span>
                    </div>
                  </div>
                  {uncompletedCount > 0 && !isExpanded && (
                    <div className="px-2 py-0.5 bg-rose-50 dark:bg-rose-900/20 rounded-md shrink-0">
                      <span className="text-[7px] font-black text-rose-600 uppercase leading-none">{uncompletedCount} KALAN</span>
                    </div>
                  )}
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <div className="h-px bg-slate-50 dark:bg-slate-800 w-full mb-2"></div>
                    {goal.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2.5">
                        <button onClick={() => toggleTask(goal.id, task.id)} className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${task.isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700'}`}>
                          {task.isCompleted && <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </button>
                        <span className={`text-[10px] font-medium ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{task.text}</span>
                      </div>
                    ))}
                    <input 
                      type="text" placeholder="Yeni görev..."
                      onKeyDown={(e) => { if (e.key === 'Enter') { addTaskToGoal(goal.id, e.currentTarget.value); e.currentTarget.value = ''; } }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-[9px] font-bold outline-none mt-1"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* QR MODAL */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsQRModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[260px] rounded-[2rem] p-6 relative z-10 shadow-2xl flex flex-col items-center">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-[0.2em]">Giriş Kodu</h3>
            <div className="p-3 bg-white rounded-2xl border border-slate-50 mb-6 shadow-inner">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUserId}&color=4f46e5`} alt="QR" className="w-32 h-32" />
            </div>
            <button onClick={() => setIsQRModalOpen(false)} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">Kapat</button>
          </div>
        </div>
      )}

      {/* ACTIVITY DETAIL MODAL (MİNİMAL TAKVİM) */}
      {activeModal === 'activity' && (
        <div className="fixed inset-0 z-[300] flex flex-col bg-white dark:bg-slate-950 animate-in slide-in-from-bottom duration-500">
          <header className="p-5 flex items-center justify-between border-b border-slate-50 dark:border-slate-900">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest leading-none">AKTİVİTE YOĞUNLUĞU</h3>
              <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-[0.2em]">HAZİRAN 2024</p>
            </div>
            <button onClick={() => setActiveModal('none')} className="w-9 h-9 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 active:scale-90 transition-all">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
            {/* Seri Bilgisi */}
            <div className="bg-orange-50/50 dark:bg-orange-500/5 p-5 rounded-[2rem] border border-orange-100 dark:border-orange-500/10 text-center shadow-sm">
               <span className="text-[8px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">BU AY AKTİF KATILIM</span>
               <div className="flex items-center justify-center gap-3 mt-2">
                  <RealisticFlame size="w-10 h-10" />
                  <span className="text-4xl font-black text-slate-900 dark:text-white leading-none">14</span>
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">GÜN</span>
               </div>
            </div>

            {/* Takvim Görünümü */}
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                 {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
                   <span key={i} className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{d}</span>
                 ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {monthlyActivity.map((item) => (
                  <div 
                    key={item.day} 
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-300 border ${
                      item.attended 
                        ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200/50 dark:border-orange-500/20 shadow-sm scale-105' 
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    {/* Tarih Numarası */}
                    <span className={`text-[8px] font-black absolute top-1.5 left-2 ${
                      item.attended 
                        ? 'text-orange-400 dark:text-orange-500' 
                        : 'text-slate-300 dark:text-slate-700'
                    }`}>
                      {item.day}
                    </span>

                    {/* Alev İkonu */}
                    {item.attended && (
                      <div className="mt-1">
                        <RealisticFlame size="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">GERİ DÖN</button>
          </div>
        </div>
      )}

      {/* NEW GOAL MODAL */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsGoalModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[260px] rounded-[2rem] p-6 relative z-10 shadow-2xl">
            <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-widest">Yeni Hedef</h3>
            <div className="space-y-3">
              <input 
                type="text" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Hedef adı..."
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-[10px] font-bold outline-none"
              />
              <div className="flex gap-1">
                {(['sport', 'academic', 'personal'] as const).map(cat => (
                  <button key={cat} onClick={() => setNewGoalCategory(cat)} className={`flex-1 py-2 rounded-lg text-[7px] font-black uppercase transition-all ${newGoalCategory === cat ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                    {cat === 'sport' ? 'Spor' : cat === 'academic' ? 'Eğitim' : 'Diğer'}
                  </button>
                ))}
              </div>
              <button onClick={addNewGoal} className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg mt-1">OLUŞTUR</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
