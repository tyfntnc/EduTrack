
import React, { useState } from 'react';
import { MOCK_COURSES, MOCK_USERS } from '../constants';
import { User } from '../types';
import { MapService } from '../services/mapService';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  currentUser: User;
  onUserClick?: (userId: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ courseId, onBack, currentUser, onUserClick }) => {
  const [viewMode, setViewMode] = useState<'info' | 'manual-attendance' | 'qr-attendance'>('info');
  const [attendanceList, setAttendanceList] = useState<Record<string, boolean>>({});
  
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const teacher = MOCK_USERS.find(u => u.id === course?.teacherId);
  if (!course) return null;
  const students = MOCK_USERS.filter(u => course.studentIds.includes(u.id));
  const classmates = students.filter(u => u.id !== currentUser.id);

  const isTeacherOfThisCourse = currentUser.id === course.teacherId;

  // Koordinat tespiti (Regex ile)
  const isCoord = course.address ? MapService.isCoordinates(course.address) : false;

  const handleLocationClick = () => {
    const url = MapService.getMapsSearchUrl(course.location || '', course.address);
    window.open(url, '_blank');
  };

  const saveAttendance = () => {
    alert('Yoklama başarıyla kaydedildi! ✅');
    setViewMode('info');
  };

  const presentDays = [2, 9, 16, 23];
  const absentDays = [4, 11, 18, 25];

  if (viewMode === 'manual-attendance') {
    return (
      <div className="w-full h-full flex flex-col page-transition px-4 space-y-3 pb-24 pt-1 transition-all overflow-hidden">
        <header className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('info')} className="w-7 h-7 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <h2 className="text-[11px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">MANUEL YOKLAMA</h2>
          </div>
          <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">HAZİRAN 2024</span>
        </header>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-4 shadow-sm flex flex-col overflow-hidden">
           <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
              {students.map(student => (
                <div key={student.id} className="flex items-center justify-between p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-0.5 overflow-hidden">
                        <img src={student.avatar} className="w-full h-full object-cover rounded-lg" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">{student.name}</span>
                   </div>
                   <div className="flex gap-1.5">
                      <button 
                        onClick={() => setAttendanceList({...attendanceList, [student.id]: true})}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${attendanceList[student.id] ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-300'}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </button>
                      <button 
                        onClick={() => setAttendanceList({...attendanceList, [student.id]: false})}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${attendanceList[student.id] === false ? 'bg-rose-500 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-300'}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                   </div>
                </div>
              ))}
           </div>
           <button 
             onClick={saveAttendance}
             className="w-full py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg mt-4 active:scale-95 transition-all"
           >
             YOKLAMAYI TAMAMLA
           </button>
        </div>
      </div>
    );
  }

  if (viewMode === 'qr-attendance') {
    return (
      <div className="fixed inset-0 z-[600] bg-slate-950 flex flex-col p-6 animate-in fade-in duration-500">
        <header className="flex justify-between items-center mb-8">
           <div className="text-white">
              <h2 className="text-sm font-black uppercase tracking-widest font-black leading-none">HIZLI QR YOKLAMA</h2>
              <p className="text-[8px] font-bold text-white/50 mt-1 uppercase tracking-tight">{course.title}</p>
           </div>
           <button onClick={() => setViewMode('info')} className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center">
           <div className="relative w-full aspect-square max-w-[280px]">
              <div className="absolute inset-0 border-[3px] border-white/20 rounded-[3rem]"></div>
              <div className="absolute inset-0 border-[3px] border-indigo-500 rounded-[3rem] animate-pulse"></div>
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-indigo-500 rounded-tl-[3rem]"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-indigo-500 rounded-tr-[3rem]"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-indigo-500 rounded-bl-[3rem]"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-indigo-500 rounded-br-[3rem]"></div>
              <div className="absolute inset-8 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-16 h-1 bg-indigo-500/40 rounded-full animate-flame-rise"></div>
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] opacity-40">ÖĞRENCİ QR OKUTUN</p>
              </div>
           </div>
           <p className="mt-8 text-white/40 text-[9px] font-bold uppercase tracking-widest text-center px-12 leading-relaxed">Kamerayı öğrencinin dijital kimliğindeki QR koda hizalayın.</p>
        </div>
        <button 
          onClick={() => { alert('Öğrenci Doğrulandı: Mehmet Kaya ✅'); setViewMode('info'); }}
          className="w-full py-4 bg-white/10 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] backdrop-blur-md border border-white/10 mb-4"
        >
          SIMULE: OKUMA YAPILDI
        </button>
      </div>
    );
  }

  return (
    <div className="w-full page-transition px-4 space-y-2 pb-24 pt-1 transition-all overflow-hidden relative">
      <header className="flex items-center gap-2 mb-1">
        <button onClick={onBack} className="w-7 h-7 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg flex items-center justify-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="min-w-0">
          <h2 className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate leading-none uppercase tracking-tight">{course.title}</h2>
          <p className="text-[6px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-0.5">KURS AYRINTISI</p>
        </div>
      </header>

      {isTeacherOfThisCourse && (
        <section className="grid grid-cols-2 gap-2 mt-1">
           <button onClick={() => setViewMode('qr-attendance')} className="bg-indigo-600 p-2.5 rounded-2xl text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span className="text-[8px] font-black uppercase tracking-widest">HIZLI YOKLAMA</span>
           </button>
           <button onClick={() => setViewMode('manual-attendance')} className="bg-slate-900 dark:bg-slate-800 p-2.5 rounded-2xl text-white flex flex-col items-center justify-center gap-1 shadow-lg active:scale-95 transition-all">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
              <span className="text-[8px] font-black uppercase tracking-widest">MANUEL YOKLAMA</span>
           </button>
        </section>
      )}

      <section className="grid grid-cols-2 gap-1.5">
        <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-50 dark:border-slate-800 flex flex-col gap-0.5 shadow-sm">
          <span className="text-[5px] font-black text-slate-400 uppercase tracking-widest">ZAMAN</span>
          <p className="text-[9px] font-bold text-slate-700 dark:text-slate-200">{course.schedule[0].startTime} - {course.schedule[0].endTime}</p>
        </div>
        
        <button onClick={handleLocationClick} className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-50 dark:border-slate-800 flex flex-col gap-0.5 shadow-sm text-left active:scale-95 transition-all relative overflow-hidden">
          <div className="flex justify-between items-center w-full">
            <span className="text-[5px] font-black text-slate-400 uppercase tracking-widest">KONUM</span>
            {isCoord && <span className="text-[5px] font-black bg-emerald-500 text-white px-1 py-0.5 rounded uppercase tracking-widest">Hassas</span>}
          </div>
          <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 truncate leading-tight">
            {course.location || 'Konum Bilgisi Yok'}
          </p>
          <p className="text-[6px] font-medium text-slate-400 truncate opacity-70">
            {isCoord ? 'Koordinat ile işaretli' : (course.address || 'Haritada Gör')}
          </p>
        </button>
      </section>

      {/* Instructor Card */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-2.5 text-white flex items-center gap-2.5 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-9 h-9 rounded-xl bg-white/10 shrink-0 overflow-hidden border border-white/10" onClick={() => teacher && onUserClick?.(teacher.id)}>
          <img src={teacher?.avatar} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-[10px] font-bold leading-none mb-1 truncate">{teacher?.name}</h3>
          <p className="text-[6px] font-black text-indigo-400 uppercase tracking-widest">EĞİTMEN</p>
        </div>
        <div className="flex gap-1.5 px-1 border-l border-white/10">
          <button className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center text-white active:scale-90 transition-transform">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </button>
          <button className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 active:scale-90 transition-transform">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
          </button>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/10 p-2 rounded-xl border border-amber-100/50 dark:border-amber-900/20">
        <p className="text-[8.5px] font-medium text-amber-800/80 dark:text-amber-300/80 leading-tight italic line-clamp-2">"{course.instructorNotes || 'Not yok.'}"</p>
      </div>

      <section className="space-y-1">
        <h3 className="text-[6px] font-black text-slate-400 uppercase tracking-widest px-1">SINIF MEVCUDU</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {classmates.slice(0, 6).map(user => (
            <div key={user.id} onClick={() => onUserClick?.(user.id)} className="flex flex-col items-center gap-1 shrink-0 active:scale-90 transition-transform">
               <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-0.5"><img src={user.avatar} className="w-full h-full object-cover rounded-md" /></div>
               <span className="text-[6px] font-bold text-slate-500 w-8 truncate text-center uppercase">{user.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm space-y-2">
        <div className="flex items-center justify-between px-1">
          <p className="text-[7px] font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">HAZİRAN 2024</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1"><div className="w-1 h-1 bg-emerald-500 rounded-full"></div><span className="text-[5px] font-black text-slate-400">VAR</span></div>
            <div className="flex items-center gap-1"><div className="w-1 h-1 bg-rose-500 rounded-full"></div><span className="text-[5px] font-black text-slate-400">YOK</span></div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d,i) => <span key={i} className="text-[6px] font-black text-slate-300 uppercase">{d}</span>)}
          {Array.from({ length: 30 }).map((_, i) => {
            const dayNum = i + 1;
            const isPresent = presentDays.includes(dayNum);
            const isAbsent = absentDays.includes(dayNum);
            return (
              <div key={i} className="h-5 flex items-center justify-center text-[7.5px] font-bold text-slate-400">
                {isPresent ? (
                  <div className="w-4 h-4 bg-emerald-500 rounded-md flex items-center justify-center text-white shadow-sm">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                ) : isAbsent ? (
                  <div className="w-4 h-4 bg-rose-500 rounded-md flex items-center justify-center text-white shadow-sm">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </div>
                ) : dayNum}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
