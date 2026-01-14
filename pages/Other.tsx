
import React, { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  category: 'sport' | 'academic' | 'personal';
  progress: number;
  isCompleted: boolean;
  deadline?: string;
}

export const Other: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: 'Haftada 4 Gün Antrenman', category: 'sport', progress: 85, isCompleted: false, deadline: '2024-07-20' },
    { id: '2', title: 'Matematik Denemesi Çöz', category: 'academic', progress: 100, isCompleted: true },
    { id: '3', title: 'Her Gün 20 Sayfa Kitap', category: 'personal', progress: 40, isCompleted: false },
    { id: '4', title: 'Su Tüketimi (3L)', category: 'personal', progress: 10, isCompleted: false },
    { id: '5', title: 'Erken Uyanma (07:00)', category: 'personal', progress: 60, isCompleted: false }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllGoalsModalOpen, setIsAllGoalsModalOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<'sport' | 'academic' | 'personal'>('sport');

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, isCompleted: !g.isCompleted, progress: !g.isCompleted ? 100 : 50 } : g
    ));
  };

  const addNewGoal = () => {
    if (!newGoalTitle.trim()) return;
    const newGoal: Goal = {
      id: Math.random().toString(36).substr(2, 9),
      title: newGoalTitle,
      category: newGoalCategory,
      progress: 0,
      isCompleted: false
    };
    setGoals([newGoal, ...goals]);
    setNewGoalTitle('');
    setIsModalOpen(false);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'sport': return '🏆';
      case 'academic': return '📐';
      case 'personal': return '🌱';
      default: return '🎯';
    }
  };

  // Kart Bileşeni
  const GoalCard = ({ goal, compact = true }: { goal: Goal, compact?: boolean }) => (
    <div 
      className={`p-3.5 bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-all relative overflow-hidden flex flex-col gap-2 ${goal.isCompleted ? 'opacity-50' : ''}`}
    >
      <div className="flex justify-between items-center">
        <span className={compact ? "text-base" : "text-xl"}>{getCategoryIcon(goal.category)}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleGoal(goal.id); }}
          className={`rounded-full flex items-center justify-center transition-all ${compact ? 'w-5 h-5' : 'w-7 h-7'} ${goal.isCompleted ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={compact ? "10" : "14"} height={compact ? "10" : "14"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </button>
      </div>
      <h5 className={`font-bold leading-tight line-clamp-2 tracking-tight ${compact ? 'text-[10px]' : 'text-xs'} ${goal.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
        {goal.title}
      </h5>
      <div className="mt-auto space-y-1 pt-1">
        <div className="flex justify-between text-[6px] font-black uppercase tracking-widest text-slate-400">
          <span>İlerleme</span>
          <span>%{goal.progress}</span>
        </div>
        <div className="h-1 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${goal.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
            style={{ width: `${goal.progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-32 px-4 pt-4 transition-colors">
      
      {/* MODAL: HEDEF EKLE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs rounded-[2.5rem] p-8 relative z-10 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tight">Hedef Belirle</h3>
            <div className="space-y-5">
              <input 
                type="text" value={newGoalTitle} onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Örn: 20 sayfa kitap oku"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold outline-none"
              />
              <div className="flex gap-2">
                {(['sport', 'academic', 'personal'] as const).map(cat => (
                  <button
                    key={cat} onClick={() => setNewGoalCategory(cat)}
                    className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase transition-all border ${newGoalCategory === cat ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                  >
                    {cat === 'sport' ? 'Spor' : cat === 'academic' ? 'Eğitim' : 'Kişisel'}
                  </button>
                ))}
              </div>
              <button onClick={addNewGoal} className="w-full bg-slate-900 dark:bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Listeye Ekle</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TÜM HEDEFLER (DETAY) */}
      {isAllGoalsModalOpen && (
        <div className="fixed inset-0 z-[400] bg-white dark:bg-slate-950 flex flex-col page-transition overflow-hidden">
          <header className="px-6 py-6 border-b border-slate-50 dark:border-slate-900 flex items-center justify-between bg-white/95 dark:bg-slate-950/95 backdrop-blur-md sticky top-0">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">Tüm Hedeflerim</h3>
              <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Kişisel Yol Haritan</p>
            </div>
            <button onClick={() => setIsAllGoalsModalOpen(false)} className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar pb-32">
            {goals.map(goal => (
               <div key={goal.id} className="w-full">
                  <GoalCard goal={goal} compact={false} />
               </div>
            ))}
          </div>
        </div>
      )}

      {/* MINIMAL TOP METRICS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex flex-col justify-between group transition-all active:bg-slate-50">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Genel Başarı</span>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">%94</h3>
            <span className="text-[8px] font-bold text-emerald-500 uppercase">+2%</span>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex flex-col justify-between group transition-all active:bg-slate-50">
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sıralama</span>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">#12</h3>
            <span className="text-[8px] font-bold text-slate-400 uppercase">/240</span>
          </div>
        </div>
      </div>

      {/* HEDEFLERİM (2x2 GRID) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-200">HEDEFLERİM</h3>
            <span className="text-[8px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded-full">{goals.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAllGoalsModalOpen(true)}
              className="text-[8px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 rounded-xl active:scale-95 transition-all"
            >
              Tüm Hedeflerim
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-8 h-8 bg-slate-900 dark:bg-slate-800 text-white rounded-xl flex items-center justify-center active:scale-90 transition-transform shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {goals.slice(0, 4).map((goal) => (
            <div key={goal.id} onClick={() => toggleGoal(goal.id)}>
              <GoalCard goal={goal} />
            </div>
          ))}
          {goals.length === 0 && (
            <div className="col-span-2 py-10 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
               <p className="text-[9px] font-black text-slate-300 uppercase">Henüz hedef eklenmedi</p>
            </div>
          )}
        </div>
      </section>

      {/* AI ÖNGÖRÜLERİ */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600 px-1">GELİŞİM ÖNGÖRÜLERİ</h3>
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm">
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-lg shadow-indigo-100 dark:shadow-none animate-pulse">
            ⚡
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Zirve Performans</h4>
            <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Akşam saatlerinde odaklanma %20 daha yüksek.</p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all hover:bg-white dark:hover:bg-slate-900 shadow-sm">
          <div className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-lg shadow-emerald-100 dark:shadow-none">
            🎯
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">Yol Haritası</h4>
            <p className="text-[9px] text-slate-500 leading-tight mt-0.5">3 gün daha devam edersen "7 Günlük Seri" rozetini kazanacaksın.</p>
          </div>
        </div>
      </section>

      {/* YETENEK MATRİSİ (MINIMAL SCALE) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-200">YETENEK SKALASI</h3>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">GÜNCEL DURUM</span>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2.25rem] shadow-sm space-y-5">
          {[
            { label: 'Teknik Kapasite', val: 88, color: 'bg-indigo-600' },
            { label: 'Fiziksel Kondisyon', val: 92, color: 'bg-emerald-500' },
            { label: 'Disiplin & Devam', val: 96, color: 'bg-amber-500' },
            { label: 'Sosyal Etkileşim', val: 74, color: 'bg-rose-500' }
          ].map(skill => (
            <div key={skill.label} className="space-y-1.5">
              <div className="flex justify-between items-center px-0.5">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{skill.label}</span>
                <span className="text-[10px] font-black text-slate-900 dark:text-slate-100">%{skill.val}</span>
              </div>
              <div className="h-0.5 w-full bg-slate-50 dark:bg-slate-800 rounded-full">
                <div 
                  className={`h-full ${skill.color} rounded-full transition-all duration-1000`} 
                  style={{ width: `${skill.val}%` }}
                ></div>
              </div>
            </div>
          ))}
          
          <div className="pt-2 text-center opacity-40">
             <p className="text-[7px] font-bold text-slate-400 uppercase tracking-[0.4em] italic">Eğitimlerle birlikte güncellenir 🚀</p>
          </div>
        </div>
      </section>

    </div>
  );
};
