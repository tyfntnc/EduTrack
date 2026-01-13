
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
import { ApiService } from './services/api.ts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Mock veri çekme
        const user = await ApiService.getCurrentUser('u2');
        const notifs = await ApiService.getNotifications();
        
        setCurrentUser(user);
        setNotifications(notifs);
      } catch (error) {
        console.error("EduTrack: Veri yükleme hatası:", error);
      } finally {
        // Animasyon hissi için kısa bir gecikme
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    initApp();
  }, []);

  if (isLoading || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-xl"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-xl animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
          Sistem Hazırlanıyor...
        </p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={currentUser.role} userName={currentUser.name} currentUserId={currentUser.id} />;
      case 'courses':
        return <Attendance currentUser={currentUser} />;
      case 'notifications':
        return <Notifications notifications={notifications} markAllAsRead={() => setNotifications(notifications.map(n => ({ ...n, isRead: true })))} />;
      case 'calendar':
        return <Calendar currentUser={currentUser} />;
      case 'other':
        return <Other />;
      case 'admin':
        return <AdminPanel currentUser={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} />;
      default:
        return <Dashboard userRole={currentUser.role} userName={currentUser.name} currentUserId={currentUser.id} />;
    }
  };

  const isAdmin = currentUser.role === UserRole.SYSTEM_ADMIN || currentUser.role === UserRole.SCHOOL_ADMIN;

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onProfileClick={() => setActiveTab('profile')}
      userRole={currentUser.role}
      userName={currentUser.name}
      unreadCount={unreadCount}
    >
      {renderContent()}
      
      {isAdmin && activeTab === 'dashboard' && (
        <button 
          onClick={() => setActiveTab('admin')}
          className="fixed right-6 bottom-32 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 active:scale-90 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      )}
    </Layout>
  );
};

export default App;
