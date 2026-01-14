
import React from 'react';
import { MOCK_COURSES, MOCK_USERS } from '../constants';
import { User } from '../types';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  currentUser: User;
  onUserClick?: (userId: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onBack, currentUser, onUserClick }) => {
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const teacher = MOCK_USERS.find(u => u.id === course?.teacherId);
  
  if (!course) return null;

  const classmates = MOCK_USERS.filter(u => course.studentIds.includes(u.id) && u.id !== currentUser.id);

  const renderAttendanceCalendar = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const attendanceData: Record<number, number | null> = {
      2: 1, 5: 0, 9: 1, 12: 1, 16: 1, 19: 0, 23: 1
    };

    const days = [];
    for (let i = 0; i < (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = attendanceData[day];
      const isToday = day === today.getDate();
      
      let content;
      if (status === 1) {
        content = (
          <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-emerald-100 dark:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        );
      } else if (status === 0) {
        content = (
          <div className="w-7 h-7 bg-rose-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-rose-100 dark:shadow-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </div>
        );
      } else {
        content = (
          <span className={`text-xs font-bold ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'}`}>{day}</span>
        );
      }

      days.push(
        <div key={day} className={`h-10 flex flex-col items-center justify-center relative transition-colors ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl' : ''}`}>
          {content}
          {isToday && <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>}
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-5 shadow-sm space-y-4 transition-all">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">Haziran 2024</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600">VAR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
              <span className="text-[8px] font-bold text-slate-400 dark:text-slate-600">YOK</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
            <span key={d} className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase mb-2">{d}</span>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full page-transition px-4 space-y-5 pb-20 pt-4 transition-colors">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 dark:text-slate-600 active:text-indigo-600 dark:active:text-indigo-400 active:scale-90 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-none truncate">{course.title}</h2>
          <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1">DERS DETAYI</p>
        </div>
      </header>

      <section 
        onClick={() => teacher && onUserClick?.(teacher.id)}
        className="bg-slate-900 dark:bg-indigo-600/20 rounded-[2.25rem] border dark:border-indigo-500/20 p-5 text-white shadow-xl shadow-slate-200 dark:shadow-none relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer"
      >
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 dark:bg-indigo-500/10 border border-white/20 dark:border-indigo-500/20 p-1 shrink-0 overflow-hidden transition-all">
             <img src={teacher?.avatar} className="w-full h-full object-cover rounded-xl" alt={teacher?.name} />
          </div>
          <div className="flex-1 min-w-0">
             <p className="text-[9px] font-bold text-indigo-300 dark:text-indigo-300 uppercase tracking-[0.2em] mb-1">EĞİTMEN</p>
             <h3 className="text-lg font-bold leading-none mb-3">{teacher?.name}</h3>
             <div className="flex gap-2">
                <button className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </button>
                <div className="w-[1px] h-4 bg-white/10 my-auto mx-1" />
                <button className="p-2 bg-gradient-to-tr from-amber-400 to-rose-600 rounded-xl active:scale-90 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </button>
             </div>
          </div>
        </div>
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest flex items-center justify-between px-1">
          SINIF ARKADAŞLARIM <span>({classmates.length})</span>
        </h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {classmates.map(user => (
            <div 
              key={user.id} 
              onClick={() => onUserClick?.(user.id)}
              className="flex flex-col items-center gap-2 shrink-0 active:scale-90 transition-transform cursor-pointer"
            >
               <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-0.5 shadow-sm transition-all">
                  <img src={user.avatar} className="w-full h-full object-cover rounded-[0.8rem]" alt={user.name} />
               </div>
               <span className="text-[9px] font-bold text-slate-500 dark:text-slate-500 text-center w-14 truncate">{user.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-[1.75rem] border border-indigo-100 dark:border-indigo-900/30 space-y-2 active:scale-95 transition-transform transition-all">
           <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
           </div>
           <div>
             <h4 className="text-[11px] font-black text-indigo-900 dark:text-indigo-300 uppercase">Ödevler</h4>
             <p className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold">2 Aktif Ödev</p>
           </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-[1.75rem] border border-amber-100 dark:border-amber-900/30 space-y-2 active:scale-95 transition-transform transition-all">
           <div className="w-8 h-8 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
           </div>
           <div>
             <h4 className="text-[11px] font-black text-amber-900 dark:text-amber-300 uppercase">Duyurular</h4>
             <p className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">1 Yeni Duyuru</p>
           </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest px-1">KATILIM TAKVİMİ</h3>
        {renderAttendanceCalendar()}
      </section>
    </div>
  );
};