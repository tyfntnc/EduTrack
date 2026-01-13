
import React, { useState } from 'react';
import { UserRole, Notification, NotificationType, User } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AdminPanel } from './pages/AdminPanel';
import { Attendance } from './pages/Attendance';
import { Notifications } from './pages/Notifications';
import { Calendar } from './pages/Calendar';
import { Other } from './pages/Other';
import { Profile } from './pages/Profile';
import { MOCK_USERS, MOCK_NOTIFICATIONS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  // Başlangıç rolünü Mehmet Kaya (Öğrenci) olarak ayarlıyoruz
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[1]); 

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const isAdmin = currentUser.role === UserRole.SYSTEM_ADMIN || currentUser.role === UserRole.SCHOOL_ADMIN;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard userRole={currentUser.role} userName={currentUser.name} currentUserId={currentUser.id} />;
      case 'courses':
        return <Attendance currentUser={currentUser} />;
      case 'notifications':
        return <Notifications notifications={notifications} markAllAsRead={markAllAsRead} />;
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
      
      {/* Dev Toggle Helper - Sadece Adminler görebilir */}
      {isAdmin && activeTab === 'dashboard' && (
        <button 
          onClick={() => setActiveTab('admin')}
          className="fixed right-6 bottom-32 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center z-40 animate-bounce"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </button>
      )}
    </Layout>
  );
};

export default App;
