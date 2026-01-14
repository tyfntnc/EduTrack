
import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_USERS, DAYS, SHORT_DAYS } from '../constants';
import { User } from '../types';

interface CalendarProps {
  currentUser: User;
  onCourseClick: (courseId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ currentUser, onCourseClick }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const today = new Date().getDay();

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const myCourses = MOCK_COURSES.filter(c => 
    c.studentIds.includes(currentUser.id) || c.teacherId === currentUser.id
  );

  const activeClasses = myCourses.flatMap(course => 
    course.schedule
      .filter(s => s.day === selectedDay)
      .map(s => ({
        ...course,
        startTime: s.startTime,
        endTime: s.endTime,
        startMinutes: timeToMinutes(s.startTime),
        userRoleInCourse: course.teacherId === currentUser.id ? 'EĞİTMEN' : 'ÖĞRENCİ'
      }))
  ).sort((a, b) => a.startMinutes - b.startMinutes);

  const weekDays = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="w-full page-transition px-4 space-y-6 pt-4 transition-colors">
      <div className="flex justify-between bg-slate-50 dark:bg-slate-900 p-1.5 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 shadow-inner">
        {weekDays.map((dayIdx) => {
          const isActive = selectedDay === dayIdx;
          const isToday = today === dayIdx;
          return (
            <button
              key={dayIdx}
              onClick={() => setSelectedDay(dayIdx)}
              className={`flex-1 min-w-[42px] py-3 rounded-2xl flex flex-col items-center justify-center transition-all ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105 z-10' 
                  : 'text-slate-400 dark:text-slate-600 active:bg-slate-100 dark:active:bg-slate-800'
              }`}
            >
              <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'opacity-70' : ''}`}>
                {SHORT_DAYS[dayIdx]}
              </span>
              <span className="text-sm font-bold mt-0.5">{dayIdx === 0 ? 7 : dayIdx}</span>
              {isToday && !isActive && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1"></div>}
            </button>
          );
        })}
      </div>

      <div className="space-y-4 pb-10">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">
            {DAYS[selectedDay]} PROGRAMI
          </h3>
          <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded-lg">{activeClasses.length} DERS</span>
        </div>

        {activeClasses.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
            <span className="text-3xl mb-3 opacity-30">🎐</span>
            <p className="text-[9px] font-bold text-slate-300 dark:text-slate-700 uppercase tracking-widest">Ders planlanmamış</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeClasses.map((cls, i) => {
              const isTrainer = cls.userRoleInCourse === 'EĞİTMEN';
              return (
                <button 
                  key={i} 
                  onClick={() => onCourseClick(cls.id)}
                  className="w-full text-left bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all group"
                >
                  <div className="flex flex-col items-center justify-center w-12 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shrink-0">
                    <span className="text-[10px] font-black text-slate-900 dark:text-slate-200 leading-none">{cls.startTime}</span>
                    <div className="w-3 h-[1px] bg-slate-200 dark:bg-slate-700 my-1.5"></div>
                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 leading-none">{cls.endTime}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight group-hover:text-indigo-600 transition-colors">{cls.title}</h4>
                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-tighter">
                      {isTrainer ? 'Kurum: ' + cls.schoolId.toUpperCase() : 'Eğitmen: ' + MOCK_USERS.find(u => u.id === cls.teacherId)?.name.split(' ')[0]}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[9px] font-medium text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      <span className="truncate">{cls.location || 'Konum Belirtilmedi'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter ${
                      isTrainer ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      {cls.userRoleInCourse}
                    </div>
                    <div className="p-1 text-slate-300 group-hover:text-indigo-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
