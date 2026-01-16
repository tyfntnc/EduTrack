
import React, { useState, useMemo } from 'react';
import { UserRole, PaymentStatus, NotificationType } from '../types';
import { MOCK_USERS, SHORT_DAYS, MOCK_PAYMENTS } from '../constants';

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
  const [activeModal, setActiveModal] = useState<'none' | 'activity' | 'goal'>('none');
  
  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  const isStudent = userRole === UserRole.STUDENT;
  const isParent = userRole === UserRole.PARENT;
  
  const relevantPayments = useMemo(() => {
    if (isParent && currentUser?.childIds) {
      return MOCK_PAYMENTS.filter(p => currentUser.childIds?.includes(p.studentId));
    }
    if (isStudent) {
      return MOCK_PAYMENTS.filter(p => p.studentId === currentUserId);
    }
    return [];
  }, [isParent, isStudent, currentUser, currentUserId]);

  const hasOverduePayment = relevantPayments.some(p => p.status === PaymentStatus.OVERDUE);
  
  // En yakın ödeme tarihini bul
  const lastPaymentDate = useMemo(() => {
    const sorted = [...relevantPayments].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    const upcoming = sorted.find(p => p.status !== PaymentStatus.PAID);
    if (!upcoming) return "Yok";
    const d = new Date(upcoming.dueDate);
    return d.toLocaleDateString('tr-TR');
  }, [relevantPayments]);

  const [goals, setGoals] = useState<Goal[]>([
    { 
      id: '1', 
      title: 'Haftalık Antrenman Programı', 
      category: 'sport', 
      tasks: [
        { id: 't1', text: 'Pazartesi: Kondisyon', isCompleted: true },
        { id: 't2', text: 'Çarşamba: Teknik Çalışma', isCompleted: true },
        { id: 't3', text: 'Cuma: Taktik Maç', isCompleted: false },
      ]
    },
    {
      id: '2',
      title: 'Matematik Olimpiyat Hazırlığı',
      category: 'academic',
      tasks: [
        { id: 't4', text: 'Türev Problemleri Çöz', isCompleted: false },
        { id: 't5', text: 'Deneme Sınavı Yap', isCompleted: false }
      ]
    }
  ]);

  const [goalForm, setGoalForm] = useState<{ title: string, category: 'sport' | 'academic' | 'personal' }>({
    title: '',
    category: 'sport'
  });
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [newTaskTexts, setNewTaskTexts] = useState<Record<string, string>>({});

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

  const addTask = (goalId: string) => {
    const text = newTaskTexts[goalId];
    if (!text?.trim()) return;
    const newTask: Task = { id: `task-${Date.now()}`, text: text.trim(), isCompleted: false };
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, tasks: [...g.tasks, newTask] } : g));
    setNewTaskTexts(prev => ({ ...prev, [goalId]: '' }));
  };

  const deleteTask = (e: React.MouseEvent, goalId: string, taskId: string) => {
    e.stopPropagation();
    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, tasks: g.tasks.filter(t => t.id !== taskId) } : g));
  };

  const handleOpenAddGoal = () => {
    setGoalForm({ title: '', category: 'sport' });
    setActiveModal('goal');
  };

  const handleSaveGoal = () => {
    if (!goalForm.title.trim()) return;
    const newGoal: Goal = { id: Math.random().toString(36).substr(2, 9), title: goalForm.title, category: goalForm.category, tasks: [] };
    setGoals([newGoal, ...goals]);
    setActiveModal('none');
  };

  const calculateProgress = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.isCompleted).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const handlePayment = (method: 'Card' | 'Manual') => {
    alert(method === 'Card' ? 'Ödeme başarıyla tamamlandı! ✅' : 'Ödeme bildirimi yöneticiye iletildi, onay bekleniyor. ⏳');
    setIsPaymentModalOpen(false);
  };

  const RealisticFlame = ({ size = "w-6 h-6", opacity = "1" }: { size?: string, opacity?: string }) => (
    <div className={`relative ${size} flex items-center justify-center animate-flame-flicker`} style={{ opacity }}>
      <div className="absolute inset-0 bg-orange-400 blur-sm opacity-30 rounded-full animate-pulse"></div>
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-[0_0_4px_rgba(249,115,22,0.6)]">
        <path d="M12 2C12 2 17 7.5 17 13.5C17 16.5 14.76 19 12 19C9.24 19 7 16.5 7 13.5C7 7.5 12 2 12 2Z" fill="#F97316" />
        <path d="M12 7C12 7 15.5 11 15.5 14.5C15.5 16.5 13.93 18 12 18C10.07 18 8.5 16.5 8.5 14.5C8.5 11 12 7 12 7Z" fill="#FB923C" />
      </svg>
    </div>
  );

  const todayDateObj = new Date();
  const getDayDate = (offset: number) => {
    const d = new Date();
    d.setDate(todayDateObj.getDate() - (6 - offset));
    return d.getDate();
  };

  const recentActivities = [
    { date: '12 Haz Çar', time: '16:00 - 18:00', title: 'U19 Futbol Elit', point: 9.2 },
    { date: '10 Haz Pzt', time: '16:00 - 18:00', title: 'U19 Futbol Elit', point: 8.5 },
    { date: '08 Haz Cmt', time: '10:00 - 12:00', title: 'Matematik İleri', point: 7.8 },
    { date: '05 Haz Çar', time: '16:00 - 18:00', title: 'U19 Futbol Elit', point: 9.0 },
  ];

  return (
    <div className="w-full page-transition px-4 space-y-3 overflow-x-hidden pb-32 pt-2 transition-all text-slate-900 dark:text-slate-100">
      
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

      {/* Button Container - 2/3 vs 1/3 Ratio */}
      <div className="flex gap-2">
        <button 
          onClick={() => setIsQRModalOpen(true)}
          className={`flex-[2] ${isStudent ? 'bg-indigo-600' : 'bg-slate-900 dark:bg-slate-800'} p-3 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all shadow-xl relative overflow-hidden group`}
        >
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-white">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="text-left">
              <h4 className="text-[8px] font-black text-white uppercase tracking-widest leading-none">DİJİTAL KİMLİK</h4>
              <p className="text-[6px] text-white/50 font-bold mt-1 uppercase">QR KOD GÖSTER</p>
            </div>
          </div>
        </button>

        {(isParent || isStudent) && (
          <button 
            onClick={() => setIsPaymentModalOpen(true)}
            className={`flex-1 bg-white dark:bg-slate-900 p-3 rounded-2xl flex items-center justify-center border-2 active:scale-[0.98] transition-all shadow-sm relative overflow-hidden group ${hasOverduePayment ? 'border-rose-500 animate-pulse' : 'border-slate-50 dark:border-slate-800'}`}
          >
            <div className="flex flex-col items-center gap-0.5 relative z-10">
              <div className={`w-6 h-6 ${hasOverduePayment ? 'bg-rose-500' : 'bg-emerald-500'} rounded-lg flex items-center justify-center text-white shadow-lg mb-0.5 font-black text-sm`}>
                ₺
              </div>
              <h4 className={`text-[7px] font-black uppercase tracking-widest leading-none ${hasOverduePayment ? 'text-rose-500' : 'text-slate-900 dark:text-slate-100'}`}>AİDAT ÖDE</h4>
              <p className="text-[5px] text-slate-400 font-bold uppercase tracking-tighter mt-1">Son: {lastPaymentDate}</p>
            </div>
          </button>
        )}
      </div>

      <section className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-[1.75rem] border border-slate-100 dark:border-slate-800/40 space-y-3">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">AKTİVİTE YOĞUNLUĞU</h3>
           <button onClick={() => setActiveModal('activity')} className="text-[7px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg active:scale-95 transition-all shadow-sm">Detay</button>
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

      <section className="space-y-2">
        <div className="flex items-center justify-between px-1 mb-0.5">
          <h3 className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">HEDEFLERİM</h3>
          <button onClick={handleOpenAddGoal} className="w-6 h-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg active:scale-90 transition-transform"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
        </div>
        <div className="space-y-2">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.tasks);
            const isExpanded = expandedGoalId === goal.id;
            return (
              <div key={goal.id} className={`bg-white dark:bg-slate-900 border transition-all duration-300 overflow-hidden shadow-sm ${isExpanded ? 'rounded-[2rem] border-indigo-100 dark:border-indigo-900/50 ring-1 ring-indigo-500/5' : 'rounded-2xl border-slate-100 dark:border-slate-800'}`}>
                <button 
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)} 
                  className="w-full p-3 flex items-center gap-3 text-left"
                >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${goal.category === 'sport' ? 'bg-orange-50 dark:bg-orange-950/30' : goal.category === 'academic' ? 'bg-blue-50 dark:bg-blue-950/30' : 'bg-pink-50 dark:bg-pink-950/30'}`}>
                      {goal.category === 'sport' ? '⚽' : goal.category === 'academic' ? '📐' : '🎯'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[11px] font-bold truncate leading-none">{goal.title}</h4>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-md ${progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>%{progress}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 rounded-full ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 flex items-center justify-center text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-4 pt-2 space-y-2 border-t border-slate-50 dark:border-slate-800/50 animate-in slide-in-from-top-2 duration-300">
                    {goal.tasks.map(task => (
                      <div key={task.id} className="group flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <button onClick={() => toggleTask(goal.id, task.id)} className="flex items-center gap-3 flex-1 text-left">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${task.isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'}`}>
                            {task.isCompleted && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                          </div>
                          <span className={`text-[10px] font-bold transition-all ${task.isCompleted ? 'text-slate-400 line-through' : ''}`}>{task.text}</span>
                        </button>
                        <button onClick={(e) => deleteTask(e, goal.id, task.id)} className="w-7 h-7 flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2 pt-2">
                      <input type="text" value={newTaskTexts[goal.id] || ''} onChange={(e) => setNewTaskTexts({...newTaskTexts, [goal.id]: e.target.value})} onKeyPress={(e) => e.key === 'Enter' && addTask(goal.id)} placeholder="Hızlı görev ekle..." className="flex-1 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 text-[10px] font-bold outline-none" />
                      <button onClick={() => addTask(goal.id)} className="w-9 h-9 bg-slate-900 dark:bg-slate-800 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg></button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Activity Detail Modal with Date/Time List */}
      {activeModal === 'activity' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] max-h-[85vh] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6 shrink-0">
                <h3 className="text-xs font-black uppercase tracking-widest">AKTİVİTE ANALİZİ</h3>
                <button onClick={() => setActiveModal('none')} className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
             </div>
             
             <div className="overflow-y-auto no-scrollbar space-y-6 flex-1 pr-1">
                {/* Heatmap with Day Numbers */}
                <div className="grid grid-cols-7 gap-1">
                   {Array.from({length: 28}).map((_, i) => {
                     const isAttended = Math.random() > 0.4;
                     return (
                       <div key={i} className={`aspect-square rounded-lg flex items-center justify-center relative transition-all ${isAttended ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.3)] scale-90' : 'bg-slate-100 dark:bg-slate-800 opacity-30'}`}>
                         <span className={`text-[7px] font-black ${isAttended ? 'text-white' : 'text-slate-400'}`}>{i + 1}</span>
                         {isAttended && <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full animate-pulse"></div>}
                       </div>
                     );
                   })}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">BU AY</span>
                      <p className="text-xl font-black">18 <span className="text-[8px] font-bold text-slate-400">Ders</span></p>
                   </div>
                   <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">GELİŞİM</span>
                      <p className="text-xl font-black text-emerald-500">+%12</p>
                   </div>
                </div>

                <div className="space-y-2">
                   <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">SON KATILIMLAR</h4>
                   <div className="space-y-1.5">
                      {recentActivities.map((act, i) => (
                        <div key={i} className="bg-white dark:bg-slate-950 border border-slate-50 dark:border-slate-800 p-2.5 rounded-2xl flex items-center gap-3">
                           <div className="flex flex-col items-center justify-center w-10 py-1 bg-slate-50 dark:bg-slate-800 rounded-xl shrink-0">
                              <span className="text-[9px] font-black leading-none">{act.date.split(' ')[0]}</span>
                              <span className="text-[6px] font-bold text-slate-400 uppercase mt-0.5">{act.date.split(' ')[1]}</span>
                           </div>
                           <div className="flex-1 min-w-0">
                              <h5 className="text-[9px] font-bold truncate">{act.title}</h5>
                              <p className="text-[7px] font-medium text-slate-400 uppercase tracking-tight">{act.time}</p>
                           </div>
                           <div className="text-[8px] font-black text-orange-500 bg-orange-50 dark:bg-orange-500/10 px-2 py-1 rounded-lg">
                              {act.point}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <p className="text-[9px] font-medium text-slate-400 leading-relaxed text-center italic py-2">"Haziran ayı katılım disiplinin oldukça yüksek. Bu tempo seni başarıya ulaştıracak!"</p>
             </div>
             <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-6 shrink-0 active:scale-95 transition-all">PANELE DÖN</button>
          </div>
        </div>
      )}

      {/* Goal Add Modal */}
      {activeModal === 'goal' && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[320px] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-widest mb-6">YENİ HEDEF EKLE</h3>
             <div className="space-y-4">
                <input type="text" value={goalForm.title} onChange={(e) => setGoalForm({...goalForm, title: e.target.value})} placeholder="Hedef Başlığı" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[11px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <div className="flex gap-2">
                    {['sport', 'academic', 'personal'].map(cat => (
                      <button key={cat} onClick={() => setGoalForm({...goalForm, category: cat as any})} className={`flex-1 py-3 rounded-2xl text-[8px] font-black uppercase tracking-widest border transition-all ${goalForm.category === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                        {cat === 'sport' ? 'SPOR' : cat === 'academic' ? 'DERS' : 'ŞAHSİ'}
                      </button>
                    ))}
                </div>
                <button onClick={handleSaveGoal} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg mt-2">HEDEFİ OLUŞTUR</button>
             </div>
          </div>
        </div>
      )}

      {/* Payment and QR Modal remains same */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsPaymentModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[300px] rounded-[3rem] p-7 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-300">
            <h3 className="text-xs font-black uppercase tracking-widest mb-2">AİDAT ÖDEMESİ</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-6">Ödeme yöntemi seçerek işlemi tamamlayın.</p>
            <div className="space-y-3">
              <button onClick={() => handlePayment('Card')} className="w-full p-4 bg-indigo-600 text-white rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                <span className="text-[9px] font-black uppercase tracking-widest">KREDİ KARTI (HIZLI)</span>
              </button>
              <button onClick={() => handlePayment('Manual')} className="w-full p-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center gap-3 border border-slate-100 dark:border-slate-700 active:scale-95 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span className="text-[9px] font-black uppercase tracking-widest">NAKİT / EFT BİLDİR</span>
              </button>
            </div>
            <button onClick={() => setIsPaymentModalOpen(false)} className="mt-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">Vazgeç</button>
          </div>
        </div>
      )}

      {isQRModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsQRModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[280px] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-500">
            <h3 className="text-xs font-black uppercase tracking-widest mb-1">DİJİTAL KİMLİK</h3>
            <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 flex flex-col gap-2 relative overflow-hidden mb-6 mt-4 border border-slate-100 dark:border-slate-800">
               <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-2 opacity-80">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={`rounded-sm ${[0,1,4,5,2,3,6,7,12,13,15].includes(i) ? 'bg-slate-900 dark:bg-white' : 'bg-transparent'}`}></div>
                  ))}
               </div>
            </div>
            <button onClick={() => setIsQRModalOpen(false)} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg">Kapat</button>
          </div>
        </div>
      )}

    </div>
  );
};
