
import React, { useState, useMemo } from 'react';
import { MOCK_USERS, SHORT_DAYS } from '../constants';
import { User, Course, IndividualLesson } from '../types';

interface CalendarProps {
  currentUser: User;
  onCourseClick: (courseId: string) => void;
  courses: Course[];
  individualLessons: IndividualLesson[];
}

export const Calendar: React.FC<CalendarProps> = ({ currentUser, onCourseClick, courses, individualLessons }) => {
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(baseDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [baseDate]);

  const activeSchedule = useMemo(() => {
    const dayOfWeek = selectedDate.getDay();
    const dateStr = selectedDate.toISOString().split('T')[0];
    const regular = courses.filter(c => (c.studentIds.includes(currentUser.id) || c.teacherId === currentUser.id) && c.schedule.some(s => s.day === dayOfWeek))
      .flatMap(c => c.schedule.filter(s => s.day === dayOfWeek).map(s => ({ id: c.id, title: c.title, startTime: s.startTime, type: 'regular', teacher: MOCK_USERS.find(u => u.id === c.teacherId)?.name.split(' ')[0] })));
    const ind = individualLessons.filter(l => l.date === dateStr).map(l => ({ id: l.id, title: l.title, startTime: l.time, type: 'individual', teacher: l.role === 'given' ? 'Sen' : 'Eğitmen' }));
    return [...regular, ...ind].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [selectedDate, currentUser.id, courses, individualLessons]);

  return (
    <div className="w-full page-transition px-4 space-y-3 pt-3 pb-24 overflow-hidden transition-all text-left h-full">
      <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/20 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{weekDays[0].toLocaleString('tr-TR', { month: 'short' }).toUpperCase()} {weekDays[0].getFullYear()}</h3>
           <div className="flex gap-1.5">
             <button onClick={() => { const d = new Date(baseDate); d.setDate(d.getDate()-7); setBaseDate(d); }} className="w-7 h-7 bg-white/50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 border border-white/20 active:scale-90"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="15 18 9 12 15 6"/></svg></button>
             <button onClick={() => { const d = new Date(baseDate); d.setDate(d.getDate()+7); setBaseDate(d); }} className="w-7 h-7 bg-white/50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 border border-white/20 active:scale-90"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="9 18 15 12 9 6"/></svg></button>
           </div>
        </div>
        <div className="flex justify-between">
          {weekDays.map((date, i) => {
            const isActive = date.getDate() === selectedDate.getDate() && date.getMonth() === selectedDate.getMonth();
            return (
              <button key={i} onClick={() => setSelectedDate(date)} className={`flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-2xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md -translate-y-1' : ''}`}>
                <span className={`text-[5px] font-black uppercase tracking-widest ${isActive ? 'text-white/60' : 'text-slate-300'}`}>{SHORT_DAYS[date.getDay()]}</span>
                <span className={`text-[10px] font-black ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{date.getDate()}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="space-y-1.5">
        <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">DERSLER</h3>
        {activeSchedule.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center bg-white/30 dark:bg-slate-900/20 backdrop-blur-md rounded-[2.5rem] border border-dashed border-white/20 dark:border-slate-800/50">
            <p className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">PLAN BULUNMUYOR</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {activeSchedule.map((item, i) => (
              <button key={i} onClick={() => onCourseClick(item.id)} className="w-full p-3 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md rounded-[1.5rem] border border-white/20 dark:border-slate-800 flex items-center gap-3 active:scale-[0.98] transition-all shadow-sm">
                <div className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-[9px] font-black text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700">{item.startTime}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[9px] font-black text-slate-800 dark:text-slate-100 truncate uppercase tracking-tight leading-none mb-1">{item.title}</h4>
                  <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest italic">{item.teacher}</p>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-200"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
