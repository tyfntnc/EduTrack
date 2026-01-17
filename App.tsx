
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, Notification, User, NotificationType, Course, IndividualLesson, PaymentStatus, PaymentRecord } from './types.ts';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AdminPanel } from './pages/AdminPanel.tsx';
import { Attendance } from './pages/Attendance.tsx';
import { Notifications } from './pages/Notifications.tsx';
import { Calendar } from './pages/Calendar.tsx';
import { Other } from './pages/Other.tsx';
import { Actions } from './pages/Actions.tsx';
import { CourseDetail } from './pages/CourseDetail.tsx';
// Fix: Import Profile component from pages/Profile.tsx
import { Profile } from './pages/Profile.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { ForgotPassword } from './pages/ForgotPassword.tsx';
import { MOCK_USERS, MOCK_COURSES, MOCK_PAYMENTS, MOCK_NOTIFICATIONS } from './constants.tsx';

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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLanding, setShowLanding] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const [actingUserId, setActingUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'lite' | 'dark'>((localStorage.getItem('theme') as 'lite' | 'dark') || 'lite');

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [individualLessons, setIndividualLessons] = useState<IndividualLesson[]>([]);
  const [goals, setGoals] = useState<Goal[]>([
    { id: 'g1', title: 'Kondisyon Gelişimi', category: 'sport', tasks: [{ id: 't1', text: 'Haftalık 3 gün antrenman', isCompleted: true }] }
  ]);

  // Modals Management
  const [activeModal, setActiveModal] = useState<'none' | 'goal-form' | 'task-form' | 'create-individual' | 'show-qr' | 'edit-family' | 'financial-details' | 'pay-dues' | 'monthly-analysis'>('none');

  // Form & Interaction States
  const [indFormData, setIndFormData] = useState({ title: '', description: '', date: new Date().toISOString().split('T')[0], time: '12:00', role: 'taken' as 'taken' | 'given' });
  const [goalFormData, setGoalFormData] = useState({ title: '', category: 'sport' as 'sport' | 'academic' | 'personal' });
  const [taskFormData, setTaskFormData] = useState({ text: '', goalId: '' });
  const [customFamilyRoles, setCustomFamilyRoles] = useState<Record<string, string>>({});
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
  const [newMemberRole, setNewMemberRole] = useState('');

  const currentUser = useMemo(() => users.find(u => u.email === currentUserEmail), [users, currentUserEmail]);
  const unreadNotificationsCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  useEffect(() => {
    if (isAuthenticated && currentUser && !actingUserId) {
      setActingUserId(currentUser.id);
    }
  }, [isAuthenticated, currentUser, actingUserId]);

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    };
    initApp();
  }, [isAuthenticated]);

  useEffect(() => {
    theme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const actingUser = useMemo(() => users.find(u => u.id === actingUserId) || currentUser, [users, actingUserId, currentUser]);

  const handleLogin = (email: string) => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', foundUser.email);
      setCurrentUserEmail(foundUser.email);
      setActingUserId(foundUser.id);
    }
  };

  const handleActionClick = (id: string) => {
    switch(id) {
      case 'create_individual': setActiveModal('create-individual'); break;
      case 'qr': setActiveModal('show-qr'); break;
      case 'new_goal': setActiveModal('goal-form'); break;
      case 'new_task': 
        if (goals.length > 0) {
          setTaskFormData(prev => ({ ...prev, goalId: goals[0].id }));
          setActiveModal('task-form');
        } else {
          alert("Lütfen önce bir hedef ekleyin.");
        }
        break;
      case 'edit_family': setActiveModal('edit-family'); break;
      case 'my_payments': setActiveModal('financial-details'); break;
      case 'pay_dues': setActiveModal('pay-dues'); break;
      case 'admin_panel': setActiveTab('admin'); break;
      case 'create_announcement': setActiveTab('notifications'); break;
    }
  };

  const handleAddGoal = () => {
    if (!goalFormData.title) return;
    const newGoal: Goal = { id: `g-${Date.now()}`, title: goalFormData.title, category: goalFormData.category, tasks: [] };
    setGoals(prev => [...prev, newGoal]);
    setActiveModal('none');
    setGoalFormData({ title: '', category: 'sport' });
  };

  const handleAddTask = () => {
    if (!taskFormData.text || !taskFormData.goalId) return;
    setGoals(prev => prev.map(g => g.id === taskFormData.goalId ? { ...g, tasks: [...g.tasks, { id: `t-${Date.now()}`, text: taskFormData.text, isCompleted: false }] } : g));
    setActiveModal('none');
    setTaskFormData({ text: '', goalId: '' });
  };

  const handleAddIndividualLesson = () => {
    if (!indFormData.title) return;
    const newLesson: IndividualLesson = { id: `ind-${Date.now()}`, title: indFormData.title, description: indFormData.description, date: indFormData.date, time: indFormData.time, role: indFormData.role, students: indFormData.role === 'given' ? [{ name: 'Öğrenci', email: 'ogrenci@mail.com' }] : [] };
    setIndividualLessons(prev => [...prev, newLesson]);
    setActiveModal('none');
    setIndFormData({ title: '', description: '', date: new Date().toISOString().split('T')[0], time: '12:00', role: 'taken' });
  };

  const handlePayDues = (paymentId: string) => {
    setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: PaymentStatus.PAID, paidAt: new Date().toISOString().split('T')[0] } : p));
    alert("Ödeme başarıyla tamamlandı! ✅");
  };

  const handleRemoveFamilyMember = (memberId: string) => {
    if(!actingUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === actingUser.id) return { ...u, childIds: u.childIds?.filter(id => id !== memberId), parentIds: u.parentIds?.filter(id => id !== memberId) };
      if (u.id === memberId) return { ...u, childIds: u.childIds?.filter(id => id !== actingUser.id), parentIds: u.parentIds?.filter(id => id !== actingUser.id) };
      return u;
    }));
  };

  const handleConfirmAddMember = () => {
    if(!actingUser || !addingMemberId) return;
    const roleToSave = newMemberRole.trim() || 'Aile Üyesi';
    setCustomFamilyRoles(prev => ({ ...prev, [addingMemberId]: roleToSave }));
    setUsers(prev => prev.map(u => {
      if (u.id === actingUser.id) {
        if (actingUser.role === UserRole.PARENT) return { ...u, childIds: [...(u.childIds || []), addingMemberId] };
        else return { ...u, parentIds: [...(u.parentIds || []), addingMemberId] };
      }
      if (u.id === addingMemberId) {
        if (actingUser.role === UserRole.PARENT) return { ...u, parentIds: [...(u.parentIds || []), actingUser.id] };
        else return { ...u, childIds: [...(u.childIds || []), actingUser.id] };
      }
      return u;
    }));
    setAddingMemberId(null);
    setNewMemberRole('');
    alert("Aile üyesi eklendi! 👨‍👩‍👧‍👦");
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
    setActingUserId(null);
    setActiveTab('dashboard');
  };

  if (isLoading) return <LoadingScreen />;
  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;
  if (!isAuthenticated || !currentUser || !actingUserId || !actingUser) {
    if (authView === 'login') return <Login onLogin={handleLogin} onRegisterClick={() => setAuthView('register')} onForgotClick={() => setAuthView('forgot')} />;
    if (authView === 'register') return <Register onRegister={handleLogin} onBackToLogin={() => setAuthView('login')} />;
    return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
  }

  const userPayments = payments.filter(p => p.studentId === actingUserId);
  const unpaidPayments = userPayments.filter(p => p.status !== PaymentStatus.PAID);
  const connectedFamily = users.filter(u => actingUser.childIds?.includes(u.id) || actingUser.parentIds?.includes(u.id));
  const otherUsers = users.filter(u => u.id !== actingUser.id && !connectedFamily.some(f => f.id === u.id));

  return (
    <div className="relative">
      <Layout 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        onProfileClick={() => setActiveTab('profile')} onNotificationClick={() => setActiveTab('notifications')}
        userRole={currentUser.role} userName={actingUser.name} unreadCount={unreadNotificationsCount} theme={theme}
      >
        <div className="page-transition">
          {viewingUser ? (
             <Profile user={viewingUser} onBack={() => setViewingUser(null)} isOwnProfile={viewingUser.id === currentUser.id} theme={theme} onThemeToggle={() => setTheme(t => t==='lite'?'dark':'lite')} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={setActingUserId} actingUserId={actingUserId} allUsers={users} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} familyRoles={customFamilyRoles} />
          ) : selectedCourseId ? (
             <CourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} currentUser={actingUser} courses={courses} individualLessons={individualLessons} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} />
          ) : activeTab === 'dashboard' ? (
             <Dashboard userName={actingUser.name} currentUserId={actingUser.id} goals={goals} onToggleTask={(gid, tid) => setGoals(prev => prev.map(g => g.id === gid ? {...g, tasks: g.tasks.map(t => t.id === tid ? {...t, isCompleted: !t.isCompleted} : t)} : g))} payments={payments} courses={courses} onOpenFinancials={() => setActiveModal('financial-details')} onOpenMonthlyAnalysis={() => setActiveModal('monthly-analysis')} />
          ) : activeTab === 'calendar' ? (
             <Calendar currentUser={actingUser} onCourseClick={setSelectedCourseId} courses={courses} individualLessons={individualLessons} />
          ) : activeTab === 'actions' ? (
             <Actions currentUser={actingUser} onActionClick={handleActionClick} />
          ) : activeTab === 'courses' ? (
             <Attendance currentUser={actingUser} onCourseClick={setSelectedCourseId} />
          ) : activeTab === 'other' ? (
             <Other currentUser={actingUser} />
          ) : activeTab === 'admin' ? (
             <AdminPanel currentUser={currentUser} onImpersonate={setActingUserId} addNotification={(n) => setNotifications(p => [n, ...p])} onCourseClick={setSelectedCourseId} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} />
          ) : activeTab === 'notifications' ? (
             <Notifications notifications={notifications} markAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))} markAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))} currentUser={actingUser} addNotification={(n) => setNotifications(p => [n, ...p])} />
          ) : (
             <Profile user={actingUser} isOwnProfile={actingUserId === currentUser.id} theme={theme} onThemeToggle={() => setTheme(t => t==='lite'?'dark':'lite')} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={setActingUserId} actingUserId={actingUserId} allUsers={users} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} familyRoles={customFamilyRoles} />
          )}
        </div>
      </Layout>

      {/* --- MODALS --- */}
      
      {activeModal === 'financial-details' && (
        <div className="fixed inset-0 z-[1000] bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom duration-500">
           <header className="px-6 py-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center sticky top-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md z-10">
              <div className="text-left">
                 <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase leading-none">ÖDEME ANALİZİ</h2>
                 <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1.5">BORÇ VE GEÇMİŞ TAKİBİ</p>
              </div>
              <button onClick={() => setActiveModal('none')} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
           </header>
           <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {userPayments.map(pay => (
                <div key={pay.id} className="p-5 rounded-[2.2rem] bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase">{pay.dueDate}</p>
                    <p className="text-[7px] font-bold text-slate-400 mt-1 uppercase">Ref: {pay.id}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-sm font-black text-slate-900 dark:text-slate-100">₺{pay.amount}</p>
                     <span className={`inline-block mt-1.5 px-1.5 py-0.5 rounded text-[6px] font-black uppercase ${pay.status === PaymentStatus.PAID ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>{pay.status}</span>
                  </div>
                </div>
              ))}
           </div>
           <div className="p-6 pb-12 border-t border-slate-100 dark:border-slate-900"><button onClick={() => setActiveModal('none')} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl">KAPAT</button></div>
        </div>
      )}

      {activeModal === 'monthly-analysis' && (
        <div className="fixed inset-0 z-[1000] bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-500">
           <header className="px-6 py-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center sticky top-0 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md z-10">
              <div className="text-left">
                 <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase leading-none">AYLIK ANALİZ</h2>
                 <p className="text-[8px] font-black text-indigo-500 uppercase tracking-widest mt-1.5">SÜREKLİLİK VE KATILIM RAPORU</p>
              </div>
              <button onClick={() => setActiveModal('none')} className="w-10 h-10 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
           </header>
           <div className="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar pb-32">
              <div className="bg-white/70 dark:bg-slate-900/40 p-6 rounded-[2.8rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="grid grid-cols-7 gap-2 mb-4">
                   {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
                     <span key={i} className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest">{d}</span>
                   ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                   {Array.from({ length: 30 }).map((_, i) => {
                      const dayNum = i + 1;
                      const status = [2, 5, 8, 12, 15, 19, 22, 26, 29].includes(dayNum) ? 'attended' : (dayNum % 7 === 0 ? 'missed' : 'none');
                      return (
                        <div key={i} className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative transition-all ${
                          status === 'attended' ? 'bg-orange-500/10 border-orange-500/20 shadow-inner' : 
                          status === 'missed' ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700' :
                          'bg-slate-50 dark:bg-slate-900/30 border-transparent'
                        }`}>
                           <span className="absolute top-1 left-1.5 text-[6px] font-black text-slate-300 dark:text-slate-600">{dayNum}</span>
                           {status === 'attended' && <span className="text-[12px] animate-flame-flicker">🔥</span>}
                        </div>
                      );
                   })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[20px] font-black text-slate-800 dark:text-slate-100 leading-none">14 Gün</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] mt-2">Ders Katılımı</p>
                    <div className="w-8 h-1 bg-orange-500 rounded-full mt-3"></div>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                    <p className="text-[20px] font-black text-emerald-500 leading-none">%82</p>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em] mt-2">Başarı Oranı</p>
                    <div className="w-8 h-1 bg-emerald-500 rounded-full mt-3"></div>
                 </div>
              </div>
              <div className="bg-indigo-600 p-8 rounded-[3rem] text-white shadow-xl shadow-indigo-600/20">
                <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-3">EĞİTMEN YORUMU</p>
                <p className="text-[12px] font-bold leading-relaxed italic opacity-95">"Disiplinli katılımın antrenman sonuçlarına doğrudan yansıyor. Teknik becerilerde gözle görülür bir artış var. Tebrikler!"</p>
              </div>
           </div>
           <div className="p-6 pb-12 border-t border-slate-100 dark:border-slate-900"><button onClick={() => setActiveModal('none')} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl">ANALİZİ KAPAT</button></div>
        </div>
      )}

      {activeModal === 'pay-dues' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95 flex flex-col gap-6">
             <div className="text-center"><h3 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500">AİDAT ÖDEME</h3><p className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Ödenmemiş Borç Listesi</p></div>
             <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                {unpaidPayments.length === 0 ? (<p className="text-[9px] font-black text-emerald-500 text-center py-4 uppercase">Ödenmemiş Borç Bulunmamaktadır ✨</p>) : (
                  unpaidPayments.map(pay => (
                    <div key={pay.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                       <div className="text-left"><p className="text-[10px] font-black text-slate-800 dark:text-slate-100">₺{pay.amount}</p><p className="text-[7px] font-bold text-rose-500 uppercase">{pay.dueDate}</p></div>
                       <button onClick={() => handlePayDues(pay.id)} className="bg-amber-500 text-white px-3 py-2 rounded-xl text-[8px] font-black uppercase shadow-md active:scale-95 transition-all">ŞİMDİ ÖDE</button>
                    </div>
                  ))
                )}
             </div>
             <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase">KAPAT</button>
          </div>
        </div>
      )}

      {activeModal === 'edit-family' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[360px] max-h-[85vh] rounded-[3rem] p-7 relative z-10 border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-center mb-6 text-rose-500">AİLE YÖNETİMİ</h3>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
              <section className="space-y-3">
                <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">MEVCUT ÜYELER</h4>
                <div className="space-y-2">
                  {connectedFamily.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm">
                      <div className="flex items-center gap-3">
                         <img src={member.avatar} className="w-8 h-8 rounded-xl object-cover" />
                         <div className="text-left">
                            <p className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase">{member.name}</p>
                            <p className="text-[7px] font-bold text-indigo-500 uppercase tracking-widest">{customFamilyRoles[member.id] || member.role}</p>
                         </div>
                      </div>
                      <button onClick={() => handleRemoveFamilyMember(member.id)} className="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center active:scale-90"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                    </div>
                  ))}
                </div>
              </section>
              <section className="space-y-3">
                 <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">YENİ ÜYE EKLE</h4>
                 <div className="grid gap-2">
                    {otherUsers.map(u => (
                      <div key={u.id} className="p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 rounded-2xl">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3"><img src={u.avatar} className="w-8 h-8 rounded-xl object-cover" /><div><p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase">{u.name}</p><p className="text-[6px] font-bold text-slate-400 uppercase">{u.role}</p></div></div>
                           {addingMemberId === u.id ? (
                             <div className="flex gap-1 animate-in slide-in-from-right-2"><input type="text" value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} placeholder="Rol (Örn: Anne)" className="w-20 bg-white dark:bg-slate-900 border border-slate-200 px-2 py-1.5 rounded-lg text-[8px] font-bold outline-none" /><button onClick={handleConfirmAddMember} className="bg-indigo-600 text-white px-2 py-1.5 rounded-lg text-[8px] font-black">EKLE</button></div>
                           ) : (
                             <button onClick={() => setAddingMemberId(u.id)} className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg flex items-center justify-center font-black text-lg">+</button>
                           )}
                        </div>
                      </div>
                    ))}
                 </div>
              </section>
            </div>
            <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase mt-6 shadow-xl">KAPAT</button>
          </div>
        </div>
      )}

      {/* --- OTHER FORM MODALS --- */}
      {activeModal === 'create-individual' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95 flex flex-col gap-5">
             <div className="text-center"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">BİREYSEL EĞİTİM</h3><p className="text-[8px] font-bold text-slate-400 mt-1 uppercase">Ders Takvimini Belirle</p></div>
             <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button onClick={() => setIndFormData(p => ({...p, role: 'taken'}))} className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${indFormData.role === 'taken' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>ALACAĞIM</button>
                <button onClick={() => setIndFormData(p => ({...p, role: 'given'}))} className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${indFormData.role === 'given' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>VERECEĞİM</button>
             </div>
             <div className="space-y-4">
                <input value={indFormData.title} onChange={(e) => setIndFormData(p => ({...p, title: e.target.value}))} placeholder="Eğitim Adı..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <div className="grid grid-cols-2 gap-3">
                   <input type="date" value={indFormData.date} onChange={(e) => setIndFormData(p => ({...p, date: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                   <input type="time" value={indFormData.time} onChange={(e) => setIndFormData(p => ({...p, time: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-800 px-3 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                </div>
                <button onClick={handleAddIndividualLesson} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">PROGRAMA EKLE</button>
                <button onClick={() => setActiveModal('none')} className="w-full py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">İPTAL</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'goal-form' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6 text-blue-500">YENİ STRATEJİK HEDEF</h3>
             <div className="space-y-4">
                <input value={goalFormData.title} onChange={(e) => setGoalFormData(p => ({ ...p, title: e.target.value }))} placeholder="Hedef Tanımı..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <select value={goalFormData.category} onChange={(e) => setGoalFormData(p => ({ ...p, category: e.target.value as any }))} className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                  <option value="sport">Spor</option><option value="academic">Akademik</option><option value="personal">Kişisel</option>
                </select>
                <button onClick={handleAddGoal} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">HEDEFİ KAYDET</button>
                <button onClick={() => setActiveModal('none')} className="w-full py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">İPTAL</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'task-form' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6 text-emerald-500">GÖREV ATAMASI</h3>
             <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">İLGİLİ HEDEF</label>
                  <select value={taskFormData.goalId} onChange={(e) => setTaskFormData(p => ({ ...p, goalId: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700">
                    {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                  </select>
                </div>
                <input value={taskFormData.text} onChange={(e) => setTaskFormData(p => ({ ...p, text: e.target.value }))} placeholder="Görev Metni..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <button onClick={handleAddTask} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">GÖREVİ EKLE</button>
                <button onClick={() => setActiveModal('none')} className="w-full py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">İPTAL</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'show-qr' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="relative z-10 w-full max-w-[320px] bg-white dark:bg-slate-900 rounded-[3rem] p-8 text-center flex flex-col items-center shadow-2xl border border-white/10 animate-in zoom-in-95">
             <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase mb-4">{actingUser.name}</h3>
             <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 mb-6">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${actingUser.id}`} className="w-44 h-44 bg-white p-4 rounded-xl" alt="QR" />
             </div>
             <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg">KAPAT</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
