
import React, { useState, useEffect, useMemo } from 'react';
import { UserRole, Notification, User, NotificationType, Course, IndividualLesson, PaymentStatus, PaymentRecord } from './types.ts';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AdminPanel } from './pages/AdminPanel.tsx';
import { Attendance } from './pages/Attendance.tsx';
import { Notifications } from './pages/Notifications.tsx';
import { Calendar } from './pages/Calendar.tsx';
import { Other } from './pages/Other.tsx';
import { Profile } from './pages/Profile.tsx';
import { Actions } from './pages/Actions.tsx';
import { CourseDetail } from './pages/CourseDetail.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { ForgotPassword } from './pages/ForgotPassword.tsx';
import { ApiService } from './services/api.ts';
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

  const [activeModal, setActiveModal] = useState<'none' | 'goal-form' | 'task-form' | 'create-individual' | 'show-qr' | 'edit-family' | 'my-payments' | 'pay-dues'>('none');
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
      setTimeout(() => setIsLoading(false), 1200);
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

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleActionClick = (id: string) => {
    switch(id) {
      case 'create_individual': setActiveModal('create-individual'); break;
      case 'qr': setActiveModal('show-qr'); break;
      case 'new_goal': setActiveModal('goal-form'); break;
      case 'new_task': setActiveModal('task-form'); break;
      case 'edit_family': setActiveModal('edit-family'); setAddingMemberId(null); break;
      case 'my_payments': setActiveModal('my-payments'); break;
      case 'pay_dues': setActiveModal('pay-dues'); break;
      case 'admin_panel': setActiveTab('admin'); break;
      case 'create_announcement': setActiveTab('notifications'); break;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setCurrentUserEmail(null);
    setActingUserId(null);
    setActiveTab('dashboard');
  };

  const handleRemoveFamilyMember = (memberId: string) => {
    if(!actingUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === actingUser.id) {
        return { ...u, childIds: u.childIds?.filter(id => id !== memberId), parentIds: u.parentIds?.filter(id => id !== memberId) };
      }
      if (u.id === memberId) {
        return { ...u, childIds: u.childIds?.filter(id => id !== actingUser.id), parentIds: u.parentIds?.filter(id => id !== actingUser.id) };
      }
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
  };

  if (isLoading) return <LoadingScreen />;
  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;
  if (!isAuthenticated || !currentUser || !actingUserId || !actingUser) {
    if (authView === 'login') return <Login onLogin={handleLogin} onRegisterClick={() => setAuthView('register')} onForgotClick={() => setAuthView('forgot')} />;
    if (authView === 'register') return <Register onRegister={handleLogin} onBackToLogin={() => setAuthView('login')} />;
    return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
  }

  const renderContent = () => {
    if (viewingUser) {
      return (
        <Profile 
          user={viewingUser} 
          onBack={() => setViewingUser(null)} 
          isOwnProfile={viewingUser.id === currentUser.id} 
          theme={theme} 
          onThemeToggle={() => setTheme(t => t==='lite'?'dark':'lite')} 
          onLogout={handleLogout} 
          currentUser={currentUser} 
          onSwitchUser={setActingUserId} 
          actingUserId={actingUserId} 
          allUsers={users} 
          onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} 
          familyRoles={customFamilyRoles}
        />
      );
    }

    if (selectedCourseId) {
      return (
        <CourseDetail 
          courseId={selectedCourseId} 
          onBack={() => setSelectedCourseId(null)} 
          currentUser={actingUser} 
          courses={courses} 
          individualLessons={individualLessons} 
          onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} 
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userName={actingUser.name} currentUserId={actingUser.id} goals={goals} onToggleTask={(gid, tid) => setGoals(prev => prev.map(g => g.id === gid ? {...g, tasks: g.tasks.map(t => t.id === tid ? {...t, isCompleted: !t.isCompleted} : t)} : g))} payments={payments} courses={courses} />;
      case 'calendar':
        return <Calendar currentUser={actingUser} onCourseClick={setSelectedCourseId} courses={courses} individualLessons={individualLessons} />;
      case 'actions':
        return <Actions currentUser={actingUser} onActionClick={handleActionClick} />;
      case 'courses':
        return <Attendance currentUser={actingUser} onCourseClick={setSelectedCourseId} />;
      case 'other':
        return <Other currentUser={actingUser} />;
      case 'admin':
        return <AdminPanel 
          currentUser={currentUser} 
          onImpersonate={setActingUserId} 
          addNotification={(n) => setNotifications(p => [n, ...p])} 
          onCourseClick={setSelectedCourseId} 
          onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} 
        />;
      case 'notifications':
        return <Notifications notifications={notifications} markAllAsRead={handleMarkAllAsRead} markAsRead={handleMarkAsRead} currentUser={actingUser} addNotification={(n) => setNotifications(p => [n, ...p])} />;
      case 'profile':
        return <Profile 
          user={actingUser} 
          isOwnProfile={actingUserId === currentUser.id} 
          theme={theme} 
          onThemeToggle={() => setTheme(t => t==='lite'?'dark':'lite')} 
          onLogout={handleLogout} 
          currentUser={currentUser} 
          onSwitchUser={setActingUserId} 
          actingUserId={actingUserId} 
          allUsers={users} 
          onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} 
          familyRoles={customFamilyRoles}
        />;
      default:
        return <Dashboard userName={actingUser.name} currentUserId={actingUser.id} goals={goals} onToggleTask={(gid, tid) => setGoals(prev => prev.map(g => g.id === gid ? {...g, tasks: g.tasks.map(t => t.id === tid ? {...t, isCompleted: !t.isCompleted} : t)} : g))} payments={payments} courses={courses} />;
    }
  };

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
        <div className="page-transition">{renderContent()}</div>
      </Layout>

      {/* --- QR MODAL --- */}
      {activeModal === 'show-qr' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="relative z-10 w-full max-w-[320px] bg-white dark:bg-slate-900 rounded-[3rem] p-8 text-center flex flex-col items-center shadow-2xl border border-white/10 animate-in zoom-in-95">
             <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-8"></div>
             <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase mb-1">{actingUser.name}</h3>
             <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 mb-8">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${actingUser.id}`} className="w-44 h-44 bg-white p-4 rounded-[2rem]" alt="QR" />
             </div>
             <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">KAPAT</button>
          </div>
        </div>
      )}

      {/* --- FAMILY MODAL --- */}
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
                      <button onClick={() => handleRemoveFamilyMember(member.id)} className="w-8 h-8 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center active:scale-90">
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              <section className="space-y-3">
                 <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">YENİ ÜYE EKLE</h4>
                 <div className="grid gap-2 max-h-64 overflow-y-auto no-scrollbar">
                    {otherUsers.map(u => {
                      const isAddingThis = addingMemberId === u.id;
                      return (
                        <div key={u.id} className={`p-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 rounded-2xl transition-all ${isAddingThis ? 'ring-2 ring-indigo-500 bg-white dark:bg-slate-800' : ''}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <img src={u.avatar} className="w-8 h-8 rounded-xl object-cover opacity-60" />
                               <div>
                                  <p className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase">{u.name}</p>
                                  <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest">{u.role}</p>
                               </div>
                            </div>
                            {!isAddingThis && (
                              <button onClick={() => { setAddingMemberId(u.id); setNewMemberRole(''); }} className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-lg flex items-center justify-center font-black text-lg active:scale-90">+</button>
                            )}
                          </div>
                          {isAddingThis && (
                            <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
                               <input type="text" value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} placeholder="Örn: Anne, Dayı..." className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-[9px] font-bold outline-none" />
                               <div className="flex gap-2">
                                  <button onClick={() => setAddingMemberId(null)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-lg text-[7px] font-black uppercase tracking-widest">İPTAL</button>
                                  <button onClick={handleConfirmAddMember} className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-[7px] font-black uppercase tracking-widest">EKLE</button>
                               </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                 </div>
              </section>
            </div>
            <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest mt-6 shadow-xl active:scale-95 transition-all">KAPAT</button>
          </div>
        </div>
      )}

      {/* --- OTHERS MODALS --- */}
      {activeModal === 'my-payments' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[360px] max-h-[80vh] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-center mb-6 text-emerald-500">ÖDEME GEÇMİŞİM</h3>
             <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
               {userPayments.map(pay => (
                 <div key={pay.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div className="text-left">
                       <p className="text-[10px] font-black text-slate-800 dark:text-slate-100 uppercase truncate">₺{pay.amount}</p>
                       <p className="text-[7px] font-bold text-slate-400 uppercase mt-1">{pay.dueDate}</p>
                    </div>
                    <span className={`text-[6px] font-black px-1.5 py-0.5 rounded-md uppercase ${pay.status === PaymentStatus.PAID ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>{pay.status}</span>
                 </div>
               ))}
             </div>
             <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-6 active:scale-95 transition-all">KAPAT</button>
          </div>
        </div>
      )}

      {activeModal === 'pay-dues' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[360px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-center mb-6 text-amber-500">AİDAT ÖDEME</h3>
             <div className="space-y-4">
               {unpaidPayments.length === 0 ? (
                 <p className="text-[10px] text-center text-emerald-500 font-black">Tüm aidatlarınız ödenmiş! ✅</p>
               ) : (
                 unpaidPayments.map(pay => (
                   <button key={pay.id} onClick={() => { alert('Ödeme sistemine yönlendiriliyorsunuz...'); setActiveModal('none'); }} className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700 active:scale-95 transition-all">
                      <div className="text-left">
                         <p className="text-[10px] font-black uppercase text-slate-800 dark:text-slate-100">Aidat Borcu</p>
                         <p className="text-[7px] font-bold text-rose-500 uppercase mt-1">₺{pay.amount}</p>
                      </div>
                      <span className="text-[8px] font-black text-indigo-600 uppercase">Öde</span>
                   </button>
                 ))
               )}
               <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-2 active:scale-95 transition-all">VAZGEÇ</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'create-individual' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-center mb-6 text-indigo-500">BİREYSEL EĞİTİM</h3>
             <div className="space-y-4">
                <input placeholder="Eğitim Başlığı" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <textarea placeholder="Detaylar..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700 h-24" />
                <button onClick={() => { alert('Eğitim talebi oluşturuldu! 🎯'); setActiveModal('none'); }} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">TALEBİ GÖNDER</button>
                <button onClick={() => setActiveModal('none')} className="w-full py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest active:scale-95 transition-all">İPTAL</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'goal-form' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-center mb-6 text-blue-500">YENİ HEDEF</h3>
             <div className="space-y-4">
                <input placeholder="Hedef Başlığı..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <button onClick={() => { alert('Yeni hedef kaydedildi! 🚀'); setActiveModal('none'); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">HEDEFİ EKLE</button>
                <button onClick={() => setActiveModal('none')} className="w-full py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest active:scale-95 transition-all">İPTAL</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'task-form' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 shadow-2xl animate-in zoom-in-95">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-center mb-6 text-emerald-500">YENİ GÖREV</h3>
             <div className="space-y-4">
                <input placeholder="Görev Tanımı..." className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-[10px] font-bold outline-none border border-slate-100 dark:border-slate-700" />
                <button onClick={() => { alert('Görev listeye eklendi! ✅'); setActiveModal('none'); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">GÖREVİ EKLE</button>
                <button onClick={() => setActiveModal('none')} className="w-full py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest active:scale-95 transition-all">İPTAL</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
