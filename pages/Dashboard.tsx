
import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_COURSES, MOCK_USERS } from '../constants';

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
  const [isMyQRModalOpen, setIsMyQRModalOpen] = useState(false);

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
    alert(`Yoklama başarıyla kaydedildi!`);
    setAttendanceCourseId(null);
    setAttendanceMode(null);
    setPresentIds([]);
  };

  const StudentQRModal = () => (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsMyQRModalOpen(false)} />
      <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col items-center border border-slate-100">
        <button onClick={() => setIsMyQRModalOpen(false)} className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Kişisel QR Kodun</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-4">Yoklama için bu kodu eğitmenine okut.</p>
        </div>
        <div className="p-4 bg-white border-4 border-indigo-50 rounded-[2.5rem] shadow-inner mb-8 ring-1 ring-slate-100">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${currentUserId}&bgcolor=ffffff&color=4f46e5`} alt="QR" className="w-44 h-44" />
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-5 py-4 rounded-3xl w-full border border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div className="text-left">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ÖĞRENCİ</p>
             <p className="text-[12px] font-bold text-slate-900">{userName}</p>
          </div>
        </div>
        <button onClick={() => setIsMyQRModalOpen(false)} className="w-full mt-6 py-5 bg-slate-900 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all shadow-xl">Kapat</button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {isMyQRModalOpen && <StudentQRModal />}
      
      {/* Hero Section */}
      <section className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-6 bg-indigo-200" />
            <p className="text-indigo-400 text-[9px] font-black uppercase tracking-widest leading-none">Bugünkü Program</p>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">Selam, {userName.split(' ')[0]} 👋</h2>
          <p className="text-[10px] text-slate-400 font-medium">Toplam {todayTaken.length + todayGiven.length} dersin planlandı.</p>
        </div>
        
        {userRole === UserRole.STUDENT && (
          <button 
            onClick={() => setIsMyQRModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 px-4 py-3 rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-500 active:scale-90 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">QR KODUM</span>
          </button>
        )}
      </section>

      {/* 1. Aldığım Eğitimler (Prioritized for Students) */}
      <section className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <button onClick={() => setIsTakenExpanded(!isTakenExpanded)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Aldığım Eğitimler</h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Bugün ({todayTaken.length} Ders)</p>
            </div>
          </div>
          <svg className={`text-slate-300 transition-transform ${isTakenExpanded ? 'rotate-180' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        {isTakenExpanded && (
          <div className="p-4 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {todayTaken.length === 0 ? (
              <p className="text-center py-6 text-[9px] font-bold text-slate-300 uppercase italic">Ders bulunmuyor</p>
            ) : (
              todayTaken.map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:bg-white transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-900">
                    <span className="text-[9px] font-black">{item.startTime}</span>
                    <div className="w-2 h-[1px] bg-slate-100 my-1" />
                    <span className="text-[7px] font-bold text-slate-400">{item.endTime}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-[11px] truncate group-hover:text-emerald-600">{item.title}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Hoca: {MOCK_USERS.find(u => u.id === item.teacherId)?.name.split(' ')[0]}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* 2. Verdiğim Eğitimler */}
      {(userRole === UserRole.TEACHER || todayGiven.length > 0) && (
        <section className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm">
          <button onClick={() => setIsGivenExpanded(!isGivenExpanded)} className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verdiğim Eğitimler</h3>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Antrenör Olarak ({todayGiven.length} Ders)</p>
              </div>
            </div>
            <svg className={`text-slate-300 transition-transform ${isGivenExpanded ? 'rotate-180' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          {isGivenExpanded && (
            <div className="p-4 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-300">
              {todayGiven.map((item, i) => (
                <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex flex-col items-center justify-center shadow-md">
                    <span className="text-[9px] font-black">{item.startTime}</span>
                    <span className="text-[7px] font-bold opacity-50">{item.endTime}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-[11px] truncate">{item.title}</h4>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => setAttendanceCourseId(item.id)} className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-[7px] font-black text-indigo-600 uppercase tracking-widest active:scale-95 transition-all">Yoklama Al</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Motivational Info Card */}
      <section className="bg-slate-900 rounded-[2.5rem] p-7 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h4 className="font-black text-[9px] uppercase tracking-[0.3em] text-slate-400 mb-2">Performans Özeti</h4>
          <p className="text-xs font-medium leading-relaxed">Bu hafta toplam <span className="text-indigo-400 font-bold">12 saat</span> aktiviten var. Katılım skorun <span className="text-emerald-400 font-bold">%94</span> ile zirvede!</p>
        </div>
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
      </section>
    </div>
  );
};
