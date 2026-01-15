
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
        userRoleInCourse: course.teacherId === currentUser.id ? 'EĞİTMEN' : 'ÖĞRENCİ'
      }))
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const weekDays = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="w-full page-transition px-4 space-y-2.5 pt-1 pb-24 transition-colors overflow-hidden">
      <div className="flex justify-between bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
        {weekDays.map((dayIdx) => {
          const isActive = selectedDay === dayIdx;
          const isToday = today === dayIdx;
          return (
            <button key={dayIdx} onClick={() => setSelectedDay(dayIdx)} className={`flex-1 py-1.5 rounded-lg flex flex-col items-center justify-center transition-all ${isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'}`}>
              <span className="text-[6px] font-black uppercase tracking-tighter">{SHORT_DAYS[dayIdx]}</span>
              <span className="text-[10px] font-bold">{dayIdx === 0 ? 7 : dayIdx}</span>
              {isToday && !isActive && <div className="w-1 h-1 bg-indigo-600 rounded-full mt-0.5"></div>}
            </button>
          );
        })}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[7px] font-black text-slate-400 uppercase tracking-widest">{DAYS[selectedDay]} PROGRAMI</h3>
        </div>

        {activeClasses.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-100 dark:border-slate-800">
            <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">Ders Bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {activeClasses.map((cls, i) => (
              <button key={i} onClick={() => onCourseClick(cls.id)} className="w-full text-left bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-50 dark:border-slate-800 flex items-center gap-3 active:scale-[0.98] transition-all">
                <div className="flex flex-col items-center justify-center w-8 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg shrink-0">
                  <span className="text-[8px] font-black text-slate-900 dark:text-slate-100">{cls.startTime}</span>
                  <span className="text-[5.5px] font-bold text-slate-400 tracking-tighter">{cls.endTime}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-100 truncate leading-none mb-1">{cls.title}</h4>
                  <p className="text-[7px] font-medium text-slate-400 truncate">{cls.userRoleInCourse === 'EĞİTMEN' ? 'Hoca Sensin' : MOCK_USERS.find(u => u.id === cls.teacherId)?.name.split(' ')[0]}</p>
                </div>
                <div className={`px-1 py-0.5 rounded-md text-[5.5px] font-black uppercase ${cls.userRoleInCourse === 'EĞİTMEN' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>{cls.userRoleInCourse}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
