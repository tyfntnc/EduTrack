
import React, { useState, useEffect } from 'react';
import { UserRole, Notification, User, NotificationType } from './types.ts';
import { Layout } from './components/Layout.tsx';
import { Dashboard } from './pages/Dashboard.tsx';
import { AdminPanel } from './pages/AdminPanel.tsx';
import { Attendance } from './pages/Attendance.tsx';
import { Notifications } from './pages/Notifications.tsx';
import { Calendar } from './pages/Calendar.tsx';
import { Other } from './pages/Other.tsx';
import { Profile } from './pages/Profile.tsx';
import { CourseDetail } from './pages/CourseDetail.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { LoadingScreen } from './components/LoadingScreen.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { ForgotPassword } from './pages/ForgotPassword.tsx';
import { ApiService } from './services/api.ts';
import { MOCK_USERS } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [actingUserId, setActingUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'lite' | 'dark'>(
    (localStorage.getItem('theme') as 'lite' | 'dark') || 'lite'
  );

  useEffect(() => {
    const initApp = async () => {
      const savedUserEmail = localStorage.getItem('userEmail');
      if (isAuthenticated && savedUserEmail) {
        try {
          const user = MOCK_USERS.find(u => u.email === savedUserEmail) || MOCK_USERS[0];
          const notifs = await ApiService.getNotifications();
          setCurrentUser(user);
          setActingUserId(user.id);
          setNotifications(notifs);
        } catch (error) {
          console.error("EduTrack: Veri yükleme hatası:", error);
          handleLogout();
        }
      }
      setTimeout(() => setIsLoading(false), 1200);
    };

    initApp();
  }, [isAuthenticated]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleStartApp = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(false);
      setIsTransitioning(false);
    }, 800);
  };

  const handleBackToLanding = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(true);
      setIsTransitioning(false);
    }, 800);
  };

  const handleLogin = (email: string) => {
    const foundUser = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    setIsTransitioning(true);
    setTimeout(() => {
      if (foundUser) {
        setIsAuthenticated(true);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', foundUser.email);
        setCurrentUser(foundUser);
        setActingUserId(foundUser.id);
      } else {
        alert("Kullanıcı bulunamadı. Lütfen geçerli bir test e-postası girin.");
      }
      setIsTransitioning(false);
    }, 1200);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userEmail');
      setActiveTab('dashboard');
      setAuthView('login');
      setActingUserId(null);
      setCurrentUser(null);
      setIsTransitioning(false);
    }, 800);
  };

  const handleTabChange = (tab: string) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setSelectedCourseId(null);
      setViewingUser(null);
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 600);
  };

  const handleSwitchActingUser = (userId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setActingUserId(userId);
      setActiveTab('dashboard');
      setIsTransitioning(false);
      window.scrollTo(0, 0);
    }, 800);
  };

  const handleUserClick = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setViewingUser(user);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'lite' ? 'dark' : 'lite');
  };

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  if (isLoading) return <LoadingScreen />;
  if (showLanding) {
    return (
      <>
        <LandingPage onStart={handleStartApp} />
        {isTransitioning && <LoadingScreen />}
      </>
    );
  }

  if (!isAuthenticated) {
    const renderAuthView = () => {
      switch (authView) {
        case 'login': return <Login onLogin={handleLogin} onRegisterClick={() => setAuthView('register')} onForgotClick={() => setAuthView('forgot')} onBackToLanding={handleBackToLanding} />;
        case 'register': return <Register onRegister={handleLogin} onBackToLogin={() => setAuthView('login')} />;
        case 'forgot': return <ForgotPassword onBackToLogin={() => setAuthView('login')} />;
        default: return <Login onLogin={handleLogin} onRegisterClick={() => setAuthView('register')} onForgotClick={() => setAuthView('forgot')} onBackToLanding={handleBackToLanding} />;
      }
    };
    return (
      <>
        {renderAuthView()}
        {isTransitioning && <LoadingScreen />}
      </>
    );
  }

  if (!currentUser || !actingUserId) return <LoadingScreen />;

  const actingUser = MOCK_USERS.find(u => u.id === actingUserId) || currentUser;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const isImpersonating = currentUser.id !== actingUserId;

  const renderContent = () => {
    if (viewingUser) {
      return <Profile user={viewingUser} onBack={() => setViewingUser(null)} isOwnProfile={viewingUser.id === currentUser.id} theme={theme} onThemeToggle={toggleTheme} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={handleSwitchActingUser} actingUserId={actingUserId} />;
    }

    if (selectedCourseId) {
      return <CourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} currentUser={actingUser} onUserClick={handleUserClick} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            userRole={actingUser.role} 
            userName={actingUser.name} 
            currentUserId={actingUser.id} 
            isSystemAdmin={currentUser.role === UserRole.SYSTEM_ADMIN}
            onImpersonate={handleSwitchActingUser}
            onTabChange={setActiveTab}
            addNotification={addNotification}
          />
        );
      case 'courses':
        return <Attendance currentUser={actingUser} onCourseClick={(id) => setSelectedCourseId(id)} />;
      case 'notifications':
        return (
          <Notifications 
            notifications={notifications} 
            markAllAsRead={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))} 
            markAsRead={markNotificationAsRead}
            currentUser={currentUser} 
            addNotification={addNotification}
          />
        );
      case 'calendar':
        return <Calendar currentUser={actingUser} onCourseClick={(id) => setSelectedCourseId(id)} />;
      case 'other':
        return <Other currentUser={actingUser} />;
      case 'admin':
        return <AdminPanel currentUser={currentUser} onImpersonate={handleSwitchActingUser} addNotification={addNotification} onCourseClick={(id) => setSelectedCourseId(id)} onUserClick={handleUserClick} />;
      case 'profile':
        return <Profile user={currentUser} isOwnProfile={true} theme={theme} onThemeToggle={toggleTheme} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={handleSwitchActingUser} actingUserId={actingUserId} />;
      default:
        return <Dashboard userRole={actingUser.role} userName={actingUser.name} currentUserId={actingUser.id} isSystemAdmin={currentUser.role === UserRole.SYSTEM_ADMIN} onImpersonate={handleSwitchActingUser} onTabChange={setActiveTab} addNotification={addNotification} />;
    }
  };

  const isAdmin = currentUser.role === UserRole.SYSTEM_ADMIN || currentUser.role === UserRole.SCHOOL_ADMIN;

  return (
    <div className="relative">
      {isTransitioning && <LoadingScreen />}
      
      {isImpersonating && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-indigo-600 text-white px-4 py-2 flex items-center justify-between shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Gözlem Modu: {actingUser.name}</span>
          </div>
          <button onClick={() => handleSwitchActingUser(currentUser.id)} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tight transition-colors">Yöneticiye Dön</button>
        </div>
      )}

      <Layout 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onProfileClick={() => { handleTabChange('profile'); }}
        userRole={currentUser.role}
        userName={actingUser.name}
        unreadCount={unreadCount}
        theme={theme}
      >
        <div className={`page-transition ${isImpersonating ? 'mt-10' : ''}`}>{renderContent()}</div>
        {isAdmin && activeTab === 'dashboard' && !viewingUser && !selectedCourseId && (
          <button onClick={() => handleTabChange('admin')} className="fixed right-6 bottom-32 w-14 h-14 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        )}
      </Layout>
    </div>
  );
};

export default App;
