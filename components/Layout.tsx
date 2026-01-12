
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
}

const Icons = {
  Courses: ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#10b981" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={active ? "#10b981" : "#94a3b8"} />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" fill={active ? "#10b98120" : "none"} />
    </svg>
  ),
  Calendar: ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#f59e0b" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill={active ? "#f59e0b20" : "none"} />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Home: ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={active ? "#ffffff" : "#64748b"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={active ? "rgba(255,255,255,0.2)" : "none"} />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Announcements: ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#ef4444" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill={active ? "#ef444420" : "none"} />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Other: ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#8b5cf6" : "#94a3b8"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" fill={active ? "#8b5cf620" : "none"} />
      <path d="M3 12h.01" /><path d="M21 12h.01" /><path d="M12 3v.01" /><path d="M12 21v.01" />
      <path d="M18.36 5.64l.01.01" /><path d="M5.64 18.36l.01.01" /><path d="M18.36 18.36l.01.01" /><path d="M5.64 5.64l.01.01" />
    </svg>
  )
};

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onProfileClick, userRole, userName, unreadCount }) => {
  const tabs = [
    { id: 'courses', label: 'Derslerim', icon: (a: boolean) => <Icons.Courses active={a} />, color: 'emerald' },
    { id: 'calendar', label: 'Takvim', icon: (a: boolean) => <Icons.Calendar active={a} />, color: 'amber' },
    { id: 'dashboard', label: 'Ana Sayfa', icon: (a: boolean) => <Icons.Home active={a} />, color: 'indigo', highlight: true },
    { id: 'notifications', label: 'Duyurular', icon: (a: boolean) => <Icons.Announcements active={a} />, color: 'rose', badge: unreadCount > 0 },
    { id: 'other', label: 'Analiz', icon: (a: boolean) => <Icons.Other active={a} />, color: 'violet' },
  ];

  const getColorClass = (color: string, active: boolean) => {
    if (!active) return 'text-slate-400';
    switch (color) {
      case 'emerald': return 'text-emerald-500';
      case 'amber': return 'text-amber-500';
      case 'indigo': return 'text-indigo-600';
      case 'rose': return 'text-rose-500';
      case 'violet': return 'text-violet-500';
      default: return 'text-slate-900';
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden border-x border-slate-100">
      <header className="px-6 py-6 bg-white/90 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center border-b border-slate-50">
        <div className="flex flex-col">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">EduTrack Premium</span>
          <h1 className="text-xl font-bold text-slate-900 -mt-1 tracking-tight">Akıllı Takip</h1>
        </div>
        
        <button 
          onClick={onProfileClick}
          className={`relative flex items-center gap-2 group active:scale-95 transition-all p-1.5 pr-3 rounded-2xl border shadow-sm ${activeTab === 'profile' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}
        >
          {unreadCount > 0 && activeTab !== 'notifications' && (
            <div className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg shadow-rose-200 z-[60] animate-bounce">
              <span className="text-[9px] font-black text-white px-1">{unreadCount}</span>
            </div>
          )}
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg transition-transform group-hover:scale-105 ${activeTab === 'profile' ? 'bg-indigo-700 shadow-indigo-200' : 'bg-indigo-600 shadow-indigo-100'}`}>
            {userName[0]}
          </div>
          <div className="text-left hidden xs:block">
            <p className={`text-[10px] font-bold leading-none ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-900'}`}>{userName.split(' ')[0]}</p>
            <p className="text-[8px] font-medium text-slate-400 uppercase tracking-tighter">Profil</p>
          </div>
        </button>
      </header>

      <main className="flex-1 pb-32 overflow-y-auto p-5 bg-white">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-4 py-4 pb-10 flex justify-between items-end z-50 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const hasUnread = tab.badge && !isActive;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-500 relative flex-1 ${
                isActive ? getColorClass(tab.color, true) : 'text-slate-400'
              } ${tab.highlight ? 'mb-1' : ''}`}
            >
              <div className={`flex items-center justify-center transition-all duration-500 relative ${
                tab.highlight 
                  ? isActive 
                    ? 'bg-indigo-600 text-white w-16 h-16 rounded-[1.75rem] shadow-2xl shadow-indigo-200 -translate-y-6 scale-110' 
                    : 'bg-white border border-slate-100 text-slate-300 w-16 h-16 rounded-[1.75rem] -translate-y-6'
                  : isActive ? 'bg-slate-50 w-12 h-12 rounded-2xl' : 'w-12 h-12'
              }`}>
                {/* Highlight Glow for Unread Notifications */}
                {hasUnread && tab.id === 'notifications' && (
                  <div className="absolute inset-0 bg-rose-500/10 rounded-2xl animate-pulse blur-lg"></div>
                )}
                
                {tab.icon(isActive)}
                
                {tab.badge && !isActive && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white shadow-sm animate-pulse"></div>
                )}
              </div>
              
              <span className={`text-[8px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 scale-75'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
