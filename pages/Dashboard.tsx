
import React, { useState, useMemo } from 'react';
import { UserRole, PaymentStatus, NotificationType, PaymentRecord } from '../types';
import { MOCK_USERS, SHORT_DAYS, MOCK_PAYMENTS, MOCK_COURSES, DAYS } from '../constants';

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
  addNotification?: (n: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  userRole, userName, currentUserId, addNotification
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'activity' | 'goal-form'>('none');
  const [localPayments, setLocalPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  
  // Hedefler ve Sayfalama State'i
  const [localGoals, setLocalGoals] = useState<Goal[]>([
    {
      id: 'g1',
      title: 'Kondisyon Gelişimi',
      category: 'sport',
      tasks: [
        { id: 't1', text: 'Haftalık 3 gün antrenman', isCompleted: true },
        { id: 't2', text: 'Günlük 2L su tüketimi', isCompleted: false },
        { id: 't3', text: 'Esneklik egzersizleri', isCompleted: false }
      ]
    },
    {
      id: 'g2',
      title: 'Akademik Başarı',
      category: 'academic',
      tasks: [
        { id: 't4', text: 'Matematik ödevlerini bitir', isCompleted: true },
        { id: 't5', text: 'Günde 20 sayfa kitap oku', isCompleted: true }
      ]
    },
    {
      id: 'g3',
      title: 'Beslenme Düzeni',
      category: 'personal',
      tasks: [
        { id: 't6', text: 'Fast food tüketme', isCompleted: false },
        { id: 't7', text: 'Protein ağırlıklı beslen', isCompleted: true }
      ]
    }
  ]);

  const [expandedGoalIds, setExpandedGoalIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskTexts, setNewTaskTexts] = useState<Record<string, string>>({});

  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  
  const relevantPayments = useMemo(() => {
    const own = localPayments.filter(p => p.studentId === currentUserId);
    const children = currentUser?.childIds 
      ? localPayments.filter(p => currentUser.childIds?.includes(p.studentId)) 
      : [];
    return [...own, ...children];
  }, [localPayments, currentUser, currentUserId]);

  const hasOverduePayment = relevantPayments.some(p => p.status === PaymentStatus.OVERDUE);
  
  const lastPaymentDate = useMemo(() => {
    const sorted = [...relevantPayments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const upcoming = sorted.find(p => p.status !== PaymentStatus.PAID);
    if (!upcoming) return "Yok";
    const d = new Date(upcoming.dueDate);
    return d.toLocaleDateString('tr-TR');
  }, [relevantPayments]);

  const handlePaymentAction = (method: 'Credit Card' | 'Manual') => {
    const targetPayment = relevantPayments.find(p => p.status === PaymentStatus.OVERDUE || p.status === PaymentStatus.PENDING);
    if (!targetPayment) {
      alert("Şu an ödenmesi gereken bir aidat bulunamadı.");
      setIsPaymentModalOpen(false);
      return;
    }
    const newStatus = method === 'Credit Card' ? PaymentStatus.PAID : PaymentStatus.PENDING;
    setLocalPayments(prev => prev.map(p => 
      p.id === targetPayment.id 
        ? { ...p, status: newStatus, method, paidAt: newStatus === PaymentStatus.PAID ? new Date().toISOString() : undefined } 
        : p
    ));
    if (method === 'Credit Card') alert("Kredi kartı ile ödemeniz başarıyla alındı! ✅");
    else alert("Manuel ödeme bildirimi yapıldı. Yönetici onayından sonra durum güncellenecektir. ⏳");
    setIsPaymentModalOpen(false);
  };

  const handleToggleGoalExpand = (id: string) => {
    setExpandedGoalIds(prev => 
      prev.includes(id) ? prev.filter(gid => gid !== id) : [...prev, id]
    );
  };

  const handleToggleTask = (goalId: string, taskId: string) => {
    setLocalGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        tasks: g.tasks.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t)
      };
    }));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: newGoalTitle,
      category: 'personal',
      tasks: []
    };
    setLocalGoals([newGoal, ...localGoals]);
    setNewGoalTitle('');
    setActiveModal('none');
    setCurrentPage(1); // Yeni eklenince başa dön
  };

  const handleAddTask = (goalId: string) => {
    const text = newTaskTexts[goalId];
    if (!text || !text.trim()) return;
    setLocalGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        tasks: [...g.tasks, { id: `task-${Date.now()}`, text: text, isCompleted: false }]
      };
    }));
    setNewTaskTexts({ ...newTaskTexts, [goalId]: '' });
  };

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Pagination Logic
  const totalPages = Math.ceil(localGoals.length / itemsPerPage);
  const paginatedGoals = localGoals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const RealisticFlame = ({ size = "w-6 h-6", dimmed = false }: { size?: string, dimmed?: boolean }) => (
    <div className={`relative ${size} flex items-center justify-center ${!dimmed ? 'animate-flame-flicker' : 'opacity-20 grayscale'}`}>
      {!dimmed && <div className="absolute inset-0 bg-orange-400 blur-sm opacity-30 rounded-full animate-pulse"></div>}
      <svg viewBox="0 0 24 24" fill="none" className={`w-full h-full ${!dimmed ? 'drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]' : ''}`}>
        <path d="M12 2C12 2 17 7.5 17 13.5C17 16.5 14.76 19 12 19C9.24 19 7 16.5 7 13.5C7 7.5 12 2 12 2Z" fill={!dimmed ? "#F97316" : "#94a3b8"} />
        <path d="M12 7C12 7 15.5 11 15.5 14.5C15.5 16.5 13.93 18 12 18C10.07 18 8.5 16.5 8.5 14.5C8.5 11 12 7 12 7Z" fill={!dimmed ? "#FB923C" : "#cbd5e1"} />
      </svg>
    </div>
  );

  const todayDateObj = new Date();
  const getDayDate = (offset: number) => {
    const d = new Date();
    d.setDate(todayDateObj.getDate() - (6 - offset));
    return d.getDate();
  };

  return (
    <div className="w-full page-transition px-4 space-y-3 overflow-x-hidden pb-32 pt-2 transition-all text-slate-900 dark:text-slate-100 text-left">
      
      <section className="pt-1 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl border border-slate-100 dark:border-slate-800 p-0.5 overflow-hidden">
            <img src={currentUser?.avatar} className="w-full h-full object-cover rounded-lg" alt="" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight leading-none">Merhaba, {userName.split(' ')[0]}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-[7px] font-bold uppercase tracking-widest mt-0.5">{userRole}</p>
          </div>
        </div>
      </section>

      <div className="flex gap-2">
        <button onClick={() => setIsQRModalOpen(true)} className="flex-[2] bg-indigo-600 p-4 rounded-[2rem] flex items-center justify-between shadow-xl active:scale-[0.98] transition-all border border-white/10">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </div>
            <div className="text-left">
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">DİJİTAL KİMLİK</h4>
              <p className="text-[7px] text-white/60 font-bold mt-1 uppercase tracking-tighter">QR KODU GÖSTER</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/40"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <button onClick={() => setIsPaymentModalOpen(true)} className={`flex-1 bg-white dark:bg-slate-900 p-3 rounded-[2rem] flex items-center justify-center border-2 shadow-sm active:scale-[0.98] transition-all ${hasOverduePayment ? 'border-rose-500 animate-pulse' : 'border-slate-50 dark:border-slate-800'}`}>
          <div className="flex flex-col items-center gap-0.5 text-center">
            <div className={`w-8 h-8 ${hasOverduePayment ? 'bg-rose-500 shadow-rose-200' : 'bg-emerald-500 shadow-emerald-200'} rounded-xl flex items-center justify-center text-white shadow-lg mb-0.5 font-black text-base`}>₺</div>
            <h4 className={`text-[8px] font-black uppercase tracking-widest leading-none ${hasOverduePayment ? 'text-rose-500' : 'text-slate-900 dark:text-slate-100'}`}>AİDAT ÖDE</h4>
            <p className="text-[5px] text-slate-400 font-bold uppercase mt-1">{lastPaymentDate}</p>
          </div>
        </button>
      </div>

      <section className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-[2rem] border border-slate-100 dark:border-slate-800/40 space-y-3">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">AKTİVİTE YOĞUNLUĞU</h3>
           <button onClick={() => setActiveModal('activity')} className="text-[7px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg transition-transform active:scale-90">Detay</button>
        </div>
        <div className="flex justify-between gap-1.5 px-0.5">
          {[true, true, false, true, true, false, true].map((attended, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
              <span className={`text-[8px] font-black leading-none ${attended ? 'text-slate-900 dark:text-slate-100' : 'text-slate-300'}`}>{getDayDate(i)}</span>
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${attended ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 shadow-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 opacity-40'}`}>
                {attended ? <RealisticFlame size="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>}
              </div>
              <span className="text-[6px] font-black text-slate-400 uppercase tracking-tighter">{SHORT_DAYS[i === 6 ? 0 : i + 1]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HEDEFLERİM BÖLÜMÜ (PAGINATED & COLLAPSIBLE) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">HEDEFLERİM</h3>
           <button onClick={() => setActiveModal('goal-form')} className="text-[7px] font-black text-indigo-600 uppercase bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg">+ Yeni Hedef</button>
        </div>
        
        <div className="space-y-2">
          {paginatedGoals.map(goal => {
            const progress = calculateProgress(goal.tasks);
            const isExpanded = expandedGoalIds.includes(goal.id);
            return (
              <div key={goal.id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
                {/* Header (Click to Toggle) */}
                <button 
                  onClick={() => handleToggleGoalExpand(goal.id)}
                  className="w-full p-4 flex items-center justify-between text-left group"
                >
                   <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0 ${goal.category === 'sport' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
                         {goal.category === 'sport' ? '⚽' : goal.category === 'academic' ? '📚' : '🎯'}
                      </div>
                      <div className="min-w-0">
                         <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{goal.title}</h4>
                         <div className="flex items-center gap-2 mt-1">
                            <div className="h-1 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-[6px] font-black text-indigo-600">%{progress}</span>
                         </div>
                      </div>
                   </div>
                   <div className={`w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"/></svg>
                   </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5 pt-1">
                      {goal.tasks.map(task => (
                        <button 
                          key={task.id} 
                          onClick={() => handleToggleTask(goal.id, task.id)}
                          className="w-full flex items-center gap-2.5 py-1 text-left group"
                        >
                          <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'}`}>
                            {task.isCompleted && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <span className={`text-[9px] font-bold flex-1 transition-all ${task.isCompleted ? 'text-slate-300 line-through' : 'text-slate-600 dark:text-slate-300'}`}>
                            {task.text}
                          </span>
                        </button>
                      ))}
                    </div>
                    
                    {/* Add Task Input */}
                    <div className="flex gap-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                      <input 
                        type="text" 
                        value={newTaskTexts[goal.id] || ''}
                        onChange={(e) => setNewTaskTexts({ ...newTaskTexts, [goal.id]: e.target.value })}
                        placeholder="Yeni görev..."
                        className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl px-3 py-2 text-[8px] font-bold outline-none focus:border-indigo-300 transition-colors"
                      />
                      <button 
                        onClick={() => handleAddTask(goal.id)}
                        className="w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center active:scale-90 transition-all shadow-md"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 disabled:opacity-30 active:scale-90 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-6 h-6 rounded-lg text-[8px] font-black transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 disabled:opacity-30 active:scale-90 transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        )}
      </section>

      {/* --- MODALLAR --- */}

      {/* AKTİVİTE TAKVİMİ MODALI */}
      {activeModal === 'activity' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[360px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest leading-none">AYLIK AKTİVİTE</h3>
                <button onClick={() => setActiveModal('none')} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl active:scale-90 transition-transform"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
             </div>

             <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
                  <span key={d} className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
                ))}
             </div>
             
             <div className="grid grid-cols-7 gap-2 text-center">
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const hasCourse = [2, 5, 9, 12, 16, 19, 23, 26].includes(dayNum);
                  const isAttended = hasCourse && (dayNum === 2 || dayNum === 9 || dayNum === 12);
                  const isToday = dayNum === 15;
                  
                  return (
                    <div key={i} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all ${isAttended ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-100 shadow-sm' : isToday ? 'border-indigo-600 bg-indigo-50/20' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'}`}>
                       <span className={`text-[8px] font-black ${hasCourse ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'} ${isToday ? 'text-indigo-600 font-black scale-110' : ''}`}>{dayNum}</span>
                       {hasCourse && <RealisticFlame size="w-3.5 h-3.5" dimmed={!isAttended} />}
                    </div>
                  );
                })}
             </div>

             <div className="mt-8 flex justify-center gap-4 text-[7px] font-black uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-orange-400 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div><span>KATILDI</span></div>
                <div className={`flex items-center gap-1.5 opacity-40`}><div className="w-2 h-2 bg-slate-400 rounded-full"></div><span>GELECEK / YOK</span></div>
             </div>
          </div>
        </div>
      )}

      {/* YENİ HEDEF MODALI */}
      {activeModal === 'goal-form' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <form onSubmit={handleAddGoal} className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-widest text-center mb-8">YENİ HEDEF TANIMLA</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">HEDEF BAŞLIĞI</label>
                   <input 
                     required 
                     type="text" 
                     value={newGoalTitle} 
                     onChange={(e) => setNewGoalTitle(e.target.value)}
                     placeholder="Örn: Hafta sonu maratonu" 
                     className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700 focus:border-indigo-400 transition-colors" 
                   />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2 active:scale-95 transition-transform">HEDEFİ OLUŞTUR</button>
             </div>
          </form>
        </div>
      )}

      {/* DİJİTAL KİMLİK MODALI */}
      {isQRModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg" onClick={() => setIsQRModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95">
             <div className="w-16 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto mb-6"></div>
             <h3 className="text-xs font-black uppercase tracking-widest mb-1">DİJİTAL KİMLİK</h3>
             <p className="text-[8px] font-bold text-slate-400 uppercase mb-8">{userName}</p>
             <div className="relative p-6 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] inline-block mb-8 border-2 border-dashed border-indigo-200 dark:border-indigo-900">
                <div className="w-48 h-48 bg-white p-4 rounded-3xl flex items-center justify-center shadow-inner">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${currentUserId}&color=4f46e5`} className="w-full h-full" alt="QR" />
                </div>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-indigo-600 rounded-tl-3xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-indigo-600 rounded-br-3xl"></div>
             </div>
             <p className="text-[9px] font-medium text-slate-400 px-6 leading-relaxed mb-8 italic text-center">Girişlerde ve yoklamalarda bu QR kodu göstererek hızlıca işlem yapabilirsiniz.</p>
             <button onClick={() => setIsQRModalOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">KAPAT</button>
          </div>
        </div>
      )}

      {/* ÖDEME SEÇENEKLERİ MODALI */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-lg" onClick={() => setIsPaymentModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-widest text-center mb-8">ÖDEME YÖNTEMİ SEÇİN</h3>
             <div className="space-y-3">
                <button onClick={() => handlePaymentAction('Credit Card')} className="w-full p-5 bg-indigo-600 rounded-3xl text-white flex items-center gap-4 shadow-xl active:scale-95 transition-all">
                   <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                   </div>
                   <div className="text-left">
                      <h4 className="text-[11px] font-black uppercase tracking-widest leading-none">KREDİ KARTI</h4>
                      <p className="text-[7px] text-white/60 font-bold mt-1 uppercase">Anında Onaylanır</p>
                   </div>
                </button>
                <button onClick={() => handlePaymentAction('Manual')} className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl text-slate-900 dark:text-white flex items-center gap-4 border border-slate-100 dark:border-slate-700 active:scale-95 transition-all">
                   <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20m-5-17h10a4 4 0 1 1 0 8H7a4 4 0 1 0 0 8h10"/></svg>
                   </div>
                   <div className="text-left">
                      <h4 className="text-[11px] font-black uppercase tracking-widest leading-none">HAVALE / EFT</h4>
                      <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">Yönetici Onayı Bekler</p>
                   </div>
                </button>
             </div>
             <button onClick={() => setIsPaymentModalOpen(false)} className="w-full mt-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">Vazgeç</button>
          </div>
        </div>
      )}
    </div>
  );
};
