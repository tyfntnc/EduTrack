
import React, { useState } from 'react';
import { UserRole, Course } from '../types';
import { MOCK_COURSES, MOCK_USERS, DAYS } from '../constants';

interface DashboardProps {
  userRole: UserRole;
  userName: string;
  currentUserId: string;
}

type AttendanceMode = 'qr' | 'manual' | null;

export const Dashboard: React.FC<DashboardProps> = ({ userRole, userName, currentUserId }) => {
  const [attendanceCourseId, setAttendanceCourseId] = useState<string | null>(null);
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>(null);
  const [presentIds, setPresentIds] = useState<string[]>([]);
  const [isGivenExpanded, setIsGivenExpanded] = useState(true);
  const [isTakenExpanded, setIsTakenExpanded] = useState(true);
  const [selectedCourseDetailId, setSelectedCourseDetailId] = useState<string | null>(null);

  const today = new Date().getDay();
  
  const coursesGiven = MOCK_COURSES.filter(c => c.teacherId === currentUserId);
  const todayGiven = coursesGiven.flatMap(course => 
    course.schedule.filter(s => s.day === today).map(s => ({
      ...course, startTime: s.startTime, endTime: s.endTime,
      startMinutes: parseInt(s.startTime.replace(':', '')), type: 'GIVEN'
    }))
  ).sort((a, b) => a.startMinutes - b.startMinutes);

  const coursesTaken = MOCK_COURSES.filter(c => c.studentIds.includes(currentUserId));
  const todayTaken = coursesTaken.flatMap(course => 
    course.schedule.filter(s => s.day === today).map(s => ({
      ...course, startTime: s.startTime, endTime: s.endTime,
      startMinutes: parseInt(s.startTime.replace(':', '')), type: 'TAKEN'
    }))
  ).sort((a, b) => a.startMinutes - b.startMinutes);

  const handleToggleStudent = (id: string) => {
    setPresentIds(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const handleSaveAttendance = () => {
    alert(`Yoklama başarıyla tamamlandı! (${presentIds.length} kişi mevcut)`);
    setAttendanceCourseId(null);
    setAttendanceMode(null);
    setPresentIds([]);
  };

  const CourseDetailModal = ({ courseId, onClose }: { courseId: string, onClose: () => void }) => {
    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (!course) return null;
    const instructor = MOCK_USERS.find(u => u.id === course.teacherId);
    const students = MOCK_USERS.filter(u => course.studentIds.includes(u.id));

    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
        <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh] flex flex-col">
          <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 z-20">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div className="overflow-y-auto no-scrollbar space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 leading-tight pr-8">{course.title}</h3>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest mt-1">Ders Detayları</p>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-5 text-white space-y-4">
              <div className="flex items-center gap-3">
                <img src={instructor?.avatar} className="w-8 h-8 rounded-xl border border-white/20" alt="i" />
                <div>
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">EĞİTMEN</p>
                  <p className="text-xs font-bold">{instructor?.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">PROGRAM</p>
                  <p className="text-[10px] font-bold">Haftalık {course.schedule.length} Saat</p>
                </div>
                <div>
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">KONTENJAN</p>
                  <p className="text-[10px] font-bold">{course.studentIds.length} Öğrenci</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Öğrenci Listesi</h4>
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={s.avatar} className="w-8 h-8 rounded-lg" alt={s.name} />
                    <span className="text-[11px] font-bold text-slate-700">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shrink-0">Kapat</button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {selectedCourseDetailId && <CourseDetailModal courseId={selectedCourseDetailId} onClose={() => setSelectedCourseDetailId(null)} />}
      
      {/* Attendance Dialog (Hybrid QR/Manual) */}
      {attendanceCourseId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setAttendanceCourseId(null); setAttendanceMode(null); }} />
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-7 relative z-10 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  {attendanceMode === 'qr' ? 'QR Okutma' : 'Manuel Yoklama'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {MOCK_COURSES.find(c => c.id === attendanceCourseId)?.title}
                </p>
              </div>
              <button onClick={() => { setAttendanceCourseId(null); setAttendanceMode(null); }} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {attendanceMode === 'qr' ? (
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="w-48 h-48 bg-slate-50 rounded-3xl border-4 border-dashed border-indigo-200 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>
                  <svg className="text-indigo-600 animate-bounce" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  <div className="absolute bottom-4 text-[10px] font-black text-indigo-400 uppercase tracking-widest">Öğrenci QR Kodunu Okutun</div>
                </div>
                <button onClick={() => setAttendanceMode('manual')} className="text-[10px] font-black text-indigo-600 underline uppercase tracking-widest">Manuel Listeye Geç</button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto no-scrollbar py-2">
                {MOCK_USERS.filter(u => MOCK_COURSES.find(c => c.id === attendanceCourseId)?.studentIds.includes(u.id)).map(student => (
                  <div key={student.id} onClick={() => handleToggleStudent(student.id)} className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${presentIds.includes(student.id) ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <img src={student.avatar} className="w-8 h-8 rounded-xl ring-2 ring-white" alt={student.name} />
                      <span className="text-[11px] font-bold">{student.name}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${presentIds.includes(student.id) ? 'bg-white text-indigo-600 border-white' : 'border-slate-200'}`}>
                      {presentIds.includes(student.id) && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button onClick={handleSaveAttendance} className="w-full bg-slate-900 text-white py-5 rounded-3xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              Yoklamayı Bitir ({presentIds.length} Mevcut)
            </button>
          </div>
        </div>
      )}

      <section>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-[1px] w-6 bg-indigo-200" />
          <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest leading-none">Bugün Ne Var?</p>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Selam, {userName.split(' ')[0]}</h2>
      </section>

      {/* 1. Verdiğim Eğitimler Portlet */}
      <section className="bg-white border border-slate-100 rounded-[2.25rem] overflow-hidden shadow-sm">
        <button onClick={() => setIsGivenExpanded(!isGivenExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
            </div>
            <div className="text-left">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verdiğim Eğitimler</h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bugün ({todayGiven.length} Ders)</p>
            </div>
          </div>
          <svg className={`text-slate-300 transition-transform duration-300 ${isGivenExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        
        {isGivenExpanded && (
          <div className="p-3 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {todayGiven.slice(0, 5).map((item, i) => (
              <div key={`given-${i}`} className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex items-center gap-3">
                <div 
                  onClick={() => setSelectedCourseDetailId(item.id)}
                  className="w-12 h-12 rounded-xl bg-indigo-600 flex flex-col items-center justify-center text-white shadow-md shadow-indigo-100 shrink-0 cursor-pointer active:scale-95 transition-all"
                >
                  <span className="text-[9px] font-black leading-none">{item.startTime}</span>
                  <div className="w-2 h-[1px] bg-white/20 my-1" />
                  <span className="text-[7px] font-bold text-white/50 leading-none">{item.endTime}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 onClick={() => setSelectedCourseDetailId(item.id)} className="font-bold text-slate-900 text-[11px] truncate cursor-pointer hover:text-indigo-600 transition-colors">{item.title}</h4>
                  <div className="flex gap-1.5 mt-1.5">
                    <button onClick={() => { setAttendanceCourseId(item.id); setAttendanceMode('qr'); }} className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-tighter text-indigo-600 flex items-center justify-center gap-1 active:scale-95 transition-all">
                      QR OKUT
                    </button>
                    <button onClick={() => { setAttendanceCourseId(item.id); setAttendanceMode('manual'); }} className="flex-1 bg-white border border-slate-200 py-1.5 rounded-lg text-[7px] font-black uppercase tracking-tighter text-slate-500 flex items-center justify-center gap-1 active:scale-95 transition-all">
                      MANUEL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. Aldığım Eğitimler Portlet */}
      <section className="bg-white border border-slate-100 rounded-[2.25rem] overflow-hidden shadow-sm">
        <button onClick={() => setIsTakenExpanded(!isTakenExpanded)} className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div className="text-left">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Aldığım Eğitimler</h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bugün ({todayTaken.length} Ders)</p>
            </div>
          </div>
          <svg className={`text-slate-300 transition-transform duration-300 ${isTakenExpanded ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        
        {isTakenExpanded && (
          <div className="p-3 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {todayTaken.slice(0, 5).map((item, i) => (
              <div 
                key={`taken-${i}`} 
                onClick={() => setSelectedCourseDetailId(item.id)}
                className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex items-center gap-3 group cursor-pointer hover:bg-white hover:border-emerald-200 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-900 shrink-0">
                  <span className="text-[9px] font-black leading-none">{item.startTime}</span>
                  <div className="w-2 h-[1px] bg-slate-100 my-1" />
                  <span className="text-[7px] font-bold text-slate-400 leading-none">{item.endTime}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-[11px] truncate group-hover:text-emerald-600 transition-colors">{item.title}</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Hoca: {MOCK_USERS.find(u => u.id === item.teacherId)?.name.split(' ')[0]}</p>
                </div>
                <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center text-slate-200 group-hover:text-emerald-600 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Motivational Card */}
      <section className="bg-slate-900 rounded-[2.25rem] p-6 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <h4 className="font-black text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-2">Haftalık Bakış</h4>
          <p className="text-xs font-medium leading-relaxed">Bu hafta toplam <span className="text-indigo-400 font-bold">12 saat</span> ders verdin. Katılım oranı <span className="text-emerald-400 font-bold">%88</span>. Harika!</p>
        </div>
        <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/10 blur-3xl rounded-full"></div>
      </section>
    </div>
  );
};
