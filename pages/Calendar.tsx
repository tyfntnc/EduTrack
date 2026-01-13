
import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_USERS, DAYS, SHORT_DAYS } from '../constants';
import { User } from '../types';

interface CalendarProps {
  currentUser: User;
}

export const Calendar: React.FC<CalendarProps> = ({ currentUser }) => {
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
    <div className="w-full page-transition px-4 space-y-6">
      <header className="pt-4 space-y-4">
        <div>
          <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-widest leading-none">Ajanda</p>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Eğitim Takvimim</h2>
        </div>

        {/* Day Picker - Fixed Width & Full Alignment */}
        <div className="flex justify-between bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-inner">
          {weekDays.map((dayIdx) => {
            const isActive = selectedDay === dayIdx;
            const isToday = today === dayIdx;
            return (
              <button
                key={dayIdx}
                onClick={() => setSelectedDay(dayIdx)}
                className={`flex-1 min-w-[42px] py-2.5 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isActive ? 'bg-indigo-600 text-white shadow-lg scale-105 z-10' : 'text-slate-400 active:bg-slate-100'
                }`}
              >
                <span className={`text-[8px] font-black uppercase tracking-tighter ${isActive ? 'opacity-70' : ''}`}>
                  {SHORT_DAYS[dayIdx]}
                </span>
                <span className="text-sm font-bold mt-0.5">{dayIdx === 0 ? 7 : dayIdx}</span>
                {isToday && !isActive && <div className="w-1 h-1 bg-indigo-600 rounded-full mt-1"></div>}
              </button>
            );
          })}
        </div>
      </header>

      {/* Class List Area */}
      <div className="space-y-3 pb-10">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {DAYS[selectedDay]} Programı
          </h3>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg">{activeClasses.length} Ders</span>
        </div>

        {activeClasses.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <span className="text-3xl mb-3 opacity-30">🎐</span>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Bu gün için ders yok</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeClasses.map((cls, i) => {
              const isTrainer = cls.userRoleInCourse === 'EĞİTMEN';
              return (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm active:scale-[0.98] transition-all">
                  <div className="flex flex-col items-center justify-center w-12 py-2 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                    <span className="text-[10px] font-bold text-slate-900">{cls.startTime}</span>
                    <div className="w-3 h-[1px] bg-slate-200 my-1"></div>
                    <span className="text-[8px] font-bold text-slate-400 leading-none">{cls.endTime}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate tracking-tight">{cls.title}</h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {isTrainer ? 'Kurum: ' + cls.schoolId.toUpperCase() : 'Hoca: ' + MOCK_USERS.find(u => u.id === cls.teacherId)?.name.split(' ')[0]}
                    </p>
                  </div>

                  <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-tighter shrink-0 ${
                    isTrainer ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {cls.userRoleInCourse}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
