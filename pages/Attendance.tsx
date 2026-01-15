
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_COURSES } from '../constants';
import { User, Course } from '../types';

interface AttendanceProps {
  currentUser: User;
  onCourseClick?: (courseId: string) => void;
}

export const Attendance: React.FC<AttendanceProps> = ({ currentUser, onCourseClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filterByTitle = (c: Course) => c.title.toLowerCase().includes(searchTerm.toLowerCase());
  const allCoursesTaken = MOCK_COURSES.filter(c => c.studentIds.includes(currentUser.id) && filterByTitle(c));
  const allCoursesGiven = MOCK_COURSES.filter(c => c.teacherId === currentUser.id && filterByTitle(c));

  const getBranchIcon = (branchId: string) => {
    switch (branchId) {
      case 'b1': return '⚽';
      case 'b2': return '🏀';
      case 'b3': return '📐';
      case 'b4': return '🏐';
      case 'b5': return '🏊';
      default: return '📚';
    }
  };

  return (
    <div className="w-full page-transition px-4 space-y-2.5 pt-1 pb-24 transition-colors overflow-hidden">
      <div className="relative">
        <input 
          type="text" placeholder="Kurs Ara..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-[10px] font-bold outline-none"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
      </div>

      <section className="space-y-1">
        <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1">ÖĞRENCİ ({allCoursesTaken.length})</h3>
        <div className="space-y-1.5">
          {allCoursesTaken.map(c => (
            <button key={c.id} onClick={() => onCourseClick?.(c.id)} className="w-full text-left p-2 bg-white dark:bg-slate-900 border border-slate-50 dark:border-slate-800 rounded-xl flex items-center gap-3 shadow-sm active:scale-[0.98] transition-all">
              <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-base shrink-0">{getBranchIcon(c.branchId)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-100 truncate leading-none mb-1">{c.title}</h4>
                <p className="text-[7px] font-black text-indigo-500 uppercase tracking-tighter">{MOCK_USERS.find(u => u.id === c.teacherId)?.name.split(' ')[0]}</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-200"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          ))}
        </div>
      </section>

      {allCoursesGiven.length > 0 && (
        <section className="space-y-1 pt-1">
          <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest px-1">EĞİTMEN ({allCoursesGiven.length})</h3>
          <div className="space-y-1.5">
            {allCoursesGiven.map(c => (
              <button key={c.id} onClick={() => onCourseClick?.(c.id)} className="w-full text-left p-2 bg-indigo-50/30 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/20 rounded-xl flex items-center gap-3 active:scale-[0.98] transition-all">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-base shrink-0 text-white shadow-sm">{getBranchIcon(c.branchId)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold text-indigo-900 dark:text-indigo-100 truncate leading-none mb-1">{c.title}</h4>
                  <p className="text-[7px] font-black text-indigo-400 uppercase tracking-tighter">{c.studentIds.length} ÖĞRENCİ</p>
                </div>
                <div className="px-1.5 py-0.5 bg-indigo-600 text-white text-[6px] font-black rounded-md uppercase">Yönet</div>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
