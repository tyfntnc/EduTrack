
import React, { useState, useEffect } from 'react';
import { UserRole, Notification, User } from './types.ts';
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
  
  // App States
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [showLanding, setShowLanding] = useState(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) return false;
    return localStorage.getItem('hasSeenLanding') !== 'true';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [actingUserId, setActingUserId] = useState<string | null>(null); // Aktif işlem yapılan kimlik
  const [theme, setTheme] = useState<'lite' | 'dark'>(
    (localStorage.getItem('theme') as 'lite' | 'dark') || 'lite'
  );

  // Initial Data Fetching
  useEffect(() => {
    const initApp = async () => {
      if (isAuthenticated) {
        try {
          // Varsayılan olarak Ayşe (Veli) giriş yapmış gibi başlatalım testi daha iyi görmek için
          // u3 = Ayşe Demir (Veli)
          const user = await ApiService.getCurrentUser('u3'); 
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
      localStorage.setItem('hasSeenLanding', 'true');
      setIsTransitioning(false);
    }, 1000);
  };

  const handleBackToLanding = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(true);
      localStorage.removeItem('hasSeenLanding');
      setIsTransitioning(false);
    }, 800);
  };

  const handleLogin = (email: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(true);
      localStorage.setItem('isLoggedIn', 'true');
      setIsTransitioning(false);
    }, 1200);
  };

  const handleLogout = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem('isLoggedIn');
      setActiveTab('dashboard');
      setAuthView('login');
      setActingUserId(null);
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
      setActiveTab('dashboard'); // Kimlik değişince ana sayfaya atalım
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

  if (isLoading) return <LoadingScreen />;
  if (showLanding && !isAuthenticated) return <><LandingPage onStart={handleStartApp} />{isTransitioning && <LoadingScreen />}</>;
  if (!isAuthenticated) return <><Login onLogin={handleLogin} onRegisterClick={() => setAuthView('register')} onForgotClick={() => setAuthView('forgot')} onBackToLanding={handleBackToLanding} />{isTransitioning && <LoadingScreen />}</>;
  if (!currentUser || !actingUserId) return <LoadingScreen />;

  const actingUser = MOCK_USERS.find(u => u.id === actingUserId) || currentUser;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    if (viewingUser) {
      return <Profile user={viewingUser} onBack={() => setViewingUser(null)} isOwnProfile={viewingUser.id === currentUser.id} theme={theme} onThemeToggle={toggleTheme} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={handleSwitchActingUser} actingUserId={actingUserId} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={actingUser.role} userName={actingUser.name} currentUserId={actingUser.id} />;
      case 'courses':
        if (selectedCourseId) {
          return <CourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} currentUser={actingUser} onUserClick={handleUserClick} />;
        }
        return <Attendance currentUser={actingUser} onCourseClick={(id) => setSelectedCourseId(id)} />;
      case 'notifications':
        return <Notifications notifications={notifications} markAllAsRead={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))} />;
      case 'calendar':
        return <Calendar currentUser={actingUser} />;
      case 'other':
        return <Other />;
      case 'admin':
        return <AdminPanel currentUser={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} isOwnProfile={true} theme={theme} onThemeToggle={toggleTheme} onLogout={handleLogout} currentUser={currentUser} onSwitchUser={handleSwitchActingUser} actingUserId={actingUserId} />;
      default:
        return <Dashboard userRole={actingUser.role} userName={actingUser.name} currentUserId={actingUser.id} />;
    }
  };

  const isAdmin = currentUser.role === UserRole.SYSTEM_ADMIN || currentUser.role === UserRole.SCHOOL_ADMIN;

  return (
    <div className="relative">
      {isTransitioning && <LoadingScreen />}
      <Layout 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onProfileClick={() => { handleTabChange('profile'); }}
        userRole={currentUser.role}
        userName={actingUser.name}
        unreadCount={unreadCount}
        theme={theme}
      >
        <div className="page-transition">{renderContent()}</div>
        {isAdmin && activeTab === 'dashboard' && !viewingUser && (
          <button onClick={() => handleTabChange('admin')} className="fixed right-6 bottom-32 w-14 h-14 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        )}
      </Layout>
    </div>
  );
};

export default App;
