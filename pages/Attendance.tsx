
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_COURSES } from '../constants';
import { User, Course } from '../types';

interface AttendanceProps {
  currentUser: User;
  onCourseClick?: (courseId: string) => void;
}

export const Attendance: React.FC<AttendanceProps> = ({ currentUser, onCourseClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [takenPage, setTakenPage] = useState(1);
  const [givenPage, setGivenPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  
  const filterByTitle = (c: Course) => c.title.toLowerCase().includes(searchTerm.toLowerCase());
  
  const allCoursesTaken = MOCK_COURSES.filter(c => c.studentIds.includes(currentUser.id) && filterByTitle(c));
  const allCoursesGiven = MOCK_COURSES.filter(c => c.teacherId === currentUser.id && filterByTitle(c));

  const totalTakenPages = Math.ceil(allCoursesTaken.length / ITEMS_PER_PAGE);
  const totalGivenPages = Math.ceil(allCoursesGiven.length / ITEMS_PER_PAGE);

  const paginatedTaken = allCoursesTaken.slice((takenPage - 1) * ITEMS_PER_PAGE, takenPage * ITEMS_PER_PAGE);
  const paginatedGiven = allCoursesGiven.slice((givenPage - 1) * ITEMS_PER_PAGE, givenPage * ITEMS_PER_PAGE);

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

  const Pagination = ({ current, total, onPageChange }: { current: number, total: number, onPageChange: (p: number) => void }) => {
    if (total <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 mt-4 pb-2">
        <button 
          disabled={current === 1}
          onClick={() => onPageChange(current - 1)}
          className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-30 active:scale-90 transition-all shadow-sm"
        >
          <svg className="text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                current === i + 1 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:shadow-none scale-110' 
                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button 
          disabled={current === total}
          onClick={() => onPageChange(current + 1)}
          className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-30 active:scale-90 transition-all shadow-sm"
        >
          <svg className="text-slate-400 dark:text-slate-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    );
  };

  return (
    <div className="w-full page-transition px-4 space-y-6 pt-4 transition-colors">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input 
          type="text" placeholder="Kayıtlı Derslerini Ara..." value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setTakenPage(1);
            setGivenPage(1);
          }}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-3.5 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 dark:text-slate-200 transition-all outline-none"
        />
      </div>

      <div className="space-y-8 pb-10">
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
              ÖĞRENCİ OLARAK <span>({allCoursesTaken.length})</span>
            </h3>
            {totalTakenPages > 1 && (
              <span className="text-[8px] font-bold text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full uppercase">
                Sayfa {takenPage}/{totalTakenPages}
              </span>
            )}
          </div>
          <div className="space-y-2.5">
            {paginatedTaken.length === 0 ? (
              <div className="py-10 text-center bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                 <p className="text-[10px] font-bold text-slate-300 dark:text-slate-700 uppercase">Kayıtlı ders bulunamadı</p>
              </div>
            ) : (
              paginatedTaken.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => onCourseClick?.(c.id)}
                  className="w-full text-left p-3.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[1.75rem] flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl shadow-inner border border-slate-100 dark:border-slate-700 shrink-0">
                    {getBranchIcon(c.branchId)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{c.title}</h4>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-tighter">
                      {MOCK_USERS.find(u => u.id === c.teacherId)?.name}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                  </div>
                </button>
              ))
            )}
          </div>
          <Pagination current={takenPage} total={totalTakenPages} onPageChange={setTakenPage} />
        </section>

        {allCoursesGiven.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                ANTRENÖR OLARAK <span>({allCoursesGiven.length})</span>
              </h3>
              {totalGivenPages > 1 && (
                <span className="text-[8px] font-bold text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full uppercase">
                  Sayfa {givenPage}/{totalGivenPages}
                </span>
              )}
            </div>
            <div className="space-y-2.5">
              {paginatedGiven.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => onCourseClick?.(c.id)}
                  className="w-full text-left p-3.5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-[1.75rem] flex items-center gap-4 active:scale-[0.98] transition-all"
                >
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-indigo-100 dark:shadow-none shrink-0 border border-indigo-500/20">
                    {getBranchIcon(c.branchId)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 truncate">{c.title}</h4>
                    <p className="text-[10px] font-bold text-indigo-600/60 dark:text-indigo-400/60 mt-0.5 uppercase tracking-tighter">
                      {c.studentIds.length} Kayıtlı Öğrenci
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-bold rounded-lg uppercase shadow-md shrink-0">
                    Yönet
                  </div>
                </button>
              ))}
            </div>
            <Pagination current={givenPage} total={totalGivenPages} onPageChange={setGivenPage} />
          </section>
        )}
      </div>
    </div>
  );
};