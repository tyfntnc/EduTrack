
import React from 'react';
import { MOCK_COURSES, MOCK_USERS, DAYS } from '../constants';
import { User } from '../types';

interface CalendarProps {
  currentUser: User;
}

export const Calendar: React.FC<CalendarProps> = ({ currentUser }) => {
  const today = new Date();
  const currentDayIdx = today.getDay();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  const timeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const myCourses = MOCK_COURSES.filter(c => 
    c.studentIds.includes(currentUser.id) || c.teacherId === currentUser.id
  );

  const weeklySchedule = [1, 2, 3, 4, 5, 6, 0].map(dayIdx => {
    const dayClasses = myCourses.flatMap(course => 
      course.schedule
        .filter(s => s.day === dayIdx)
        .map(s => ({
          ...course,
          startTime: s.startTime,
          endTime: s.endTime,
          startMinutes: timeToMinutes(s.startTime),
          endMinutes: timeToMinutes(s.endTime),
          userRoleInCourse: course.teacherId === currentUser.id ? 'EĞİTMEN' : 'ÖĞRENCİ'
        }))
    ).sort((a, b) => a.startMinutes - b.startMinutes);

    return { dayIdx, classes: dayClasses };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <header>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-[1px] w-8 bg-amber-500" />
          <p className="text-amber-600 text-[10px] font-black uppercase tracking-widest">Programım</p>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Eğitim Takvimi</h2>
      </header>

      <div className="space-y-6">
        {weeklySchedule.map(({ dayIdx, classes }) => {
          const isToday = dayIdx === currentDayIdx;
          return (
            <div key={dayIdx} className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isToday ? 'text-indigo-600' : 'text-slate-300'}`}>
                  {DAYS[dayIdx]}
                </span>
                {isToday && <span className="bg-indigo-100 text-indigo-600 text-[8px] font-black px-2 py-0.5 rounded-full">BUGÜN</span>}
                <div className={`flex-1 h-[1px] ${isToday ? 'bg-indigo-50' : 'bg-slate-50'}`} />
              </div>

              {classes.length === 0 ? (
                <div className="p-6 rounded-[2rem] border-2 border-dashed border-slate-50 flex items-center justify-center text-slate-300 text-[10px] font-bold uppercase italic">
                  Aktivite Yok
                </div>
              ) : (
                <div className="space-y-3">
                  {classes.map((cls, i) => {
                    const isNow = isToday && currentTimeInMinutes >= cls.startMinutes && currentTimeInMinutes <= cls.endMinutes;
                    const isTrainer = cls.userRoleInCourse === 'EĞİTMEN';

                    return (
                      <div key={i} className={`relative p-5 rounded-[2rem] border transition-all ${
                        isNow ? 'bg-indigo-600 border-indigo-600 shadow-xl scale-[1.02]' : 'bg-white border-slate-100 shadow-sm'
                      }`}>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <span className={`text-[7px] font-black px-2 py-1 rounded-lg border uppercase tracking-widest ${
                            isNow ? 'bg-white/20 text-white border-white/20' : isTrainer ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {cls.userRoleInCourse}
                          </span>
                        </div>

                        <div className="flex items-center gap-5">
                          <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border ${isNow ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                            <span className="text-[10px] font-black">{cls.startTime}</span>
                            <div className={`w-3 h-[1px] my-1 ${isNow ? 'bg-white/30' : 'bg-slate-200'}`} />
                            <span className="text-[8px] font-bold opacity-60">{cls.endTime}</span>
                          </div>
                          <div>
                            <h4 className={`text-sm font-bold tracking-tight ${isNow ? 'text-white' : 'text-slate-900'}`}>{cls.title}</h4>
                            <p className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${isNow ? 'text-white/70' : 'text-slate-400'}`}>
                               {isTrainer ? 'SİZİN DERSİNİZ' : MOCK_USERS.find(u => u.id === cls.teacherId)?.name}
                            </p>
                          </div>
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
