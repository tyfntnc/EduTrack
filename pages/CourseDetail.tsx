
import React from 'react';
import { MOCK_USERS } from '../constants';
import { User, Course, IndividualLesson } from '../types';
import { MapService } from '../services/mapService';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  currentUser: User;
  courses: Course[];
  individualLessons: IndividualLesson[];
  onUserClick?: (uid: string) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ 
  courseId, 
  onBack, 
  currentUser, 
  courses, 
  individualLessons, 
  onUserClick 
}) => {
  const course = courses.find(c => c.id === courseId);
  const indLesson = individualLessons.find(l => l.id === courseId);

  if (!course && !indLesson) return null;

  const isIndividual = !!indLesson;
  const title = isIndividual ? indLesson!.title : course!.title;
  const teacherId = isIndividual ? (indLesson!.role === 'given' ? currentUser.id : 'unknown') : course!.teacherId;
  const teacher = MOCK_USERS.find(u => u.id === teacherId);
  const teacherName = teacher?.name || (isIndividual && indLesson!.role === 'given' ? 'Sen (Eğitmen)' : 'Eğitmen');
  
  const studentList = isIndividual 
    ? indLesson!.students 
    : MOCK_USERS.filter(u => course!.studentIds.includes(u.id));

  const location = isIndividual ? 'Bireysel Çalışma' : (course!.location || 'A Sahası');
  const address = isIndividual ? '' : course!.address;
  const notes = isIndividual ? indLesson!.description : (course!.instructorNotes || 'Bu kurs için eğitmen notu bulunmamaktadır.');
  const time = isIndividual ? indLesson!.time : (course!.schedule[0]?.startTime + ' - ' + course!.schedule[0]?.endTime);

  const handleLocationClick = () => {
    if (address || location) {
      const url = MapService.getMapsSearchUrl(location, address);
      window.open(url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-50 dark:bg-slate-950 flex flex-col page-transition overflow-y-auto no-scrollbar pb-32">
      
      {/* --- GLASS HEADER --- */}
      <header className="sticky top-0 z-[510] px-6 py-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-white/20 dark:border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={onBack} className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-all shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 truncate leading-none uppercase tracking-tight">{title}</h2>
              {isIndividual && <span className="text-[6px] font-black bg-cyan-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Bireysel</span>}
            </div>
            <p className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1.5">EĞİTİM DETAYLARI</p>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 space-y-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* --- GLASS EĞİTMEN KARTI --- */}
        <section 
          onClick={() => teacher && onUserClick?.(teacher.id)}
          className="bg-white/70 dark:bg-indigo-900/10 backdrop-blur-md rounded-[2.5rem] p-5 border border-white/40 dark:border-indigo-500/10 shadow-[0_8px_32px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-all hover:border-indigo-500/20 active:scale-[0.98] cursor-pointer"
        >
          <div className="w-16 h-16 rounded-[1.8rem] bg-white dark:bg-slate-800 shrink-0 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
            <img src={teacher?.avatar || `https://ui-avatars.com/api/?name=${teacherName}`} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest">AKTİF EĞİTMEN</span>
             </div>
            <h3 className="text-[13px] font-black text-slate-900 dark:text-slate-100 leading-none truncate uppercase tracking-tight">{teacherName}</h3>
            <p className="text-[8px] font-bold text-slate-400 mt-2 uppercase tracking-tighter italic">Profil Detayı İçin Dokun</p>
          </div>
        </section>

        {/* --- GLASS METRİKLER --- */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-[2.2rem] border border-white/20 dark:border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-2">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">DERS ZAMANI</span>
            <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 leading-none">{time}</p>
            <div className="w-6 h-1 bg-indigo-500 rounded-full mt-1"></div>
          </div>
          <button 
            onClick={handleLocationClick}
            className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-[2.2rem] border border-white/20 dark:border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-2 text-left active:scale-95 transition-all group"
          >
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">KONUM BİLGİSİ</span>
            <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 truncate group-hover:underline">{location}</p>
            <div className="w-6 h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1"></div>
          </button>
        </section>

        {/* --- GLASS EĞİTMEN NOTLARI --- */}
        <section className="bg-amber-50/50 dark:bg-amber-900/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-amber-100/50 dark:border-amber-900/20 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-1.5 h-3 bg-amber-400 rounded-full"></div>
             <span className="text-[8px] font-black text-amber-600/70 dark:text-amber-400/70 uppercase tracking-widest">EĞİTMEN ÖZEL NOTU</span>
          </div>
          <p className="text-[10px] font-medium text-amber-900/80 dark:text-amber-300/80 leading-relaxed italic">
            "{notes}"
          </p>
        </section>

        {/* --- GLASS ÖĞRENCİ LİSTESİ --- */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SINIF MEVCUDU</h3>
              <div className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                <span className="text-[8px] font-black text-slate-500 dark:text-slate-400">{studentList.length} Kişi</span>
              </div>
           </div>
           
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
              {studentList.length === 0 ? (
                <p className="text-[9px] font-bold text-slate-300 py-4 uppercase">Kayıtlı öğrenci bulunmamaktadır.</p>
              ) : (
                studentList.map((s, i) => {
                  const name = 'name' in s ? s.name : 'Öğrenci';
                  const avatar = 'avatar' in s ? (s as any).avatar : `https://ui-avatars.com/api/?name=${name}`;
                  const id = 'id' in s ? (s as any).id : `idx-${i}`;

                  return (
                    <button 
                      key={id} 
                      onClick={() => onUserClick?.(id)}
                      className="flex flex-col items-center gap-2.5 shrink-0 active:scale-90 transition-transform group"
                    >
                      <div className="w-14 h-14 rounded-[1.8rem] bg-white/70 dark:bg-slate-900 backdrop-blur-sm border border-white/40 dark:border-slate-800 p-0.5 overflow-hidden shadow-sm group-hover:border-indigo-500/30">
                        <img src={avatar} className="w-full h-full object-cover rounded-[1.5rem]" alt="" />
                      </div>
                      <span className="text-[7px] font-black text-slate-400 group-hover:text-indigo-600 transition-colors w-14 truncate text-center uppercase tracking-tighter">{name.split(' ')[0]}</span>
                    </button>
                  );
                })
              )}
           </div>
        </section>

        {/* --- GLASS YOKLAMA GEÇMİŞİ --- */}
        <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800 rounded-[2.8rem] p-7 shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[9px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest leading-none">KATILIM ISI HARİTASI</h3>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div><span className="text-[6px] font-black text-slate-400 uppercase">Var</span></div>
               <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div><span className="text-[6px] font-black text-slate-400 uppercase">Yok</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => (
              <span key={i} className="text-[7px] font-black text-slate-300 dark:text-slate-700 uppercase mb-2">{d}</span>
            ))}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const isPresent = [2, 5, 9, 12, 16, 19, 23, 26, 30].includes(day);
              const isAbsent = [7, 14, 21, 28].includes(day);
              
              return (
                <div key={i} className="h-8 flex flex-col items-center justify-center gap-1 relative group">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 group-hover:text-indigo-500 transition-colors">{day}</span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isPresent ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : isAbsent ? 'bg-rose-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                </div>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PERFORMANS SKORU</span>
             <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">%92 KATILIM</span>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
};
