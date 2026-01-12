
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_COURSES, SHORT_DAYS, DAYS } from '../constants';
import { User, UserRole, Course } from '../types';

interface AttendanceProps {
  currentUser: User;
}

export const Attendance: React.FC<AttendanceProps> = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isGivenExpanded, setIsGivenExpanded] = useState(true);
  const [isTakenExpanded, setIsTakenExpanded] = useState(true);

  // Filter Logic
  const filterByTitle = (c: Course) => c.title.toLowerCase().includes(searchTerm.toLowerCase());
  
  const coursesGiven = MOCK_COURSES.filter(c => c.teacherId === currentUser.id && filterByTitle(c));
  const coursesTaken = MOCK_COURSES.filter(c => c.studentIds.includes(currentUser.id) && filterByTitle(c));

  const StudentAvatarsMinimal = ({ studentIds }: { studentIds: string[] }) => {
    return (
      <div className="flex -space-x-1.5 overflow-hidden">
        {studentIds.slice(0, 3).map((sid, idx) => {
          const student = MOCK_USERS.find(u => u.id === sid);
          return (
            <img key={idx} src={student?.avatar} className="inline-block h-5 w-5 rounded-full ring-1 ring-white object-cover shadow-sm" alt="s" />
          );
        })}
        {studentIds.length > 3 && (
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-100 ring-1 ring-white text-[6px] font-black text-slate-500 shadow-sm">
            +{studentIds.length - 3}
          </div>
        )}
      </div>
    );
  };

  const CompactWeeklyTracker = ({ course }: { course: Course }) => {
    const today = new Date().getDay();
    // Monday to Sunday order
    const weekDays = [1, 2, 3, 4, 5, 6, 0];
    return (
      <div className="flex gap-1">
        {weekDays.map((dayIdx) => {
          const isClassDay = course.schedule.some(s => s.day === dayIdx);
          const isToday = dayIdx === today;
          
          return (
            <div 
              key={dayIdx} 
              className={`w-5 h-6 rounded-md flex flex-col items-center justify-center transition-all ${
                isClassDay 
                  ? isToday ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-300'
              }`}
            >
              <span className="text-[5px] font-black uppercase leading-none mb-0.5">{SHORT_DAYS[dayIdx][0]}</span>
              {isClassDay && <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-indigo-400'}`} />}
            </div>
          );
        })}
      </div>
    );
  };

  // --- DETAIL VIEW ---
  if (selectedCourseId) {
    const course = MOCK_COURSES.find(c => c.id === selectedCourseId)!;
    const isTeacher = course.teacherId === currentUser.id;
    const instructor = MOCK_USERS.find(u => u.id === course.teacherId);
    const students = MOCK_USERS.filter(u => course.studentIds.includes(u.id));

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedCourseId(null)} 
            className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 active:scale-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-black text-slate-900 leading-tight">{course.title}</h2>
            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest">{isTeacher ? 'YÖNETİĞİNİZ DERS' : 'KATILDIĞINIZ DERS'}</p>
          </div>
        </header>

        <section className="bg-slate-900 rounded-[2.5rem] p-6 text-white shadow-xl shadow-slate-200 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">EĞİTMEN</p>
              <div className="flex items-center gap-2">
                <img src={instructor?.avatar} className="w-6 h-6 rounded-lg object-cover border border-white/20" alt="i" />
                <p className="text-sm font-bold">{instructor?.name}</p>
              </div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">KONTENJAN</p>
              <p className="text-sm font-bold">{course.studentIds.length} Öğrenci</p>
            </div>
          </div>

          <div className="bg-white/10 rounded-3xl p-4 border border-white/5">
             <p className="text-[8px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-3">HAFTALIK PROGRAM</p>
             <div className="grid grid-cols-4 gap-2">
                {course.schedule.map((s, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
                    <p className="text-[9px] font-black text-white">{DAYS[s.day]}</p>
                    <p className="text-[8px] font-bold text-white/50">{s.startTime} - {s.endTime}</p>
                  </div>
                ))}
             </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Öğrenci Listesi</h3>
            <span className="text-[9px] font-black text-slate-400 uppercase">{students.length} Kayıt</span>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {students.map(student => (
              <div key={student.id} className="bg-white border border-slate-100 p-3 rounded-2xl flex items-center gap-4 group">
                <div className="relative">
                  <img src={student.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-50 shadow-sm" alt={student.name} />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-800">{student.name}</p>
                  <p className="text-[9px] text-slate-400 font-medium">{student.email}</p>
                </div>
                <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Eğitimlerim</h2>
        <p className="text-slate-500 text-xs mt-1 font-medium italic">Sorumluluklarınız ve gelişim yolculuğunuz.</p>
      </header>

      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <input 
          type="text" placeholder="Ders Ara..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm"
        />
      </div>

      {/* 1. Verdiğim Eğitimler Portlet */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <button onClick={() => setIsGivenExpanded(!isGivenExpanded)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Verdiğim Eğitimler</h3>
            <span className="bg-indigo-50 text-indigo-500 text-[10px] font-black px-2 py-0.5 rounded-md">{coursesGiven.length}</span>
          </div>
          <svg className={`text-slate-300 transition-transform duration-300 ${isGivenExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {isGivenExpanded && (
          <div className="p-4 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {coursesGiven.slice(0, 5).map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCourseId(c.id)}
                className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:bg-white hover:border-indigo-200 transition-all group cursor-pointer flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{c.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <StudentAvatarsMinimal studentIds={c.studentIds} />
                    <span className="text-[9px] font-black text-slate-400 uppercase">{c.studentIds.length} Öğrenci</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                   <CompactWeeklyTracker course={c} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Aldığım Eğitimler Portlet */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <button onClick={() => setIsTakenExpanded(!isTakenExpanded)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50/50 transition-colors">
          <div className="flex items-center gap-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Aldığım Eğitimler</h3>
            <span className="bg-emerald-50 text-emerald-500 text-[10px] font-black px-2 py-0.5 rounded-md">{coursesTaken.length}</span>
          </div>
          <svg className={`text-slate-300 transition-transform duration-300 ${isTakenExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {isTakenExpanded && (
          <div className="p-4 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {coursesTaken.slice(0, 5).map(c => (
              <div 
                key={c.id} 
                onClick={() => setSelectedCourseId(c.id)}
                className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:bg-white hover:border-emerald-200 transition-all group cursor-pointer flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-emerald-600 transition-colors">{c.title}</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Hoca: {MOCK_USERS.find(u => u.id === c.teacherId)?.name.split(' ')[0]}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                   <CompactWeeklyTracker course={c} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
