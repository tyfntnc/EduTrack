
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
import { ApiService } from './services/api.ts';
import { MOCK_USERS } from './constants.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLanding, setShowLanding] = useState(() => {
    return localStorage.getItem('hasSeenLanding') !== 'true';
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<'lite' | 'dark'>(
    (localStorage.getItem('theme') as 'lite' | 'dark') || 'lite'
  );

  useEffect(() => {
    const initApp = async () => {
      try {
        const user = await ApiService.getCurrentUser('u2');
        const notifs = await ApiService.getNotifications();
        
        setCurrentUser(user);
        setNotifications(notifs);
      } catch (error) {
        console.error("EduTrack: Veri yükleme hatası:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    initApp();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

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

  const handleUserClick = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) {
      setViewingUser(user);
    }
  };

  const handleStartApp = () => {
    setShowLanding(false);
    localStorage.setItem('hasSeenLanding', 'true');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'lite' ? 'dark' : 'lite');
  };

  if (showLanding) {
    return <LandingPage onStart={handleStartApp} />;
  }

  if (isLoading || !currentUser) {
    return <LoadingScreen />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    if (viewingUser) {
      return <Profile user={viewingUser} onBack={() => setViewingUser(null)} isOwnProfile={viewingUser.id === currentUser.id} theme={theme} onThemeToggle={toggleTheme} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={currentUser.role} userName={currentUser.name} currentUserId={currentUser.id} />;
      case 'courses':
        if (selectedCourseId) {
          return <CourseDetail courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} currentUser={currentUser} onUserClick={handleUserClick} />;
        }
        return <Attendance currentUser={currentUser} onCourseClick={(id) => setSelectedCourseId(id)} />;
      case 'notifications':
        return <Notifications notifications={notifications} markAllAsRead={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))} />;
      case 'calendar':
        return <Calendar currentUser={currentUser} />;
      case 'other':
        return <Other />;
      case 'admin':
        return <AdminPanel currentUser={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} isOwnProfile={true} theme={theme} onThemeToggle={toggleTheme} />;
      default:
        return <Dashboard userRole={currentUser.role} userName={currentUser.name} currentUserId={currentUser.id} />;
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
        userName={currentUser.name}
        unreadCount={unreadCount}
        theme={theme}
      >
        {renderContent()}
        
        {isAdmin && activeTab === 'dashboard' && !viewingUser && (
          <button 
            onClick={() => handleTabChange('admin')}
            className="fixed right-6 bottom-32 w-14 h-14 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </button>
        )}
      </Layout>
    </div>
  );
};

export default App;
