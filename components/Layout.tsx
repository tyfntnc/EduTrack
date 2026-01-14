
import React from 'react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onProfileClick: () => void;
  userRole: UserRole;
  userName: string;
  unreadCount: number;
  theme?: 'lite' | 'dark';
}

const NavIcon = ({ id, active }: { id: string, active: boolean }) => {
  const icons: Record<string, React.ReactNode> = {
    courses: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    notifications: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    other: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M3 12h.01" /><path d="M21 12h.01" /><path d="M12 3v.01" /><path d="M12 21v.01" />
      </svg>
    )
  };
  return icons[id] || null;
};

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onProfileClick, userRole, userName, unreadCount, theme = 'lite' }) => {
  const tabs = [
    { id: 'courses', label: 'Kurslar' },
    { id: 'calendar', label: 'Haftalık Program' },
    { id: 'dashboard', label: 'Ana Sayfa', center: true },
    { id: 'notifications', label: 'Duyurular', badge: unreadCount > 0 },
    { id: 'other', label: 'Analiz' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white dark:bg-slate-950 overflow-hidden relative shadow-2xl transition-colors duration-300">
      <header className="px-4 py-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm sticky top-0 z-[60] flex justify-between items-center border-b border-slate-50 dark:border-slate-900 transition-colors">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">EduTrack Mobile</span>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 -mt-1 tracking-tight">Akıllı Takip</h1>
        </div>
        
        <button onClick={onProfileClick} className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 active:scale-95 transition-all">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
            {userName[0]}
          </div>
        </button>
      </header>

      <main className="flex-1 w-full bg-white dark:bg-slate-950 relative pb-32 transition-colors overflow-y-auto no-scrollbar">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-900 px-4 pt-2 pb-6 flex items-center justify-between z-[70] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-colors">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 transition-all relative"
            >
              <div className={`flex items-center justify-center transition-all duration-300 ${
                tab.center 
                  ? isActive 
                    ? 'bg-indigo-600 text-white w-12 h-12 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none -mt-8 scale-110' 
                    : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 w-12 h-12 rounded-2xl -mt-8 shadow-sm'
                  : `w-10 h-10 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`
              }`}>
                <NavIcon id={tab.id} active={isActive} />
                {tab.badge && !isActive && (
                  <div className="absolute top-2 right-1/4 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-950"></div>
                )}
              </div>
              <span className={`text-[8px] font-bold tracking-tight ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600 opacity-60'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
