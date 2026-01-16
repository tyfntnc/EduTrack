
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
import { MOCK_USERS, MOCK_COURSES, MOCK_PAYMENTS } from './constants.tsx';

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

  const [activeModal, setActiveModal] = useState<'none' | 'goal-form' | 'task-form' | 'create-individual' | 'show-qr' | 'add-family' | 'delete-family' | 'my-payments' | 'pay-dues'>('none');

  // currentUser ve actingUser türetilmiş state olmalı
  const currentUser = useMemo(() => users.find(u => u.email === currentUserEmail), [users, currentUserEmail]);
  
  useEffect(() => {
    if (isAuthenticated && currentUser && !actingUserId) {
      setActingUserId(currentUser.id);
    }
  }, [isAuthenticated, currentUser, actingUserId]);

  useEffect(() => {
    const initApp = async () => {
      if (isAuthenticated) {
        const notifs = await ApiService.getNotifications();
        setNotifications(notifs);
      }
      setTimeout(() => setIsLoading(false), 1200);
    };
    initApp();
  }, [isAuthenticated]);

  useEffect(() => {
    theme === 'dark' ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const actingUser = useMemo(() => users.find(u => u.id === actingUserId) || currentUser, [users, actingUserId, currentUser]);

  const handleActionClick = (id: string) => {
    switch(id) {
      case 'create_individual': setActiveModal('create-individual'); break;
      case 'qr': setActiveModal('show-qr'); break;
      case 'new_goal': setActiveModal('goal-form'); break;
      case 'new_task': setActiveModal('task-form'); break;
      case 'add_family': setActiveModal('add-family'); break;
      case 'delete_family': setActiveModal('delete-family'); break;
      case 'my_payments': setActiveModal('my-payments'); break;
      case 'pay_dues': setActiveModal('pay-dues'); break;
      case 'admin_panel': setActiveTab('admin'); break;
      case 'create_announcement': setActiveTab('notifications'); break;
    }
  };

  const handleAddFamily = (targetUserId: string, relation: 'parent' | 'child') => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const key = relation === 'parent' ? 'parentIds' : 'childIds';
        const currentIds = (u as any)[key] || [];
        if (!currentIds.includes(targetUserId)) {
          return { ...u, [key]: [...currentIds, targetUserId] };
        }
      }
      if (u.id === targetUserId) {
        const key = relation === 'parent' ? 'childIds' : 'parentIds';
        const currentIds = (u as any)[key] || [];
        if (!currentIds.includes(currentUser.id)) {
          return { ...u, [key]: [...currentIds, currentUser.id] };
        }
      }
      return u;
    }));
    setActiveModal('none');
    alert('Aile bireyi başarıyla eklendi! 👨‍👩‍👦');
  };

  const handleDeleteFamily = (targetUserId: string) => {
    if (!currentUser) return;
    if (!confirm('Bu aile bireyini listenizden kaldırmak istediğinize emin misiniz?')) return;

    // Hem kendi listemden hedefi, hem hedefin listesinden kendimi siliyorum (Karşılıklı)
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          childIds: (u.childIds || []).filter(id => id !== targetUserId),
          parentIds: (u.parentIds || []).filter(id => id !== targetUserId)
        };
      }
      if (u.id === targetUserId) {
        return {
          ...u,
          childIds: (u.childIds || []).filter(id => id !== currentUser.id),
          parentIds: (u.parentIds || []).filter(id => id !== currentUser.id)
        };
      }
      return u;
    }));
    
    // Gözlem modundaysak ana kullanıcıya dön
    if (actingUserId === targetUserId) {
      setActingUserId(currentUser.id);
    }

    setActiveModal('none');
    alert('Aile bireyi başarıyla kaldırıldı.');
  };

  const handleMakePayment = (courseId: string, month: string, method: 'Credit Card' | 'Manual') => {
    if (!actingUser) return;
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      studentId: actingUser.id,
      courseId: courseId,
      amount: 1500,
      dueDate: new Date().toISOString().split('T')[0],
      status: PaymentStatus.PAID,
      paidAt: new Date().toISOString(),
      method: method
    };
    setPayments([newPayment, ...payments]);
    setActiveModal('none');
    alert(`Ödemeniz başarıyla alındı! (${month} ayı için) ✅`);
  };

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setCurrentUserEmail(null);
    setActingUserId(null);
  };

  if (isLoading) return <LoadingScreen />;
  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;
  if (!isAuthenticated || !currentUser || !actingUserId || !actingUser) {
    const renderAuth = () => {
      if (authView === 'login') return <Login onLogin={handleLogin} onRegisterClick={() => setAuthView('register')} onForgotClick={() => setAuthView('forgot')} />;
      if (authView === 'register') return <Register onRegister={handleLogin} onBackToLogin={() => setAuthView('login')} />;
      return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
    };
    return renderAuth();
  }

  const renderContent = () => {
    if (selectedCourseId) {
      return <CourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} currentUser={actingUser} courses={courses} individualLessons={individualLessons} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} />;
    }

    if (viewingUser) {
      return <Profile user={viewingUser} onBack={() => setViewingUser(null)} isOwnProfile={viewingUser.id === currentUser.id} theme={theme} onThemeToggle={() => setTheme(t => t==='lite'?'dark':'lite')} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={setActingUserId} actingUserId={actingUserId} allUsers={users} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} />;
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
      case 'notifications':
        return <Notifications notifications={notifications} markAllAsRead={() => {}} markAsRead={() => {}} currentUser={currentUser} addNotification={(n) => setNotifications(p => [n, ...p])} />;
      case 'profile':
        return <Profile user={actingUser} isOwnProfile={actingUserId === currentUser.id} theme={theme} onThemeToggle={() => setTheme(t => t==='lite'?'dark':'lite')} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={setActingUserId} actingUserId={actingUserId} allUsers={users} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} />;
      case 'other':
        return <Other currentUser={actingUser} />;
      case 'admin':
        return <AdminPanel currentUser={currentUser} onUserClick={(uid) => { const u = users.find(user => user.id === uid); if (u) setViewingUser(u); }} />;
      default:
        return <Dashboard userName={actingUser.name} currentUserId={actingUser.id} goals={goals} onToggleTask={(gid, tid) => setGoals(prev => prev.map(g => g.id === gid ? {...g, tasks: g.tasks.map(t => t.id === tid ? {...t, isCompleted: !t.isCompleted} : t)} : g))} payments={payments} courses={courses} />;
    }
  };

  return (
    <div className="relative">
      {isTransitioning && <LoadingScreen />}
      
      <Layout 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        onProfileClick={() => setActiveTab('profile')} onNotificationClick={() => setActiveTab('notifications')}
        userRole={currentUser.role} userName={actingUser.name} unreadCount={notifications.length} theme={theme}
      >
        <div className="page-transition">{renderContent()}</div>
      </Layout>

      {/* --- MODALS --- */}
      {activeModal === 'my-payments' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[360px] rounded-[3rem] p-7 relative z-10 border border-white/10 space-y-5 shadow-2xl max-h-[80vh] overflow-y-auto no-scrollbar text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6">ÖDEME GEÇMİŞİM</h3>
            <div className="space-y-2.5">
              {payments.filter(p => p.studentId === actingUserId).slice(0, 10).map(p => {
                const course = courses.find(c => c.id === p.courseId);
                return (
                  <div key={p.id} className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div className="space-y-1 min-w-0">
                      <p className="text-[9px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight truncate">{course?.title || 'Eğitim Aidatı'}</p>
                      <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">{p.paidAt ? new Date(p.paidAt).toLocaleDateString('tr-TR') : p.dueDate}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-black text-emerald-600 tracking-tighter">₺{p.amount}</p>
                      <p className="text-[6px] font-black text-slate-300 uppercase">{p.method === 'Credit Card' ? 'Kart' : 'Nakit'}</p>
                    </div>
                  </div>
                );
              })}
              {payments.filter(p => p.studentId === actingUserId).length === 0 && (
                <p className="text-center py-12 text-[8px] font-black text-slate-300 uppercase tracking-widest">Henüz ödeme bulunmuyor.</p>
              )}
            </div>
            <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest mt-4">KAPAT</button>
          </div>
        </div>
      )}

      {activeModal === 'pay-dues' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              handleMakePayment(fd.get('course') as string, fd.get('month') as string, fd.get('method') as any);
            }} 
            className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 space-y-4 shadow-2xl text-left"
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-6 text-rose-500">AİDAT ÖDEMESİ</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">KURS SEÇİMİ</label>
                <select name="course" required className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3.5 rounded-2xl text-[10px] font-bold border border-slate-100 dark:border-slate-700 outline-none">
                  {courses.filter(c => c.studentIds.includes(actingUserId!)).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">ÖDEME DÖNEMİ</label>
                <select name="month" required className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3.5 rounded-2xl text-[10px] font-bold border border-slate-100 dark:border-slate-700 outline-none">
                  <option value="Haziran 2024">Haziran 2024</option>
                  <option value="Temmuz 2024">Temmuz 2024</option>
                  <option value="Ağustos 2024">Ağustos 2024</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">ÖDEME YÖNTEMİ</label>
                <div className="grid grid-cols-2 gap-2">
                   <label className="relative cursor-pointer group">
                      <input type="radio" name="method" value="Credit Card" defaultChecked className="hidden peer" />
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-center transition-all peer-checked:bg-indigo-600 peer-checked:text-white">
                         <span className="text-[9px] font-black uppercase">Kart</span>
                      </div>
                   </label>
                   <label className="relative cursor-pointer group">
                      <input type="radio" name="method" value="Manual" className="hidden peer" />
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-center transition-all peer-checked:bg-emerald-600 peer-checked:text-white">
                         <span className="text-[9px] font-black uppercase">Nakit</span>
                      </div>
                   </label>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-2">ÖDEMEYİ TAMAMLA</button>
            </div>
          </form>
        </div>
      )}

      {activeModal === 'add-family' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 space-y-5 shadow-2xl text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-4">AİLE BİREYİ EKLE</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">BİREY SEÇİN</label>
                <select id="family-user-select" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3.5 rounded-2xl text-[10px] font-bold border border-slate-100 dark:border-slate-700 outline-none">
                  <option value="">Kullanıcı Seçin...</option>
                  {users.filter(u => u.id !== currentUser.id && !(currentUser.childIds || []).includes(u.id) && !(currentUser.parentIds || []).includes(u.id)).map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">İLİŞKİ TÜRÜ</label>
                <select id="family-relation-select" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3.5 rounded-2xl text-[10px] font-bold border border-slate-100 dark:border-slate-700 outline-none">
                  <option value="child">Çocuğum Olarak Ekle</option>
                  <option value="parent">Velim Olarak Ekle</option>
                </select>
              </div>
              <button onClick={() => { const uid = (document.getElementById('family-user-select') as HTMLSelectElement).value; const rel = (document.getElementById('family-relation-select') as HTMLSelectElement).value as 'child' | 'parent'; if (uid) handleAddFamily(uid, rel); else alert('Lütfen bir kullanıcı seçin.'); }} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">LİSTEYE EKLE</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'delete-family' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="bg-white dark:bg-slate-900 w-full max-w-[340px] rounded-[3rem] p-8 relative z-10 border border-white/10 space-y-5 shadow-2xl text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-center mb-4 text-slate-400">AİLE BİREYİ SİL</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest ml-1">SİLİNECEK BİREY</label>
                <select id="delete-family-user-select" className="w-full bg-slate-50 dark:bg-slate-800 px-4 py-3.5 rounded-2xl text-[10px] font-bold border border-slate-100 dark:border-slate-700 outline-none">
                  <option value="">Seçiniz...</option>
                  {users.filter(u => (currentUser.childIds || []).includes(u.id) || (currentUser.parentIds || []).includes(u.id)).map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={() => { const uid = (document.getElementById('delete-family-user-select') as HTMLSelectElement).value; if (uid) handleDeleteFamily(uid); else alert('Lütfen silmek istediğiniz bireyi seçin.'); }} className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all border border-white/10">LİSTEDEN KALDIR</button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'show-qr' && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setActiveModal('none')} />
          <div className="relative z-10 w-full max-w-[320px] bg-white dark:bg-slate-900 rounded-[3rem] p-8 animate-in zoom-in-95 duration-300 text-center flex flex-col items-center shadow-2xl border border-white/10">
             <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mb-8"></div>
             <div className="space-y-1 mb-8">
               <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight uppercase leading-none">{actingUser.name}</h3>
               <p className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500 opacity-60">DİJİTAL KİMLİK KODU</p>
             </div>
             <div className="relative p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-inner mb-8">
                <div className="w-44 h-44 bg-white p-4 rounded-[2rem] flex items-center justify-center shadow-sm">
                   <img src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${actingUser.id}&color=0f172a`} className="w-full h-full" alt="QR" />
                </div>
             </div>
             <button onClick={() => setActiveModal('none')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">ANLADIM</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
