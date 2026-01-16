
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_COURSES } from '../constants';
import { User, Course } from '../types';

interface AttendanceProps {
  currentUser: User;
  onCourseClick?: (courseId: string) => void;
}

export const Attendance: React.FC<AttendanceProps> = ({ currentUser, onCourseClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allCoursesTaken = MOCK_COURSES.filter(c => c.studentIds.includes(currentUser.id) && c.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const allCoursesGiven = MOCK_COURSES.filter(c => c.teacherId === currentUser.id && c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const getBranchIcon = (branchId: string) => {
    switch (branchId) {
      case 'b1': return '⚽';
      case 'b2': return '🏀';
      case 'b3': return '📐';
      default: return '📚';
    }
  };

  return (
    <div className="w-full page-transition px-4 space-y-3 pt-3 pb-24 overflow-hidden transition-all h-full text-left">
      <div className="relative bg-white/50 dark:bg-slate-900/30 backdrop-blur-md border border-white/20 dark:border-slate-800 rounded-2xl overflow-hidden">
        <input 
          type="text" placeholder="Kurs Ara..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent border-none px-10 py-2.5 text-[9px] font-black outline-none placeholder:text-slate-300"
        />
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1">ÖĞRENCİ ({allCoursesTaken.length})</h3>
        <div className="space-y-1.5">
          {allCoursesTaken.map(c => (
            <button key={c.id} onClick={() => onCourseClick?.(c.id)} className="w-full p-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800 rounded-2xl flex items-center gap-3 shadow-sm active:scale-[0.98] transition-all">
              <div className="w-8 h-8 bg-slate-100/50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-base shrink-0">{getBranchIcon(c.branchId)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[9px] font-black text-slate-800 dark:text-slate-100 truncate leading-none mb-1 uppercase tracking-tight">{c.title}</h4>
                <p className="text-[6px] font-black text-indigo-500 uppercase tracking-widest">{MOCK_USERS.find(u => u.id === c.teacherId)?.name.split(' ')[0]}</p>
              </div>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          ))}
        </div>
      </section>

      {allCoursesGiven.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1">EĞİTMEN ({allCoursesGiven.length})</h3>
          <div className="space-y-1.5">
            {allCoursesGiven.map(c => (
              <button key={c.id} onClick={() => onCourseClick?.(c.id)} className="w-full p-3 bg-indigo-50/20 dark:bg-indigo-900/10 backdrop-blur-md border border-indigo-100/30 dark:border-indigo-900/20 rounded-2xl flex items-center gap-3 active:scale-[0.98] transition-all shadow-sm">
                <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-base shrink-0 text-white">{getBranchIcon(c.branchId)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[9px] font-black text-indigo-900 dark:text-indigo-100 truncate leading-none mb-1 uppercase tracking-tight">{c.title}</h4>
                  <p className="text-[6px] font-black text-indigo-400 uppercase tracking-widest">{c.studentIds.length} ÖĞRENCİ</p>
                </div>
                <div className="px-2 py-1 bg-indigo-600 text-white text-[6px] font-black rounded-lg uppercase tracking-widest shadow-sm">Yönet</div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
