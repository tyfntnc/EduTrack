
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_USERS } from '../constants';
import { User, Course, IndividualLesson, AttendanceRecord } from '../types';
import { MapService } from '../services/mapService';

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
  currentUser: User;
  courses: Course[];
  individualLessons: IndividualLesson[];
  onUserClick?: (uid: string) => void;
  // Fix: Make attendanceRecords optional as it is currently unused and causing type errors in App.tsx
  attendanceRecords?: AttendanceRecord[];
  onSaveAttendance?: (record: AttendanceRecord) => void;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ 
  courseId, onBack, currentUser, courses, individualLessons, onUserClick, attendanceRecords, onSaveAttendance 
}) => {
  const [activeAttendanceView, setActiveAttendanceView] = useState<'selection' | 'qr' | 'manual' | 'none'>('none');
  const [presentStudentIds, setPresentStudentIds] = useState<string[]>([]);
  const [absentStudentIds, setAbsentStudentIds] = useState<string[]>([]);
  const [lastScannedStudent, setLastScannedStudent] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const course = courses.find(c => c.id === courseId);
  const indLesson = individualLessons.find(l => l.id === courseId);

  if (!course && !indLesson) return null;

  const isIndividual = !!indLesson;
  const isTeacher = (course?.teacherId === currentUser.id) || (indLesson?.role === 'given');
  const studentList = isIndividual ? indLesson!.students : MOCK_USERS.filter(u => course!.studentIds.includes(u.id));
  
  const title = isIndividual ? indLesson!.title : course!.title;
  const time = isIndividual ? indLesson!.time : (course!.schedule[0]?.startTime + ' - ' + course!.schedule[0]?.endTime);
  const location = isIndividual ? 'Bireysel' : (course!.location || 'A Sahası');
  const teacherId = isIndividual ? (indLesson!.role === 'given' ? currentUser.id : 'unknown') : course!.teacherId;
  const teacher = MOCK_USERS.find(u => u.id === teacherId);
  const teacherName = teacher?.name || (isIndividual && indLesson!.role === 'given' ? 'Sen (Eğitmen)' : 'Eğitmen');

  // Camera Management for QR
  useEffect(() => {
    if (activeAttendanceView === 'qr' && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(() => { 
          alert("Kamera izni reddedildi veya cihazda kamera bulunamadı."); 
          setActiveAttendanceView('selection'); 
        });
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
  }, [activeAttendanceView]);

  const handleManualMark = (id: string, isPresent: boolean) => {
    if (isPresent) {
      setPresentStudentIds(prev => [...prev.filter(i => i !== id), id]);
      setAbsentStudentIds(prev => prev.filter(i => i !== id));
    } else {
      setAbsentStudentIds(prev => [...prev.filter(i => i !== id), id]);
      setPresentStudentIds(prev => prev.filter(i => i !== id));
    }
  };

  const handleQRScanSimulate = () => {
    // Simulated scanning logic for demonstration
    const unscanned = studentList.filter((s: any) => !presentStudentIds.includes(s.id || s.email));
    if (unscanned.length === 0) {
      alert("Tüm öğrenciler zaten tarandı!");
      return;
    }
    const random = unscanned[Math.floor(Math.random() * unscanned.length)];
    const id = (random as any).id || (random as any).email;
    setPresentStudentIds(prev => [...prev, id]);
    setLastScannedStudent((random as any).name);
    setTimeout(() => setLastScannedStudent(null), 2500);
  };

  const finishAttendance = () => {
    // If we are in QR mode, anyone not present is automatically absent
    let finalAbsent = [...absentStudentIds];
    if (activeAttendanceView === 'qr') {
      const remainingIds = studentList
        .map((s: any) => s.id || s.email)
        .filter(id => !presentStudentIds.includes(id));
      finalAbsent = remainingIds;
    }

    if (onSaveAttendance) {
      onSaveAttendance({
        id: `att-${Date.now()}`,
        courseId,
        date: new Date().toISOString().split('T')[0],
        presentStudentIds
      });
    }

    alert(`Yoklama başarıyla kaydedildi!\n${presentStudentIds.length} VAR / ${finalAbsent.length} YOK`);
    setActiveAttendanceView('none');
    setPresentStudentIds([]);
    setAbsentStudentIds([]);
  };

  return (
    <div className="fixed inset-0 z-[500] bg-slate-50 dark:bg-slate-950 flex flex-col page-transition overflow-y-auto no-scrollbar pb-32">
      <header className="sticky top-0 z-[510] px-6 py-6 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-white/20 dark:border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-all"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg></button>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-none">{title}</h2>
            <p className="text-[7px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-1.5">EĞİTİM DETAYLARI</p>
          </div>
        </div>
      </header>

      <div className="px-5 py-6 space-y-6 text-left">
        {/* ATTENDANCE ACTION PANEL (TEACHER ONLY) */}
        {isTeacher && (
          <section className="bg-indigo-600 p-6 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/20 flex flex-col gap-4">
            <div className="text-left">
              <span className="text-[7px] font-black text-indigo-200 uppercase tracking-[0.3em]">YÖNETİCİ KONTROLLERİ</span>
              <h3 className="text-base font-black uppercase mt-1">GÜNLÜK YOKLAMA</h3>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveAttendanceView('manual')}
                className="flex-1 bg-white text-indigo-600 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                📝 MANUEL
              </button>
              <button 
                onClick={() => setActiveAttendanceView('qr')}
                className="flex-1 bg-indigo-500 text-white py-3 border border-indigo-400 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                📱 HIZLI QR
              </button>
            </div>
          </section>
        )}

        {/* INSTRUCTOR CARD */}
        <section className="bg-white/70 dark:bg-indigo-900/10 backdrop-blur-md rounded-[2.5rem] p-5 border border-white/40 dark:border-indigo-500/10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-[1.8rem] overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
            <img src={teacher?.avatar || `https://ui-avatars.com/api/?name=${teacherName}`} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[7px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">EĞİTMEN</span>
            <h3 className="text-[13px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight leading-none">{teacherName}</h3>
          </div>
        </section>

        {/* INFO GRID */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-[2.2rem] border border-white/20 dark:border-slate-800 shadow-sm">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">DERS ZAMANI</span>
            <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 leading-none mt-1">{time}</p>
          </div>
          <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md p-5 rounded-[2.2rem] border border-white/20 dark:border-slate-800 shadow-sm">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">KONUM</span>
            <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 leading-none mt-1 truncate">{location}</p>
          </div>
        </section>

        {/* HEATMAP */}
        <section className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800 rounded-[2.8rem] p-7 space-y-6 shadow-sm">
          <h3 className="text-[9px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">KATILIM ISI HARİTASI</h3>
          <div className="grid grid-cols-7 gap-y-2 text-center">
            {['P', 'S', 'Ç', 'P', 'C', 'C', 'P'].map((d, i) => <span key={i} className="text-[7px] font-black text-slate-300 dark:text-slate-700 uppercase mb-2">{d}</span>)}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const isPresent = [2, 5, 9, 12, 16, 19, 23, 26, 30].includes(day);
              return (
                <div key={i} className="h-8 flex flex-col items-center justify-center gap-1">
                  <span className="text-[10px] font-black text-slate-400 dark:text-slate-600">{day}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${isPresent ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* --- ATTENDANCE OVERLAY --- */}
      {activeAttendanceView !== 'none' && (
        <div className="fixed inset-0 z-[1000] bg-white dark:bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
          
          <header className="px-6 py-6 border-b border-slate-100 dark:border-slate-900 flex justify-between items-center bg-white dark:bg-slate-900 shadow-sm">
            <div className="text-left">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tighter leading-none">
                {activeAttendanceView === 'manual' ? 'MANUEL LİSTE' : 'QR TARAYICI'}
              </h2>
              <p className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.3em] mt-1.5">
                {presentStudentIds.length} VAR / {studentList.length} TOPLAM
              </p>
            </div>
            <button 
              onClick={() => setActiveAttendanceView('none')}
              className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700 active:scale-90"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
            
            {/* MANUAL LIST VIEW */}
            {activeAttendanceView === 'manual' && (
              <div className="p-5 space-y-2.5">
                {studentList.map((s: any) => {
                  const id = s.id || s.email;
                  const isPresent = presentStudentIds.includes(id);
                  const isAbsent = absentStudentIds.includes(id);

                  return (
                    <div key={id} className="bg-white dark:bg-slate-900 p-4 rounded-[2.2rem] border border-slate-50 dark:border-slate-800 flex items-center gap-4 shadow-sm transition-all">
                      <div className="w-12 h-12 rounded-[1.2rem] overflow-hidden border border-slate-100 shrink-0">
                        <img src={s.avatar || `https://ui-avatars.com/api/?name=${s.name}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase truncate leading-none mb-1">{s.name}</p>
                        <p className={`text-[7px] font-black uppercase tracking-widest ${isPresent ? 'text-emerald-500' : isAbsent ? 'text-rose-500' : 'text-slate-300'}`}>
                          {isPresent ? 'VAR' : isAbsent ? 'YOK' : 'İŞARETLENMEDİ'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleManualMark(id, true)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isPresent ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                        </button>
                        <button 
                          onClick={() => handleManualMark(id, false)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isAbsent ? 'bg-rose-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-300'}`}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* QR SCANNER VIEW */}
            {activeAttendanceView === 'qr' && (
              <div className="flex-1 relative bg-black flex flex-col">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-2 border-indigo-500/50 rounded-[3rem] relative shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="absolute inset-0 border-4 border-indigo-500 rounded-[3rem] animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 animate-[qr-scan_2s_infinite] shadow-[0_0_15px_#6366f1]"></div>
                  </div>
                </div>

                {lastScannedStudent && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-4 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-5 flex items-center gap-3">
                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">✓</div>
                     <div className="text-left">
                       <p className="text-[10px] font-black uppercase leading-none">{lastScannedStudent}</p>
                       <p className="text-[7px] font-bold opacity-80 uppercase mt-1">GİRİŞ YAPILDI</p>
                     </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 right-4 text-center">
                   <p className="text-[8px] font-black text-white/50 uppercase tracking-widest bg-black/40 backdrop-blur-md py-2 rounded-full border border-white/10 px-4">ÖĞRENCİ QR KODUNU VİZÖRE ORTALAYIN</p>
                </div>

                {/* SIMULATION BUTTON FOR TESTING */}
                <div className="absolute top-20 right-4">
                  <button onClick={handleQRScanSimulate} className="bg-white/10 backdrop-blur-md border border-white/20 text-white/40 text-[6px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">OKUMA SİMÜLE ET</button>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER ACTION */}
          <div className="p-6 pb-12 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
             <button 
               onClick={finishAttendance}
               className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
             >
               YOKLAMAYI BİTİR VE KAYDET
             </button>
             {activeAttendanceView === 'qr' && (
               <p className="text-center text-[7px] font-black text-slate-400 uppercase tracking-widest mt-4">OKUTULMAYANLAR OTOMATİK "YOK" SAYILACAKTIR</p>
             )}
          </div>
        </div>
      )}

      {/* QR SCAN KEYFRAMES */}
      <style>{`
        @keyframes qr-scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};
