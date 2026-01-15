
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
  const isStudent = userRole === UserRole.STUDENT;
  
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
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
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

    const newTask: Task = {
      id: `task-${Date.now()}`,
      text: text.trim(),
      isCompleted: false
    };

    setGoals(prev => prev.map(g => g.id === goalId ? { ...g, tasks: [...g.tasks, newTask] } : g));
    setNewTaskTexts(prev => ({ ...prev, [goalId]: '' }));
  };

  const deleteTask = (goalId: string, taskId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        return {
          ...g,
          tasks: g.tasks.filter(t => t.id !== taskId)
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

  const handleOpenAddGoal = () => {
    setEditingGoalId(null);
    setGoalForm({ title: '', category: 'sport' });
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setGoalForm({ title: goal.title, category: goal.category });
    setIsGoalModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Bu hedefi silmek istediğinize emin misiniz?')) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  const handleSaveGoal = () => {
    if (!goalForm.title.trim()) return;

    if (editingGoalId) {
      setGoals(prev => prev.map(g => g.id === editingGoalId ? { ...g, title: goalForm.title, category: goalForm.category } : g));
    } else {
      const newGoal: Goal = {
        id: Math.random().toString(36).substr(2, 9),
        title: goalForm.title,
        category: goalForm.category,
        tasks: []
      };
      setGoals([newGoal, ...goals]);
    }
    setIsGoalModalOpen(false);
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
    <div className="w-full page-transition px-4 space-y-3 overflow-x-hidden pb-24 pt-2 transition-all">
      
      <section className="pt-1 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl border border-slate-100 dark:border-slate-800 p-0.5 overflow-hidden">
            <img src={currentUser?.avatar} className="w-full h-full object-cover rounded-lg" alt="" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Merhaba, {userName.split(' ')[0]}</h2>
            <p className="text-indigo-600 dark:text-indigo-400 text-[7px] font-bold uppercase tracking-widest mt-0.5">{userRole}</p>
          </div>
        </div>
      </section>

      <button 
        onClick={() => setIsQRModalOpen(true)}
        className={`w-full ${isStudent ? 'bg-indigo-600' : 'bg-slate-900 dark:bg-slate-800'} p-3 rounded-2xl flex items-center justify-between active:scale-[0.98] transition-all shadow-xl relative overflow-hidden group`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/10 group-active:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div className="text-left">
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
              {isStudent ? 'DERS YOKLAMASINA KATIL' : 'Dijital Kimliğim'}
            </h4>
            <p className="text-[7px] text-white/50 font-bold mt-1 uppercase tracking-tight">
              {isStudent ? 'Derse Giriş Yapmak İçin Tıkla' : 'QR Kod Göster'}
            </p>
          </div>
        </div>
        <div className="w-6 h-6 bg-white/5 rounded-full flex items-center justify-center text-white/40 border border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </button>

      {isQRModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsQRModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[280px] rounded-[3rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 text-center animate-in zoom-in-95 duration-500">
            <div className="mb-6">
              <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest mb-1">
                {isStudent ? 'YOKLAMA KİMLİĞİ' : 'DİJİTAL KİMLİK'}
              </h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{currentUser?.name}</p>
            </div>
            
            <div className="aspect-square w-full bg-slate-50 dark:bg-slate-800 rounded-3xl p-4 flex flex-col gap-2 relative overflow-hidden mb-6 border border-slate-100 dark:border-slate-800">
               <div className="flex-1 grid grid-cols-4 grid-rows-4 gap-2 opacity-80">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={`rounded-sm ${[0,1,4,5,2,3,6,7,12,13,15].includes(i) ? 'bg-slate-900 dark:bg-white' : 'bg-transparent'}`}></div>
                  ))}
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl border-4 border-slate-50 dark:border-slate-800 flex items-center justify-center shadow-lg">
                    {isStudent ? (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    ) : (
                       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-indigo-600"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                    )}
                  </div>
               </div>
               <div className={`absolute inset-0 border-2 ${isStudent ? 'border-emerald-500/20' : 'border-indigo-600/20'} rounded-3xl pointer-events-none`}></div>
            </div>

            <p className="text-[7px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 leading-relaxed">
              {isStudent ? 'ANTRENÖRE OKUTARAK DERSE GİRİŞİNİZİ TAMAMLAYIN' : 'OKUTARAK DERS GİRİŞİ YAPIN'}
            </p>
            <button 
              onClick={() => setIsQRModalOpen(false)} 
              className={`w-full py-4 ${isStudent ? 'bg-emerald-600' : 'bg-slate-900 dark:bg-indigo-600'} text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all`}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <section className="bg-slate-50 dark:bg-slate-900/30 p-3 rounded-[1.75rem] border border-slate-100 dark:border-slate-800/40 space-y-2">
        <div className="flex justify-between items-center px-1">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">AKTİVİTE YOĞUNLUĞU</h3>
           <button onClick={() => setActiveModal('activity')} className="text-[7px] font-black text-indigo-600 dark:text-indigo-400 uppercase bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">Detay</button>
        </div>
        <div className="flex justify-between gap-1.5">
          {activityData.map((attended, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all ${attended ? 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200/50 dark:border-orange-500/20' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-40'}`}>
                {attended ? <RealisticFlame size="w-4 h-4" /> : <div className="w-1 h-1 rounded-full bg-slate-300"></div>}
              </div>
              <span className="text-[6px] font-black text-slate-400 uppercase">{SHORT_DAYS[i === 6 ? 0 : i + 1]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between px-1 mb-0.5">
          <h3 className="text-[8px] font-black uppercase tracking-widest text-slate-400 leading-none">HEDEFLERİM</h3>
          <button onClick={handleOpenAddGoal} className="w-5 h-5 bg-indigo-600 text-white rounded-lg flex items-center justify-center active:scale-90 transition-all shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        <div className="space-y-2">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.tasks);
            const isExpanded = expandedGoalId === goal.id;
            
            return (
              <div key={goal.id} className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-1 ring-indigo-500/20 shadow-md' : 'shadow-sm'}`}>
                <div className="flex items-center pr-2">
                  <button onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)} className="flex-1 p-2.5 flex items-center gap-2.5 text-left min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${progress === 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                      {goal.category === 'sport' ? '⚽' : goal.category === 'academic' ? '📚' : '🌱'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-100 truncate leading-none">{goal.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1 flex-1 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                        </div>
                        <span className="text-[6px] font-black text-slate-400 shrink-0">%{progress}</span>
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <button onClick={(e) => { e.stopPropagation(); handleOpenEditGoal(goal); }} className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-indigo-600 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }} className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <div className="h-px bg-slate-50 dark:bg-slate-800 w-full mb-1"></div>
                    {goal.tasks.length > 0 ? goal.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between group/task">
                        <div className="flex items-center gap-2">
                           <button onClick={() => toggleTask(goal.id, task.id)} className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${task.isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-200 dark:border-slate-700'}`}>
                             {task.isCompleted && <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                           </button>
                           <span className={`text-[9px] font-medium transition-all ${task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-300'}`}>{task.text}</span>
                        </div>
                        <button 
                          onClick={() => deleteTask(goal.id, task.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover/task:opacity-100 transition-opacity"
                        >
                           <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    )) : (
                      <p className="text-[8px] font-medium text-slate-400 italic py-2">Henüz görev eklenmemiş.</p>
                    )}
                    
                    <div className="pt-2 flex gap-2">
                       <input 
                         type="text"
                         value={newTaskTexts[goal.id] || ''}
                         onChange={(e) => setNewTaskTexts(prev => ({ ...prev, [goal.id]: e.target.value }))}
                         onKeyDown={(e) => e.key === 'Enter' && addTask(goal.id)}
                         placeholder="+ Yeni görev ekle..."
                         className="flex-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-2.5 py-1.5 text-[8px] font-bold outline-none border border-transparent focus:border-indigo-500/30"
                       />
                       <button 
                         onClick={() => addTask(goal.id)}
                         className="px-3 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all"
                       >
                         EKLE
                       </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {isGoalModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsGoalModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[280px] rounded-[2.5rem] p-6 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[10px] font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase leading-none">{editingGoalId ? 'HEDEFİ DÜZENLE' : 'YENİ HEDEF EKLE'}</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="w-6 h-6 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 flex items-center justify-center active:scale-90 transition-all">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">HEDEF BAŞLIĞI</label>
                <input 
                  type="text" 
                  value={goalForm.title} 
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })} 
                  placeholder="Örn: Haftalık Koşu"
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl px-4 py-3 text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KATEGORİ</label>
                <div className="flex gap-2">
                  {(['sport', 'academic', 'personal'] as const).map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setGoalForm({ ...goalForm, category: cat })}
                      className={`flex-1 py-2.5 rounded-xl border text-[8px] font-black uppercase transition-all ${goalForm.category === cat ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}
                    >
                      {cat === 'sport' ? 'Spor' : cat === 'academic' ? 'Eğitim' : 'Kişisel'}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleSaveGoal}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all mt-2"
              >
                {editingGoalId ? 'GÜNCELLE' : 'HEDEFİ OLUŞTUR'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'activity' && (
        <div className="fixed inset-0 z-[300] flex flex-col bg-white dark:bg-slate-950 animate-in slide-in-from-bottom duration-500">
          <header className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-900">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest leading-none">AKTİVİTE YOĞUNLUĞU</h3>
              <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase tracking-[0.2em]">HAZİRAN 2024</p>
            </div>
            <button onClick={() => setActiveModal('none')} className="w-8 h-8 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            <div className="bg-orange-50/50 dark:bg-orange-500/5 p-4 rounded-[1.75rem] border border-orange-100 dark:border-orange-500/10 text-center shadow-sm">
               <span className="text-[7px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-[0.2em]">BU AY AKTİF KATILIM</span>
               <div className="flex items-center justify-center gap-2 mt-1">
                  <RealisticFlame size="w-8 h-8" />
                  <span className="text-3xl font-black text-slate-900 dark:white leading-none">14</span>
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">GÜN</span>
               </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-7 gap-1 text-center">
                 {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((d, i) => (
                   <span key={i} className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">{d}</span>
                 ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {monthlyActivity.map((item) => (
                  <div 
                    key={item.day} 
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all duration-300 border ${
                      item.attended 
                        ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200/50 dark:border-orange-500/20 shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800'
                    }`}
                  >
                    <span className={`text-[7px] font-black absolute top-1 left-1 ${
                      item.attended ? 'text-orange-400 dark:text-orange-500' : 'text-slate-300 dark:text-slate-700'
                    }`}>{item.day}</span>
                    {item.attended && <div className="mt-1"><RealisticFlame size="w-3 h-3" /></div>}
                  </div>
                ))}
              </div>
            </div>
            
            <button onClick={() => setActiveModal('none')} className="w-full py-3.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl font-black text-[8px] uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">GERİ DÖN</button>
          </div>
        </div>
      )}

    </div>
  );
};
