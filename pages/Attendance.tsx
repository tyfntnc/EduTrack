
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_COURSES } from '../constants';
import { User, Course } from '../types';

interface AttendanceProps {
  currentUser: User;
}

export const Attendance: React.FC<AttendanceProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filterByTitle = (c: Course) => c.title.toLowerCase().includes(searchTerm.toLowerCase());
  const coursesGiven = MOCK_COURSES.filter(c => c.teacherId === currentUser.id && filterByTitle(c));
  const coursesTaken = MOCK_COURSES.filter(c => c.studentIds.includes(currentUser.id) && filterByTitle(c));

  return (
    <div className="w-full page-transition px-4 space-y-6">
      <header className="pt-4">
        <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest">Eğitim Yönetimi</p>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Kayıtlı Derslerim</h2>
      </header>

      {/* Modern Search */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input 
          type="text" placeholder="Ders Ara..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      <div className="space-y-6 pb-10">
        {/* Taken Section */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            Öğrenci Olarak <span>({coursesTaken.length})</span>
          </h3>
          <div className="space-y-2">
            {coursesTaken.map(c => (
              <div key={c.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm active:bg-slate-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{c.title}</h4>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-tighter">
                    Eğitmen: {MOCK_USERS.find(u => u.id === c.teacherId)?.name}
                  </p>
                </div>
                <div className="ml-4 w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Given Section */}
        {coursesGiven.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              Antrenör Olarak <span>({coursesGiven.length})</span>
            </h3>
            <div className="space-y-2">
              {coursesGiven.map(c => (
                <div key={c.id} className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between active:bg-indigo-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-indigo-900 truncate">{c.title}</h4>
                    <p className="text-[10px] font-bold text-indigo-600/60 mt-0.5 uppercase">
                      {c.studentIds.length} Kayıtlı Öğrenci
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-bold rounded-lg uppercase shadow-md shadow-indigo-100">
                    Yoklama Al
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
