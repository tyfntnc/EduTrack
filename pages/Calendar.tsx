
import React from 'react';
import { MOCK_COURSES, MOCK_USERS, DAYS, SHORT_DAYS } from '../constants';
import { User, Course } from '../types';

interface CalendarProps {
  currentUser: User;
}

export const Calendar: React.FC<CalendarProps> = ({ currentUser }) => {
  const today = new Date();
  const currentDayIdx = today.getDay(); // 0-6
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Helper to parse "HH:mm" to minutes for comparison
  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Get all courses the student is enrolled in
  const studentCourses = MOCK_COURSES.filter(c => c.studentIds.includes(currentUser.id));

  // Build the weekly schedule: Map each day to its courses
  const weeklySchedule = [1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
    const dayClasses = studentCourses.flatMap(course => 
      course.schedule
        .filter(s => s.day === dayIdx)
        .map(s => ({
          ...course,
          startTime: s.startTime,
          endTime: s.endTime,
          startMinutes: timeToMinutes(s.startTime),
          endMinutes: timeToMinutes(s.endTime)
        }))
    ).sort((a, b) => a.startMinutes - b.startMinutes);

    return { dayIdx, classes: dayClasses };
  });

  const getInstructor = (id: string) => MOCK_USERS.find(u => u.id === id)?.name || 'Eğitmen';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-[1px] w-8 bg-amber-500" />
          <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">Haftalık Program</p>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Eğitim Takvimi</h2>
        <p className="text-slate-500 text-xs mt-1 font-medium">Bu hafta sizi bekleyen tüm aktiviteler.</p>
      </header>

      <div className="space-y-6 pb-10">
        {weeklySchedule.map(({ dayIdx, classes }) => {
          const isToday = dayIdx === currentDayIdx;
          
          return (
            <div key={dayIdx} className={`space-y-3 ${isToday ? 'relative' : ''}`}>
              <div className="flex items-center gap-3 px-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-indigo-600' : 'text-slate-300'}`}>
                  {DAYS[dayIdx]}
                </span>
                {isToday && (
                  <span className="bg-indigo-100 text-indigo-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm border border-indigo-200">
                    BUGÜN
                  </span>
                )}
                <div className={`flex-1 h-[1px] ${isToday ? 'bg-indigo-100' : 'bg-slate-50'}`} />
              </div>

              {classes.length === 0 ? (
                <div className="p-6 rounded-[2rem] border-2 border-dashed border-slate-50 flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase tracking-widest italic">
                  Ders Planlanmadı
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls, i) => {
                    const isPast = (dayIdx < currentDayIdx) || (isToday && cls.endMinutes < currentTimeInMinutes);
                    const isFuture = (dayIdx > currentDayIdx) || (isToday && cls.startMinutes > currentTimeInMinutes);
                    const isNow = isToday && currentTimeInMinutes >= cls.startMinutes && currentTimeInMinutes <= cls.endMinutes;

                    return (
                      <div 
                        key={`${cls.id}-${i}`}
                        className={`relative group p-5 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                          isNow 
                            ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 scale-[1.02]' 
                            : isPast 
                              ? 'bg-slate-50 border-slate-50 opacity-40 grayscale-[0.5]' 
                              : 'bg-white border-slate-100 shadow-sm hover:shadow-lg'
                        }`}
                      >
                        {/* Status Glow for 'Now' */}
                        {isNow && (
                          <div className="absolute top-0 right-0 p-4">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-5">
                          <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border transition-colors ${
                            isNow ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'
                          }`}>
                            <span className={`text-[10px] font-black ${isNow ? 'text-white' : 'text-slate-900'}`}>{cls.startTime}</span>
                            <div className={`w-3 h-[1px] my-1 ${isNow ? 'bg-white/30' : 'bg-slate-200'}`} />
                            <span className={`text-[8px] font-bold ${isNow ? 'text-white/60' : 'text-slate-400'}`}>{cls.endTime}</span>
                          </div>

                          <div className="flex-1">
                            <h4 className={`text-sm font-bold tracking-tight mb-0.5 ${isNow ? 'text-white' : 'text-slate-900'}`}>
                              {cls.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <p className={`text-[9px] font-bold uppercase tracking-wider ${isNow ? 'text-white/70' : 'text-slate-400'}`}>
                                {getInstructor(cls.teacherId)}
                              </p>
                              <div className={`w-1 h-1 rounded-full ${isNow ? 'bg-white/30' : 'bg-slate-200'}`} />
                              <p className={`text-[9px] font-bold uppercase tracking-wider ${isNow ? 'text-white/70' : 'text-slate-400'}`}>
                                SAHA 1
                              </p>
                            </div>
                          </div>

                          {isNow && (
                            <button className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-lg active:scale-90 transition-all">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3l14 9-14 9V3z"></path></svg>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
